---
title: "Quadrotor Control and Trajectory Generation"
date: 2024-12-07
draft: false
author: "Pushkar Dave"
tags:
  - MATLAB
  - Trajectory Generation
  - Control
image: 
description: ""
toc: true
mathjax: true
repoName: quadrotor-control-and-trajectory-generation
---

## Overview
As a part of University of Pennsylvania's MOOC on Aerial Robotics, I implemented PD control for a quadrotor in 1D, 2D and 3D. Additionally, I also generated a minimum snap trajectory using a 7th-order polynomial.

---
## 1D Quadrotor Control
PD controller was implemented for the height control of the quadrotor. Proportional gain (Kp) and Derivative gain (Kd) were tuned for two objectives.

### Hover Control
The quadrotor was stabilised at **z = 0m**
![image](/images/projects/quad-matlab/hover.gif)

### Step Response
The quadrotor was given a desired height of **1m**. The rise time was kept less than 1 second and maximum overshoot was capped at 5%
![image](/images/projects/quad-matlab/step-rise.gif)

---
## 2D Quadrotor Control 
After performing 1D control, next objective was to implement PD control to track trajectories in the 2D (Y-Z) plane. 

### Linear Trajectory
![image](/images/projects/quad-matlab/linear-2d.gif)

### Sinusoidal Trajectory
![image](/images/projects/quad-matlab/sine-2d.gif)

---
## 3D Quadrotor Control 
Both Linear and Helical trajectories were tracked using a PD controller.  

### Linear Trajectory
![image](/images/projects/quad-matlab/linear-3d.gif)

### Helical Trajectory
![image](/images/projects/quad-matlab/helix-3d.gif)

---
## Minimum Snap Trajectory
Minimum Snap is trajectory generation technique to generate optimal trajectories while satisfying position, velocity and acceleration constraints.
This is based on a [paper](https://ieeexplore.ieee.org/document/5980409) by D. Mellinger et al. - "Minimum snap trajectory generation and control for quadrotors," presented at IEEE International Conference on Robotics and Automation, Shanghai, China, 2011.

In this simulation, a minimum snap trajectory was generated using 7th order polynomial for a given set of waypoints.

![image](/images/projects/quad-matlab/snap.gif)