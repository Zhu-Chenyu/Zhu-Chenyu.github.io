---
title: "Ants vs SomeBees (Tower Defense Simulation)"
date: 2025-10-11
draft: false
author: "Chenyu Zhu"
tags:
  - Python
  - Game Development
  - Object-Oriented Programming
image: /images/projects/ants-vs-bees/gameplay.gif
description: "A strategic, turn-based tower defense game where ants defend their colony from invading bees using limited resources and diverse abilities."
toc: true
mathjax: false
repoName: ants-vs-bees
---

## Overview

**Ants vs SomeBees** is a **strategic, turn-based tower defense game** built in Python, inspired by UC Berkeley’s **CS61A “Ants” project**.  
Players must deploy various kinds of ants using limited food resources to protect their colony and defend the **Queen Ant** from invading bees.

This project demonstrates strong **object-oriented design**, **event-driven programming**, and **game logic architecture** — all implemented from scratch.

---

## Gameplay Overview

- **Goal:** Prevent bees from reaching the Queen by strategically placing ants along tunnels.  
- **Resources:** Each ant costs food to deploy, which is regenerated each turn by HarvesterAnts.  
- **Turns:** Each round, ants act first (attack, harvest, or defend), followed by bees (move or sting).  
- **Terrain:** Water cells kill non-waterproof ants instantly.  
- **Victory:** Eliminate all bees before any reach the nest.


---

## Ant Stats and Abilities

| Ant | Preview | Food Cost | Health | Special Ability |
|---|---|---:|---:|---|
| **HarvesterAnt** | <img src="/images/projects/ants-vs-bees/Harvester.gif" width="100" alt="HarvesterAnt"> | 2 | 1 | Produces food each turn |
| **ThrowerAnt** | <img src="/images/projects/ants-vs-bees/Thrower.gif" width="100" alt="ThrowerAnt"> | 4 | 1 | Attacks bees in the front |
| **ShortThrower** | <img src="/images/projects/ants-vs-bees/Short.gif" width="100" alt="ShortThrower"> | 3 | 1 | Attacks bees farther than 2 blocks |
| **LongThrower** | <img src="/images/projects/ants-vs-bees/Long.gif" width="100" alt="LongThrower"> | 3 | 1 | Attacks bees within 2 blocks |
| **FireAnt** | <img src="/images/projects/ants-vs-bees/Fire.gif" width="100" alt="FireAnt"> | 5 | 1 | Explodes upon death, damaging nearby bees |
| **WallAnt** | <img src="/images/projects/ants-vs-bees/Wall.gif" width="100" alt="WallAnt"> | 4 | 4 | Acts as a durable blocker |
| **HungryAnt** | <img src="/images/projects/ants-vs-bees/Hungry.gif" width="100" alt="HungryAnt"> | 4 | 1 | Devours one bee every few turns |
| **BodyguardAnt** | <img src="/images/projects/ants-vs-bees/Bodyguard.gif" width="100" alt="BodyguardAnt"> | 4 | 2 | Protects another ant from damage |
| **TankAnt** | <img src="/images/projects/ants-vs-bees/Tank.gif" width="100" alt="TankAnt"> | 6 | 3 | Attacks all bees in its tunnel |
| **ScubaThrower** | <img src="/images/projects/ants-vs-bees/Scuba.gif" width="100" alt="ScubaThrower"> | 6 | 1 | Water-resistant ranged attacker |
| **QueenAnt** | <img src="/images/projects/ants-vs-bees/Queen.gif" width="100" alt="QueenAnt"> | 7 | 1 | Buffs other ants and ends the game if killed |

---

## Combat Logic

- **Ants act first:** attack, harvest, or defend.
- **Bees act second:** move toward the Queen or sting the nearest ant.
- **Health check:** ants or bees with ≤ 0 health are removed.
- **Loop continues** until either all bees die (win) or the Queen is reached (lose).

This simple sequence produces surprisingly complex strategies when combined with different ant types.

---

## Object-Oriented Design

The codebase emphasizes **class inheritance**, **encapsulation**, and **polymorphism**.  

- `Ant` — Base class for all ant behaviors.  
- `Bee` — Defines enemy movement and attack logic.  
- `Place` — Manages ants, bees, and tunnel positions.  
- `Colony` — Oversees the entire game state and turn logic.  
- `AntColonyGUI` — (optional) Provides a visual interface using `tkinter`.

Each new ant type is a subclass of `Ant`, allowing for **clean feature expansion** without modifying existing logic.


---

## Food Economy and Strategy

Players start with limited **food** resources and must manage them efficiently.  
Deploying ants consumes food; only **HarvesterAnts** can replenish it.  
Over-investing early can leave the colony undefended, while conservative play risks being overwhelmed.

Strategic decisions revolve around **placement**, **timing**, and **ant synergy**.


## Acknowledgments

This is a class project of CS61A from UC Berkeley. Tom Magrino and Eric Tzeng developed the structure of this project with John DeNero.
The artwork was drawn by Alana Tran, Andrew Huang, Emilee Chen, Jessie Salas, Jingyi Li, Katherine Xu, Meena Vempaty, Michelle Chang, and Ryan Davis.