---
title: "谁偷了我的笔？—— 视觉引导机械臂抓取"
title_en: "Who Stole My Pen? -- Vision-Guided Robot Pen Grasping"
date: 2025-10-11
draft: false
author: "Chenyu Zhu"
tags:
  - Computer Vision
  - Robotics
  - Calibration
  - RealSense
  - Python
  - Path Planning
image: /images/projects/robot-pen-grasping/pen_grasping.gif
description: "一个完整的机器人视觉与控制流水线，使用 Interbotix PX100 机械臂和 RealSense 深度相机检测、定位并抓取笔。"
toc: true
mathjax: true
math: true
repoName: grab_pen
---

<div class="lang-zh">

## 概述

**谁偷了我的笔？**
笔刚才还在这里，现在不见了。周围没有人 —— 只有机械臂。它不可能拿走了……对吧？

本项目展示了一个**视觉引导机器人抓取系统**，使用 **RealSense 深度相机**检测笔，通过**相机-机器人标定**计算其位置，并控制 **Interbotix PX100 机械臂**实时拾取 —— 全部自动完成。

项目集成了 **RGB-D 感知、坐标变换和运动控制**，作为视觉伺服（Visual Servoing）和机器人抓取操作的小型演示。

---

## 系统组成

| 组件 | 描述 |
|------|------|
| **机械臂** | [Interbotix PX100](https://docs.trossenrobotics.com/interbotix_xsarms_docs/specifications/px100.html)，5 自由度，通过 ROS Python API 控制 |
| **相机** | [Intel RealSense](https://www.intel.com/content/www/us/en/architecture-and-technology/realsense-overview.html)，提供同步 RGB 和深度数据流 |
| **环境** | Ubuntu 24.04 / ROS Kilted / Python 3.12 |
| **控制接口** | Interbotix Python API、OpenCV、NumPy |


---

## 工作流程

### 1. RGB-D 数据采集
- 从 RealSense 相机采集 RGB 和深度图像。
- 对齐两帧以确保像素级深度对应。
- 滤除距离超过 1 米的区域以减少背景干扰。

### 2. 基于 HSV 阈值分割的颜色检测
- 将 RGB 帧转换为 HSV 色彩空间。
- 使用 OpenCV **滑动条**界面动态调整色相、饱和度和明度阈值。
- 应用高斯模糊使分割更平滑。
- 生成**二值掩模**以隔离笔的颜色特征。

---

### 3. 轮廓提取与质心定位
- 从二值掩模中检测所有物体轮廓。
- 选择**最大轮廓** —— 对应于笔。
- 计算轮廓的**质心**，即笔的近似像素位置。

<div style="display:flex; justify-content:center;">
  <img src="/images/projects/robot-pen-grasping/picture1.png" width="98%" alt="轮廓检测">
</div>

---

### 4. 相机-机器人标定
为使机器人能基于相机观测执行动作，需要建立相机坐标系与机器人坐标系之间的**变换矩阵**。

- 将机械臂末端执行器移动到工作空间内的 12 个已知点。
- 在**机器人坐标系**和**相机坐标系**中分别记录每个点的坐标。
- 计算：
  - **旋转矩阵 (R)**：通过点云之间的向量对齐。
  - **平移向量 (T)**：通过质心偏移。



<div style="display:flex; justify-content:center; gap:20px;">
  <img src="/images/projects/robot-pen-grasping/picture2.png" width="48%" alt="标定前">
  <img src="/images/projects/robot-pen-grasping/picture3.png" width="48%" alt="标定后">
</div>


---

### 5. 笔的抓取执行
- 将检测到的笔的像素和深度数据转换为 **3D 相机坐标**。
- 应用标定变换计算**机器人坐标**。
- 控制 PX100 机械臂将末端执行器移动到计算出的位置。
- 关闭夹爪 —— 笔被当场抓获！

<div style="display:flex; justify-content:center;">
  <img src="/images/projects/robot-pen-grasping/pen_grasping.gif" width="85%" alt="机械臂抓取笔">
</div>

---

## 文件结构

| 文件 | 描述 |
|------|------|
| `main.py` | 运行实时检测与控制流水线 |
| `calibration.py` | 计算相机-机器人变换矩阵 |
| `vision.py` | 管理 RealSense 数据流和对齐 |
| `colorspace.py` | 实现 HSV 阈值分割和掩模创建 |
| `contour.py` | 检测轮廓和质心 |
| `position.py` | 将 2D 像素位置转换为 3D 相机坐标 |
| `grab_pen.py` | 根据变换结果执行抓取动作 |
| `thread.py` | 演示多线程标定与控制 |
| `Rotation_mat.txt`、`Translation_mat.txt` | 保存的变换矩阵 |
| `citation.txt` | 参考文献与算法引用 |


## 致谢

本项目作为**美国西北大学黑客马拉松**的一部分，在 **Matthew Elwin 教授**的指导和框架设计下开发完成。
他的指导和课程资料为将计算机视觉、机器人标定和运动控制集成为一个完整系统奠定了基础。
特别感谢**西北大学 2025 级机器人学硕士同学们**的协作与支持，极大地丰富了开发过程。

</div>

<div class="lang-en">

## Overview

**Who Stole My Pen?**
The pen was right here a moment ago, and now it's gone. Nobody is around -- just the robot arm. It couldn't have taken it... right?

This project demonstrates a **vision-guided robotic grasping system** that uses an **Intel RealSense depth camera** to detect a pen, computes its position through **camera-robot calibration**, and controls an **Interbotix PX100 robot arm** to pick it up in real time -- all fully automated.

The project integrates **RGB-D perception, coordinate transformation, and motion control** as a compact demonstration of visual servoing and robotic grasping.

---

## System Components

| Component | Description |
|-----------|------------|
| **Robot Arm** | [Interbotix PX100](https://docs.trossenrobotics.com/interbotix_xsarms_docs/specifications/px100.html), 5-DOF, controlled via ROS Python API |
| **Camera** | [Intel RealSense](https://www.intel.com/content/www/us/en/architecture-and-technology/realsense-overview.html), providing synchronized RGB and depth streams |
| **Environment** | Ubuntu 24.04 / ROS Kilted / Python 3.12 |
| **Control Interface** | Interbotix Python API, OpenCV, NumPy |


---

## Workflow

### 1. RGB-D Data Acquisition
- Captures RGB and depth images from the RealSense camera.
- Aligns both frames to ensure pixel-level depth correspondence.
- Filters out regions beyond 1 meter to reduce background interference.

### 2. HSV Thresholding for Color Detection
- Converts the RGB frame to HSV color space.
- Uses an OpenCV **trackbar** interface to dynamically adjust hue, saturation, and value thresholds.
- Applies Gaussian blur for smoother segmentation.
- Generates a **binary mask** to isolate the pen's color features.

---

### 3. Contour Extraction and Centroid Detection
- Detects all object contours from the binary mask.
- Selects the **largest contour** -- corresponding to the pen.
- Computes the contour's **centroid**, the approximate pixel location of the pen.

<div style="display:flex; justify-content:center;">
  <img src="/images/projects/robot-pen-grasping/picture1.png" width="98%" alt="Contour detection">
</div>

---

### 4. Camera-Robot Calibration
To enable the robot to act on camera observations, a **transformation matrix** between the camera frame and robot frame must be established.

- Moves the robot end-effector to 12 known points in the workspace.
- Records coordinates in both **robot frame** and **camera frame**.
- Computes:
  - **Rotation Matrix (R)**: via vector alignment between point clouds.
  - **Translation Vector (T)**: via centroid offset.



<div style="display:flex; justify-content:center; gap:20px;">
  <img src="/images/projects/robot-pen-grasping/picture2.png" width="48%" alt="Before calibration">
  <img src="/images/projects/robot-pen-grasping/picture3.png" width="48%" alt="After calibration">
</div>


---

### 5. Pen Grasping Execution
- Converts the detected pen's pixel and depth data into **3D camera coordinates**.
- Applies the calibration transform to compute **robot coordinates**.
- Commands the PX100 arm to move the end-effector to the computed position.
- Closes the gripper -- pen caught red-handed!

<div style="display:flex; justify-content:center;">
  <img src="/images/projects/robot-pen-grasping/pen_grasping.gif" width="85%" alt="Robot arm grasping a pen">
</div>

---

## File Structure

| File | Description |
|------|------------|
| `main.py` | Runs the real-time detection and control pipeline |
| `calibration.py` | Computes camera-robot transformation matrix |
| `vision.py` | Manages RealSense data streams and alignment |
| `colorspace.py` | Implements HSV thresholding and mask creation |
| `contour.py` | Detects contours and centroids |
| `position.py` | Converts 2D pixel positions to 3D camera coordinates |
| `grab_pen.py` | Executes grasping based on transformation results |
| `thread.py` | Demonstrates multi-threaded calibration and control |
| `Rotation_mat.txt`, `Translation_mat.txt` | Saved transformation matrices |
| `citation.txt` | References and algorithm citations |


## Acknowledgments

This project was developed as part of the **Northwestern University Hackathon**, under the guidance and framework design of **Prof. Matthew Elwin**.
His instruction and course materials laid the foundation for integrating computer vision, robot calibration, and motion control into a complete system.
Special thanks to the **Northwestern MS in Robotics Class of 2025** for their collaboration and support, which greatly enriched the development process.

</div>
