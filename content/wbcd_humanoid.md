---
title: "双臂人形机器人货架拣选系统 · WBCD 2026 美国赛区亚军 · 最佳创意末端执行器奖"
title_en: "Bimanual Humanoid Shelf-Picking · WBCD 2026 US Region 2nd Place · Best Creative End-Effector Award"
date: 2026-07-05
draft: false
author: "Chenyu Zhu"
tags:
  - Robotics
  - Manipulation
  - Teleoperation
  - ROS 2
  - Computer Vision
  - Human-Robot Interaction
description: "在 WBCD 2026 赛事中，团队为 Unitree G1 人形机器人设计了非对称双夹爪系统与全身遥操作栈，荣获美国赛区亚军及最佳创意末端执行器设计奖。"
toc: true
links:
  - icon: fas fa-trophy
    name: "Competition"
    url: https://wbcdcompetition.github.io
  - icon: fas fa-file-alt
    name: "Paper"
    url: https://wbcdcompetition.github.io
---

<div class="lang-zh">

<img src="/images/projects/wbcd_humanoid/main_image.jpg" style="width:70%; height:auto; border-radius:12px; display:block; margin: 0 auto;" alt="NU Roboticists 团队与 Unitree G1">

---

## 赛事背景

**WBCD 2026（What Bimanuals Can Do）** 是一项专注于双臂人形机器人操作的竞技赛事。Track 1 要求机器人在两次各 10 分钟的运行中，将多种异质物品从三层货架转移至运输推车。

每层货架要求机器人采用不同全身姿态完成拣选：
- 顶层货架：站立拣选（+8 分）
- 中层货架：弯腰拣选（+10 分）
- 底层货架：蹲姿拣选（+10 分）

竞赛规则极为严格：仅完整完成"取-运-放"全流程才计分，无过程分；运送中掉落扣 -3 分；运行分数乘以所申报的自主等级（遥操作 ×2，全自主 ×4）。

**团队 NU Roboticists（西北大学）最终荣获：**
- 🥈 **美国赛区亚军**
- 🏆 **最佳创意末端执行器设计奖**
- 两次运行共完成 **14 次成功转移**，夹爪零故障

---

## 系统概述

整个系统由两个层次构成：**末端执行器层**（怎么抓）与**系统层**（怎么操控）。

<img src="/images/projects/wbcd_humanoid/final_robot.jpeg" style="width:65%; height:auto; border-radius:12px; display:block; margin: 1rem auto;" alt="Unitree G1 系统全貌：双夹爪、主动云台与腿部追踪器">

上图展示了完整系统：左手裸 Dex1-1 夹爪、右手 TPU 手套夹爪、头顶 ZED Mini 相机云台，以及腿部运动追踪器。

| 模块 | 技术方案 |
|------|---------|
| **机器人本体** | Unitree G1 人形机器人 |
| **末端执行器** | 非对称双夹爪（裸 Dex1-1 + TPU 手套 Dex1-1） |
| **全身控制** | NVIDIA SONIC（全身运动追踪策略） |
| **遥操作头显** | PICO4U VR 头显 + 腿部运动追踪器 |
| **视觉系统** | ZED Mini 立体相机（搭载自制 2 自由度主动云台） |
| **夹爪控制** | 自定义力矩感知保持模式电机服务 |
| **中间件** | ROS 2 + DDS |

---

## 末端执行器设计

### 设计挑战

物品种类跨度极大：软质易碎品（薯片袋、保鲜膜、毛绒玩具）与硬质重型品（整罐可乐、网球、魔方）并存，且全部放置在小型储物盒内。

单一夹爪几何结构无法满足以下四项相互冲突的需求：
- **R1 触及距离：** 底层货架紧贴地面，原装 Dex1-1 手指够不到
- **R2 硬物夹持力：** 需要足够法向力才能举起光滑的满罐可乐
- **R3 软物柔性夹持：** 不能压碎薄皮物品，且需防滑
- **R4 紧凑性：** 手指需能伸入小储物盒，且不碰倒周边物品

### 迭代历程

**基线（Dex1-1 原装手指）→ 失败：** 够不到底层货架（违反 R1）。

**第一次尝试：加宽手指 → 失败：** 加宽不解决触及距离问题，反而在小盒内更易碰撞。

**第二次尝试：3 倍长度 PLA 延伸手指 → 失败：** 虽然够到底层，但长悬臂在举起满罐可乐时根部断裂，多次加固仍无法通过考验。

**关键转变：TPU 手套，而非替换手指。** 不再重新设计手指，而是保留原装 Dex1-1 手指，并在其上套一个 **TPU 软性手套**（类似指尖套）：
- 长度足以触及底层货架（满足 R1）
- 截面紧凑，可伸入小盒（满足 R4）
- 指尖弯曲，为圆形硬物提供形封闭夹持（满足 R2）
- TPU 弹性材料可反复弯曲而不断裂（满足耐久性）

<img src="/images/projects/wbcd_humanoid/gripper_glove.jpg" style="width:65%; height:auto; border-radius:12px; display:block; margin: 0 auto;" alt="TPU 手套夹爪">

### 安装方案：从精确负形到圆柱定位特征

早期方案将手套内腔设计为 Dex1-1 手指的精确布尔差集负形，结果对打印公差极为敏感——轻微的过挤出或翘曲即可导致手套无法套入。

最终方案改为**释放内腔 + 圆柱定位特征（定位销 + 贯通销轴）**，仅在几个明确的接触点上约束位置，彻底消除公差敏感性，且手套拆换只需数秒。

### 非对称双夹爪配置

| 属性 | 短型裸手（Hand A） | 长型手套手（Hand B） |
|------|------------------|-------------------|
| 基础 | Dex1-1 原装 | Dex1-1 + TPU 手套 |
| 有效长度 | 短 | 长（可达底层） |
| 刚度 | 高 | 柔顺 |
| 指尖 | 平直 | 弯曲防滑 |
| 最适物品 | 软质、薄壁 | 硬质、圆形、重型 |

**反直觉但关键的设计逻辑：** 硬质物品用柔顺手套，软质物品用刚性裸手。软物易被压扁或挤出，刚性夹爪可精确控制夹持力；硬质圆物易从平夹爪滑落，弯曲柔顺指尖可形封闭防止轴向滑出。每种物品被分配到最能规避其失效模式的那只手。

---

## 全身运动控制：SONIC vs HOMIE

团队评估了两套全身控制方案：

**HOMIE**：基于模型预测控制（MPC）的方案，控制精度理论上更高，但在实际测试中，在动态的拣选动作下稳定性表现不及预期，调试周期也更长。

**NVIDIA SONIC**：大规模运动追踪策略，直接将操作员全身姿态重定向至 G1。操作员佩戴 PICO4U 头显与腿部追踪器，**走路机器人就走路，弯腰机器人就弯腰，蹲下机器人就蹲下**。平衡控制完全由策略负责，操作员只需专注于"到哪里"和"抓什么"。

最终选择 **SONIC**，原因在于：
- 直觉映射，操作员学习成本极低
- 在货架三种姿态下表现稳定
- 与夹爪服务和相机管道集成简洁

---

## 主动 2 自由度云台（TWIST2 颈部设计）

固定躯干相机或腕部相机无法同时兼顾近场抓取视角和机器人脚部与货架的间距——而后者至关重要：靠近货架时，腿部碰到货架可能推倒整个货架。

受 **TWIST2** 方案启发，团队自制了搭载 **ZED Mini 立体相机的 2 自由度主动云台**：

- 云台跟随操作员自然头部运动（俯仰 + 偏航）
- 操作员低头，机器人就低头——无需第二台相机
- ZED 视频流通过 DDS 传至操作员笔记本，平均延迟约 **100 ms**，再通过 TCP 中继至 VR 头显

<img src="/images/projects/wbcd_humanoid/head.jpg" style="width:65%; height:auto; border-radius:12px; display:block; margin: 0 auto;" alt="2 自由度主动相机云台">

**反面教训——腕部相机：** 尝试加装 Intel RealSense D405 腕部相机以获得近场深度信息，结果 G1 板载 CPU 无法承载额外负载，视频延迟从 100 ms 飙升至约 400 ms，整个遥操作管道变得不可用，最终移除。教训：每个额外传感器都在争夺同一套板载算力，凡是拖慢主视频流的传感器，其信息价值无论多高都是负收益。

---

## 力矩感知保持模式

操作员通过手柄扳机控制夹爪，无任何力或触觉反馈。原始接口存在致命缺陷：手指夹到硬物后，命令位置持续推进而实际位置卡住，位置误差积累驱动电机力矩直至过力矩故障。

团队在电机服务中实现了**力矩感知保持模式**：

- 正常状态：电机跟踪扳机映射的位置（阻抗控制）
- 检测条件：`|估计力矩| > 阈值` 且 `|关节速度| < 停滞阈值`
- 触发后：锁定当前位置为保持位置，切换至软保持增益
- 解除条件：操作员主动开合超过释放裕量，或夹持力矩持续低于释放阈值

**实际效果：** 操作员完全按下扳机并保持即可，服务在首次接触时自动锁定，过力矩故障消失，抓取贯穿整个运送过程无需人工计量力度。整个比赛中夹爪零故障。

---

## 失败案例总结

| 方案 | 问题 |
|------|------|
| 加宽 PLA 手指 | 未解决触及距离，盒内更难操控 |
| 3 倍长度 PLA 手指 | 举起满罐可乐时根部断裂，多次改版均失败 |
| D405 腕部相机 | 板载 CPU 过载，延迟 ×4，管道不可用 |
| 端到端自主策略 | 任务时序过长、物品布置随机，单一策略覆盖不了 |
| 双手同时运送 | 提高了掉落率；-3 分且从地板拾取极难，改为每次单件运送 |

---

## 比赛结果

两次运行均申报为遥操作（×2 倍率）。

| | 第一次运行 | 第二次运行 |
|---|---|---|
| 练习（平均） | ~6 次 | ~6 次 |
| 正式比赛 | 6 次 | 8 次 |

### 第一次运行

比赛当天，团队以稳健为第一优先。操作员（Jyothi）已在练习中完成约六次转移，策略是专攻中层和底层货架——这两层各得 +10 分，而顶层仅 +8 分。第一次运行顺利完成 6 次转移，系统表现如预期，夹爪零故障。

### 第二次运行

第二次运行的目标是突破 6 次。操作员对机器人的响应已相当熟悉，节奏明显加快。然而运行中途，G1 在一次靠近底层货架的蹲姿动作中失去平衡，倒在了地板上。

这原本可能是灾难性的——但团队沉着重启，让机器人重新站立，随后继续完成了本次运行。最终成绩：**8 次成功转移**，比第一次提升 33%。

第二次运行结束后的现场：G1 在地板上，运输推车中装满了成功转移的物品——薯片、保鲜膜、网球、卫生纸、魔方等。货架仍有剩余物品，但 10 分钟的时钟已到。

<img src="/images/projects/wbcd_humanoid/final_result_secondrun.jpg" style="width:65%; height:auto; border-radius:12px; display:block; margin: 0 auto;" alt="第二次运行结束后的现场">

**全程夹爪零过力矩故障，所有物品类别均成功拣选，包括令刚性手指折断的满罐可乐。**

---

## 奖项

除美国赛区亚军外，本项目的非对称双夹爪设计还获得了由 IEEE Robotics and Automation Society 于 ICRA 2026 颁发的 **Best Creative End-Effector Design Award**。对我们而言，这个奖项最有意义之处在于它认可的正是那条最曲折的路线——从加宽手指、断裂的 PLA 延长指，到最终"套手套而非换手指"的思路转变。一个不起眼却决定成败的细节（用圆柱定位特征替代精确负形来固定手套），恰恰是让整套方案真正可用的关键。

<img src="/images/projects/wbcd_humanoid/award.jpg" style="width:55%; height:auto; border-radius:12px; display:block; margin: 1rem auto;" alt="ICRA 2026 WBCD 最佳创意末端执行器设计奖证书">

---

## 致谢

本项目由 **Jyothi Swaroop Kasina、Chenyu Zhu、Andnet DeBoer、Md Saif Ahmad** 共同完成，均来自西北大学，四位作者贡献均等。感谢 WBCD 2026 组委会提供的精彩赛事平台。

</div>

<div class="lang-en">

<img src="/images/projects/wbcd_humanoid/main_image.jpg" style="width:70%; height:auto; border-radius:12px; display:block; margin: 0 auto;" alt="Team NU Roboticists with Unitree G1">

---

## Competition Background

**WBCD 2026 (What Bimanuals Can Do)** is a robotics competition focused on bimanual humanoid manipulation. Track 1 required a Unitree G1 humanoid to transfer a heterogeneous set of objects from a three-level shelf into a transport cart within two 10-minute runs.

Each shelf level demanded a different whole-body posture:
- Top shelf: upright pick (+8 pts)
- Middle shelf: bent pick (+10 pts)
- Bottom shelf: crouched pick (+10 pts)

Scoring was unforgiving: only a completed pick-carry-place cycle counted, partial credit was zero, dropping an item during transfer cost −3, and each run's score was multiplied by the declared autonomy level (×2 for remote teleoperation, ×4 for full autonomy).

**Team NU Roboticists (Northwestern University) achieved:**
- 🥈 **2nd place overall**
- 🏆 **Best Creative End-Effector Design Award**
- **14 successful transfers** across two runs, zero gripper faults

---

## System Overview

The system operates at two layers: the **end-effector layer** (how to grip) and the **system layer** (how to operate).

<img src="/images/projects/wbcd_humanoid/final_robot.jpeg" style="width:65%; height:auto; border-radius:12px; display:block; margin: 1rem auto;" alt="Unitree G1 full system: dual grippers, active head, and leg trackers">

The photo above shows the complete system: bare Dex1-1 gripper on the left hand, TPU-glove gripper on the right, ZED Mini camera on the custom active head, and leg motion trackers worn by the operator.

| Module | Solution |
|--------|---------|
| **Robot** | Unitree G1 humanoid |
| **End-effectors** | Asymmetric dual-gripper (bare Dex1-1 + TPU-glove Dex1-1) |
| **Whole-body control** | NVIDIA SONIC (full-body motion retargeting policy) |
| **Teleoperation** | PICO4U VR headset + leg motion trackers |
| **Vision** | ZED Mini stereo camera on custom 2-DOF active head |
| **Gripper control** | Custom torque-aware hold motor server |
| **Middleware** | ROS 2 + DDS |

---

## End-Effector Design

### The Challenge

The object set spanned soft, crushable items (chip bags, cling wrap, plush toys) and rigid, slippery, heavy items (a full soda can, a tennis ball, a speed cube), all staged inside small bins. No single gripper geometry served the full range.

Four requirements conflicted directly:
- **R1 Reach:** The bottom shelf sits just above the floor; stock Dex1-1 fingers cannot reach it
- **R2 Grip force on hard objects:** Enough normal force to lift the soda can without it sliding out
- **R3 Gentle grip on soft objects:** No crushing, no slipping on smooth surfaces
- **R4 Compactness:** Fingers must fit inside small bins without knocking neighbors

### Design Evolution

**Baseline (stock Dex1-1) → Failed:** Too short for the bottom shelf (fails R1).

**Attempt 1: Widened finger → Failed:** Width solved neither reach nor agility in tight bins.

**Attempt 2: 3× length PLA finger → Failed:** Reached the bottom shelf, but snapped at the base under the soda can load. Multiple revised versions all fractured.

**The pivot — sleeve a glove, don't replace the finger.** Instead of redesigning the finger, keep the stock Dex1-1 fingers and design a **TPU glove** that slides over them like a fingertip cap:
- Long enough to reach the bottom shelf (R1)
- Compact cross-section for tight bins (R4)
- Curved tip for form closure on round hard objects (R2)
- TPU elastomer flexes repeatedly without fracturing (durability)

<img src="/images/projects/wbcd_humanoid/gripper_glove.jpg" style="width:65%; height:auto; border-radius:12px; display:block; margin: 0 auto;" alt="TPU Glove Gripper">

### Mounting: From Exact Negative to Cylindrical Locators

The obvious approach — seeding the glove cavity from a Boolean negative of the finger — is intolerant of print variation: any slight over-extrusion prevents the glove from fitting at all. Instead, the cavity was relieved and **cylindrical locating features (pins + through-rod)** were added, constraining the glove at a few defined contacts rather than across an entire matched surface. This made mounting insensitive to print tolerance and reduced glove swaps to seconds.

### Final Asymmetric Configuration

| Property | Short bare hand (A) | Long glove hand (B) |
|----------|--------------------|--------------------|
| Base | Stock Dex1-1 | Dex1-1 + TPU glove |
| Effective length | Short | Long (bottom-shelf reach) |
| Stiffness | High | Compliant |
| Tip | Flat/short | Curved, non-slip |
| Best objects | Soft, crushable | Hard, round, heavy |

**The counter-intuitive logic:** the stiff hand is better for soft objects; the compliant hand is better for hard ones. Soft objects fail by crushing or squeezing out — a controllable stiff jaw avoids both. Hard round objects fail by sliding from a flat rigid pinch — a compliant curved tip wraps them into a stable seated contact. Each object goes to the hand whose failure mode it avoids.

---

## Whole-Body Control: SONIC vs HOMIE

The team evaluated two whole-body control frameworks:

**HOMIE** is a model-predictive control approach with theoretically higher precision. In practice, it showed instability under the dynamic shelf-picking motions and required significantly more tuning time.

**NVIDIA SONIC** is a large motion-tracking policy that retargets the operator's full-body pose directly to the G1. The operator wears a PICO4U headset and leg trackers and **physically walks, bends, and crouches** — the robot mirrors the motion. Balance is entirely the policy's responsibility; the operator thinks only about where to be and what to grab.

**SONIC was selected** for:
- Intuitive mapping with minimal operator learning curve
- Stable performance across all three shelf postures
- Clean integration with the gripper server and camera pipeline

---

## Active 2-DOF Head (TWIST2-Inspired Neck Design)

A fixed torso camera or wrist camera cannot simultaneously give a close-up grasp view and a view of the robot's feet — yet the feet matter critically: a leg brushing the shelf rack during close approaches can tip the entire unit.

Inspired by the **TWIST2** system, the team built a custom **2-DOF active head** carrying a **ZED Mini stereo camera**:

- The head tracks the operator's natural head motion (pitch and yaw) via our own ROS 2 control implementation
- The operator looks down — the robot looks down. No second camera needed.
- ZED video was tuned (resolution + DDS settings) to ~**100 ms average latency** to the operator laptop, relayed to the headset over TCP

<img src="/images/projects/wbcd_humanoid/head.jpg" style="width:65%; height:auto; border-radius:12px; display:block; margin: 0 auto;" alt="2-DOF Active Camera Head">

**Negative result — wrist camera:** An Intel RealSense D405 wrist camera was tested for near-field depth during grasping. The G1's onboard CPU could not absorb the additional load: latency rose from ~100 ms to ~400 ms, making teleoperation unusable. It was removed. The lesson: every sensor has a CPU cost; a sensor that degrades the primary video path has negative value regardless of the information it adds.

---

## Torque-Aware Hold Mode

The operator commands the gripper via a controller trigger mapped to finger position, with no force or touch feedback. The raw interface has a critical failure mode: when fingers close on a stiff object, the commanded position keeps advancing while the actual position stalls, error accumulates, and the motor faults on over-torque. Holding a trigger at exactly the right partial depression for an entire transport walk is unrealistic.

The solution was implemented in the **gripper motor server**, running at a 2 ms control period:

- **Normal:** motor tracks trigger-mapped position via impedance control
- **Detection:** `|estimated torque| > hold threshold` AND `|joint velocity| < stall threshold`  
- **On trigger:** latch current position as `q_hold`, switch to soft holding gains — position error collapses to zero, torque settles at a modest holding level
- **Release:** operator opens trigger past release margin, or load torque stays low for 300 ms

**Effect:** The operator squeezes fully and keeps holding. The server latches on first firm contact, over-torque faults disappear, and the grasp survives the entire transport walk without the operator metering force. Zero gripper faults across all competition runs.

---

## What Failed

| Approach | Problem |
|----------|---------|
| Widened PLA finger | Did not solve reach, worse in tight bins |
| 3× length PLA finger | Snapped at the base under soda-can load, multiple revisions all failed |
| D405 wrist camera | Saturated onboard CPU, 4× latency increase, pipeline unusable |
| End-to-end autonomous policy | Task too long-horizon and object arrangement too variable for a single policy |
| Bimanual carries | Increased drop rate; with −3 per drop and difficult floor recovery, one object per trip scored better |

---

## Results

Both runs were declared as remote teleoperation (×2 multiplier).

| | Run 1 | Run 2 |
|--|-------|-------|
| Practice (average) | ~6 | ~6 |
| Competition | 6 | 8 |

### Run 1

On competition day, the strategy was reliability first. The operator (Jyothi) had averaged about six transfers in practice, so the plan was to focus on the middle and bottom shelves — each worth +10 points versus +8 for the top. Run 1 completed 6 transfers cleanly, the system performed as expected, and the gripper produced zero faults.

### Run 2

Run 2 was about pushing past 6. The operator had built familiarity with the robot's response and set a faster pace. Midway through, however, the G1 lost balance during a deep crouch approaching the bottom shelf and fell to the floor.

What could have ended the run didn't. The team recovered — got the robot back on its feet — and kept going. Final count: **8 successful transfers**, a 33% improvement over Run 1.

After Run 2: the G1 on the floor, the transport cart in the foreground filled with successfully transferred items — chips, cling wrap, tennis ball, toilet paper, speed cube and more. The shelf still has items remaining, but the 10-minute clock had run out.

<img src="/images/projects/wbcd_humanoid/final_result_secondrun.jpg" style="width:65%; height:auto; border-radius:12px; display:block; margin: 0 auto;" alt="End of Run 2 — cart full, robot down">

**Zero over-torque faults across all runs. Every object class picked successfully, including the full soda can that had destroyed the rigid PLA finger.**

---

## Award

Beyond 2nd place in the US region, the asymmetric dual-gripper design received the **Best Creative End-Effector Design Award**, presented by the IEEE Robotics and Automation Society at ICRA 2026. What made this recognition meaningful to us is that it honored the messiest part of the path — from the widened finger, through the PLA extension that snapped, to the eventual shift in thinking from *replacing the finger* to *sleeving a glove over it*. An unglamorous but decisive detail (retaining the glove with cylindrical locators instead of an exact negative) was what turned the whole scheme into something that actually worked.

<img src="/images/projects/wbcd_humanoid/award.jpg" style="width:55%; height:auto; border-radius:12px; display:block; margin: 1rem auto;" alt="ICRA 2026 WBCD Best Creative End-Effector Design Award certificate">

---

## Acknowledgments

This project was completed by **Jyothi Swaroop Kasina, Chenyu Zhu, Andnet DeBoer, and Md Saif Ahmad**, all from Northwestern University. All authors contributed equally. We thank the WBCD 2026 organizers for an outstanding competition platform.

</div>
