---
title: "SenseVR"
date: 2025-06-09
draft: false
author: "Pushkar Dave"
tags:
  - Virtual Reality
  - Steam VR
  - Arduino
image: 
description: ""
toc: true
mathjax: true
repoName: SenseVR
---
SenseVR started as a SteamVR-compatible headset, built using <a href="https://github.com/relativty/Relativty" target="blank">Relativty's</a> open-source guide. It is now evolving into a complete VR system, featuring handheld controllers and color-based tracking inspired by <a href="https://github.com/HadesVR/HadesVR" target="blank">HadesVR</a>.

<img src="/images/projects/headset/headset1c.jpg" style="width: auto; height: auto;"/>

---

## Hardware Setup

The current hardware setup for the head mounted display (HMD) includes the following components:  

- **Arduino Pro Micro**: Handles IMU sampling, calibration, and receives RF data from the controllers
- **MPU 9250 IMU**: Provides 9-DoF head tracking using accelerometer, gyroscope, and magnetometer data
- **nRF24L01 Transceiver**: Listens on multiple RF channels for controller data including button states and orientation
- **LS055R1SX04 LCD Display**:  Acts as the primary display for VR content inside the headset 
- **Custom 3D Printed Headset Shell**: Houses all electronics with proper alignment for visual and motion tracking


<div style="display: flex; justify-content: space-between;">
  <img src="/images/projects/headset/HeadsetCAD.png" alt="Top View" style="width: 58%; height: auto;"/>
  <img src="/images/projects/headset/circuits.JPG" alt="Case Top" style="width: 40%; height: auto;"/>
  
</div>
<br>

The current hardware setup for the handheld controllers includes the following components:
- **Arduino Nano**: Reads sensor and input data and transmits it to the headset over RF
- **MPU 9250 IMU**: Tracks controller orientation and motion using fused IMU data
- **nRF24L01 Transceiver**: Sends packets with button states, trigger values, joystick input, and IMU data to the HMD
- **Analog Joystick** : Used for directional input and pressure-sensitive actions
- **Tactile Buttons**: Provide inputs like system, menu, grip, and thumbstick click

*Note: The nRF24L01 module is not visible in these images*
<div style="display: flex; justify-content: space-between;">
  <img src="/images/projects/knuckles/Front.JPG" alt="Top View" style="width: 49%; height: auto;"/>
  <img src="/images/projects/knuckles/Side.JPG" alt="Side View" style="width: 48%; height: auto;"/>
</div>
<br>


---
## Current Status

A working prototype of the handheld controller has been built and is currently being tested for reliable transmission of position and orientation data to the headset via RF. The next steps involve designing and 3D printing a custom enclosure for the controllers, along with refining the headset shell to better accommodate the internal electronics.

Following the mechanical design phase, I plan to learn PCB design and create custom boards for the controllers to reduce wiring complexity and improve durability. Once the hardware is finalized, I will begin integrating a software stack for spatial tracking using PS3 Eye cameras to track both the headset and controllers in 3D space.




