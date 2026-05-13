---
title: "LeHome 挑战：基于 VLA 的双臂衣物折叠"
title_en: "LeHome Challenge: Bimanual Garment Folding with VLA Policies"
date: 2026-05-13
draft: false
author: "Chenyu Zhu"
tags:
  - Robotics
  - Manipulation
  - Imitation Learning
  - Vision-Language-Action
  - Deformable Objects
description: "面向 LeHome Challenge 2026 的双臂衣物折叠策略。我们比较了 SmolVLA、xVLA、Lingbot、ACT 和 Diffusion Policy，最终 SmolVLA 在自行评估中取得最高成功率。"
toc: true
repoName: fold_clothes
video: /images/projects/fold_clothes/smolvla_shirt.mp4
links:
  - icon: fa-regular fa-face-smile
    name: "Hugging Face"
    url: https://huggingface.co/LaundryNauts
---

<div class="lang-zh">

<video autoplay muted playsinline controls style="width:72%; height:auto; border-radius:12px; display:block; margin: 0 auto;">
  <source src="/images/projects/fold_clothes/smolvla_shirt.mp4" type="video/mp4">
</video>

---

## 概述

本项目面向 **LeHome Challenge 2026**：在仿真环境中训练双臂机器人折叠不同类别的衣物。衣物属于典型的可变形物体，状态空间高、接触动力学复杂，且不同服装之间形状差异很大，因此很难用固定轨迹或规则控制解决。

我们的目标不是为单件衣服写一个专用流程，而是训练一个能跨类别泛化的策略。最终提交团队为 **LaundryNauts**，官方评测排名 **第 54 名**，官方分数 **40.00%**。在我们自己的评估设置中，最佳模型达到 **53.25%**。

---

## 团队

| 成员 | 贡献方向 |
|------|----------|
| Md Saif Ahmad | Diffusion Policy 训练；关键点函数；硬件测试 |
| Andnet DeBoer | 提交系统；xVLA 训练；SmolVLA 测试；硬件搭建；数据随机化 |
| Conor Hayes | Lingbot 训练；状态机；硬件搭建 |
| Jyothi Swaroop Kasina | Diffusion Policy 训练；CuRobo 集成；关键点函数；录制流水线；硬件搭建 |
| Chenyu Zhu | SmolVLA 训练；ACT 训练；Lingbot 测试；CuRobo 集成；数据采集；数据随机化 |
| Robert Zhu | 数据采集；评测流水线 |

---

## 任务设置

LeHome Challenge 将衣物分为四类：

- 长袖上衣
- 短袖上衣
- 长裤
- 短裤

每个类别都需要机器人从展开、扭曲或偏移的初始状态出发，通过双臂操作将衣物折叠到目标形态。评测不仅关注最终形状是否接近目标，也考验策略在不同初始状态和不同服装几何上的泛化能力。参考任务说明中，挑战提供四类衣物的遥操作演示用于训练策略。

<div style="display:flex; justify-content:center; margin: 1rem 0;">
  <img src="/images/projects/fold_clothes/garment_keypoints.png" width="850" alt="衣物关键点示意" style="border-radius:8px;">
</div>

---

## 模型对比

我们尝试了五类策略：

| 方法 | 观察 |
|------|------|
| **SmolVLA** | 最稳定，最终自行评估成功率最高 |
| **xVLA** | 泛化有潜力，但训练稳定性不足 |
| **Lingbot** | 对语言条件有优势，但在当前数据和动作空间下不够稳定 |
| **ACT** | 动作 chunking 有帮助，但对初始状态扰动较敏感 |
| **Diffusion Policy** | 轨迹质量好，但需要更细的训练和采样调参 |

最终我们选择 **SmolVLA** 作为主要提交策略。它在四类衣物中的表现最均衡，尤其是在短裤折叠上明显优于其他尝试。

---

## 自行评估结果

| 类别 | 成功率 |
|------|-------:|
| 长袖上衣 | 67% |
| 短袖上衣 | 30% |
| 长裤 | 41% |
| 短裤 | 75% |
| **综合** | **53.25%** |

短裤和长袖上衣相对容易形成稳定抓取与折叠轨迹；短袖上衣更容易因为布料局部折叠、袖口朝向和抓取点偏差导致失败。长裤结果介于两者之间，主要瓶颈是裤腿的对齐和中后段折叠的一致性。

---

## 官方评测

官方 leaderboard 中，团队 **LaundryNauts** 的结果为：

| 排名 | Registration ID | Team Name | Long-Sleeved Tops | Short-Sleeved Tops | Long Pants | Shorts | Score |
|-----:|-----------------|-----------|------------------:|-------------------:|-----------:|-------:|------:|
| 54 | r20 | LaundryNauts | 39.5% | 10.5% | 43.5% | 66.5% | 40.00% |

官方结果与自行评估之间存在差距，主要可能来自评测样本分布、随机初始状态、仿真 rollout 设置以及提交模型 checkpoint 的差异。

---

## 系统流程

1. 读取仿真环境中的多视角观察和任务语言描述。
2. 将衣物类别、视觉输入和机器人状态送入 VLA 策略。
3. 策略生成双臂末端执行器动作。
4. 在仿真中执行动作序列，并根据衣物关键点和目标形态计算成功率。
5. 对不同模型和 checkpoint 做分类别评估，选择综合成功率最高的提交。

---

## 关键经验

- 可变形物体任务中，训练 loss 不总是和最终折叠质量一致，必须做 rollout 评估。
- 分类别评测很重要。一个模型的综合分可能不错，但会在某类衣物上系统性失败。
- 衣物关键点可用于快速定位失败原因，例如袖口错位、裤腿未对齐或抓取点漂移。
- 小模型并不一定劣势。SmolVLA 在这个任务上的稳定性和调参效率反而更适合有限时间内的迭代。

---

## 致谢

本项目由 **Md Saif Ahmad、Andnet DeBoer、Conor Hayes、Jyothi Swaroop Kasina、Chenyu Zhu 和 Robert Zhu** 合作完成。感谢 LeHome Challenge 提供的任务、数据和评测环境。

</div>

<div class="lang-en">

<video autoplay muted playsinline controls style="width:72%; height:auto; border-radius:12px; display:block; margin: 0 auto;">
  <source src="/images/projects/fold_clothes/smolvla_shirt.mp4" type="video/mp4">
</video>

---

## Overview

This project targets the **LeHome Challenge 2026**: training a bimanual robot policy to fold garments in simulation. Garments are deformable objects with high-dimensional state, complex contact dynamics, and large shape variation across clothing categories, making the task difficult to solve with fixed trajectories or rule-based control.

Our goal was not to script a special case for one garment, but to train a policy that generalizes across categories. Our submission team, **LaundryNauts**, ranked **54th** on the official evaluation with an official score of **40.00%**. In our internal evaluation setup, the best model reached **53.25%**.

---

## Team

| Member | Contribution Area |
|--------|-------------------|
| Md Saif Ahmad | Diffusion Policy training; keypoint function; hardware testing |
| Andnet DeBoer | Submission system; xVLA training; SmolVLA testing; hardware setup; data randomization |
| Conor Hayes | Lingbot training; state machine; hardware setup |
| Jyothi Swaroop Kasina | Diffusion Policy training; CuRobo integration; keypoint function; recording pipeline; hardware setup |
| Chenyu Zhu | SmolVLA training; ACT training; Lingbot testing; CuRobo integration; data collection; data randomization |
| Robert Zhu | Data collection; evaluation pipeline |

---

## Task Setup

LeHome Challenge evaluates four garment categories:

- Long-sleeved tops
- Short-sleeved tops
- Long pants
- Shorts

For each category, the robot must start from unfolded, distorted, or shifted garment states and use bimanual manipulation to reach a folded target configuration. The evaluation measures not only final shape quality, but also generalization across initial states and garment geometry. Based on the task description, the challenge provides teleoperation demonstrations across the four garment classes for policy training.

<div style="display:flex; justify-content:center; margin: 1rem 0;">
  <img src="/images/projects/fold_clothes/garment_keypoints.png" width="850" alt="Garment keypoints" style="border-radius:8px;">
</div>

---

## Model Comparison

We evaluated five policy families:

| Method | Observation |
|--------|-------------|
| **SmolVLA** | Most stable; highest internal evaluation success rate |
| **xVLA** | Promising generalization, but less stable in training |
| **Lingbot** | Useful language-conditioning structure, but not stable enough for this action space |
| **ACT** | Action chunking helped, but it was sensitive to initial-state perturbations |
| **Diffusion Policy** | Good trajectory quality, but required more careful training and sampling tuning |

We selected **SmolVLA** as the primary submission policy. It produced the most balanced performance across garment categories, with especially strong results on shorts.

---

## Internal Evaluation

| Category | Success Rate |
|----------|-------------:|
| Long-sleeved tops | 67% |
| Short-sleeved tops | 30% |
| Long pants | 41% |
| Shorts | 75% |
| **Overall** | **53.25%** |

Shorts and long-sleeved tops were easier to stabilize into repeatable grasp-and-fold trajectories. Short-sleeved tops failed more often due to local cloth folds, sleeve orientation, and grasp-point drift. Long pants were in the middle, with the main bottleneck being pant-leg alignment and late-stage fold consistency.

---

## Official Evaluation

On the official leaderboard, **LaundryNauts** achieved:

| Rank | Registration ID | Team Name | Long-Sleeved Tops | Short-Sleeved Tops | Long Pants | Shorts | Score |
|-----:|-----------------|-----------|------------------:|-------------------:|-----------:|-------:|------:|
| 54 | r20 | LaundryNauts | 39.5% | 10.5% | 43.5% | 66.5% | 40.00% |

The gap between official and internal evaluation is likely due to differences in evaluation samples, randomized initial states, simulation rollout settings, and the submitted model checkpoint.

---

## System Flow

1. Read multi-view simulation observations and task language.
2. Feed garment category, visual inputs, and robot state into the VLA policy.
3. Generate bimanual end-effector actions.
4. Execute the action sequence in simulation and score the fold using garment keypoints and target configurations.
5. Evaluate multiple models and checkpoints by category, then select the strongest overall submission.

---

## Lessons Learned

- For deformable-object manipulation, training loss does not reliably predict final fold quality; rollout evaluation is mandatory.
- Per-category evaluation matters. A model can score well overall while systematically failing one garment class.
- Garment keypoints are useful for diagnosing failures such as sleeve misalignment, pant-leg mismatch, or grasp drift.
- Smaller models are not necessarily weaker. SmolVLA was the most stable and efficient option for rapid iteration under time constraints.

---

## Acknowledgments

This project was completed by **Md Saif Ahmad, Andnet DeBoer, Conor Hayes, Jyothi Swaroop Kasina, Chenyu Zhu, and Robert Zhu**. Thanks to LeHome Challenge for providing the task, data, and evaluation environment.

</div>
