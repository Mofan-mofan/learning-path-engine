# 核心 Schema 设计（v0.1）
## —— 以"终端成果 + Rubric + 知识点倒推"为原语

> 用途：作为路径引擎的通用地基。目标验收标准 = **领域专家（IC 研究生）不写一行代码，就能把本领域路径图填进这套 Schema**。
> 本文用 IC 论文场景试填，并在末尾列出试填暴露的问题。

---

## 零、设计约束（Schema 必须同时满足）

1. **领域无关**：字段名里不出现"论文""财务模型"等具体词汇，它们只能是**取值**，不能是**字段**。
2. **成果优先**：知识点由成果倒推产生，Schema 里"成果"是一等公民，"知识点"是派生数据。
3. **可判分**：每个终端成果都必须挂一份 Rubric，且理解型成果必须分级。
4. **可并集**：支持从"一批成果"提取共同隐含前置知识。
5. **可填**：领域专家用表单/表格就能填，不需要理解 DAG、概率模型等技术概念。

---

## 一、实体总览与关系

```
Domain ──< OutcomeArchetype ──< OutcomeInstance ──> Rubric
  │                                  │
  │                                  └──(implies)──> KnowledgeNode
  │                                                        │
  └──< KnowledgeNode ──< Dependency(edge) ──< KnowledgeNode
                    │
                    └──< PracticeTask ──(targets)──> KnowledgeNode
                                      ──(bridges)──> OutcomeInstance 的某一级

PathGraph = Spine(KnowledgeNode) + Branches(由 OutcomeInstance 倒推的 KnowledgeNode 集)
LearnerModel = NodeStates + InferredTraits + SubmittedEvidence + OutcomeHistory
```

一句话读法：**成果实例 → 倒推出知识点 → 知识点连成依赖图 → 知识点再挂练习任务 → 练习任务回指成果的某一级。**

---

## 二、实体与字段

### 2.1 Domain（领域）

| 字段 | 类型 | 说明 | IC 试填 |
|---|---|---|---|
| `domain_id` | string | 唯一标识 | `ic.device` |
| `name` | string | 领域名 | 集成电路 · 器件方向 |
| `parent` | domain_id? | 可嵌套（大类→子领域） | `ic` |
| `outcome_archetypes` | [archetype_id] | 该领域常见成果原型 | `[comprehension]` |
| `source_pool` | object | 终端成果从哪来、是否开放 | `{type: 公开论文库, open: true, scale: 海量}` |

> 关键：`source_pool.open` 决定了这个领域能不能作为第一个跑通的领域。

---

### 2.2 OutcomeArchetype（成果原型）—— **核心原语之一**

| 字段 | 类型 | 说明 |
|---|---|---|
| `archetype_id` | string | 如 `comprehension` / `production` / `operation` |
| `kind` | enum | `comprehension` \| `production` \| `operation` |
| `name` | string | 理解型 / 生产型 / 操作型 |
| `rubric_dimensions` | [string] | 该原型的**通用判分维度模板** |
| `level_ladder` | [Level] | 该原型的通用分级阶梯 |

**三种原型的默认定义（可被领域覆盖，但默认应尽量通用）：**

| kind | 典型成果 | 默认判分维度 | 默认分级阶梯 |
|---|---|---|---|
| `comprehension` 理解型 | 读懂论文/规范 | 忠实度、完整性、批判性、创新性 | L1 复述 → L2 复现 → L3 批判 → L4 推进 |
| `production` 生产型 | 报告/模型/设计稿 | 正确性、完整性、可交付性、规范性 | L1 模仿范例 → L2 独立产出 → L3 达行业标准 → L4 可被采用 |
| `operation` 操作型 | 写代码/诊断/实操 | 正确率、效率、过程规范、异常处理 | L1 照步骤做 → L2 独立完成 → L3 稳定高效 → L4 处理异常 |

> **这一层是整个引擎能否通用的关键。** 领域专家只需选一种 kind，并（可选）微调维度和阶梯。

---

### 2.3 OutcomeInstance（终端成果实例）—— 一等公民

| 字段 | 类型 | 说明 | IC 试填 |
|---|---|---|---|
| `instance_id` | string | 唯一标识 | `ic.device.paper.finfer2023` |
| `domain_id` | string | 归属领域 | `ic.device` |
| `archetype_id` | string | 成果原型 | `comprehension` |
| `title` | string | 成果标题 | "FinFET 短沟道效应抑制的器件论文" |
| `source_uri` | string | 来源（可追溯） | `doi:10.xxxx/xxxxx` |
| `difficulty_tier` | 1–5 | 难度档 | `3` |
| `implied_prerequisites` | [node_id] | **该成果隐含依赖的前置知识**（需单独标注，因为论文不会写出来） | `[sp.mos, dev.shortchannel, proc.litho, ...]` |
| `rubric_id` | string | 挂载的判分标准 | `rubric.ic.device.paper.v1` |

> `implied_prerequisites` 是 Schema 的灵魂字段：**它区分了"成果写了什么"和"成果默认你会什么"**。并集就从多个实例的这一字段取。

---

### 2.4 Rubric（判分标准）—— **核心原语之一**

| 字段 | 类型 | 说明 |
|---|---|---|
| `rubric_id` | string | 唯一标识 |
| `applies_to` | archetype_id | 适用的成果原型 |
| `levels` | [Level] | 分级 + 每级的**可观察证据** |

**Level 结构：**

| 字段 | 说明 | IC 试填（理解型） |
|---|---|---|
| `level` | 1–4 | `2` |
| `name` | 级别名 | 复现 |
| `observable_evidence` | **可观察证据**（最重要，必须是能被看到的行为/产出） | "能独立推导出论文核心公式，且中间步骤无误" |
| `scoring_criteria` | 如何判定通过 | "推导链完整、量纲正确、边界条件说明清楚" |

IC 理解型的四级 `observable_evidence` 试填：

| level | name | observable_evidence |
|---|---|---|
| L1 | 复述 | 能用自己的话准确说出论文解决了什么问题、结论是什么 |
| L2 | 复现 | 能独立推导核心公式 / 复现关键仿真结果 |
| L3 | 批判 | 能指出论文的假设局限、适用边界、未解释的反常现象 |
| L4 | 推进 | 能提出一个可验证的改进方向，并说明预期收益与代价 |

> **注意：`observable_evidence` 必须写成"看得见的行为"，不能写成"理解了""掌握了"这类内心状态。** 这是 Rubric 能不能用的分水岭。

---

### 2.5 KnowledgeNode（知识点）—— 派生数据

| 字段 | 类型 | 说明 | IC 试填 |
|---|---|---|---|
| `node_id` | string | 唯一标识 | `sp.mos` |
| `name` | string | 知识点名 | MOSFET 工作原理 |
| `kind` | enum | `concept` \| `fact` \| `procedure` \| `tool` | `concept` |
| `domain_id` | string | 归属 | `ic.device` |
| `prerequisites` | [node_id] | 前置节点（= 依赖边的反向索引） | `[sp.semiconductor, sp.pn.junction]` |
| `evidence_of_mastery` | [string] | **怎么算掌握**（对应练习的判据） | "能说明阈值电压如何随沟道掺杂变化，并给出趋势判断" |
| `source_of_need` | [instance_id] | 它由哪些成果倒推而来（追溯用） | `[...paper.finfer2023, ...paper.gaa2024]` |

> `source_of_need` 让"知识点是倒推出来的"这件事可追溯——**孤立的、没有任何成果需要它的知识点，应该被裁剪掉。**

---

### 2.6 Dependency（依赖边）

| 字段 | 类型 | 说明 |
|---|---|---|
| `from_node` | node_id | 前置 |
| `to_node` | node_id | 后继 |
| `type` | enum | `hard`（不学就学不下去）\| `soft`（有帮助但可跳过） |
| `reason` | string | 为什么有这条依赖（人可读） |

> `hard` / `soft` 的区分直接决定路径是"刚性主轴"还是"可跳分支"。

---

### 2.7 PracticeTask（练习任务）

| 字段 | 类型 | 说明 | IC 试填 |
|---|---|---|---|
| `task_id` | string | 唯一标识 | `task.sp.mos.01` |
| `targets` | [node_id] | 训练哪些节点 | `[sp.mos]` |
| `type` | enum | `recall` \| `derivation` \| `implementation` \| `critique` \| `design` | `derivation` |
| `instructions` | string | 题目 | "推导理想 MOSFET 的 I-V 关系并说明各假设" |
| `success_criteria` | string | 判据（对应 `evidence_of_mastery`） | "推导链完整、假设明确、量纲正确" |
| `bridges_to` | {instance_id, level} | **回指成果的哪一级** | `{paper.finfer2023, L2}` |

> `bridges_to` 把"练习"与"成果"缝在一起，这是路径闭环的最后一环。

---

### 2.8 PathGraph（路径图）

| 字段 | 类型 | 说明 |
|---|---|---|
| `spine` | [node_id]（有序） | **主轴**：固定、有序、领域无关的通用基础层，所有人一样 |
| `branches` | [{instance_id, nodes: [node_id]}] | **分支**：由某个成果倒推出的知识点集，随用随取 |
| `ordering` | [node_id] | 全图拓扑序 |

> 主轴 + 分支，正是为了化解"统一固定"与"结果导向"的矛盾。

---

### 2.9 LearnerModel（学习者模型）

| 字段 | 类型 | 说明 |
|---|---|---|
| `learner_id` | string | 用户标识 |
| `node_states` | {node_id: NodeState} | 每个节点：`mastery_prob`（0–1）、`attempts`、`time_spent`、`last_seen` |
| `inferred_traits` | object | **隐变量**：由行为推断，非用户声明。如 `learning_speed`、`persistence`、`transfer_ability`、`practice_strength` |
| `submitted_evidence` | [Evidence] | 用户主动提交：作品、课程与分数、证件；含 `weight`、`verified` |
| `outcome_history` | [{instance_id, achieved_level}] | 已完成成果及达到的级别 |

> 重点：`inferred_traits` 是**从行为持续推断**出来的，不是一次性测试声明的。这正是最早那版方案的修正结果。

---

## 三、IC 论文场景：端到端试填

以"读懂一篇 FinFET 器件论文"为终端成果，走一遍完整链路：

**Step 1 — 定成果**
```
OutcomeInstance: ic.device.paper.finfer2023
  archetype = comprehension, difficulty_tier = 3
  rubric = rubric.ic.device.paper.v1   (L1 复述 / L2 复现 / L3 批判 / L4 推进)
```

**Step 2 — 从"一批"论文倒推前置（关键：取并集）**

假设从 30 篇器件论文提取 `implied_prerequisites`，高频共同项形成基础层：

```
sp.semiconductor   半导体物理基础
sp.pn.junction     PN 结
sp.mos             MOSFET 工作原理
dev.shortchannel   短沟道效应
dev.scaling       器件缩放理论
proc.litho         光刻
proc.etch          刻蚀
proc.deposition    薄膜沉积
char.iv            I-V 特性表征
char.cv            C-V 特性表征
tool.tcad          TCAD 仿真
math.calc          微积分
```

> **被 30 篇论文反复默认的东西 → 才是主轴。** 这一步是整个"从成果倒推路径"的核心动作。

**Step 3 — 连依赖（Dependency）**
```
sp.pn.junction --hard--> sp.mos
sp.semiconductor --hard--> sp.pn.junction
sp.mos --hard--> dev.shortchannel
dev.scaling --soft--> dev.shortchannel
math.calc --hard--> sp.semiconductor
```

**Step 4 — 从主干分叉成主轴 vs 分支**
```
PathGraph:
  spine  = [math.calc, sp.semiconductor, sp.pn.junction, sp.mos]
  branch(paper.finfer2023) = [dev.shortchannel, dev.scaling, char.iv, tool.tcad]
```

**Step 5 — 挂练习、回指级别**
```
PracticeTask: task.dev.shortchannel.01
  targets = [dev.shortchannel], type = critique
  instructions = "指出该论文在短沟道效应抑制上的适用边界"
  bridges_to = {paper.finfer2023, L3}
```

**Step 6 — 学习者在走，画像在长**
```
LearnerModel:
  node_states: { sp.mos: {mastery_prob: 0.82, ...}, dev.shortchannel: {0.31, ...} }
  inferred_traits: { learning_speed: 高, practice_strength: 高, transfer_ability: 中 }
  outcome_history: [{paper.finfer2023, L2}]
```
→ 画像显示"理论学得快、实践强，但跨器件迁移一般"，据此调整后续分支顺序。

---

## 四、试填暴露的问题（Schema 待定项）

用 IC 场景实填后，暴露了 5 个需要你拍板的点：

1. **知识点的粒度没有锚**。`sp.mos` 是一个节点，还是应拆成"阈值电压/跨导/输出特性"多个节点？**建议**：以 `evidence_of_mastery` 能否被一条练习判定为准——判得动就是一节点，判不动就拆。

2. **成果级别与知识点掌握的关系未定**。达到论文 L2，是否要求其所有前置节点都达标？**建议**：不必，只要求该成果 rubric 直接用到的那几个节点达标即可。

3. **并集阈值没有量化**。"被反复默认"具体是多少篇里出现几次？**建议**：先设经验值（如 ≥30% 的成果实例都隐含它 → 进主轴），后续用数据调。

4. **`soft` 依赖是否进路径**。**建议**：进图但不阻塞，仅作为推荐顺序。

5. **用户主动提交证据的权重规则空着**。作品、分数、证件各自算多少权重？**建议**：先设保守先验（证件/作品高、自述低），作为 `submitted_evidence.weight` 的初始值，后续校准。

---

## 五、下一步

- [ ] 你确认上述 5 个待定项的处理方向
- [ ] 把 IC 器件方向按本 Schema 实填到 **30–50 个节点**，检验粒度是否崩
- [ ] 从中选 1 个成果实例 + 4 条练习，跑最小闭环验证
