---
title: "Rapidly Exploring Random Trees"
date: 2024-12-07
draft: false
author: "Pushkar Dave"
tags:
  - Python 
  - Path Planning
  - RRT
image: 
description: ""
toc: true
mathjax: true
repoName: RRT_Challenge
---

## Demo Video
Rapidly exploring random trees (RRT) is a path planning algorithm originally published in 1998 by Steven M. LaValle.
This is an implementation of the RRT algorithm both in an obstacle-free and an obstacle-filled environment.

{{<youtube 84Kn_j1kV1Q>}}

---
## Pseudo Code
The pseudo code of the algorithm can be described as shown: 
![image](/images/projects/rrt/rrt-algorithm.png)

---
## Results
In the obstacle-free environment, 500 iterations of RRT give almost uniform coverage throughout the space.
![image](/images/projects/rrt/basic-rrt.png)

In the obstacle-filled environment, the RRT algorithm is used to find the path from a start position to a goal position. The shortest path from the start to goal is indicated in yellow.
![image](/images/projects/rrt/collision-rrt.png)

---
## Reference
This implementation was a part of a challenge during the NU MSR hackathon. More details can be found here: https://nu-msr.github.io/hackathon/rrt_challenge.html