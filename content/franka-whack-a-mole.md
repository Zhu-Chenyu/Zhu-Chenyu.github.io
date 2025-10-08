---
title: "Franka Plays Whack a Mole"
date: 2024-12-12
draft: false
author: "Pushkar Dave"
tags:
  - Python
  - ROS2
  - MoveIt2
  - OpenCV
image: 
description: ""
toc: true
mathjax: true
repoName: franka-whack-a-mole
---
<!-- This post is **Under Construction**. Please check back on 18th January, 2024.    -->
<!-- ### Demo Video -->
This project involved making a ROS2 package to enable the Franka Emika Robot Arm to play a game of Whack-a-Mole using MoveIt2 and OpenCV.

{{<youtube 4dHbzPfOs48>}}

<!-- This project is a group effort including Ben Benyamin, David Khachatryan, Sairam Umakanth, Haodong Wang, and Pushkar Dave -->

---
## Hardware Setup

The hardware setup includes the following components:  

- **Franka Robot Arm**: Serves as the primary manipulator for the system
- **Realsense D435i Camera**: Used for color detection and pose estimation  
- **AprilTag**: Attached to the robot's base for accurate localization within the environment  
- **Servo Motor-Controlled Hammer**: Executes the hitting action in the Whack-a-Mole game
- **Whack-a-Mole Game Board**: A custom-built game board designed to allow precise control over its speed and provide feedback for debugging purposes  

![image](/images/projects/franka-mole/setup.png)

---
## System Architecture
![image](/images/projects/franka-mole/NewBlock.png)

Four major components of the project are:
 - Detecting the Colored Buttons a.k.a Moles
 - Getting the position of the Moles in the Robot's Frame
 - Generating a Motion Plan from the Current Robot State to the Target Mole
 - Actuating the Hammer to Swing and Hit the Mole


---
## Color Detection

To detect the colors of the moles, we use the OpenCV library. The process involves:  

**Subscribing to Camera Image Data** : The camera provides real-time image data for processing.  

**Color Detection with HSV Thresholding** : HSV thresholding is applied to isolate specific colors—green, red, blue, and yellow—in the image frame.  

**Noise Reduction** : To minimize noise, we draw a bounding box around the Whack-a-Mole board. Additionally, a clipping distance is applied to ignore objects outside the board’s range. 

**Pose Detection** : After detecting the colors, we calculate their centroids. These centroids are then used to publish transforms from the camera frame to the respective color frames, to accurately localize the moles.

The frames can be seen in this RViz visualization:

{{<youtube d6eUucrmaNk>}}

---
## April Tags and Transforms

To detect the pose of the moles in the robot's frame, we used a single AprilTag attached to the base of the robot. Using the `apriltag_ros` package in ROS2, we published a transform from the camera frame to the AprilTag located at the robot's base. This process added the camera frame to the robot's [TF tree](https://github.com/ME495-EmbeddedSystems/finalproject-whack-a-mole#tf-tree). The transforms between the robot's links were accessible via the MoveItAPI.

---

## MoveIt API

The MoveIt API is a custom ROS package we developed to simplify motion planning by abstracting the lower-level ROS API.
It is composed of three major components:

**Motion Planning**
  - Plan a path from any valid starting joint configuration to any valid goal joint configuration.  
    - If the starting configuration is not provided, the current robot position is used.  
  - Plan a path from a specified pose (position and orientation) from any starting configuration.  
    - If the starting configuration is not provided, the current robot position is used.  
    - If the goal position is not specified, the plan should achieve the specified orientation (at any position).  
    - If the goal orientation is not specified, the plan should achieve the specified position (at any orientation).  
  - Plan a Cartesian path from any valid starting pose to a goal pose.  
    - If the starting configuration is not provided, the current robot position is used.  
  - Plan a path from any valid starting pose to a named configuration. Any of the paths should be able to:  
    - Be executed immediately after planning.  
    - Be saved and inspected at a later time.  

**Planning Scene**
  - Add or remove boxes to the planning scene dynamically, at any location.  
  - Attach and detach collision objects to the robot's end-effector.  
  - Load a planning scene from parameters that specify the locations and sizes of objects.  

**Robot State**
  - Perform inverse kinematics (IK) on the robot from an arbitrary end-effector pose.  
    - If no pose is specified, use the current location.  
  - Perform forward kinematics (FK) on the robot from an arbitrary joint state.  
    - If no pose is specified, use the current location.  
  - Retrieve the most up-to-date joint configuration or end-effector pose from the robot.  

---
## ROS Nodes

The `camera_node` subscribes to topics published by the RealSense camera. Its functions include: 
- Detecting colors in the camera feed
- Broadcasting the frames of detected colors to the TF tree, making both the camera and color frames visible in RViz

The `game_node` is responsible for:
- Establishing a static transform between the robot's base frame and the base AprilTag  
- Looking up and communicating the pose of the target mole from the TF tree
- Calling a service to trigger the MoveIt API to generate a motion plan towards the target mole

The `hint_node` serves as a fallback mechanism for the color detection algorithm. It receives serial data from the arduino, indicating which mole is currently illuminated.

The `comm_node` performs the following tasks:
- Triggering the MoveIt API to execute the generated motion plan
- Calling a custom action to swing the hammer upon reaching the target


---
## Group
This project was developed as a group consisting of Ben Benyamin, David Khachatryan, Haodong Wang, Sairam Umakanth and Pushkar Dave.

