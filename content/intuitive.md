---
title: "Robotic Scalpel Cooling Experiment – Intuitive Surgical"
date: 2025-08-12
draft: false
author: "Chenyu Zhu"
tags:
  - Robotics
  - Experiment Design
  - Data Modeling
  - Medical Devices
  - Thermal Analysis
  - Da Vinci Surgical System
description: "An experimental study conducted at Intuitive Surgical using the Da Vinci Surgical System to analyze the cooling behavior of ultrasonic scalpels through robotic automation and thermal imaging."
toc: true
mathjax: false
repoName: intuitive
---

## Overview

During my internship at **Intuitive Surgical**, I participated in an **experimental study on ultrasonic scalpel cooling performance** using the **Da Vinci Surgical System**.  
The goal was to develop a repeatable and data-driven framework to evaluate how surgical instruments dissipate heat after activation.

I worked on designing and automating the **robot-assisted testing process**, integrating **thermal imaging data collection** and **curve fitting models** to analyze the cooling behavior of surgical tools.  
This project combined skills in **robotics, thermal analysis, and experimental data modeling** within a medical device research environment.

---

## System Components

| Component | Description |
|------------|-------------|
| **Robot System** | Da Vinci Surgical System, programmed for precise motion sequences |
| **Instruments** | Ultrasonic scalpels with varied materials and coatings |
| **Sensors** | Thermal imaging system for surface temperature monitoring |
| **Software Tools** | Python, OpenCV, NumPy, and curve-fitting libraries |
| **Work Environment** | Controlled lab conditions for repeatable robotic experiments |

---

## Experimental Workflow

### 1. Robotic Operation Setup
- Programmed the Da Vinci robot to perform repeatable **cutting and cooling sequences** with fixed speed, path, and force.  
- Ensured consistency in contact duration, angle, and motion trajectory.  
- Verified robotic precision through multiple calibration cycles before each trial.

---

### 2. Thermal Imaging and Data Collection
- Used a **thermal camera** to continuously record the temperature decay of the surgical instrument after activation.  
- Defined **regions of interest (ROI)** to focus analysis on critical contact areas.  
- Extracted time–temperature data series for later processing.

<div style="display:flex; justify-content:center;">
  <img src="/images/internships/intuitive/da_vinci_cooling_test.png" width="75%" alt="Thermal imaging of ultrasonic scalpels during cooling test">
</div>

---

### 3. Data Modeling and Analysis
- Processed recorded temperature data using Python.  
- Applied **curve fitting techniques** to model cooling behavior over time.  
- Implemented exponential decay fitting to estimate **cooling parameters** under different configurations.  
- Compared model accuracy across multiple repetitions to verify experimental reliability.

---

### 4. Instrument Handling and Inspection
- Assisted in preparing and securing instruments for each trial.  
- Conducted **microscopic inspections** after each round to check for potential surface or coating changes.  

<div style="display:flex; justify-content:center;">
  <img src="/images/internships/intuitive/scalpel.png" width="70%" alt="Ultrasonic scalpel under magnification inspection">
</div>

---

## Skills and Contributions

- **Robotics Programming:** Operated and scripted motion routines for the Da Vinci Surgical System.  
- **Experimental Design:** Planned repeatable testing conditions, ensuring accuracy and reproducibility.  
- **Thermal Data Analysis:** Processed and modeled time–temperature data with Python.  
- **Team Collaboration:** Worked alongside R&D engineers in a regulated, multidisciplinary lab setting.  
- **Documentation:** Recorded procedures, setup configurations, and data workflow for internal reporting.

---

## Takeaways

This internship strengthened my understanding of how **robotics and data modeling intersect in medical device research**.  
I learned to apply engineering principles — precision, repeatability, and safety — in a high-stakes, real-world environment, bridging software, hardware, and human factors in surgical robotics.

---

## Acknowledgments

I would like to thank the **R&D team at Intuitive Surgical** for their mentorship and guidance during this internship.  
Their insights into robotic instrumentation, data validation, and safety testing greatly shaped my learning experience.

---

## Disclaimer

All photographs shown on this page are used **under authorization** and depict only **non-confidential, educationally appropriate content**.  
No proprietary data, internal results, or intellectual property of Intuitive Surgical are disclosed in this project summary.
