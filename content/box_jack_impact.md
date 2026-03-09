---
title: "碰撞感知动力学仿真：基于 SymPy 的 Box-Jack 系统"
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
description: "基于 SymPy 符号推导的平面 Box-Jack 系统混杂动力学仿真器，包含单面接触约束和弹性/非弹性碰撞速度修正，通过 Plotly 进行可视化。"
toc: true
repoName: box_jack_impact
video: "/images/projects/box_jack_impact/elastic_impact.mp4"
---
<video autoplay loop muted playsinline style="width:50%; height:auto; border-radius:12px; display:block; margin:0 auto;">
  <source src="/images/projects/box_jack_impact/inelastic_impact.mp4" type="video/mp4">
</video>

---


## 概述

本项目构建了一个双刚体系统的**平面刚体动力学仿真器**：一个空心方形**盒子**和一个内部的方形**千斤顶**。
仿真器捕获**连续运动**（通过欧拉-拉格朗日动力学）和**离散事件**（通过单面接触约束和基于冲量的速度修正），构成一个**混杂系统**。

主要特性：
- 使用 **SymPy** 进行运动方程的符号推导
- 壁面接触和地面接触的**单面间隙约束**
- 基于约束值和接近方向的碰撞检测
- **弹性和非弹性**碰撞更新律的对比
- 使用 Matplotlib 时间序列和 Plotly 刚体动画进行可视化

---

## 系统模型

### 广义坐标
状态使用 6 个广义坐标：
- 盒子位姿：$(x_{box}, y_{box}, \theta_{box})$
- 千斤顶位姿：$(x_{jack}, y_{jack}, \theta_{jack}) $

及其速度和加速度的时间导数。

### 几何与惯量
- 盒子建模为薄壁方形框架，可配置壁厚和内部尺寸。
- 质量和转动惯量由壁面段计算，加上平行轴定理的偏移修正。
- 千斤顶建模为均匀方形板，具有质量和平面转动惯量。

---

## 动力学推导

### 拉格朗日公式
为两个刚体定义动能和势能：
- $T $: 平动 + 转动动能
- $V $: 重力势能

拉格朗日量为：
$
L = T - V
$

使用 SymPy 符号计算欧拉-拉格朗日方程：
$
\frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}}\right) - \frac{\partial L}{\partial q} = F
$

得到的 $\ddot{q} $表达式经符号求解后数值化（Lambdify）为高速数值函数，用于时间积分。

---

## 接触约束

### 盒子-千斤顶壁面接触
仿真器定义了以下接触的单面间隙约束：
- 四面盒壁（上/右/下/左）
- 四个千斤顶极端点（上/右/下/左）

共产生 16 个约束：
$
\phi_k(q) \ge 0
$
其中 $\phi_k < 0 $表示穿透。

### 地面接触
附加约束确保盒子顶点保持在地面以上，产生额外 4 个间隙约束。
所有约束组装成单一向量 $\phi(q) $及其雅可比矩阵：
$
J_\phi(q) = \frac{\partial \phi}{\partial q}
$

---

## 仿真循环

仿真器使用固定步长的四阶龙格-库塔法（RK4）进行连续动力学积分。每一步：

1. 计算约束值 $\phi_k $
2. 如果 $\phi_k $接近接触且在减小，检测即将发生的碰撞
3. 若碰撞发生，应用冲量速度修正 $\dot{q}^- \to \dot{q}^+ $
4. 以更新后的速度继续积分

由此产生分段光滑轨迹，带有离散跳跃事件。

---

## 碰撞模型：弹性 vs 非弹性

仿真器支持**两种碰撞模型**，用于比较碰撞假设对长期行为的影响。
两种模型共享相同的动力学方程、约束和事件检测逻辑，仅在**碰撞更新律**上不同。

### 非弹性碰撞（能量耗散）

在**非弹性**模型中，碰撞耗散机械能。碰撞后速度降低，导致振荡衰减，运动更快趋于稳定。

观察：
- 碰撞后反弹减弱
- 在反复接触下更快稳定
- 对日常刚体碰撞更真实的模拟

### 弹性碰撞（能量守恒）

<video autoplay loop muted playsinline style="width:50%; height:auto; border-radius:12px; display:block; margin:0 auto;">
  <source src="/images/projects/box_jack_impact/elastic_impact.mp4" type="video/mp4">
</video>

在**弹性**模型中，碰撞保持机械能守恒。系统无能量损失地反弹，在反复碰撞下产生持续弹跳和持续振荡。

观察：
- 碰撞后更强烈的反弹
- 更持久的振荡
- 可用于验证冲量更新公式的正确性

### 对比总结

- 弹性碰撞保持能量，放大弹跳行为
- 非弹性碰撞降低能量，促进运动趋于稳定
- 对比分离了在连续动力学不变时，跳跃动力学如何影响结果

---

## 结果与可视化

### 时间序列验证
仿真器绘制以下轨迹：
- $x_{box}, y_{box}$
- $x_{jack}, y_{jack}$

以验证包容性并识别重复碰撞事件。

### 2D 几何动画
Plotly 动画渲染：
- 盒子内边界
- 盒子外边界
- 千斤顶几何体
- 地面线

使接触事件可视化，并有助于调试约束逻辑。

---

## 实现说明

- 符号表达式（欧拉-拉格朗日项和约束雅可比矩阵）仅计算一次并数值化以提高速度。
- 使用 SE(2) 齐次变换简洁地计算壁面/千斤顶的相对几何关系。
- 仿真器采用模块化设计：事件检测、碰撞更新和 RK4 积分相互分离。

---

## 代码仓库

- Google Colab: https://colab.research.google.com/drive/1A_hauOwYlPGEzfWMQ_YFyIN-RMTYe0G8?authuser=2#scrollTo=6gZLdfdMyb39
