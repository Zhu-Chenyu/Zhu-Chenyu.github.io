---
title: "碰撞感知动力学仿真：基于 SymPy 的 Box-Jack 系统"
title_en: "Impact-Aware Dynamics Simulation: SymPy-Based Box-Jack System"
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
links:
  - icon: fas fa-external-link-alt
    name: "Notebook"
    url: https://colab.research.google.com/drive/1A_hauOwYlPGEzfWMQ_YFyIN-RMTYe0G8?authuser=2#scrollTo=1mpudsGeVxwh
---

<div class="lang-zh">

<video autoplay loop muted playsinline style="width:50%; height:auto; border-radius:12px; display:block; margin:0 auto;">
  <source src="/images/projects/box_jack_impact/inelastic_impact.mp4" type="video/mp4">
</video>

---


## 概述

本项目构建了一个双刚体系统的**平面刚体动力学仿真器**：一个空心方形**盒子**和一个内部的方形**骰子**。
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
- 骰子位姿：$(x_{jack}, y_{jack}, \theta_{jack}) $

及其速度和加速度的时间导数。

### 几何与惯量
- 盒子建模为薄壁方形框架，可配置壁厚和内部尺寸。
- 质量和转动惯量由壁面段计算，加上平行轴定理的偏移修正。
- 骰子建模为均匀方形板，具有质量和平面转动惯量。

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

### 盒子-骰子壁面接触
仿真器定义了以下接触的单面间隙约束：
- 四面盒壁（上/右/下/左）
- 四个骰子极端点（上/右/下/左）

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
- 骰子几何体
- 地面线

使接触事件可视化，并有助于调试约束逻辑。

---

## 实现说明

- 符号表达式（欧拉-拉格朗日项和约束雅可比矩阵）仅计算一次并数值化以提高速度。
- 使用 SE(2) 齐次变换简洁地计算壁面/骰子的相对几何关系。
- 仿真器采用模块化设计：事件检测、碰撞更新和 RK4 积分相互分离。

---

## 代码库

- Google Colab: https://colab.research.google.com/drive/1A_hauOwYlPGEzfWMQ_YFyIN-RMTYe0G8?authuser=2#scrollTo=6gZLdfdMyb39

</div>

<div class="lang-en">

<video autoplay loop muted playsinline style="width:50%; height:auto; border-radius:12px; display:block; margin:0 auto;">
  <source src="/images/projects/box_jack_impact/inelastic_impact.mp4" type="video/mp4">
</video>

---


## Overview

This project builds a **planar rigid-body dynamics simulator** for a two-body system: a hollow square **box** and a square **jack** inside it.
The simulator captures **continuous motion** (via Euler-Lagrange dynamics) and **discrete events** (via unilateral contact constraints and impulsive velocity updates), forming a **hybrid system**.

Key features:
- Symbolic derivation of equations of motion using **SymPy**
- **Unilateral gap constraints** for wall contact and ground contact
- Impact detection based on constraint values and approach direction
- Comparison of **elastic and inelastic** impact update laws
- Visualization using Matplotlib time series and Plotly rigid-body animations

---

## System Model

### Generalized Coordinates
The state uses 6 generalized coordinates:
- Box pose: $(x_{box}, y_{box}, \theta_{box})$
- Jack pose: $(x_{jack}, y_{jack}, \theta_{jack}) $

along with their velocity and acceleration time derivatives.

### Geometry and Inertia
- The box is modeled as a thin-walled square frame with configurable wall thickness and internal dimensions.
- Mass and moment of inertia are computed from wall segments, plus parallel-axis theorem offset corrections.
- The jack is modeled as a uniform square plate with mass and planar moment of inertia.

---

## Dynamics Derivation

### Lagrangian Formulation
Kinetic and potential energy are defined for both rigid bodies:
- $T $: translational + rotational kinetic energy
- $V $: gravitational potential energy

The Lagrangian is:
$
L = T - V
$

Euler-Lagrange equations are computed symbolically using SymPy:
$
\frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}}\right) - \frac{\partial L}{\partial q} = F
$

The resulting $\ddot{q} $ expressions are symbolically solved and lambdified into fast numerical functions for time integration.

---

## Contact Constraints

### Box-Jack Wall Contact
The simulator defines unilateral gap constraints for contact between:
- Four box walls (top/right/bottom/left)
- Four jack extreme points (top/right/bottom/left)

This produces 16 constraints:
$
\phi_k(q) \ge 0
$
where $\phi_k < 0 $ indicates penetration.

### Ground Contact
Additional constraints ensure box vertices remain above the ground plane, producing 4 more gap constraints.
All constraints are assembled into a single vector $\phi(q) $ with its Jacobian:
$
J_\phi(q) = \frac{\partial \phi}{\partial q}
$

---

## Simulation Loop

The simulator uses fixed-step RK4 (4th-order Runge-Kutta) for continuous dynamics integration. At each step:

1. Compute constraint values $\phi_k $
2. If $\phi_k $ is near contact and decreasing, detect an imminent impact
3. If impact occurs, apply impulsive velocity update $\dot{q}^- \to \dot{q}^+ $
4. Continue integration with updated velocities

This produces piecewise-smooth trajectories with discrete jump events.

---

## Impact Models: Elastic vs Inelastic

The simulator supports **two impact models** for comparing the effect of impact assumptions on long-term behavior.
Both models share the same dynamics equations, constraints, and event detection logic, differing only in the **impact update law**.

### Inelastic Impact (Energy Dissipation)

In the **inelastic** model, impacts dissipate mechanical energy. Post-impact velocities are reduced, causing oscillations to decay and motion to settle more quickly.

Observations:
- Weaker rebounds after impact
- Faster stabilization under repeated contact
- More realistic simulation of everyday rigid-body collisions

### Elastic Impact (Energy Conservation)

<video autoplay loop muted playsinline style="width:50%; height:auto; border-radius:12px; display:block; margin:0 auto;">
  <source src="/images/projects/box_jack_impact/elastic_impact.mp4" type="video/mp4">
</video>

In the **elastic** model, impacts conserve mechanical energy. The system rebounds without energy loss, producing sustained bouncing and persistent oscillations under repeated impacts.

Observations:
- Stronger rebounds after impact
- More persistent oscillations
- Useful for validating the correctness of the impulsive update formulas

### Comparison Summary

- Elastic impacts conserve energy and amplify bouncing behavior
- Inelastic impacts reduce energy and promote settling
- The comparison isolates how jump dynamics affect outcomes when continuous dynamics remain unchanged

---

## Results and Visualization

### Time Series Validation
The simulator plots the following trajectories:
- $x_{box}, y_{box}$
- $x_{jack}, y_{jack}$

to verify containment and identify repeated impact events.

### 2D Geometry Animation
Plotly animations render:
- Box inner boundary
- Box outer boundary
- Jack geometry
- Ground line

making contact events visual and aiding constraint logic debugging.

---

## Implementation Notes

- Symbolic expressions (Euler-Lagrange terms and constraint Jacobians) are computed once and lambdified for speed.
- SE(2) homogeneous transforms are used to concisely compute relative wall/jack geometry.
- The simulator follows a modular design: event detection, impact updates, and RK4 integration are separated.

---

## Repository

- Google Colab: https://colab.research.google.com/drive/1A_hauOwYlPGEzfWMQ_YFyIN-RMTYe0G8?authuser=2#scrollTo=6gZLdfdMyb39

</div>
