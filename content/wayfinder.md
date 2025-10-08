---
title: "ESP32 Navigation Device"
date: 2024-12-07
draft: false
author: "Pushkar Dave"
tags:
  - C++
  - ESP32
  - Microcontrollers
image: 
description: ""
toc: true
mathjax: true
repoName: esp32-wayfinder
---

## Demo Video
In this project, we built an ESP32 based navigation device, capable of displaying navigation animations to indicate the path and direction to the destination.

{{<youtube h5L-v0sdsr8>}}

---
## Circuit Diagram

The setup consists of:
- ESP32 Microcontroller (2.2V to 3.6V, 600mA)
- MAX 7219 8x8 LED Matrix Display (5V, 320mA)
- 5V Li-ion Battery

![image](/images/projects/wayfinder/esp32.jpg)

---
## Approach

The ESP32 microcontroller acts as a receiver for audio signals from popular navigation applications such as Google Maps or Waze, which are transmitted via Bluetooth. These incoming audio signals are then processed using a fast Fourier transform (FFT) function to extract the audio frequency information. Once the audio frequency is isolated, the microcontroller uses simple conditional statements in the code to trigger corresponding animations on an LED Matrix display. For instance, if the detected frequency falls within the range of 200-220 Hz, a '3-2-1 GO' animation could be displayed, synchronizing with the navigation application's cues. This approach enables a visually engaging and intuitive way to convey navigation instructions to the user while minimizing the need for distracting audio cues.

![image](/images/projects/wayfinder/block-diagram.png)