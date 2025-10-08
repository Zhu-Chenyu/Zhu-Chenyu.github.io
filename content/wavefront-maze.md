---
title: "Maze Solving using Wavefront Algorithm"
date: 2024-12-07
draft: false
author: "Pushkar Dave"
tags:
  - Python 
  - Path Planning
  - BFS
image: 
description: ""
toc: true
mathjax: true
repoName: pythonRAMPAGE
---

## Demo Videos
As a part of the NU MSR hackathon, we completed a Maze Solving challenge. This challenge was done in a team comprising of Joe Blom, Grayson Snyder, Catherine Maglione, and Pushkar Dave

{{<youtube C1ZHhO6q5xQ>}}

{{<youtube 7sAWzuInZhk>}}

---
## Maze Description
We worked with M x N rectangular grids (mazes). The robot could move North, South, East, or West. No diagonal movement was allowed.

---
## Maze Generation Algorithm
Initially, we tested our algorithms on manually defined mazes, but then we were able to implement the Randomized Prim's Algorithm

### Randomised Prim's Algorithm
Our implementation of the Prim's Algorithm assumes a cell is either free or blocked. The algorithm can then generate a maze without any loops or inaccessible areas.

Algorithm Pseudo Code:
```
All cells are walls.
Randomly choose a cell Q and mark it as free.
Add cell Q's neighbors to the wall list.
While the wall list is not empty:
    Randomly choose a wall W from the wall list
    If wall W is adjacent to exactly one free cell
       Let F be the free cell that wall W is adjacent to
       W is to a direction DIR (either North, South, East, or West) of F.
       Let A be the cell to the direction DIR of W
       Make W free
       Make A free
       Add the walls of A to the wall list
    Remove W from the wall list
```

## Maze Solvers
We implemented two different maze solving algorithms

### Wavefront Planner
- Breadth-first search approach
- Start at the goal
- Advance one square in every direction and mark with a 1.
- From each 1, advance to every open square and mark with a 2
- From each
- square advance to every open square and mark with an
- Stop when there are no more squares to explore
- From any starting point, move to the adjacent cell with the lowest number
- Stop at the goal
- This finds the shortest path to a given goal from every starting point, but it requires full knowledge of the maze

### Recursive Back Tracking
- Depth-first search approach
- Start at the start
- For each neighboring cell, find a path to the goal
- When finding a path to the goal:
    - If you are at the goal, return true, you are done
    - If you are at a wall, return false, this is not the path
    - Otherwise find a path from each neighboring cell
- Mark each cell when exploring it as part of the path
- Unmark each cell when you've searched all its neighbors without finding the goal
- Does not find the shortest path, but it will find a path if it exists
- Does not require full knowledge of the maze (because exploration starts at the start, the robot could physically follow each step in the search). 

## Reference 
More detail about this challenge can be found on the NU MSR website: https://nu-msr.github.io/hackathon/python_challenge.html