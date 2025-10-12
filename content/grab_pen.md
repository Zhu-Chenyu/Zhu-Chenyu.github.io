---
title: "Who Stole My Pen? – Vision-Guided Robot Pen Grasping"
date: 2025-10-11
draft: false
author: "Chenyu Zhu"
tags:
  - Computer Vision
  - Robotics
  - Calibration
  - RealSense
  - Python
  - ROS
image: /images/projects/robot-pen-grasping/pen_grasping.gif
description: "A complete robotic vision and control pipeline for detecting, localizing, and grasping a pen using an Interbotix PX100 robot arm and RealSense depth camera."
toc: true
mathjax: true
math: true
repoName: grab_pen
---

## Overview

**Who stole my pen?**  
The pen was right here. Now it’s not. No humans around — just the robot arm. It couldn’t have taken it… right? 

This project presents a **vision-guided robotic grasping system** that detects a pen using a **RealSense camera**, computes its position through **camera–robot calibration**, and commands an **Interbotix PX100** robotic arm to pick it up — all in real time.

The project integrates **RGB-D sensing, coordinate transformation, and motion control**, serving as a miniature demonstration of visual servoing and object grasping for robotic manipulation.

---

## System Components

| Component | Description |
|------------|-------------|
| **Robot Arm** | [Interbotix PX100](https://docs.trossenrobotics.com/interbotix_xsarms_docs/specifications/px100.html), 5 DOF, controlled via ROS Python API |
| **Camera** | [Intel RealSense](https://www.intel.com/content/www/us/en/architecture-and-technology/realsense-overview.html), providing synchronized RGB and depth streams |
| **Environment** | Ubuntu 22.04 / ROS Kilted / Python 3.11 |
| **Control Interface** | Interbotix Python API, OpenCV, NumPy |


---

## Workflow

### 1. RGB-D Acquisition
- Capture RGB and depth images from the RealSense camera.
- Align the two frames to ensure pixel-level depth correspondence.
- Filter out regions farther than 1 meter to reduce background interference.

### 2. Color Detection via HSV Filtering
- Convert the RGB frame to HSV color space.
- Use an OpenCV **trackbar** interface to dynamically adjust hue, saturation, and value thresholds.
- Apply Gaussian blur for smoother segmentation.
- Generate a **binary mask** to isolate the pen’s color signature.

---

### 3. Contour Extraction and Centroid Localization
- Detect all object contours from the binary mask.
- Select the **largest contour** — corresponding to the pen.
- Compute the **centroid** of the contour, which represents the pen’s approximate pixel location.

<div style="display:flex; justify-content:center;">
  <img src="/images/projects/robot-pen-grasping/picture1.png" width="98%" alt="Contour detection">
</div>

---

### 4. Camera–Robot Calibration
To allow the robot to act based on camera observations, a **transformation matrix** between the camera and robot coordinate systems must be established.

- Move the robot end-effector to 12 known points within its workspace.
- Record each point’s coordinates in both **robot** and **camera** frames.
- Compute:
  - **Rotation matrix (R)** via vector alignment between point clouds.
  - **Translation vector (T)** by centroid offset.



<div style="display:flex; justify-content:center; gap:20px;">
  <img src="/images/projects/robot-pen-grasping/picture2.png" width="48%" alt=" Before calibration">
  <img src="/images/projects/robot-pen-grasping/picture3.png" width="48%" alt="After calibration">
</div>


---

### 5. Pen Grasping Execution
- Convert the detected pen’s pixel and depth data into **3D camera coordinates**.  
- Apply the calibration transformation to compute **robot coordinates**.  
- Command the PX100 arm to move the end-effector to the computed point.  
- Close the gripper — the pen is caught red-handed!

<div style="display:flex; justify-content:center;">
  <img src="/images/projects/robot-pen-grasping/pen_grasping.gif" width="85%" alt="Robot grasping the pen">
</div>

---

## File Structure

| File | Description |
|------|--------------|
| `main.py` | Runs the real-time detection and control pipeline |
| `calibration.py` | Computes camera–robot transformation matrices |
| `vision.py` | Manages RealSense streaming and alignment |
| `colorspace.py` | Implements HSV filtering and mask creation |
| `contour.py` | Detects contours and centroids |
| `position.py` | Converts 2D pixel positions to 3D camera coordinates |
| `grab_pen.py` | Executes grasping action based on transformation results |
| `thread.py` | Demonstrates multithreaded calibration and control |
| `Rotation_mat.txt`, `Translation_mat.txt` | Saved transformation matrices |
| `citation.txt` | References and algorithm citations |


## Acknowledgments

This project was developed as part of a **Northwestern University Hackathon** under the guidance and design framework of **Professor Matthew Elwin**.  
His mentorship and course materials provided the foundation for integrating computer vision, robotic calibration, and motion control into a cohesive system.  
Special thanks to the **Northwestern MS Robotics 2025 cohort** for their collaboration and support that made this project possible.
