// ============================================================
// data/papers.js —— 固化论文库（跟着 app 一起发布，打开就能用）
//
// 用户自己用 DOI 导入的论文不在这里，存在浏览器 localStorage，
// 由 js/store.js 管。两者会合并成一个论文列表。
//
// 每篇论文有两种 path_source：
//   'curated' —— 路径与 Rubric 节点足迹都是人工写死的（论文 A 就是原来的示例，
//                原样保留，一个字没改）
//   'auto'    —— 路径由 js/pathgen.js 依据标题+摘要+主题词自动算出来
//                （论文 B）。这种论文只需人工写两样东西：
//                  · rubric 各级的 evidence 判据文字（机器写出来是空话）
//                  · practice_tasks（练习要用到论文里的真实数字）
//                uses_nodes（节点足迹 N_k）由算法自动填，不用手写。
//
// 论文 B 的数据来源：2026-09-12 用 Crossref + OpenAlex 接口实际抓取。
// ============================================================
window.PAPERS = [

  // ----------------------------------------------------------
  // 论文 A：原有的 IC 器件方向示例（人工策划，原样保留）
  // ----------------------------------------------------------
  {
    "instance_id": "ic.device.paper.finfet2015",
    "title": "A 5nm FinFET Technology Featuring Self-Aligned Quadruple Patterning",
    "short_title": "5nm FinFET + SAQP",
    "doi": "",
    "url": "",
    "journal": "",
    "year": 2015,
    "volume": "", "issue": "", "pages": "",
    "authors": [],
    "institutions": [],
    "abstract": "",
    "topics": [], "keywords": [], "concepts": [], "primary_topic": null,
    "pools": ["ic.device"],
    "path_source": "curated",
    "difficulty_tier": 3,
    "note": "项目最初的示例论文。未记录 DOI 与作者信息，因此「相关文献推荐」对它不可用；它的作用是保留 05 号文档里那份人工实填的路径，作为自动生成结果的对照基准。",
    "domain": {
      "domain_id": "ic.device",
      "name": "集成电路 · 器件方向",
      "outcome_archetype": "comprehension"
    },
    "rubric": {
      "levels": [
        { "level": 1, "name": "复述", "evidence": "能说出论文解决了什么问题、结论是什么", "uses_nodes": ["dev.finfet", "proc.litho"] },
        { "level": 2, "name": "复现", "evidence": "能推导核心公式 / 复现关键仿真结果", "uses_nodes": ["sp.mosfet.vth", "dev.shortchannel", "tool.tcad.device", "char.iv"] },
        { "level": 3, "name": "批判", "evidence": "能指出假设局限、适用边界、未解释的反常现象", "uses_nodes": ["dev.scaling", "dev.reliability", "proc.etch"] },
        { "level": 4, "name": "推进", "evidence": "能提出可验证的改进方向，说明预期收益与代价", "uses_nodes": ["dev.gaa", "dev.scaling"] }
      ]
    },
    "path_graph": {
      "spine": ["sp.crystal", "sp.carrier.stats", "sp.carrier.transport", "sp.pn.equilibrium", "sp.pn.bias", "sp.mos.cap", "sp.mosfet.iv", "sp.mosfet.vth"],
      "branches": [{
        "instance_id": "ic.device.paper.finfet2015",
        "nodes": ["dev.shortchannel", "dev.finfet", "dev.scaling", "proc.litho", "proc.etch", "char.iv", "tool.tcad.device"]
      }]
    },
    "practice_tasks": [
      {
        "task_id": "task.finfet2015.l1",
        "title": "L1 复述：论文核心观点",
        "targets": ["dev.finfet", "proc.litho"],
        "type": "recall",
        "instructions": "阅读论文摘要和引言，用自己的话回答：\n1. 这篇论文解决了什么问题？\n2. 论文的主要结论是什么？\n3. FinFET相比平面MOSFET有什么优势？",
        "success_criteria": "能准确说出5nm FinFET的制造挑战和SAQP工艺的可行性",
        "bridges_to": { "instance_id": "ic.device.paper.finfet2015", "level": 1 }
      },
      {
        "task_id": "task.finfet2015.l2",
        "title": "L2 复现：TCAD仿真验证",
        "targets": ["sp.mosfet.vth", "dev.shortchannel", "tool.tcad.device", "char.iv"],
        "type": "implementation",
        "instructions": "用TCAD仿真一个FinFET器件：\n1. 建立器件结构（鳍片宽度5nm，高度30nm）\n2. 仿真I-V特性\n3. 提取阈值电压\n4. 与论文的Figure 3对比",
        "success_criteria": "仿真结果与论文数据吻合（误差<10%）",
        "bridges_to": { "instance_id": "ic.device.paper.finfet2015", "level": 2 }
      },
      {
        "task_id": "task.finfet2015.l3",
        "title": "L3 批判：论文局限性分析",
        "targets": ["dev.scaling", "dev.reliability", "proc.etch"],
        "type": "critique",
        "instructions": "批判性阅读论文的方法部分，回答：\n1. 论文的假设有哪些局限？（如是否考虑了variability？）\n2. SAQP工艺的适用边界是什么？\n3. 论文中有没有未解释的反常现象？",
        "success_criteria": "能指出至少2个假设局限和1个适用边界",
        "bridges_to": { "instance_id": "ic.device.paper.finfet2015", "level": 3 }
      },
      {
        "task_id": "task.finfet2015.l4",
        "title": "L4 推进：提出改进方向",
        "targets": ["dev.gaa", "dev.scaling"],
        "type": "design",
        "instructions": "基于论文的工作，提出一个改进方向：\n1. 如果用GAA替代FinFET，预期收益是什么？代价是什么？\n2. 设计一个实验验证你的改进方向\n3. 说明预期结果和可能的挑战",
        "success_criteria": "改进方向可验证，收益/代价分析合理",
        "bridges_to": { "instance_id": "ic.device.paper.finfet2015", "level": 4 }
      }
    ]
  },

  // ----------------------------------------------------------
  // 论文 B：Ga2O3 vs SiC 中压平面栅 MOSFET（自动生成路径）
  // 元数据来源：Crossref（题录/ORCID/机构全称）+ OpenAlex（摘要/主题/作者ID）
  // 抓取日期：2026-09-12
  // ----------------------------------------------------------
  {
    "instance_id": "doi.10.1109.tpel.2024.3522297",
    "title": "Comparison and Investigation on the Static and Dynamic Performance for Medium-Voltage (3300 V-6500 V) Ga2O3 and SiC Planar Gate MOSFETs",
    "short_title": "Ga2O3 vs SiC 中压平面栅 MOSFET",
    "doi": "10.1109/tpel.2024.3522297",
    "url": "https://doi.org/10.1109/tpel.2024.3522297",
    "journal": "IEEE Transactions on Power Electronics",
    "year": 2025,
    "volume": "40", "issue": "4", "pages": "5467-5479",
    "publisher": "IEEE",
    "authors": [
      { "name": "Zhenghua Wang", "position": "first", "orcid": "0009-0007-8106-9761", "openalex_id": "",
        "affiliations": ["Faculty of Integrated Circuit, Xidian University, Xi'an, China"] },
      { "name": "Lei Yuan", "position": "middle", "orcid": "0000-0002-4093-6677", "openalex_id": "A5071937674",
        "affiliations": ["Faculty of Integrated Circuit, Xidian University, Xi'an, China"] },
      { "name": "Bo Peng", "position": "middle", "orcid": "0000-0002-2696-900X", "openalex_id": "A5101650082",
        "affiliations": ["Faculty of Integrated Circuit, Xidian University, Xi'an, China"] },
      { "name": "Yuming Zhang", "position": "middle", "orcid": "0000-0002-8587-0747", "openalex_id": "A5100421237",
        "affiliations": ["Faculty of Integrated Circuit, Xidian University, Xi'an, China"] },
      { "name": "Renxu Jia", "position": "last", "orcid": "0000-0002-0401-6857", "openalex_id": "A5033382356",
        "affiliations": ["Faculty of Integrated Circuit, Xidian University, Xi'an, China"] }
    ],
    "institutions": [{ "id": "I149594827", "name": "Xidian University" }],

    // 摘要由 OpenAlex 的倒排索引还原，下标与公式处的空格会丢失
    // （如 "Ga2O3planar gatemosfets"、"turn-onvoltage"），中间还有一段带公式的
    // 内容因为含特殊符号没能还原。以 DOI 原文为准。
    "abstract": "The structural design, static, dynamic power losses and short-circuit (SC) robustness of vertical Ga2O3planar gatemosfets for medium voltage (3300–6500 V) ratings are first analyzed and comparatively investigated by technology computer-aided (TCAD) simulation. The specificon-resistance of Ga2O3planarmosfets is 5.85 mΩ·cm2(3300 V), 14.3 mΩ·cm2(4500 V) and 30 mΩ·cm2(6500 V). The Baliga figure of merit of 3300 V rated Ga2O3mosfets is up to 2.53 GW/cm2(Ron,sp= 5.85 mΩ·cm2, BV = 3840 V,Emax(gate oxide) … Ga2O3planarmosfets have a higher turn-onvoltage (|Von| > 5 V) than SiCmosfets, but loweron-resistance (7.5 mΩ·cm2). Moreover, the switching power loss of 3300 V Ga2O3planarmosfets is almost same as that of SiCmosfets. The reverse recovery time and reverse recovery charge of the channel diode are 8.5 ns and 18 nC, respectively. Overall, Ga2O3planarmosfets have lower conduction losses and promising switching losses. However, its SC robustness is weaker than that of SiC. The main reason for this is the low thermal conductivity and lattice heat capacity. These findings provide meaningful references for vertical Ga2O3planar gatemosfetdeployment in future application scenarios.",
    "abstract_quality": "reconstructed",

    "topics": [
      { "id": "T12529", "name": "Ga2O3 and related materials", "score": 1.0 },
      { "id": "T10090", "name": "ZnO doping and properties", "score": 0.99 },
      { "id": "T12588", "name": "Electronic and Structural Properties of Oxides", "score": 0.94 }
    ],
    "keywords": [
      { "name": "Materials science", "score": 0.67 },
      { "name": "Planar", "score": 0.66 },
      { "name": "MOSFET", "score": 0.56 },
      { "name": "Voltage", "score": 0.52 },
      { "name": "Optoelectronics", "score": 0.48 },
      { "name": "Electrical engineering", "score": 0.37 },
      { "name": "Transistor", "score": 0.16 }
    ],
    // concepts 与 keywords 名字重复是 OpenAlex 接口本身如此（keywords 由 concepts 派生）。
    // 这里必须存 concepts 而不是只存 keywords：id 用来拼检索式，
    // level（概念具体度）用来把「整个 Ga2O3 材料体系」收窄到「MOSFET 这一类器件」，
    // 见 js/config.js 的 recommend.minConceptLevel。
    "concepts": [
      { "id": "C192562407",  "name": "Materials science",          "score": 0.67, "level": 0 },
      { "id": "C134786449",  "name": "Planar",                     "score": 0.66, "level": 2 },
      { "id": "C2778413303", "name": "MOSFET",                     "score": 0.56, "level": 4 },
      { "id": "C165801399",  "name": "Voltage",                    "score": 0.52, "level": 2 },
      { "id": "C49040817",   "name": "Optoelectronics",            "score": 0.48, "level": 1 },
      { "id": "C119599485",  "name": "Electrical engineering",     "score": 0.37, "level": 1 },
      { "id": "C172385210",  "name": "Transistor",                 "score": 0.16, "level": 3 },
      { "id": "C127413603",  "name": "Engineering",                "score": 0.14, "level": 0 },
      { "id": "C41008148",   "name": "Computer science",           "score": 0.12, "level": 0 },
      { "id": "C121684516",  "name": "Computer graphics (images)", "score": 0.0,  "level": 1 }
    ],
    "primary_topic": { "id": "T12529", "name": "Ga2O3 and related materials" },
    "openalex_id": "W4405812540",
    "cited_by_count": 2,

    // 领域归属：算法会重算一遍，这里存的是 2026-09-12 的判定结果。
    // 只挂 power.wbg —— ic.device 池的 shared 节点（半导体物理、表征、TCAD）
    // 依然会进候选，但 FinFET/GAA/CMP 这些 CMOS 专属节点不会。
    "pools": ["power.wbg"],
    "path_source": "auto",
    // 留空 = 完全靠标题+摘要+主题词自动匹配。
    // 想强制某个节点进路径，把 node_id 加到这里（例如 ["pw.proc.termination"]）。
    "focus_nodes": [],
    "difficulty_tier": 3,
    "note": "本校课题组（西安电子科技大学集成电路学院，末位作者贾仁需）的论文，同时覆盖 SiC 与 Ga2O3 两条主线。图里选哪些节点、主轴与学习顺序由 pathgen.js 自动生成；Rubric 判据文字、判据节点与四个练习任务为人工撰写，因为这几样需要论文里的真实数字，也需要判断哪个概念对应哪一级能力。",

    "rubric": {
      // 判据文字与判据节点都是人工指定的：算法按角色自动填的节点足迹，
      // 对这篇论文不够准（L2 复现本该落在优值/耐压/导通电阻分解上，
      // 自动规则挑到的却是工具与流程类节点）。
      // 用 DOI 导入的新论文没有这个字段，仍由 pathgen.js 自动填。
      "rubric_source": "curated",
      "levels": [
        { "level": 1, "name": "复述",
          "evidence": "能说出这篇论文对比了哪两种材料、哪三档电压，以及核心结论：Ga2O3 导通损耗更低、开关损耗与 SiC 相当，但短路鲁棒性更弱",
          "uses_nodes": ["pw.material.sic", "pw.material.ga2o3", "pw.app.mv", "pw.mos.planar", "pw.perf.compare"] },
        { "level": 2, "name": "复现",
          "evidence": "能用 BFOM = BV²/Ron,sp 复核论文 3300 V 档给出的 2.53 GW/cm²，并解释三档电压下比导通电阻的变化趋势",
          "uses_nodes": ["pw.fom.baliga", "pw.bv.drift", "pw.ron.decomp", "pw.tool.tcad.power", "tool.tcad.device"] },
        { "level": 3, "name": "批判",
          "evidence": "能指出全部结论来自 TCAD 仿真而非实测，列出决定结论却无法独立验证的关键材料参数，并说明摘要中表述不清之处",
          "uses_nodes": ["pw.tool.tcad.power", "pw.thermal", "pw.gateoxide", "pw.proc.doping", "pw.proc.termination", "pw.char.dyn"] },
        { "level": 4, "name": "推进",
          "evidence": "能针对「热」这一根本短板提出可验证的改进路线，给出定量估算、代价与最小成本验证方案，并判断最先落地的应用场景",
          "uses_nodes": ["pw.hetero.integration", "pw.thermal", "pw.mos.trench", "pw.tool.lossmodel", "pw.app.mv"] }
      ]
    },

    "practice_tasks": [
      {
        "task_id": "task.ga2o3sic.l1",
        "title": "L1 复述：这篇论文到底比了什么",
        "type": "recall",
        "instructions": "只看标题、摘要和结论，用自己的话回答：\n1. 对比的是哪两种材料？什么结构？覆盖哪几档电压等级？\n2. Ga2O3 相对 SiC 的优势是什么？劣势是什么？\n3. 论文把劣势归因于什么物理原因？\n4. 这些结论是实测得到的，还是仿真得到的？",
        "success_criteria": "四问全对，且第 4 问明确回答「全部来自 TCAD 仿真」——这一条决定了后面所有结论的可信度等级",
        "targets": ["pw.material.sic", "pw.material.ga2o3", "pw.app.mv", "pw.mos.planar"],
        "bridges_to": { "instance_id": "doi.10.1109.tpel.2024.3522297", "level": 1 }
      },
      {
        "task_id": "task.ga2o3sic.l2",
        "title": "L2 复现：核算 Baliga 优值与三档趋势",
        "type": "implementation",
        "instructions": "1. 用器件优值定义 BFOM = BV² / Ron,sp，代入论文 3300 V 档数据（BV = 3840 V，Ron,sp = 5.85 mΩ·cm²），算出优值。\n2. 与摘要给出的 2.53 GW/cm² 对比，检查是否一致。注意单位：1 mΩ·cm² = 1e-3 Ω·cm²，算出来是 W/cm²，再换算成 GW/cm²。\n3. 用同样方法处理 4500 V 档（14.3 mΩ·cm²）与 6500 V 档（30 mΩ·cm²），说明优值随电压等级怎么变。\n4. 若有 TCAD 环境，按论文的结构参数复现 3300 V 档的静态输出特性，与论文图对比。",
        "success_criteria": "第 2 问误差在 1% 以内；能解释为什么耐压升高时 Ron,sp 的增长快于优值的增长（漂移区必须更厚、掺杂更低）",
        "targets": ["pw.fom.baliga", "pw.bv.drift", "pw.ron.decomp", "pw.tool.tcad.power"],
        "bridges_to": { "instance_id": "doi.10.1109.tpel.2024.3522297", "level": 2 }
      },
      {
        "task_id": "task.ga2o3sic.l3",
        "title": "L3 批判：这套仿真结论能信几分",
        "type": "critique",
        "instructions": "1. 论文所有结论来自 TCAD 仿真。列出至少四个直接决定结论、但你无法从论文正文独立验证的材料参数（提示：雪崩电离系数、热导率及其各向异性、界面态密度、迁移率模型、不完全电离参数）。\n2. 对每个参数判断：取值偏差 20% 会不会翻转论文的结论？\n3. 摘要有一句「higher turn-on voltage (|Von| > 5 V) than SiC mosfets, but lower on-resistance (7.5 mΩ·cm2)」。回到正文图表，确认 7.5 mΩ·cm² 究竟属于 SiC 还是 Ga2O3、对应哪一档电压——摘要在这里表述不清，别直接引用。\n4. 论文说 Ga2O3 短路鲁棒性弱于 SiC，归因于热导率低与晶格热容小。这个归因完整吗？还有哪些因素没被讨论（提示：栅氧在高温下的可靠性、无 p 型掺杂导致无法做电导调制、边缘终端是否限制了实测耐压）？",
        "success_criteria": "能指出至少 4 个关键仿真参数并给出灵敏度判断；能明确 7.5 mΩ·cm² 的归属；能补充至少 1 条论文未讨论的失效机理",
        "targets": ["pw.tool.tcad.power", "pw.thermal", "pw.gateoxide", "pw.proc.doping", "pw.proc.termination"],
        "bridges_to": { "instance_id": "doi.10.1109.tpel.2024.3522297", "level": 3 }
      },
      {
        "task_id": "task.ga2o3sic.l4",
        "title": "L4 推进：给出一个可验证的改进方向",
        "type": "design",
        "instructions": "论文的短板是热：Ga2O3 热导率约 10–13 W/(m·K)，比 SiC 低约 30 倍，导致短路耐量不足。请提出一条改进路线并论证：\n1. 方案是什么（可选方向：异质集成到 SiC / AlN / 金刚石衬底、减薄衬底、优化元胞布局以降低 Ron,sp 从而减少发热、改进封装热阻、优化边缘终端提升实测耐压）。\n2. 预期能把结温或短路耐量改善多少？给出估算依据，不要只说「会改善」。\n3. 代价是什么（工艺复杂度、成本、良率、键合界面热阻、热膨胀失配）？\n4. 怎么用最小成本的实验或仿真验证它？\n5. 换一个视角回答：如果这条路线成立，Ga2O3 器件最先落地的会是哪个电压等级、哪类整机？为什么不是别的等级？",
        "success_criteria": "方案在物理上成立、有定量估算、代价说清楚、验证路径可执行；第 5 问能结合应用场景（如轨道交通牵引 3300 V、固态变压器 6500 V）给出有依据的判断",
        "targets": ["pw.hetero.integration", "pw.thermal", "pw.mos.trench", "pw.tool.lossmodel", "pw.app.mv"],
        "bridges_to": { "instance_id": "doi.10.1109.tpel.2024.3522297", "level": 4 }
      }
    ]
  }
];
