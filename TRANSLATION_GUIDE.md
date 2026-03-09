# 朱宸宇个人主页 中文本地化 — 术语对照表与翻译指南

> 生成日期: 2026-03-09
> 用途: 翻译前的术语统一参考，确保全站术语一致性和专业准确性

---

## 一、项目背景概述

朱宸宇 (Chenyu Zhu)
东南大学（南京）自动化本科 → UC Berkeley 交换 → 西北大学(Northwestern, Evanston, IL) 机器人学硕士
语言：英语（专业）、中文（母语）、日语（基础会话）

### 网页展示内容（6个项目+1实习+1专利）

| 领域 | 涉及项目 |
|------|---------|
| 无人机/飞控 | Human-in-the-Loop Compliant Drone with LiDAR Avoidance |
| 机械臂操作 | Franka Domino Placement、Pen Grasping |
| 动力学仿真 | Box-Jack Impact Simulation |
| 医疗机器人 | Intuitive Surgical 实习（达芬奇手术系统） |
| 强化学习 | Base Station Optimization |
| 游戏开发 | Ants vs SomeBees |
| 专利 | Saccule folding mechanism (CN 220988900 U) |

### 简历中有但网页未展示的内容

| 类型 | 内容 |
|------|------|
| 实习 | **GE Healthcare**（无锡，2023.6-8）— 平台工程师实习，竞赛机器人 |
| 实习 | **Cryofocus Medtech**（上海，2022.6-9）— 嵌入式系统实习，低温流量调节 |
| 项目 | **Hybrid Electric Vehicle Torque Distribution Study**（2023.9-2024.1）— 混动车扭矩分配 |
| 项目 | **Directional Horizontal Drilling Rig Guidance System**（2022.10-2023.10）— 水平定向钻机导向 |

### 技能清单（来自简历）
- 编程语言：Python, C, C++, Assembly(x86), MATLAB
- 技术技能：ROS 2, Linux, Git, CAD, SLAM, Motion Capture, Parallel Computing, Path Planning, Simulink

---

## 二、核心术语对照表

### 2.1 机器人学与控制

| English | 推荐中文 | 备选 | 说明 |
|---------|---------|------|------|
| Force-Compliant | 力柔顺 | 力顺应 | "力柔顺"是学术界主流用法，如"柔顺控制" |
| Force Compliance | 力柔顺性 | — | |
| Compliant Control | 柔顺控制 | — | 机器人控制领域标准术语 |
| Obstacle Avoidance | 避障 | 障碍物避让 | "避障"是通用简称 |
| Kalman Filter | 卡尔曼滤波器 | 卡尔曼滤波 | 都可以，"滤波器"更正式 |
| Potential Field | 人工势场 | 势场法 | 避障语境用"人工势场法" |
| Motion Planning | 运动规划 | 路径规划 | "运动规划"包含轨迹+路径；"路径规划"仅指路径 |
| Robot Manipulation | 机器人操作 | 机械臂操作 | 学术论文用"机器人操作" |
| Force Control | 力控制 | 力控 | "力控"是口语简称 |
| Torque Feedback | 力矩反馈 | 转矩反馈 | 机器人领域多用"力矩" |
| End-effector | 末端执行器 | — | 标准术语 |
| DOF (Degrees of Freedom) | 自由度 | — | |
| 7-DOF | 7自由度 | — | |
| Cartesian Space | 笛卡尔空间 | 直角坐标空间 | |
| Joint Space | 关节空间 | — | |
| Eye-in-hand | 眼在手上 | — | 网络实证：CSDN/知乎手眼标定教程一致用"眼在手上"，Gemini建议去"上"字有误 |
| Extrinsic Calibration | 外参标定 | 外部参数标定 | |
| Hand-eye Calibration | 手眼标定 | — | 标准术语 |
| Pose Estimation | 位姿估计 | 姿态估计 | "位姿"=位置+姿态 |
| Setpoint | 设定值 | 目标值 | 控制工程标准用语 |
| Hover | 悬停 | — | |
| Position Hold | 位置保持 | 定点悬停 | |
| Sensorless Force Estimation | 无传感器力估计 | — | 网络实证：浙大等论文用"无传感器力估计"，"无力传感器力估计"有歧义 |
| Collision-aware | 碰撞感知 | 避碰 | |
| Trajectory | 轨迹 | — | |

### 2.2 无人机/飞控专用

| English | 推荐中文 | 备选 | 说明 |
|---------|---------|------|------|
| Quadrotor | 四旋翼 | 四旋翼飞行器 | |
| Drone | 无人机 | — | |
| Thrust | 推力 | — | |
| Pitch | 俯仰角 | 俯仰 | |
| Roll | 横滚角 | 横滚 | |
| Yaw | 偏航角 | 偏航 | |
| NED (North-East-Down) | 北-东-地坐标系 | NED坐标系 | 可保留NED缩写 |
| FLU (Forward-Left-Up) | 前-左-上坐标系 | FLU坐标系 | |
| FRD (Forward-Right-Down) | 前-右-下坐标系 | — | |
| Attitude | 姿态 | — | |
| Autopilot | 自动驾驶仪 | 飞控固件 | PX4语境用"飞控" |
| Flight Controller | 飞行控制器 | 飞控 | |
| Companion Computer | 机载电脑 | 机载计算机 | 网络实证：PX4官方中文文档(docs.px4.io/main/zh/)用"机载电脑" |
| Force Superposition | 力的叠加 | 力叠加 | |
| Velocity Damping | 速度阻尼 | — | |
| Repulsive Force | 斥力 | 排斥力 | 势场法语境用"斥力" |
| Hemicircle | 半圆 | — | |
| Safety Bubble | 安全包络（Safety Bubble） | 安全气泡 | 网络实证：中文无人机文献中"安全气泡"几乎不出现，"安全包络"更通用 |
| Motion Capture | 动作捕捉 | 运动捕捉 | 都可以 |
| OptiTrack | OptiTrack | — | 品牌名保留英文 |
| uXRCE-DDS | uXRCE-DDS | — | 协议名保留 |
| UART | UART串口 | 通用异步收发器 | 保留缩写更通用 |
| Baud Rate | 波特率 | — | |

### 2.3 计算机视觉

| English | 推荐中文 | 备选 | 说明 |
|---------|---------|------|------|
| RGB-D | RGB-D | — | 保留，已是通用写法 |
| HSV Color Space | HSV色彩空间 | HSV颜色空间 | |
| HSV Filtering | HSV 阈值分割 | 基于 HSV 的颜色检测 | 网络实证：CSDN标准叫法是"HSV阈值分割"（用inRange） |
| Contour Extraction | 轮廓提取 | — | |
| Centroid | 质心 | 形心 | 网络实证：OpenCV中文教程（cv2.moments）统一用"质心"，GPT建议"形心"有误 |
| Centroid Detection | 质心检测 | — | 网络实证：CV领域统一用"质心检测" |
| Binary Mask | 二值掩模 | 二值蒙版 | "掩模"是学术标准 |
| Depth Correspondence | 深度对齐 | 像素级深度对应 | |
| Visual Servoing | 视觉伺服 | — | |
| Bounding Box | 边界框 | 包围框 | |
| Point Cloud | 点云 | — | |
| Color Filtering | 颜色滤波 | 颜色过滤 | |
| Gaussian Blur | 高斯模糊 | 高斯平滑 | |
| Segmentation | 分割 | 图像分割 | |
| Trackbar | 滑动条 | 调参条 | OpenCV中常见 |
| Quaternion | 四元数 | — | |
| Coordinate Transformation | 坐标变换 | — | |
| Camera Intrinsics | 相机内参 | 内部参数 | |
| Rotation Matrix | 旋转矩阵 | — | |
| Translation Vector | 平移向量 | — | |

### 2.4 物理/动力学

| English | 推荐中文 | 备选 | 说明 |
|---------|---------|------|------|
| Lagrangian Mechanics | 拉格朗日力学 | — | |
| Euler-Lagrange Equations | 欧拉-拉格朗日方程 | — | |
| Generalized Coordinates | 广义坐标 | — | |
| Kinetic Energy | 动能 | — | |
| Potential Energy | 势能 | — | |
| Moment of Inertia | 转动惯量 | — | 终审修正：刚体动力学语境只用"转动惯量"，删除"惯性矩"（那是截面惯性矩） |
| Rigid-body Dynamics | 刚体动力学 | — | |
| Unilateral Contact Constraint | 单面接触约束 | 单侧接触约束 | 网络实证：理论力学教材标准术语是"单面约束/双面约束" |
| Gap Constraint | 间隙约束 | — | |
| Elastic Impact | 弹性碰撞 | — | |
| Inelastic Impact | 非弹性碰撞 | — | |
| Impact Detection | 碰撞检测 | — | |
| Impulsive Velocity Update | 基于冲量的速度修正 | 冲量法速度更新 | 网络实证：GAMES103/PhysX中文社区用"速度修正"多于"速度更新" |
| RK4 (Runge-Kutta 4th order) | 四阶龙格-库塔法 | RK4 | |
| Piecewise-smooth | 分段光滑 | — | |
| SE(2) | SE(2) | 特殊欧氏群 | 保留数学符号 |
| Homogeneous Transform | 齐次变换 | — | |
| Parallel-axis Theorem | 平行轴定理 | — | |
| Jacobian | 雅可比矩阵 | — | |
| Energy Conservation | 能量守恒 | — | |
| Energy Dissipation | 能量耗散 | — | |
| Equations of Motion | 运动方程 | — | |
| Lambdify | 数值化 | Lambda化 | SymPy专用：将符号表达式转为数值函数 |
| Symbolic Computation | 符号计算 | — | |
| Time Integration | 时间积分 | — | |
| Planar | 平面的 | — | |

### 2.5 医疗器械

| English | 推荐中文 | 备选 | 说明 |
|---------|---------|------|------|
| Da Vinci Surgical System | 达芬奇手术系统 | 达芬奇外科手术系统 | |
| Ultrasonic Scalpel | 超声刀 | 超声手术刀 | "超声刀"是临床通用简称 |
| Cryoablation | 冷冻消融 | — | |
| Cryoablation Catheter | 冷冻消融导管 | — | |
| Thermal Imaging | 热成像 | 红外热成像 | |
| Cooling Behavior | 冷却特性 | 冷却行为 | "冷却特性"更学术 |
| Exponential Decay | 指数衰减 | — | |
| Curve Fitting | 曲线拟合 | — | |
| Region of Interest (ROI) | 感兴趣区域 | ROI | |
| Microscopic Inspection | 显微检查 | 微观检测 | |
| Saccule Folding Mechanism | 球囊折叠机构 | 囊体折叠机构 | 三方审计：Gemini指出医疗领域标准用"球囊" |
| Balloon Retraction | 球囊回缩 | — | |
| Sheath | 鞘管 | 外鞘 | 导管器械标准用语 |
| Coating | 涂层 | — | |
| Cryogenic Flow Regulator | 低温流量调节器 | — | Cryofocus实习相关 |
| Digital-to-Analog Converting | 数模转换 | D/A转换 | |
| PCI Control | PCI控制 | — | GE Healthcare实习相关 |
| Torque-Coupler | 转矩耦合器 | 扭矩耦合器 | 混动车项目 |
| Drilling Rig | 钻机 | — | |
| Directional Horizontal Drilling | 水平定向钻进 | — | |
| Magnetic-Signal Communication | 磁信号通信 | — | |
| PI Control | PI控制 | 比例积分控制 | |

### 2.6 强化学习与优化

| English | 推荐中文 | 说明 |
|---------|---------|------|
| Reinforcement Learning (RL) | 强化学习 | |
| Deep Reinforcement Learning (DRL) | 深度强化学习 | |
| Base Station | 基站 | |
| Throughput | 吞吐量 | |
| Energy Consumption | 能耗 | 能量消耗 |
| Optimization | 优化 | |

### 2.7 游戏开发

| English | 推荐中文 | 说明 |
|---------|---------|------|
| Tower Defense | 塔防 | |
| Turn-based | 回合制 | |
| OOP (Object-Oriented Programming) | 面向对象编程 | |
| Class Inheritance | 类继承 | |
| Encapsulation | 封装 | |
| Polymorphism | 多态 | |
| Event-driven Programming | 事件驱动编程 | |
| Game State | 游戏状态 | |
| GUI | 图形用户界面 | 可保留GUI |

### 2.8 硬件/平台（保留英文原名）

以下品牌名/产品名**保留英文**，必要时首次出现加中文注释：

| 原名 | 翻译策略 |
|------|---------|
| Franka Emika Panda | Franka Emika Panda 机械臂 |
| Interbotix PX100 | Interbotix PX100 机械臂 |
| Intel RealSense | Intel RealSense 深度相机 |
| Pixhawk 6C | Pixhawk 6C 飞控 |
| Holybro X500 V2 | Holybro X500 V2 机架 |
| SLAMTEC RPLidar | 思岚 RPLidar 激光雷达 |
| Raspberry Pi 5 | 树莓派5 |
| OpenCV | OpenCV |
| SymPy | SymPy |
| NumPy | NumPy |
| Plotly | Plotly |
| Matplotlib | Matplotlib |
| MoveIt | MoveIt |
| PX4 | PX4 |
| ROS 2 | ROS 2 |
| TF2 | TF2 |
| Eigen | Eigen |
| easy_handeye2 | easy_handeye2 |

### 2.9 学术机构

| English | 中文 |
|---------|------|
| Northwestern University | 美国西北大学 |
| MS in Robotics | 机器人学硕士 |
| Southeast University | 东南大学 |
| BS in Automation | 自动化专业学士 |
| University of California, Berkeley | 加州大学伯克利分校 |
| Exchange Program | 交换项目 |
| Intuitive Surgical | Intuitive Surgical（直觉外科） |
| CS61A | CS61A（保留课程编号） |
| ME495 | ME495（保留课程编号） |

---

## 三、翻译原则与注意事项

### 3.1 通用原则
1. **技术术语一致性**: 全站同一术语必须统一翻译，不可一处用"力柔顺"另一处用"力顺应"
2. **品牌/产品名保留英文**: Franka、PX4、ROS 2、OpenCV 等不翻译
3. **首次出现加注**: 专业术语首次出现时用「中文（English）」格式，后续直接用中文
4. **公式保留**: 所有 LaTeX 数学公式保持原样，不翻译变量名
5. **代码/节点名保留**: `find_dominoes`、`place_dominoes` 等代码标识符不翻译
6. **图片/视频路径不动**: 所有 `/images/...` 路径保持不变

### 3.2 特别注意
- **Force-Compliant** 统一译为 **"力柔顺"**（不用"力顺应"）
  - 依据：中国机器人学期刊（《机器人》《机械工程学报》）中"柔顺控制"是标准表述
- **Obstacle Avoidance** 统一译为 **"避障"**
- **Motion Planning** 与 **Path Planning** 区分使用：
  - Motion Planning = 运动规划（包含时间/速度信息）
  - Path Planning = 路径规划（仅几何路径）
- **Impact** 在动力学语境译为 **"碰撞"**，不用"冲击"
- **Hybrid System** 在动力学语境译为 **"混杂系统"**（不用"混合系统"）
  - 依据：连续+离散混合的系统在控制理论中称"混杂系统"
- **Companion Computer** 译为 **"机载电脑"**（PX4 官方中文文档用语）
- **Software Stack** 译为 **"软件技术栈"**，**Software Architecture** 译为 **"软件架构"**，二者必须区分
- **Saccule** 医疗领域译为 **"球囊"**（专利原文即此）
- **Centroid** 统一译为 **"质心"**（OpenCV 中文教程标准，不用"形心"）
- **Safety Bubble** 译为 **"安全包络"**（中文无人机文献标准，不用"安全气泡"）
- **Eye-in-hand** 译为 **"眼在手上"**（CSDN/知乎手眼标定统一用法）
- **Unilateral Contact** 译为 **"单面接触"**（理论力学教材标准）
- **Sensorless Force Estimation** 译为 **"无传感器力估计"**（"无力传感器"有歧义）

### 3.2.1 三方审计补充的遗漏术语

| English | 推荐中文 | 说明 |
|---------|---------|------|
| Impedance Control | 阻抗控制 | 力柔顺相关的底层控制方法 |
| Admittance Control | 导纳控制 | 与阻抗控制互补 |
| Forward Kinematics (FK) | 正运动学 | |
| Inverse Kinematics (IK) | 逆运动学 | |
| Coefficient of Restitution | 恢复系数 | 碰撞动力学核心参数 |
| Quasi-steady-state | 准稳态 | drone.md中出现 |
| Random Walk | 随机游走 | KF模型中出现 |
| Friction Cone | 摩擦锥 | 接触动力学相关 |
| Grasp Planning | 抓取规划 | |
| Contact Model | 接触模型 | |
| State Estimation | 状态估计 | 无人机/KF 相关 |
| Stiffness / Damping | 刚度 / 阻尼 | 力控相关 |
| Body Frame / World Frame | 机体系 / 世界系 | 坐标系 |
| Offboard (PX4) | 外部控制（Offboard） | PX4 飞行模式 |
| Thresholding | 阈值处理 | CV 相关 |
| Policy / Value Function | 策略 / 价值函数 | RL 相关 |
| Coefficient of Friction | 摩擦系数 | 碰撞动力学 |
| Coulomb Friction | 库仑摩擦 | 碰撞动力学 |

### 3.2.2 排版规范（三方审计建议）
- 中文与英文/数字之间**加半角空格**：`基于 ROS 2 和 OpenCV`（不写 `基于ROS 2和OpenCV`）
- 首次出现格式：`柔顺控制（Compliant Control）`
- 行业常用缩写可直接保留：PID、MPC、IMU、SLAM、EKF 等无需展开
- 英文缩写严格保留官方大小写：**LiDAR**（非 Lidar）、**PX4**（非 px4）、**ROS 2**（非 ros2）
- 数字与单位间加半角空格：`7 DoF`、`500 Hz`、`3.5 kg`（例外：`%` 和 `°C` 紧贴数字）

### 3.3 UI/菜单翻译

| 原文 | 中文 |
|------|------|
| Featured Projects | 精选项目 |
| Other Projects | 其他项目 |
| Read More | 查看详情 |
| About Me | 关于我 |
| Resume | 简历 |
| Projects | 项目 |
| Table Of Contents | 目录 |
| Page not found | 页面未找到 |
| Recent Posts | 最新文章 |

### 3.4 各项目标题推荐翻译

| 原标题（网页） | 简历标题（如不同） | 推荐中文标题 |
|---------------|-------------------|------------|
| Force-Compliant Drone with Obstacle Avoidance | Human-in-the-Loop Compliant Drone with LiDAR Avoidance | 力柔顺交互四旋翼：LiDAR 避障 |
| Vision-Guided Domino Placement with Franka Emika Robot | 同 | 基于视觉引导的 Franka 机械臂多米诺骨牌摆放 |
| Impact-Aware Dynamics Simulation (Box–Jack) | 无（仅网页） | 碰撞感知刚体动力学仿真（Box-Jack 系统） |
| Who Stole My Pen? – Vision-Guided Robot Pen Grasping | Picking Up a Pen Using Robot Arm and RealSense Camera | 谁偷了我的笔？—— 视觉引导机械臂抓取 |
| Ants vs SomeBees (Tower Defense Simulation) | 无（仅网页） | 蚂蚁大战蜜蜂（塔防策略游戏） |
| Experimental Study on Thermal Performance of Robotic Surgical Tools | Robotics Research Intern – Intuitive Surgical | Intuitive Surgical（直觉外科）实习：机器人手术器械热性能实验研究 |
| Innovative Balloon Retraction System (Structure Design Patent) | Saccule folding mechanism, CN 220988900 U | 球囊折叠机构（实用新型专利，CN 220988900 U） |
| Reinforcement Learning for Base Station Optimization | 无（仅网页） | 基于强化学习的基站优化 |
| — | Hybrid Electric Vehicle Torque Distribution Study | 混合动力汽车扭矩分配研究（仅简历，网页未展示） |
| — | Directional Horizontal Drilling Rig Guidance System | 水平定向钻机导向系统（仅简历，网页未展示） |

### 3.5 各section标题翻译

| 原文 | 中文 |
|------|------|
| Overview | 概述 |
| Inspiration | 灵感来源 |
| Demo | 演示 |
| How It Works | 工作原理 |
| Mathematical Model | 数学模型 |
| System Components | 系统组成 |
| High-Level Pipeline | 总体流程 |
| Hardware | 硬件平台 |
| Software Stack | 软件技术栈 |
| Software Architecture | 软件架构 |
| Workflow | 工作流程 |
| Key Engineering Challenges Solved | 解决的核心工程挑战 |
| Acknowledgments | 致谢 |
| Disclaimer | 免责声明 |
| Results and Visualization | 结果与可视化 |
| Implementation Notes | 实现说明 |
| File Structure | 文件结构 |
| Skills and Contributions | 技能与贡献 |
| Takeaways | 收获 |
| Gameplay Overview | 玩法概述 |
| Combat Logic | 战斗逻辑 |
| Object-Oriented Design | 面向对象设计 |
| Food Economy and Strategy | 资源经济与策略 |
| Ant Stats and Abilities | 蚂蚁属性与技能 |

---

## 四、翻译工作清单

按优先级排序：

1. `config.yaml` — 菜单、项目标题/描述、UI文本
2. `content/about.md` — 个人简介（最重要的门面页）
3. `content/drone.md` — 最复杂，术语最密集
4. `content/fer_domino.md` — 第二复杂
5. `content/grab_pen.md` — 中等复杂度
6. `content/box_jack_impact.md` — 物理/数学术语密集
7. `content/intuitive.md` — 医疗术语
8. `content/ants_vs_bees.md` — 最简单
9. `content/resume.md` — 仅标题

---

## 五、待确认事项（翻译前必须明确）

1. ~~**中文名确认**~~: **朱宸宇** ✅已确认
2. ~~**baseURL**~~: **不改** ✅已确认
3. ~~**languageCode**~~: 改为 `zh-cn` ✅已确认
4. ~~**简历PDF**~~: **不替换，只做网页本地化** ✅已确认
5. ~~**YouTube视频**~~: **不换** ✅已确认
6. **GitHub/LinkedIn 链接**: 保留不变 ✅
7. **教授人名**: Matthew Elwin 等保留英文 ✅
8. **网页标题 vs 简历标题不一致**: 翻译以网页标题为准，简历仅作参考
9. **GE Healthcare / Cryofocus / 混动车 / 钻机**: 网页未展示，不翻译 ✅
10. **专利类型**: CN...U = **实用新型专利**（终审Gemini纠正，非"结构设计专利"）✅

## 六、简历PDF额外发现的术语补充

| English | 推荐中文 | 说明 |
|---------|---------|------|
| Human-in-the-Loop | 人在回路 | 标准控制术语 |
| Parallel Computing | 并行计算 | |
| SLAM | SLAM（同步定位与建图） | 首次出现加注释 |
| Simulink | Simulink | 保留 |
| CAD | CAD | 保留 |
| Assembly Language (x86) | 汇编语言 (x86) | |
| Platform Engineer | 平台工程师 | |
| Embedded System | 嵌入式系统 | |
| Competition Robot | 竞赛机器人 | |
| Contact-aware Execution | 接触感知执行 | |
| Collision-free Path | 无碰撞路径 | |
| Mileage | 续航里程 | 混动车语境 |
| Emissions | 排放 | |
| Ground-device | 地面设备 | 钻机项目 |
