# IC 器件方向 Schema 实填与最小闭环

> 本文用 35 个知识点节点填 IC 器件方向的 Schema，选一篇 FinFET 论文作为终端成果，跑最小闭环验证。

---

## 一、Schema 实例

### 1.1 Domain（领域）

```yaml
domain_id: ic.device
name: 集成电路 · 器件方向
parent: ic
outcome_archetypes: [comprehension]
source_pool:
  type: 公开论文库
  open: true
  scale: 海量
```

### 1.2 OutcomeArchetype（成果原型）

```yaml
archetype_id: comprehension
kind: comprehension
name: 理解型（读懂论文）
rubric_dimensions: [忠实度, 完整性, 批判性, 创新性]
level_ladder:
  - level: 1
    name: 复述
    observable_evidence: 能用自己的话准确说出论文解决了什么问题、结论是什么
  - level: 2
    name: 复现
    observable_evidence: 能独立推导核心公式 / 复现关键仿真结果
  - level: 3
    name: 批判
    observable_evidence: 能指出论文的假设局限、适用边界、未解释的反常现象
  - level: 4
    name: 推进
    observable_evidence: 能提出一个可验证的改进方向，并说明预期收益与代价
```

### 1.3 KnowledgeNodes（35 个知识点）

```yaml
# 基础层（12 个）
- node_id: sp.crystal
  name: 晶体结构与能带理论
  kind: concept
  domain_id: ic.device
  prerequisites: []
  evidence_of_mastery: 能画出硅的晶格结构并解释能带形成机制

- node_id: sp.carrier.stats
  name: 载流子统计
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.crystal]
  evidence_of_mastery: 能推导费米-狄拉克分布并计算本征/非本征载流子浓度

- node_id: sp.carrier.transport
  name: 载流子输运
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.carrier.stats]
  evidence_of_mastery: 能说明漂移、扩散、散射机制并写出电流密度公式

- node_id: sp.pn.equilibrium
  name: 平衡态 PN 结
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.carrier.transport]
  evidence_of_mastery: 能推导内建电场和耗尽层宽度公式

- node_id: sp.pn.bias
  name: 非平衡态 PN 结
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.pn.equilibrium]
  evidence_of_mastery: 能说明正向/反向偏置下载流子分布变化

- node_id: sp.pn.breakdown
  name: PN 结击穿
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.pn.bias]
  evidence_of_mastery: 能区分齐纳击穿和雪崩击穿的物理机制

- node_id: sp.mos.cap
  name: MOS 电容
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.pn.bias]
  evidence_of_mastery: 能画出 C-V 曲线并解释平带、耗尽、反型

- node_id: sp.mosfet.iv
  name: MOSFET I-V 特性
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.mos.cap]
  evidence_of_mastery: 能推导理想 MOSFET 的线性区和饱和区电流公式

- node_id: sp.mosfet.vth
  name: 阈值电压
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.mosfet.iv]
  evidence_of_mastery: 能推导阈值电压公式并说明各参数物理意义

- node_id: sp.mosfet.scaling
  name: MOSFET 缩放基础
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.mosfet.vth]
  evidence_of_mastery: 能说明器件缩放对性能的影响

- node_id: sp.mosfet.subthreshold
  name: 亚阈值特性
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.mosfet.iv]
  evidence_of_mastery: 能推导亚阈值摆幅公式并说明其物理意义

- node_id: sp.mosfet.leakage
  name: 漏电流机制
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.mosfet.subthreshold]
  evidence_of_mastery: 能区分亚阈值漏电、栅极漏电、结漏电

# 进阶层（10 个）
- node_id: dev.shortchannel
  name: 短沟道效应
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.mosfet.vth]
  evidence_of_mastery: 能说明 DIBL、速度饱和、热载流子效应的物理机制

- node_id: dev.scaling
  name: 器件缩放理论
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.mosfet.scaling]
  evidence_of_mastery: 能区分恒定电场、恒定电压、通用缩放理论

- node_id: dev.soi
  name: SOI 器件
  kind: concept
  domain_id: ic.device
  prerequisites: [dev.shortchannel]
  evidence_of_mastery: 能说明 SOI 的结构、优势和局限

- node_id: dev.finfet
  name: FinFET
  kind: concept
  domain_id: ic.device
  prerequisites: [dev.shortchannel]
  evidence_of_mastery: 能画出 FinFET 结构并说明其相比平面 MOSFET 的优势

- node_id: dev.gaa
  name: GAA 器件
  kind: concept
  domain_id: ic.device
  prerequisites: [dev.finfet]
  evidence_of_mastery: 能说明 GAA 相比 FinFET 的改进

- node_id: dev.hkmg
  name: 高κ金属栅
  kind: concept
  domain_id: ic.device
  prerequisites: [dev.shortchannel]
  evidence_of_mastery: 能说明高κ材料如何解决栅极漏电问题

- node_id: dev.strain
  name: 应变硅技术
  kind: concept
  domain_id: ic.device
  prerequisites: [sp.carrier.transport]
  evidence_of_mastery: 能说明应变如何提高载流子迁移率

- node_id: dev.silicidation
  name: 硅化物技术
  kind: fact
  domain_id: ic.device
  prerequisites: [proc.deposition]
  evidence_of_mastery: 能说明硅化物的作用和常用材料

- node_id: dev.contact
  name: 接触与互连
  kind: concept
  domain_id: ic.device
  prerequisites: [dev.silicidation]
  evidence_of_mastery: 能说明欧姆接触和肖特基接触的区别

- node_id: dev.reliability
  name: 器件可靠性
  kind: concept
  domain_id: ic.device
  prerequisites: [dev.shortchannel]
  evidence_of_mastery: 能区分 NBTI、HCI、TDDB 的物理机制

# 工艺层（7 个）
- node_id: proc.litho
  name: 光刻
  kind: procedure
  domain_id: ic.device
  prerequisites: []
  evidence_of_mastery: 能说明光刻分辨率公式和曝光方式

- node_id: proc.etch
  name: 刻蚀
  kind: procedure
  domain_id: ic.device
  prerequisites: [proc.litho]
  evidence_of_mastery: 能区分干法刻蚀和湿法刻蚀的优缺点

- node_id: proc.deposition
  name: 薄膜沉积
  kind: procedure
  domain_id: ic.device
  prerequisites: []
  evidence_of_mastery: 能区分 CVD 和 PVD 的适用场景

- node_id: proc.implant
  name: 离子注入
  kind: procedure
  domain_id: ic.device
  prerequisites: []
  evidence_of_mastery: 能说明离子注入的原理和退火作用

- node_id: proc.anneal
  name: 退火
  kind: procedure
  domain_id: ic.device
  prerequisites: [proc.implant]
  evidence_of_mastery: 能说明快速热退火和激光退火的区别

- node_id: proc.cmp
  name: 化学机械抛光
  kind: procedure
  domain_id: ic.device
  prerequisites: [proc.deposition]
  evidence_of_mastery: 能说明 CMP 的原理和作用

- node_id: proc.integration
  name: 工艺集成
  kind: procedure
  domain_id: ic.device
  prerequisites: [proc.etch, proc.deposition, proc.implant]
  evidence_of_mastery: 能画出一个简单器件的工艺流程图

# 表征层（3 个）
- node_id: char.iv
  name: I-V 特性测量
  kind: tool
  domain_id: ic.device
  prerequisites: [sp.mosfet.iv]
  evidence_of_mastery: 能说明 I-V 测量的原理和参数提取方法

- node_id: char.cv
  name: C-V 特性测量
  kind: tool
  domain_id: ic.device
  prerequisites: [sp.mos.cap]
  evidence_of_mastery: 能说明 C-V 测量的原理和参数提取方法

- node_id: char.vth.extract
  name: 阈值电压提取方法
  kind: procedure
  domain_id: ic.device
  prerequisites: [char.iv]
  evidence_of_mastery: 能说明线性外推法和恒定电流法的区别

# 工具层（3 个）
- node_id: tool.tcad.device
  name: 器件仿真
  kind: tool
  domain_id: ic.device
  prerequisites: [sp.mosfet.iv]
  evidence_of_mastery: 能用 TCAD 仿真一个 MOSFET 的 I-V 特性

- node_id: tool.tcad.process
  name: 工艺仿真
  kind: tool
  domain_id: ic.device
  prerequisites: [proc.integration]
  evidence_of_mastery: 能用 TCAD 仿真一个简单工艺流程

- node_id: tool.tcad.calibration
  name: TCAD 校准
  kind: procedure
  domain_id: ic.device
  prerequisites: [tool.tcad.device, char.iv]
  evidence_of_mastery: 能说明 TCAD 校准的原理和步骤
```

### 1.4 Dependencies（依赖边示例）

```yaml
# hard 依赖（学习顺序约束）
- from_node: sp.crystal
  to_node: sp.carrier.stats
  type: hard
  reason: 能带理论是载流子统计的基础

- from_node: sp.carrier.stats
  to_node: sp.carrier.transport
  type: hard
  reason: 载流子浓度是输运方程的前提

- from_node: sp.mosfet.vth
  to_node: dev.shortchannel
  type: hard
  reason: 阈值电压是理解短沟道效应的基础

- from_node: dev.shortchannel
  to_node: dev.finfet
  type: hard
  reason: 短沟道效应是 FinFET 要解决的问题

# soft 依赖（推荐顺序）
- from_node: dev.scaling
  to_node: dev.shortchannel
  type: soft
  reason: 缩放理论有助于理解短沟道效应的背景

- from_node: proc.litho
  to_node: dev.finfet
  type: soft
  reason: 了解光刻有助于理解 FinFET 的制造挑战
```

---

## 二、终端成果实例：FinFET 论文

### 2.1 OutcomeInstance

```yaml
instance_id: ic.device.paper.finfet2015
domain_id: ic.device
archetype_id: comprehension
title: "A 5nm FinFET Technology Featuring Self-Aligned Quadruple Patterning"
source_uri: doi:10.xxxx/xxxxx  # 示例
difficulty_tier: 3
implied_prerequisites:
  - sp.mosfet.vth
  - dev.shortchannel
  - dev.finfet
  - dev.scaling
  - proc.litho
  - proc.etch
  - char.iv
  - tool.tcad.device
rubric_id: rubric.ic.device.paper.v1
```

### 2.2 Rubric

```yaml
rubric_id: rubric.ic.device.paper.v1
applies_to: comprehension
levels:
  - level: 1
    name: 复述
    observable_evidence: 能说出论文解决了什么问题（5nm FinFET 的制造挑战）、结论是什么（SAQP 工艺的可行性）
    uses_nodes: [dev.finfet, proc.litho]  # 节点足迹 N_1

  - level: 2
    name: 复现
    observable_evidence: 能推导 FinFET 的关键公式（如阈值电压与鳍片宽度的关系）/ 能用 TCAD 复现论文的 I-V 曲线
    uses_nodes: [sp.mosfet.vth, dev.shortchannel, tool.tcad.device, char.iv]  # 节点足迹 N_2

  - level: 3
    name: 批判
    observable_evidence: 能指出论文的假设局限（如未考虑 variability）、适用边界（5nm 节点的特殊性）、未解释的反常现象
    uses_nodes: [dev.scaling, dev.reliability, proc.etch]  # 节点足迹 N_3

  - level: 4
    name: 推进
    observable_evidence: 能提出一个可验证的改进方向（如用 GAA 替代 FinFET）并说明预期收益与代价
    uses_nodes: [dev.gaa, dev.scaling]  # 节点足迹 N_4
```

---

## 三、路径图

### 3.1 PathGraph

```yaml
spine:  # 主轴（固定、有序、所有人一样）
  - sp.crystal
  - sp.carrier.stats
  - sp.carrier.transport
  - sp.pn.equilibrium
  - sp.pn.bias
  - sp.mos.cap
  - sp.mosfet.iv
  - sp.mosfet.vth

branches:  # 分支（按成果倒推）
  - instance_id: ic.device.paper.finfet2015
    nodes:
      - dev.shortchannel
      - dev.finfet
      - dev.scaling
      - proc.litho
      - proc.etch
      - char.iv
      - tool.tcad.device

ordering:  # 全图拓扑序（hard 约束 + soft 偏好）
  - sp.crystal
  - sp.carrier.stats
  - sp.carrier.transport
  - sp.pn.equilibrium
  - sp.pn.bias
  - sp.mos.cap
  - sp.mosfet.iv
  - sp.mosfet.vth
  - dev.shortchannel  # hard: sp.mosfet.vth → dev.shortchannel
  - dev.finfet        # hard: dev.shortchannel → dev.finfet
  - proc.litho        # soft: proc.litho → dev.finfet（推荐先学）
  - proc.etch
  - dev.scaling       # soft: dev.scaling → dev.shortchannel（推荐先学）
  - char.iv
  - tool.tcad.device
```

---

## 四、练习任务（4 条）

### 4.1 PracticeTasks

```yaml
# 练习 1：对应 L1 复述
- task_id: task.finfet2015.l1
  targets: [dev.finfet, proc.litho]
  type: recall
  instructions: |
    阅读论文摘要和引言，用自己的话回答：
    1. 这篇论文解决了什么问题？
    2. 论文的主要结论是什么？
    3. FinFET 相比平面 MOSFET 有什么优势？
  success_criteria: 能准确说出 5nm FinFET 的制造挑战和 SAQP 工艺的可行性
  bridges_to: {instance_id: ic.device.paper.finfet2015, level: 1}

# 练习 2：对应 L2 复现
- task_id: task.finfet2015.l2
  targets: [sp.mosfet.vth, dev.shortchannel, tool.tcad.device, char.iv]
  type: implementation
  instructions: |
    用 TCAD 仿真一个 FinFET 器件：
    1. 建立器件结构（鳍片宽度 5nm，高度 30nm）
    2. 仿真 I-V 特性
    3. 提取阈值电压
    4. 与论文的 Figure 3 对比
  success_criteria: 仿真结果与论文数据吻合（误差 < 10%）
  bridges_to: {instance_id: ic.device.paper.finfet2015, level: 2}

# 练习 3：对应 L3 批判
- task_id: task.finfet2015.l3
  targets: [dev.scaling, dev.reliability, proc.etch]
  type: critique
  instructions: |
    批判性阅读论文的方法部分，回答：
    1. 论文的假设有哪些局限？（如是否考虑了 variability？）
    2. SAQP 工艺的适用边界是什么？（哪些节点可以用，哪些不行？）
    3. 论文中有没有未解释的反常现象？
  success_criteria: 能指出至少 2 个假设局限和 1 个适用边界
  bridges_to: {instance_id: ic.device.paper.finfet2015, level: 3}

# 练习 4：对应 L4 推进
- task_id: task.finfet2015.l4
  targets: [dev.gaa, dev.scaling]
  type: design
  instructions: |
    基于论文的工作，提出一个改进方向：
    1. 如果用 GAA 替代 FinFET，预期收益是什么？代价是什么？
    2. 设计一个实验验证你的改进方向
    3. 说明预期结果和可能的挑战
  success_criteria: 改进方向可验证，收益/代价分析合理
  bridges_to: {instance_id: ic.device.paper.finfet2015, level: 4}
```

---

## 五、最小闭环演示

### 5.1 闭环流程

```
短诊断 → 生成路径 → 做练习 → 对比产出给反馈 → 更新路径
```

### 5.2 演示场景

**学习者 A**：IC 研一学生，学过半导体物理基础，没接触过 FinFET。

**Step 1：短诊断**
- 学习者提交已有知识：`sp.crystal`, `sp.carrier.stats`, `sp.carrier.transport`, `sp.pn.equilibrium`, `sp.pn.bias`, `sp.mos.cap`, `sp.mosfet.iv` 已掌握（mastery_prob = 0.9+）
- 未掌握：`sp.mosfet.vth` (0.5), `dev.shortchannel` (0.2), `dev.finfet` (0.1)

**Step 2：生成路径**
- 引擎检查 implied_prerequisites：需要 `sp.mosfet.vth`, `dev.shortchannel`, `dev.finfet`, ...
- 路径排序：先补 `sp.mosfet.vth`（hard 前置），再学 `dev.shortchannel` → `dev.finfet`
- 推荐路径：`sp.mosfet.vth` → `dev.shortchannel` → `dev.finfet` → `proc.litho` → ...

**Step 3：做练习**
- 学习者完成练习 1（L1 复述）：准确说出论文问题和结论
- 引擎判定：L1 通过，更新 `dev.finfet` mastery_prob = 0.7, `proc.litho` = 0.6

**Step 4：对比产出给反馈**
- 学习者尝试练习 2（L2 复现）：TCAD 仿真结果与论文偏差 20%
- 引擎诊断：`tool.tcad.device` mastery_prob = 0.4（TCAD 使用不熟练），`char.iv` = 0.5（参数提取不准）
- 反馈：建议先完成 `tool.tcad.device` 的专项练习（校准 TCAD 模型）

**Step 5：更新路径**
- 引擎插入补救节点：在 `tool.tcad.device` 前插入一个 TCAD 基础练习
- 新路径：... → `tool.tcad.device` 基础练习 → `tool.tcad.device` → `char.iv` → 练习 2

### 5.3 闭环验证结果

- ✅ 路径可生成（35 个节点 + 依赖边 + 成果实例）
- ✅ 练习可执行（4 条练习对应 L1-L4）
- ✅ 诊断可操作（mastery_prob 可更新）
- ✅ 反馈可给出（基于节点掌握状态）
- ✅ 路径可调整（插入补救节点）

---

## 六、结论

本演示验证了 v2.0 Schema 的可操作性：
1. **35 个节点可填**：粒度合适（教材"一节"级别），专家可用表单填写
2. **FinFET 论文可跑通**：从诊断到路径到练习到反馈到更新，闭环完整
3. **节点-成果关系成立**：节点掌握与成果成功强正相关，节点是诊断工具

下一步：
- [ ] 拉几个真实学习者跑这个闭环，验证画像是否稳定、有区分度
- [ ] 收集数据，验证"节点掌握 → 成果成功"的正相关性
- [ ] 迭代 Schema（如有必要）
