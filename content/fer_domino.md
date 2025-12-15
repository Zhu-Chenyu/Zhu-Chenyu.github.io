---
title: "Vision-Guided Domino Stacking with Franka Emika Robot"
date: 2025-03-18
draft: false
author: "Chenyu Zhu"
tags:
  - Robotics
  - ROS 2
  - Computer Vision
  - Manipulation
  - Force Control
  - Motion Planning
description: "A vision-guided robotic manipulation system using a Franka Emika Panda robot to detect, reorient, place, and topple dominoes into predefined patterns with force-aware placement."
toc: true
repoName: fer_domino
video: "/images/projects/fer_domino/squigle_domino.mp4"
---

<video autoplay loop muted playsinline style="width:70%; height:auto; border-radius:12px; display:block; margin: 0 auto;">
  <source src="/images/projects/fer_domino/squigle_domino.mp4" type="video/mp4">
</video>

---

## Overview

This project implements a **vision-guided domino manipulation system** using the **Franka Emika Panda robot**.  
The robot detects dominoes on a table, estimates their pose using RGB-D vision, and autonomously rearranges them into predefined geometric patterns before toppling them.

Unlike purely kinematic demonstrations, this system addresses **real-world uncertainty**, including:
- Variable table height
- Vision calibration error
- Grasping constraints due to small object size

To handle these challenges, the system integrates **camera–robot extrinsic calibration**, **staged manipulation strategies**, and **force-controlled placement**, resulting in a robust and repeatable manipulation pipeline.

---

## System Components

| Component | Description |
|---------|-------------|
| **Robot** | Franka Emika Panda (7-DOF torque-controlled manipulator) |
| **Camera** | Intel RealSense RGB-D camera (eye-in-hand configuration) |
| **Middleware** | ROS 2 |
| **Motion Planning** | MoveIt-based Cartesian and joint-space planning |
| **Vision** | OpenCV + depth-based 3D pose estimation |
| **Calibration** | `easy_handeye2` extrinsic calibration |
| **Control** | Position control + joint torque feedback |

---

## High-Level Pipeline

1. Detect domino poses using RGB-D vision  
2. Transform camera-frame detections into robot coordinates  
3. Iteratively pick, reorient, and place dominoes into target patterns  
4. Use force feedback to ensure accurate placement on uneven surfaces  
5. Topple completed patterns as a final execution step  

---

## Domino Manipulation Strategy

### Staged Placement Algorithm

Directly grasping and placing dominoes from a lying-down position proved unreliable due to:
- Limited gripper clearance
- Risk of collision with nearby dominoes
- Inaccurate final orientation

To address this, the system uses a **three-stage manipulation strategy**:

- **Initial Pickup:** The robot grasps the domino from its detected pose on the table.
- **Staging (Reorientation):** The domino is rotated into a **standing orientation** at an intermediate staging pose. This reorientation allows for precise placement without gripper interference.
- **Final Placement:** The domino is placed into its goal position within the target pattern.


This approach significantly improves reliability and avoids collisions in dense layouts.

---

## Vision System

The domino vision algorithm continuously monitors the RGB-D stream and estimates each domino’s pose when requested.

### Position Estimation
- Color filtering isolates domino candidates.
- Depth data and camera intrinsics are used to compute 3D positions.
- Positions are expressed in the camera frame and transformed into the robot frame using extrinsic calibration.

### Orientation Estimation
- OpenCV bounding boxes determine the domino’s orientation about the vertical axis.
- Orientation is converted into a quaternion for motion planning.

### Vision Assumptions and Limitations
The algorithm assumes:
- The camera is approximately perpendicular to the table
- The table surface is flat

In practice, these assumptions introduce small pose errors that accumulate during placement, motivating the need for force-aware control.

---

## Camera–Robot Calibration

Accurate perception requires precise extrinsic calibration between the camera and robot.

- Calibration is performed using **easy_handeye2** in an eye-in-hand configuration.
- The resulting calibration is published via a dedicated ROS node and used to transform vision detections into the robot base frame.
- A fixed calibration file is loaded at runtime to ensure consistency across runs.

This calibration step is critical to achieving repeatable manipulation performance.

---

## Force-Controlled Placement

To compensate for table height variability and vision inaccuracies, the system incorporates **force-based placement logic**.

### Placement Strategy
- The robot approaches the table using position control.
- Near the expected contact point, it switches to small incremental downward motions.
- Joint torque feedback is monitored.
- Once a force threshold is exceeded, contact with the table is detected and motion stops.

This approach:
- Eliminates hard-coded height values
- Prevents under- or over-penetration
- Dramatically improves robustness in real-world execution

---

## Collision Management Tradeoffs

Force-based placement required careful handling of collision objects:

- Table collision geometry is temporarily removed during force-based contact to avoid planner conflicts.
- Domino collision objects are detached and respawned after placement to prevent simulation artifacts.

These design decisions reflect practical tradeoffs between simulation fidelity and real-world control.

---

## Patterns and Execution Modes

The system supports multiple predefined patterns, including:
- Straight line
- Circle
- Squiggle

Both **real hardware execution** and **simulation modes** are supported, with force control disabled in simulation due to missing torque feedback.

---

## Software Architecture

| Node | Responsibility |
|------|---------------|
| `find_dominoes` | Vision processing and pose estimation |
| `place_dominoes` | High-level manipulation logic |
| `handeye_publisher` | Publishes camera–robot calibration |
| `apriltag_node` | Assists with calibration workflows |

The system is modular, allowing perception, planning, and execution to be tested independently.

---

## Key Engineering Challenges Solved

- Reliable manipulation of small objects  
- Vision error accumulation mitigation  
- Safe contact with uncertain surfaces  
- Integration of perception, planning, and force feedback  
- Bridging simulation and real hardware constraints  

---

## Acknowledgments

This project was developed as a **final project for ME495: Embedded Systems in Robotics** at **Northwestern University**, under the instruction of **Professor Matthew Elwin**.
It was completed collaboratively with **Gregory Aiosa**, **Daniel Augustin**, and **Michael Jenz**, whose teamwork and technical contributions were essential to the project’s success.

The project emphasizes real-world robotic system design, highlighting the gap between idealized simulation and physical execution.
