---
title: "Force-Compliant Drone with Obstacle Avoidance"
date: 2026-02-01
draft: false
author: "Chenyu Zhu"
tags:
  - Robotics
  - ROS 2
  - Drone
  - Kalman Filter
  - Obstacle Avoidance
  - Control Systems
description: "A quadrotor that moves in the direction of applied external forces — drag it, and it follows. A Kalman filter estimates force from position observations alone, and LiDAR-based potential fields prevent collisions while preserving the intended direction of motion."
toc: true
mathjax: true
math: true
repoName: drone
video: /images/projects/drone/main_demo.MP4
---

<video autoplay loop muted playsinline style="width:70%; height:auto; border-radius:12px; display:block; margin: 0 auto;">
  <source src="/images/projects/drone/main_demo.MP4" type="video/mp4">
</video>

---

## Inspiration

When I was 5, I watched WALL-E. In this scene, EVE is in sleeping mode — yet she still hovers. WALL-E drags her along with a tether, and she just... follows. Fully compliant to external force, effortlessly.

<video autoplay loop muted playsinline style="width:60%; height:auto; border-radius:12px; display:block; margin: 0 auto;">
  <source src="/images/projects/drone/walle_eve.MP4" type="video/mp4">
</video>

That image never left me. This project is my attempt to build something with that same quality: a drone that senses force applied to it and moves with you, not against you.

---

## Overview

A quadrotor that moves in the direction of applied external forces — drag it, and it follows.
A Kalman filter estimates the force from position observations alone, and an LiDAR-based potential field prevents collisions while preserving the intended direction of motion.

**Behaviors:**
- Hover in place with no input
- Translate in the direction and at the speed implied by applied force
- Decelerate and hold position when force is released
- Repel from nearby obstacles using 2D LiDAR (directional hemicircle + omnidirectional safety bubble)

---

## Demo

### Force Compliance + Obstacle Avoidance

<div style="display:flex; justify-content:center; margin: 1rem 0;">
  <iframe width="700" height="394" src="https://www.youtube.com/embed/fADfVLkpe30" title="Force Compliance + Obstacle Avoidance" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

### Force Compliance Only

<div style="display:flex; justify-content:center; margin: 1rem 0;">
  <iframe width="700" height="394" src="https://www.youtube.com/embed/PKJpDcvVS8U" title="Force Compliance Only" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

---

## How It Works

The drone stays still when no force is applied. Push it in any horizontal direction, and it accelerates in that direction at a speed proportional to force magnitude. Release it, and it decelerates to a position hold. With obstacle avoidance enabled, the drone steers around obstacles automatically while the pilot continues to apply force in the desired direction.

---

## Mathematical Model

### Force Decomposition

A tilted quadrotor that is not accelerating horizontally must be experiencing an external horizontal force. This is the core insight that makes sensorless force estimation possible.

<div style="display:flex; justify-content:center; margin: 1rem 0;">
  <img src="/images/projects/drone/ModelDiagram.jpg" width="600" alt="Force Decomposition Diagram" style="border-radius:8px;">
</div>

At quasi-steady-state, the force balance gives:
- **Vertical:** $T\sin(\theta) = G$ — vertical thrust equals gravity
- **Horizontal:** $T\cos(\theta) = ma + E$ — horizontal thrust overcomes inertia and external force $E$

By observing position through OptiTrack and knowing the thrust command, any residual horizontal acceleration is attributed to an external force.

### Frame Conventions

The system uses four coordinate frames, all visible on the physical drone:

<div style="display:flex; justify-content:center; margin: 1rem 0;">
  <img src="/images/projects/drone/DroneFrames.jpg" width="700" alt="Drone Coordinate Frames" style="border-radius:8px;">
</div>

| Frame | Convention | Role |
|-------|------------|------|
| **Pixhawk** | NED — X=North, Y=East, Z=Down | PX4 internal state, trajectory setpoints |
| **Drone rigid body** (`imu_link`) | FLU — X=Forward, Y=Left, Z=Up | OptiTrack tracking frame; KF position observations |
| **base_footprint** | FLU — X=Forward, Y=Left, Z=Up | Ground-projected drone pose in the TF tree |
| **LiDAR** (`laser`) | FLU — X=Forward, Y=Left, Z=Up | 2D scan frame; rigidly aligned with body (no rotation) |

All ROS frames use FLU. Only the Pixhawk uses NED. Conversion chain (body FLU → NED), using yaw $\psi$:

$$x_{ned} = \cos(\psi) x_{frd} + \sin(\psi) y_{frd}$$
$$y_{ned} = -\sin(\psi) x_{frd} + \cos(\psi) y_{frd}$$

where $x_{frd} = x_{flu}$, $y_{frd} = -y_{flu}$.

### Attitude Encodes Horizontal Force

Because PX4 produces horizontal motion by tilting the drone, pitch and roll are direct observations of horizontal force. This validates the model and motivates using attitude in the Kalman filter's control input term.

**Pitch correlates with X position error (NED):**

<div style="display:flex; justify-content:center; margin: 1rem 0;">
  <img src="/images/projects/drone/pitch_to_xe.png" width="750" alt="Pitch to X Error Correlation" style="border-radius:8px;">
</div>

Correlation = 0.732. Pitch tracks the X-axis error, confirming the model: when the drone is pushed forward, PX4 pitches nose-down to accelerate, producing a position error that grows until it matches the commanded velocity.

**Roll correlates with Y position error (NED):**

<div style="display:flex; justify-content:center; margin: 1rem 0;">
  <img src="/images/projects/drone/roll_to_ye.png" width="750" alt="Roll to Y Error Correlation" style="border-radius:8px;">
</div>

Correlation = −0.777 (negative due to the FRD→NED sign convention). Roll tracks Y-axis error with the expected sign flip, consistent with the frame rotation.

---

## Kalman Filter Force Estimator

The KF estimates $[p_x, v_x, p_y, v_y, F_x, F_y]$ in the NED world frame using only OptiTrack position observations at 50 Hz.

**State transition:**

$$p_x \leftarrow p_x + v_x \Delta t$$
$$v_x \leftarrow v_x + (F_x/m)\Delta t + Bu_x$$
$$F_x \leftarrow F_x \quad \text{(modeled as random walk)}$$

(and symmetrically for $y$.)

**Control input $Bu$** — the NED horizontal acceleration produced by thrust, accounting for the full roll/pitch/yaw rotation:

$$Bu_x = -(T/m)[\cos(\psi)\sin(\theta)\cos(\phi) + \sin(\psi)\sin(\phi)]\,\Delta t$$
$$Bu_y = -(T/m)[\sin(\psi)\sin(\theta)\cos(\phi) - \cos(\psi)\sin(\phi)]\,\Delta t$$

Thrust magnitude: $T = mg / (\cos(\phi)\cos(\theta))$, so the vertical component always equals gravity regardless of tilt.

**Observation:** OptiTrack 2D position $[p_x, p_y]$. The filter converges in ~1 second from hover and continues tracking slowly varying external forces.

The estimated $[F_x, F_y]$ drives the velocity setpoint. Obstacle repulsion forces are added to $F_{cmd}$ *after* estimation and never feed back into the KF.

---

## Obstacle Avoidance

Repulsive forces from the RPLidar scan are superimposed on the estimated external force using a potential field approach.

<div style="display:flex; justify-content:center; margin: 1rem 0;">
  <img src="/images/projects/drone/Potential field.jpg" width="550" alt="Potential Field Obstacle Avoidance" style="border-radius:8px;">
</div>

The diagram shows the full force superposition: the orange arc is the hemicircle detection zone facing $F_{ext}$ (red). Obstacles inside generate avoidance forces (teal and purple arrows) pushing the drone away. Velocity damping (pink) opposes the current velocity when repulsion is active. The command force (blue dashed) is the vector sum of all contributions.

### Two-Pass Scan Processing

**Pass 1 — Hemicircle (directional):**
Scans a ±90° cone in the direction of $F_{ext}$ (the orange arc), up to a radius that scales with force magnitude. Ensures obstacles in the intended direction of travel are detected well in advance.

**Pass 2 — Omnidirectional safety bubble:**
Scans the full 360° for obstacles within a fixed close-range radius (default 0.5 m). Catches side and rear obstacles when the drone sidesteps away from a front obstacle — preventing blind-spot collisions.

Both passes accumulate into the same repulsion vector. Overlap near the drone produces stronger repulsion exactly where it is needed most.

### Force Superposition

$$F_{cmd} = F_{ext} + F_{rep} + F_{damp}$$

- $F_{ext}$ — estimated external force from the Kalman filter
- $F_{rep} = \sum k/d^2$ toward the drone, from all detected obstacles (clamped to `max_repulsion_force`)
- $F_{damp} = -\text{damping} \times (|F_{rep}| / F_{rep,max}) \times v_{cmd}$ — opposes velocity, grows proportionally as the drone enters the repulsion field

---

## Hardware

| Component | Model | Role |
|-----------|-------|------|
| Frame | Holybro X500 V2 | Quadrotor platform |
| Flight Controller | Pixhawk 6C | PX4 autopilot, attitude and rate control |
| Companion Computer | Raspberry Pi 5 | uXRCE-DDS bridge over UART |
| Motion Capture | OptiTrack | 6-DoF position at 120 Hz |
| LiDAR | SLAMTEC RPLidar | 2D scan, 360°, ~8 m range |

**Communication chain:**
```
OptiTrack → Laptop (ROS 2) ──WiFi──► Raspberry Pi ──UART (921600 baud)──► Pixhawk (PX4)
```

---

## Software Stack

| Layer | Technology |
|-------|------------|
| OS | Ubuntu 24.04 (RPi), Linux (Laptop) |
| ROS 2 | Jazzy (RPi), Kilted (Laptop) |
| Autopilot | PX4 |
| DDS Bridge | uXRCE-DDS Agent |
| Localization | OptiTrack Motive + TF2 |
| Force Estimator | Custom KF (Eigen) in ROS 2 node |
| Obstacle Avoidance | Potential field on LaserScan |
