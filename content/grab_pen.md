---
title: "谁偷了我的笔？—— 视觉引导机械臂抓取"
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
