---
title: "Impact-Aware Dynamics Simulation: Box–Jack System with SymPy"
date: 2025-03-20
draft: false
author: "Chenyu Zhu"
tags:
  - Dynamics
  - SymPy
  - Lagrangian Mechanics
  - Hybrid Systems
  - Impact Modeling
  - Simulation
description: "A hybrid dynamics simulator for a planar box–jack system with unilateral contact constraints and elastic/inelastic impact updates, derived symbolically with SymPy and visualized with Plotly."
toc: true
repoName: box_jack_impact
video: "/images/projects/box_jack_impact/elastic_impact.mp4"
---
<video autoplay loop muted playsinline style="width:50%; height:auto; border-radius:12px; display:block; margin:0 auto;">
  <source src="/images/projects/box_jack_impact/inelastic_impact.mp4" type="video/mp4">
</video>

---


## Overview

This project builds a **planar rigid-body dynamics simulator** for a two-body system: a hollow square **box** and an internal square **jack**.  
The simulator captures **continuous motion** (via Euler–Lagrange dynamics) and **discrete events** (via unilateral contact constraints and impulsive velocity updates), forming a **hybrid system**.

Key features include:
- Symbolic derivation of equations of motion using **SymPy**
- **Unilateral gap constraints** for wall contacts and ground contact
- Impact detection based on constraint values and approach direction
- **Elastic and inelastic** impact update laws for comparison
- Visualization using Matplotlib time-series and a Plotly animation of rigid bodies

---

## System Model

### Generalized Coordinates
The state uses 6 generalized coordinates:
- Box pose: $(x_{box}, y_{box}, \theta_{box})$
- Jack pose: $(x_{jack}, y_{jack}, \theta_{jack}) $

and their time derivatives for velocity and acceleration.

### Geometry and Inertia
- The box is modeled as a thin-walled square frame with configurable wall thickness and inner dimension.
- Mass and inertia are computed from wall segments plus a parallel-axis offset.
- The jack is modeled as a uniform square plate with mass and planar inertia.

---

## Dynamics Derivation

### Lagrangian Formulation
Kinetic and potential energies are defined for both bodies:
- $T $: translational + rotational kinetic energy
- $V $: gravitational potential energy

The Lagrangian is:
$
L = T - V
$

Using SymPy, the Euler–Lagrange equations are computed symbolically:
$
\frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}}\right) - \frac{\partial L}{\partial q} = F
$

The resulting expressions for $\ddot{q} $are solved symbolically and lambdified into fast numerical functions for time integration.

---

## Contact Constraints

### Box–Jack Wall Contacts
The simulator defines unilateral gap constraints for contacts between:
- four box walls (up/right/bottom/left), and
- four jack extremal points (up/right/bottom/left)

This produces 16 constraints:
$
\phi_k(q) \ge 0
$
where $\phi_k < 0 $indicates penetration.

### Ground Contacts
Additional constraints enforce that box vertices remain above a ground plane, producing 4 more gap constraints.  
All constraints are assembled into a single vector $\phi(q) $and its Jacobian:
$
J_\phi(q) = \frac{\partial \phi}{\partial q}
$

---

## Simulation Loop

The simulator uses fixed-step RK4 for continuous dynamics. At each step:

1. Evaluate constraint values $\phi_k $ 
2. Detect an impending impact if $\phi_k $is near contact and decreasing  
3. If impact occurs, apply an impulsive update $\dot{q}^- \to \dot{q}^+ $ 
4. Continue integration with updated velocities  

This produces piecewise-smooth trajectories with discrete jump events.

---

## Impact Models: Elastic vs Inelastic

The simulator supports **two impact models** to compare how collision assumptions influence long-term behavior.  
Both models share the same dynamics, constraints, and event detection logic. They differ only in the **impact update law**.

### Inelastic Impact (Energy-Dissipative)

In the **inelastic** model, impacts dissipate mechanical energy. After contact, post-impact velocities are reduced, causing oscillations to decay and the motion to settle more quickly.

Observations:
- Reduced rebound after collision  
- Faster stabilization under repeated contacts  
- More realistic behavior for everyday rigid-body impacts  

### Elastic Impact (Energy-Conserving)

<video autoplay loop muted playsinline style="width:50%; height:auto; border-radius:12px; display:block; margin:0 auto;">
  <source src="/images/projects/box_jack_impact/elastic_impact.mp4" type="video/mp4">
</video>

In the **elastic** model, impacts conserve mechanical energy. The system rebounds without energy loss, which produces persistent bouncing and sustained oscillations under repeated impacts.

Observations:
- Stronger rebound after collision  
- Longer-lasting oscillations  
- Useful for validating the impulse update formulation  

### Summary Comparison

- Elastic impacts preserve energy and amplify bouncing behavior  
- Inelastic impacts reduce energy and promote settling  
- The comparison isolates how jump dynamics affect outcomes when continuous dynamics remain unchanged  

---

## Results and Visualization

### Time-Series Validation
The simulator plots trajectories such as:
- $x_{box}, y_{box}$
- $x_{jack}, y_{jack}$

to verify containment and identify repeated impact events.

### 2D Geometry Animation
A Plotly animation renders:
- the box inner boundary  
- the box outer boundary  
- the jack geometry  
- the ground line  

This makes contact events visually interpretable and helps debug constraint logic.

---

## Implementation Notes

- Symbolic expressions (Euler–Lagrange terms and constraint Jacobians) are computed once and lambdified for speed.
- SE(2) homogeneous transforms are used to compute wall/jack relative geometry cleanly.
- The simulator is modular: event detection, impact update, and RK4 integration are separated.

---

## Repo

- Google Colab: https://colab.research.google.com/drive/1A_hauOwYlPGEzfWMQ_YFyIN-RMTYe0G8?authuser=2#scrollTo=6gZLdfdMyb39
