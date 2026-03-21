---
title: "基于视觉引导的 Franka 机械臂多米诺骨牌摆放"
title_en: "Vision-Guided Domino Placement with Franka Emika Robot"
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
description: "使用 Franka Emika Panda 机械臂的视觉引导机器人操作系统，实现多米诺骨牌的检测、重定向、力控放置及推倒，排列成预设图案。"
toc: true
repoName: fer_domino
video: "/images/projects/fer_domino/full_domino_video.mp4"
links:
  - icon: fab fa-github
    name: "Source"
    url: https://github.com/Zhu-Chenyu/Franka-Domino-Project
---

<div class="lang-zh">

<video autoplay muted playsinline controls style="width:70%; height:auto; border-radius:12px; display:block; margin: 0 auto;">
  <source src="/images/projects/fer_domino/full_domino_video.mp4" type="video/mp4">
</video>

---

## 概述

本项目实现了一个使用 **Franka Emika Panda 机械臂**的**视觉引导多米诺骨牌操作系统**。
机器人检测桌面上的多米诺骨牌，通过 RGB-D 视觉估计其位姿，自主将骨牌重新排列为预设几何图案，最后推倒它们。

与纯运动学演示不同，本系统应对**真实世界的不确定性**，包括：
- 桌面高度变化
- 视觉标定误差
- 小物体尺寸导致的抓取约束

为应对这些挑战，系统集成了**相机-机器人外参标定**、**分阶段操作策略**和**力控放置**，构建了一个鲁棒且可重复的操作流水线。

---

## 系统组成

| 组件 | 描述 |
|------|------|
| **机器人** | Franka Emika Panda（7 自由度力矩控制机械臂） |
| **相机** | Intel RealSense RGB-D 深度相机（固定在夹爪上） |
| **系统** | ROS 2 |
| **运动规划** | 基于 MoveIt 的笛卡尔空间和关节空间规划 |
| **视觉** | OpenCV + 基于深度的 3D 位姿估计 |
| **标定** | `easy_handeye2` 外参标定 |
| **控制** | 位置控制 + 关节力矩反馈 |

---

## 总体流程

1. 使用 RGB-D 视觉检测多米诺骨牌位姿
2. 将相机坐标系下的检测结果变换到机器人坐标系
3. 迭代拾取、重定向、放置骨牌至目标图案
4. 利用力反馈确保在不平整表面上精确放置
5. 推倒已完成的图案作为最终执行步骤

---

## 多米诺骨牌操作策略

### 分阶段放置算法

直接从平放状态抓取并放置多米诺骨牌被证明不够可靠，原因包括：
- 夹爪间隙有限
- 与邻近骨牌碰撞的风险
- 最终方向不精确

为此，系统采用**三阶段操作策略**：

- **初始拾取：** 机器人从检测到的桌面位姿抓取骨牌。
- **中转（重定向）：** 骨牌在中间位姿处被旋转为**竖立方向**。这一重定向步骤使得放置时无需担心夹爪干涉。
- **最终放置：** 骨牌被放置到目标图案中的目标位置。


该方法显著提高了可靠性，避免了密集布局中的碰撞。

---

## 视觉系统

多米诺骨牌视觉算法持续监控 RGB-D 数据流，并在请求时估计每块骨牌的位姿。

### 位置估计
- 颜色滤波隔离骨牌候选区域。
- 利用深度数据和相机内参计算 3D 位置。
- 位置在相机坐标系中表示，通过外参标定变换到机器人坐标系。

### 方向估计
- OpenCV 边界框确定骨牌绕垂直轴的方向。
- 方向转换为四元数用于运动规划。

### 视觉假设与局限性
算法假设：
- 相机大致垂直于桌面
- 桌面表面平坦

在实际操作中，这些假设引入微小的位姿误差，误差在放置过程中累积，因此需要力感知控制来补偿。

以下演示展示了视觉流水线的运行过程 —— 相机扫描桌面，检测每块骨牌，并在机器人开始拾取之前将其位置和方向发布为标记：

<video autoplay loop muted playsinline style="width:70%; height:auto; border-radius:12px; display:block; margin: 0 auto;">
  <source src="/images/projects/fer_domino/cv.MP4" type="video/mp4">
</video>

---

## 相机-机器人标定

精确的感知依赖于相机与机器人之间的精确外参标定。

- 使用 **easy_handeye2** 在“Eye-in-hand”（摄像头固定在夹爪上）设定下进行标定。
- 标定结果通过专用 ROS 节点发布，用于将视觉检测结果变换到机器人基座坐标系。
- 运行时加载固定标定文件以确保多次运行的一致性。

这一标定步骤对于实现可重复的操作性能至关重要。

---

## 力控放置

为补偿桌面高度变化和视觉误差，系统集成了**基于力的放置逻辑**。

### 放置策略
- 机器人使用位置控制接近桌面。
- 在预期接触点附近，切换为小幅增量下降运动。
- 持续监控关节力矩反馈。
- 当力阈值被超过时，检测到与桌面的接触，运动停止。

该方法：
- 消除了硬编码的高度值
- 防止了放置不足或过度插入
- 极大提高了真实世界执行的鲁棒性

---

## 碰撞管理权衡

力控放置需要谨慎处理碰撞对象：

- 在力控接触过程中临时移除桌面碰撞几何体，以避免规划器冲突。
- 放置后分离并重新生成骨牌碰撞对象，以防止仿真伪影。

这些设计决策反映了仿真保真度与真实世界控制之间的实际权衡。

---

## 图案与执行模式

系统支持多种预设图案，包括：
- 直线
- 圆形
- 波浪线

同时支持**真实硬件执行**和**仿真模式**，由于仿真中缺少力矩反馈，仿真模式下力控功能被禁用。

---

## 软件架构

| 节点 | 职责 |
|------|------|
| `find_dominoes` | 视觉处理与位姿估计 |
| `place_dominoes` | 高层操作逻辑 |
| `handeye_publisher` | 发布相机-机器人标定结果 |
| `apriltag_node` | 辅助标定工作流 |

系统采用模块化设计，感知、规划和执行可独立测试。

---

## 解决的核心工程挑战

- 小物体的可靠操作
- 视觉误差累积的缓解
- 与不确定表面的安全接触
- 感知、规划与力反馈的集成
- 仿真与真实硬件约束的桥接

---

## 致谢

本项目是**美国西北大学 ME495：嵌入式机器人系统**课程的期末项目，由 **Matthew Elwin 教授**指导。
项目与 **Gregory Aiosa**、**Daniel Augustin** 和 **Michael Jenz** 协作完成，他们的团队合作和技术贡献对项目的成功至关重要。

本项目强调真实世界机器人系统设计，凸显了理想化仿真与物理执行之间的差距。

</div>

<div class="lang-en">

<video autoplay muted playsinline controls style="width:70%; height:auto; border-radius:12px; display:block; margin: 0 auto;">
  <source src="/images/projects/fer_domino/full_domino_video.mp4" type="video/mp4">
</video>

---

## Overview

This project implements a **vision-guided domino manipulation system** using a **Franka Emika Panda robot arm**.
The robot detects dominoes on the table, estimates their poses via RGB-D vision, autonomously rearranges them into predefined geometric patterns, and finally topples them.

Unlike pure kinematic demonstrations, this system handles **real-world uncertainties**, including:
- Table height variations
- Vision calibration errors
- Grasping constraints from small object dimensions

To address these challenges, the system integrates **camera-robot extrinsic calibration**, **staged manipulation strategies**, and **force-controlled placement**, building a robust and repeatable manipulation pipeline.

---

## System Components

| Component | Description |
|-----------|------------|
| **Robot** | Franka Emika Panda (7-DOF torque-controlled robot arm) |
| **Camera** | Intel RealSense RGB-D depth camera (eye-in-hand configuration) |
| **Middleware** | ROS 2 |
| **Motion Planning** | MoveIt-based Cartesian and joint-space planning |
| **Vision** | OpenCV + depth-based 3D pose estimation |
| **Calibration** | `easy_handeye2` extrinsic calibration |
| **Control** | Position control + joint torque feedback |

---

## High-Level Pipeline

1. Detect domino poses using RGB-D vision
2. Transform camera-frame detections to robot frame
3. Iteratively pick, reorient, and place dominoes into target pattern
4. Use force feedback to ensure precise placement on uneven surfaces
5. Topple the completed pattern as the final execution step

---

## Domino Manipulation Strategy

### Staged Placement Algorithm

Direct pick-and-place of flat-lying dominoes proved unreliable due to:
- Limited gripper clearance
- Risk of collisions with neighboring dominoes
- Imprecise final orientation

To address this, the system uses a **three-stage manipulation strategy**:

- **Initial Pick:** The robot grasps the domino from its detected table pose.
- **Waypoint (Reorientation):** The domino is rotated to an **upright orientation** at an intermediate pose. This reorientation step enables placement without gripper interference.
- **Final Placement:** The domino is placed at the target position in the target pattern.


This approach significantly improves reliability and avoids collisions in dense layouts.

---

## Vision System

The domino vision algorithm continuously monitors the RGB-D data stream and estimates each domino's pose on request.

### Position Estimation
- Color filtering isolates domino candidate regions.
- 3D position is computed using depth data and camera intrinsics.
- Positions are expressed in camera frame and transformed to robot frame via extrinsic calibration.

### Orientation Estimation
- OpenCV bounding boxes determine domino orientation about the vertical axis.
- Orientation is converted to quaternions for motion planning.

### Vision Assumptions and Limitations
The algorithm assumes:
- Camera is approximately perpendicular to the table surface
- Table surface is flat

In practice, these assumptions introduce small pose errors that accumulate during placement, necessitating force-aware control to compensate.

The following demo shows the vision pipeline in action -- the camera scans the table, detects each domino, and publishes their positions and orientations as markers before the robot begins picking:

<video autoplay loop muted playsinline style="width:70%; height:auto; border-radius:12px; display:block; margin: 0 auto;">
  <source src="/images/projects/fer_domino/cv.MP4" type="video/mp4">
</video>

---

## Camera-Robot Calibration

Accurate perception depends on precise extrinsic calibration between the camera and robot.

- Calibration is performed using **easy_handeye2** in an eye-in-hand configuration.
- Calibration results are published via a dedicated ROS node, used to transform visual detections to the robot base frame.
- A fixed calibration file is loaded at runtime to ensure consistency across runs.

This calibration step is essential for achieving repeatable manipulation performance.

---

## Force-Controlled Placement

To compensate for table height variations and vision errors, the system integrates **force-based placement logic**.

### Placement Strategy
- The robot approaches the table using position control.
- Near the expected contact point, it switches to small incremental descent motions.
- Joint torque feedback is continuously monitored.
- When a force threshold is exceeded, contact with the table is detected and motion stops.

This approach:
- Eliminates hard-coded height values
- Prevents under-placement or over-insertion
- Greatly improves robustness in real-world execution

---

## Collision Management Trade-offs

Force-controlled placement requires careful handling of collision objects:

- Temporarily removes the table collision geometry during force-controlled contact to avoid planner conflicts.
- Detaches and re-spawns domino collision objects after placement to prevent simulation artifacts.

These design decisions reflect practical trade-offs between simulation fidelity and real-world control.

---

## Patterns and Execution Modes

The system supports multiple predefined patterns, including:
- Straight lines
- Circles
- Wavy lines

It supports both **real hardware execution** and **simulation mode**. Force control is disabled in simulation due to the absence of torque feedback.

---

## Software Architecture

| Node | Responsibility |
|------|---------------|
| `find_dominoes` | Vision processing and pose estimation |
| `place_dominoes` | High-level manipulation logic |
| `handeye_publisher` | Publishes camera-robot calibration |
| `apriltag_node` | Assists calibration workflow |

The system follows a modular design, with perception, planning, and execution independently testable.

---

## Key Engineering Challenges Solved

- Reliable manipulation of small objects
- Mitigation of accumulated vision errors
- Safe contact with uncertain surfaces
- Integration of perception, planning, and force feedback
- Bridging simulation and real hardware constraints

---

## Acknowledgments

This project is the final project for **ME495: Embedded Systems in Robotics** at **Northwestern University**, advised by **Prof. Matthew Elwin**.
It was completed in collaboration with **Gregory Aiosa**, **Daniel Augustin**, and **Michael Jenz**, whose teamwork and technical contributions were essential to the project's success.

This project emphasizes real-world robotic system design, highlighting the gap between idealized simulation and physical execution.

</div>
