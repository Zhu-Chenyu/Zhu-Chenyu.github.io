---
title: "蚂蚁大战蜜蜂（塔防策略游戏）"
date: 2025-10-11
draft: false
author: "Chenyu Zhu"
tags:
  - Python
  - Game Development
  - Object-Oriented Programming
image: /images/projects/ants-vs-bees/gameplay.gif
description: "一款策略回合制塔防游戏，玩家使用有限资源和多样化技能的蚂蚁保卫蚁巢，抵御入侵蜜蜂。"
toc: true
mathjax: false
repoName: ants-vs-bees
---

## 概述

**蚂蚁大战蜜蜂**是一款用 Python 开发的**策略回合制塔防游戏**，灵感来源于加州大学伯克利分校 **CS61A 课程的 "Ants" 项目**。
玩家需要利用有限的食物资源部署各种蚂蚁来保护蚁巢，保卫**蚁后**免受入侵蜜蜂的攻击。

本项目展示了扎实的**面向对象设计**、**事件驱动编程**和**游戏逻辑架构** —— 全部从零实现。

---

## 玩法概述

- **目标：** 通过在隧道中策略性地部署蚂蚁来阻止蜜蜂到达蚁后。
- **资源：** 每只蚂蚁的部署都消耗食物，食物由采集蚁每回合再生。
- **回合：** 每一轮，蚂蚁先行动（攻击、采集或防御），随后蜜蜂行动（移动或蜇刺）。
- **地形：** 水域格子会立即杀死非防水蚂蚁。
- **胜利：** 在任何蜜蜂到达蚁巢前消灭所有蜜蜂。


---

## 蚂蚁属性与技能

| 蚂蚁 | 预览 | 食物消耗 | 生命值 | 特殊能力 |
|------|------|-------:|-------:|---------|
| **采集蚁** | <img src="/images/projects/ants-vs-bees/Harvester.gif" width="100" alt="采集蚁"> | 2 | 1 | 每回合产出食物 |
| **投掷蚁** | <img src="/images/projects/ants-vs-bees/Thrower.gif" width="100" alt="投掷蚁"> | 4 | 1 | 攻击前方蜜蜂 |
| **短程投掷蚁** | <img src="/images/projects/ants-vs-bees/Short.gif" width="100" alt="短程投掷蚁"> | 3 | 1 | 攻击距离超过 2 格的蜜蜂 |
| **远程投掷蚁** | <img src="/images/projects/ants-vs-bees/Long.gif" width="100" alt="远程投掷蚁"> | 3 | 1 | 攻击 2 格以内的蜜蜂 |
| **火蚁** | <img src="/images/projects/ants-vs-bees/Fire.gif" width="100" alt="火蚁"> | 5 | 1 | 死亡时爆炸，伤害附近蜜蜂 |
| **墙蚁** | <img src="/images/projects/ants-vs-bees/Wall.gif" width="100" alt="墙蚁"> | 4 | 4 | 高耐久的肉盾 |
| **饥饿蚁** | <img src="/images/projects/ants-vs-bees/Hungry.gif" width="100" alt="饥饿蚁"> | 4 | 1 | 每隔几回合吞噬一只蜜蜂 |
| **保镖蚁** | <img src="/images/projects/ants-vs-bees/Bodyguard.gif" width="100" alt="保镖蚁"> | 4 | 2 | 保护另一只蚂蚁免受伤害 |
| **坦克蚁** | <img src="/images/projects/ants-vs-bees/Tank.gif" width="100" alt="坦克蚁"> | 6 | 3 | 攻击其隧道中的所有蜜蜂 |
| **潜水投掷蚁** | <img src="/images/projects/ants-vs-bees/Scuba.gif" width="100" alt="潜水投掷蚁"> | 6 | 1 | 防水远程攻击者 |
| **蚁后** | <img src="/images/projects/ants-vs-bees/Queen.gif" width="100" alt="蚁后"> | 7 | 1 | 增强其他蚂蚁，被击杀则游戏结束 |

---

## 战斗逻辑

- **蚂蚁先行动：** 攻击、采集或防御。
- **蜜蜂后行动：** 向蚁后移动或蜇刺最近的蚂蚁。
- **生命值检查：** 生命值 ≤ 0 的蚂蚁或蜜蜂被移除。
- **循环继续** 直到所有蜜蜂被消灭（胜利）或蚁后被触及（失败）。

这一简单序列在与不同蚂蚁类型组合时，能产生出人意料的复杂策略。

---

## 面向对象设计

代码库强调**类继承**、**封装**和**多态**。

- `Ant` —— 所有蚂蚁行为的基类。
- `Bee` —— 定义敌方移动和攻击逻辑。
- `Place` —— 管理蚂蚁、蜜蜂和隧道位置。
- `Colony` —— 管控整个游戏状态和回合逻辑。
- `AntColonyGUI` ——（可选）使用 `tkinter` 提供可视界面。

每种新蚂蚁类型都是 `Ant` 的子类，允许**清晰的功能扩展**而无需修改现有逻辑。


---

## 资源经济与策略

玩家以有限的**食物**资源开局，必须高效管理。
部署蚂蚁消耗食物；只有**采集蚁**能补充食物。
过早大量投入可能导致蚁巢无人防守，而过于保守则面临被蜜蜂淹没的风险。

策略决策围绕**部署位置**、**时机**和**蚂蚁协同**展开。


## 致谢

这是加州大学伯克利分校 CS61A 的课程项目。Tom Magrino 和 Eric Tzeng 与 John DeNero 共同开发了本项目的框架结构。
美术由 Alana Tran、Andrew Huang、Emilee Chen、Jessie Salas、Jingyi Li、Katherine Xu、Meena Vempaty、Michelle Chang 和 Ryan Davis 绘制。
