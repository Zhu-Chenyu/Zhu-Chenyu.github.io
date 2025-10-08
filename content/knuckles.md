---
title: "Knuckles"
date: 2025-06-09
draft: false
author: "Pushkar Dave"
tags:
  - Arduino
  - Max MSP
  - Digital Music
image: 
description: ""
toc: true
mathjax: true
repoName: knuckles-max
---
Knuckles is a digital musical instrument that combines a joystick, trigger buttons, and orientation data to crossfade between audio tracks and effects in real time.
{{<youtube jKNxeeGMev4>}}

---
## Hardware Setup

The hardware setup includes the following components:  

- **Arduino Nano**: Performs serial communication between Max MSP and all the sensors
- **MPU 9250 IMU**: Provides orientation data used for switching between two configurations
- **Analog JoyStick**: Used to control volume and crossfade between audio tracks 
- **Mechanical Switches**: Starts and stops audio tracks, and controls certain sound effects  

<div style="display: flex; justify-content: space-between;">
  <img src="/images/projects/knuckles/Front.JPG" alt="Top View" style="width: 48%; height: auto;"/>
  <img src="/images/projects/knuckles/Side.JPG" alt="Side View" style="width: 48%; height: auto;"/>
</div>
<br>

---
## Concept and Design 

This instrument emerged from one of my side projects. I was trying to build my own 3D-printed VR headset, inspired by the <a href="" target="blank">HadesVR setup</a>. Over spring break, I got the headset working and control it pretty well using an Xbox controller. But I wanted to take it further. I thought it would be fun to build my own Knuckle-style controllers like Valve's. So I follwed the Hades' build guide and put together a prototype circuit on a breadboard -- and that eventually truned into this instrument.  

Another big inspiration was Onyx Ashanti's <a href="https://www.youtube.com/watch?v=-0v7mTvJ8M4" target="blank">"BeatJazz"</a> perfomance. We watched one of his videos on the first day of class, where he uses two handheld controllers to make music. That idea stuck with ne, and I wanted to try and build something in that same spirit.

<div style="display: flex; justify-content: space-between;">
  <img src="/images/projects/knuckles/valve.jpg" alt="Valve" style="width: 48%; height: auto;"/>
  <img src="/images/projects/knuckles/ashanti.jpeg" alt="Onyx Ashanti" style="width: 48%; height: auto;"/>
</div>
<br>

From a design perspective, the Arduino Nano is powered through a USB connection, which also handles serial communication with Max MSP. The IMU is connected via I2C and sends orientation data directly to the microcontroller. There are four mechanical switches wired in, plus an additional button that comes from the thumbstick click on the joystick.

![image](/images/projects/knuckles/KnucklesSchematic.png)

---
## Arduino Code

To process the IMU data, I use the Madgwick library to convert raw accelerometer and gyroscope readings into quaternion values. These quaternions are then sent over to Max. Inside Max, I use basic if-else logic to switch between two different configurations based on the orientation.

Button presses are handled in the Arduino code—each press is sent as a single bit (1 for pressed, 0 for not pressed). After each full loop of data transmission, the number 255 is sent as a marker to indicate the end of that data packet.

The full code, audio files and Max patch can be found on my GitHub: <a href="https://github.com/rdlynx19/knuckles" target="blank">Knuckles-Max</a>
```
  IMU.update();
  IMU.getAccel(&accelData);
  IMU.getGyro(&gyroData);
  IMU.getMag(&magData);
  
  // Convert gyroscope to radians/sec
  float gx = gyroData.gyroX * PI/180.0;
  float gy = gyroData.gyroY * PI/180.0;
  float gz = gyroData.gyroZ * PI/180.0;

  // Update Madgwick Filter
  filter.update(gx, gy, gz, accelData.accelX, accelData.accelY, accelData.accelZ);

  // Get orientation in quaternions
  float qw = filter.getQuatW();
  float qx = filter.getQuatX();
  float qy = filter.getQuatY();
  float qz = filter.getQuatZ();
```
---
## Max Patch

For the performance, I use the instrument in two main configurations. In the standing-up position, the switches are mapped to trigger different audio samples, which I use to perform a cover of "End of Line" by Daft Punk. The joystick controls the volume, letting me gradually fade out the song by lowering the levels of two overlapping samples.

![image](/images/projects/knuckles/standing.png)

In the face-up position, the switches trigger three separate audio samples and two sound effects: delay and tremolo. All of this is wrapped into a single Node object, and I use the joystick to smoothly crossfade between the effects, creating a dynamic and expressive performance.

![image](/images/projects/knuckles/faceUp.png)

---
## Acknowledgements

I would like to thank Prof. Stephan Moore and Kate In for their helpful insights and guidance throughout the process of building and integrating this instrument with Max.


