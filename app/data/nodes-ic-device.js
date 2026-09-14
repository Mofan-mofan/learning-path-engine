// ============================================================
// 节点池 A：集成电路 · 器件方向（35 节点 / 38 依赖边）
// 内容来源：04-IC器件方向粒度锚提取.md + 05-IC器件方向Schema实填与最小闭环.md
// 2026-09-12 由原 data/graph.js 机械拆分而来，原文案一字未改。
//
// 本文件只放「与具体论文无关」的领域知识；某篇论文的路径与 Rubric
// 放在 data/papers.js 里。这样换一篇论文时，节点池可以复用。
//
// 新增/修改一个字段的含义：
//   match_terms : 自动匹配词。js/pathgen.js 用它给论文标题+摘要打分，
//                 决定这篇论文需要哪些节点。匹配不上就改这里。
//   scope       : shared = 任何半导体论文都可复用；
//                 domain = 只在 IC/CMOS 语境下才进候选（换领域时不会被
//                 hard 闭包拉进来，避免把 FinFET 塞给功率器件论文）。
//   skippable   : soft 依赖明标可跳过（Schema v2.0 决策一）。
// ============================================================
window.NODE_POOLS = window.NODE_POOLS || {};

window.NODE_POOLS['ic.device'] = {
  "domain_id": "ic.device",
  "name": "集成电路 · 器件方向",
  "source": "doc04《IC器件方向粒度锚提取》35节点 + doc05 实填",
  "outcome_archetypes": [
    "comprehension"
  ],
  "layers": {
    "基础层": "所有人必经的物理基础",
    "进阶层": "器件方向核心",
    "工艺层": "器件方向需了解",
    "表征层": "器件方向需掌握",
    "工具层": "器件方向需使用"
  },
  "nodes": [
    {
      "node_id": "sp.crystal",
      "name": "晶体结构与能带理论",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [],
      "evidence_of_mastery": "能画出硅的晶格结构并解释能带形成机制",
      "description": "固体中原子周期性排列形成晶格，相邻原子的电子轨道重叠使离散能级展宽为能带。导体、半导体、绝缘体的区别源于禁带宽度。硅的金刚石结构是其器件特性的物理根基。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第1章",
          "type": "教材",
          "note": "晶体结构、能带形成的标准讲解"
        },
        {
          "title": "B站搜索: 半导体物理 能带理论",
          "type": "视频",
          "note": "推荐西安电子科技大学/清华的公开课片段"
        },
        {
          "title": "Wikipedia: Band structure",
          "type": "文章",
          "note": "英文版有清晰的能带形成动画示意"
        }
      ],
      "match_terms": [
        "crystal",
        "lattice",
        "band structure",
        "bandgap",
        "band gap",
        "energy band",
        "eg",
        "晶格",
        "能带",
        "禁带"
      ]
    },
    {
      "node_id": "sp.carrier.stats",
      "name": "载流子统计",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.crystal"
      ],
      "evidence_of_mastery": "能推导费米-狄拉克分布并计算本征/非本征载流子浓度",
      "description": "费米-狄拉克分布描述电子占据各能级的概率。结合态密度函数，可求出导带电子浓度和价带空穴浓度。掺杂改变费米能级位置，从而控制载流子类型和数量。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第3-4章",
          "type": "教材",
          "note": "费米分布、态密度、载流子浓度推导"
        },
        {
          "title": "中国大学MOOC: 半导体物理学",
          "type": "课程",
          "note": "搜索'半导体物理'，选电子科技大学或清华版本"
        },
        {
          "title": "B站搜索: 费米能级 载流子浓度",
          "type": "视频",
          "note": "重点看费米能级随掺杂变化的直观讲解"
        }
      ],
      "match_terms": [
        "carrier statistics",
        "carrier concentration",
        "fermi",
        "doping",
        "dopant",
        "density of states",
        "掺杂",
        "载流子浓度",
        "费米"
      ]
    },
    {
      "node_id": "sp.carrier.transport",
      "name": "载流子输运",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.carrier.stats"
      ],
      "evidence_of_mastery": "能说明漂移、扩散、散射机制并写出电流密度公式",
      "description": "载流子在电场作用下漂移（欧姆运动），在浓度梯度下扩散。散射（声子、杂质）决定迁移率。电流密度 J = qnμE + qD∇n 是器件方程的核心。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第5章",
          "type": "教材",
          "note": "漂移-扩散模型、迁移率、爱因斯坦关系"
        },
        {
          "title": "MIT OCW 6.013 Electromagnetics and Applications",
          "type": "课程",
          "note": "载流子输运的物理图像讲解清晰"
        },
        {
          "title": "B站搜索: 载流子漂移扩散 迁移率",
          "type": "视频",
          "note": "关注动画演示漂移和扩散的区别"
        }
      ],
      "match_terms": [
        "mobility",
        "drift",
        "diffusion",
        "scattering",
        "transport",
        "current density",
        "迁移率",
        "输运"
      ]
    },
    {
      "node_id": "sp.pn.equilibrium",
      "name": "平衡态 PN 结",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.carrier.transport"
      ],
      "evidence_of_mastery": "能推导内建电场和耗尽层宽度公式",
      "description": "P型和N型半导体接触后，载流子扩散形成空间电荷区（耗尽层），产生内建电场阻止进一步扩散，达到热平衡。耗尽近似下可解析求出电势分布和耗尽层宽度。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第7章",
          "type": "教材",
          "note": "PN结平衡态：内建电势、耗尽层宽度推导"
        },
        {
          "title": "Pierret《半导体器件基础》第5章",
          "type": "教材",
          "note": "图解法讲解PN结能带弯曲，非常直观"
        },
        {
          "title": "B站搜索: PN结 耗尽层 内建电场",
          "type": "视频",
          "note": "推荐看能带图动画"
        }
      ],
      "match_terms": [
        "pn junction",
        "depletion",
        "built-in",
        "space charge",
        "junction",
        "耗尽层",
        "pn结",
        "内建电场"
      ]
    },
    {
      "node_id": "sp.pn.bias",
      "name": "非平衡态 PN 结",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.pn.equilibrium"
      ],
      "evidence_of_mastery": "能说明正向/反向偏置下载流子分布变化",
      "description": "正向偏置降低势垒，多数载流子注入形成扩散电流（指数增长）；反向偏置增大势垒，仅有少数载流子漂移产生的微小饱和电流。理想二极管方程 I = I₀(exp(qV/kT)-1)。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第8章",
          "type": "教材",
          "note": "正偏/反偏载流子分布、理想I-V方程推导"
        },
        {
          "title": "中国大学MOOC: 半导体器件物理",
          "type": "课程",
          "note": "搜索'半导体器件'，PN结部分通常在第2-3周"
        },
        {
          "title": "B站搜索: PN结正向偏置 反向偏置",
          "type": "视频",
          "note": "重点看少子注入和扩散电流的动画"
        }
      ],
      "match_terms": [
        "forward bias",
        "reverse bias",
        "diode",
        "rectifier",
        "injection",
        "ideality",
        "schottky",
        "sbd",
        "jbs",
        "二极管",
        "偏置",
        "整流"
      ]
    },
    {
      "node_id": "sp.pn.breakdown",
      "name": "PN 结击穿",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.pn.bias"
      ],
      "evidence_of_mastery": "能区分齐纳击穿和雪崩击穿的物理机制",
      "description": "反向电压超过临界值时电流急剧增大。齐纳击穿：强电场直接撕裂共价键（高掺杂，低击穿电压）；雪崩击穿：载流子加速碰撞电离（低掺杂，高击穿电压）。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第9章",
          "type": "教材",
          "note": "击穿机制对比、击穿电压与掺杂的关系"
        },
        {
          "title": "Wikipedia: Zener diode / Avalanche breakdown",
          "type": "文章",
          "note": "两种击穿的对比表格很清晰"
        },
        {
          "title": "B站搜索: PN结击穿 齐纳 雪崩",
          "type": "视频",
          "note": "注意区分两种机制的适用条件"
        }
      ],
      "match_terms": [
        "breakdown",
        "avalanche",
        "zener",
        "critical field",
        "breakdown voltage",
        "impact ionization",
        "edge termination",
        "击穿",
        "雪崩",
        "临界电场"
      ]
    },
    {
      "node_id": "sp.mos.cap",
      "name": "MOS 电容",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.pn.bias"
      ],
      "evidence_of_mastery": "能画出 C-V 曲线并解释平带、耗尽、反型",
      "description": "金属-氧化物-半导体三层结构。栅压改变半导体表面状态：积累→平带→耗尽→反型。C-V 特性是理解 MOSFET 工作的基础，也是表征氧化层质量的核心手段。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第10章",
          "type": "教材",
          "note": "MOS电容C-V特性完整推导"
        },
        {
          "title": "Pierret《半导体器件基础》第8章",
          "type": "教材",
          "note": "能带图+电荷图对照讲解"
        },
        {
          "title": "B站搜索: MOS电容 C-V曲线",
          "type": "视频",
          "note": "推荐看高频/低频C-V曲线差异的讲解"
        }
      ],
      "match_terms": [
        "mos capacitor",
        "capacitance",
        "c-v",
        "gate oxide",
        "inversion",
        "accumulation",
        "flatband",
        "电容",
        "栅氧",
        "反型"
      ]
    },
    {
      "node_id": "sp.mosfet.iv",
      "name": "MOSFET I-V 特性",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.mos.cap"
      ],
      "evidence_of_mastery": "能推导理想 MOSFET 的线性区和饱和区电流公式",
      "description": "栅压超过阈值时形成反型层（沟道），源漏电压驱动载流子流动。线性区 ID∝(VGS-Vth)VDS，饱和区 ID∝(VGS-Vth)²。这是数字电路和模拟电路分析的起点。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第11-12章",
          "type": "教材",
          "note": "理想I-V推导、沟道形成过程"
        },
        {
          "title": "Razavi《模拟CMOS集成电路设计》第3章",
          "type": "教材",
          "note": "从电路角度理解I-V，直觉性更强"
        },
        {
          "title": "中国大学MOOC: 微电子器件",
          "type": "课程",
          "note": "搜索'微电子器件'或'MOSFET原理'"
        },
        {
          "title": "B站搜索: MOSFET I-V特性推导",
          "type": "视频",
          "note": "推荐逐步推导版（非纯结论背诵）"
        }
      ],
      "match_terms": [
        "mosfet",
        "transistor",
        "i-v",
        "transfer characteristic",
        "output characteristic",
        "drain current",
        "on-state",
        "conduction",
        "转移特性",
        "输出特性"
      ]
    },
    {
      "node_id": "sp.mosfet.vth",
      "name": "阈值电压",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.mosfet.iv"
      ],
      "evidence_of_mastery": "能推导阈值电压公式并说明各参数物理意义",
      "description": "Vth = VFB + 2φF + Qdep/Cox。它由栅材料功函数差、氧化层电荷、衬底掺杂和氧化层厚度共同决定。Vth 是器件设计的核心可调参数，直接影响功耗和速度。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第11章",
          "type": "教材",
          "note": "Vth公式各项物理意义的详细解释"
        },
        {
          "title": "B站搜索: 阈值电压 推导 MOSFET",
          "type": "视频",
          "note": "关注各项含义的逐项讲解"
        },
        {
          "title": "Wikipedia: Threshold voltage",
          "type": "文章",
          "note": "快速查阅公式和各参数定义"
        }
      ],
      "match_terms": [
        "threshold voltage",
        "vth",
        "turn-on voltage",
        "von",
        "normally-off",
        "normally-on",
        "enhancement mode",
        "depletion mode",
        "阈值电压",
        "开启电压"
      ]
    },
    {
      "node_id": "sp.mosfet.scaling",
      "name": "MOSFET 缩放基础",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "sp.mosfet.vth"
      ],
      "evidence_of_mastery": "能说明器件缩放对性能的影响",
      "description": "等比例缩小器件尺寸可提高速度、降低功耗、增加集成度。但简单等比缩放会引发短沟道效应、热载流子退化等问题。摩尔定律的物理基础就是器件缩放。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第13章",
          "type": "教材",
          "note": "缩放规则（Dennard scaling）及其局限"
        },
        {
          "title": "ITRS/IRDS 路线图",
          "type": "文章",
          "note": "搜索'International Roadmap for Devices and Systems'了解历史缩放节点"
        },
        {
          "title": "B站搜索: 摩尔定律 器件缩放 Dennard",
          "type": "视频",
          "note": "了解缩放带来的好处和物理限制"
        }
      ],
      "match_terms": [
        "scaling",
        "dennard",
        "gate length",
        "channel length",
        "technology scaling",
        "尺寸缩放"
      ]
    },
    {
      "node_id": "sp.mosfet.subthreshold",
      "name": "亚阈值特性",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.mosfet.iv"
      ],
      "evidence_of_mastery": "能推导亚阈值摆幅公式并说明其物理意义",
      "description": "VGS < Vth 时器件并非完全关断，存在指数衰减的亚阈值电流。亚阈值摆幅 SS = (kT/q)·ln10·(1+Cd/Cox) ≈ 60mV/dec（室温极限），是低功耗设计的核心指标。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第12章",
          "type": "教材",
          "note": "亚阈值电流推导、SS公式"
        },
        {
          "title": "B站搜索: 亚阈值摆幅 subthreshold swing",
          "type": "视频",
          "note": "关注60mV/dec极限的物理来源"
        },
        {
          "title": "Wikipedia: Subthreshold swing",
          "type": "文章",
          "note": "简明公式和典型值"
        }
      ],
      "match_terms": [
        "subthreshold",
        "sub-threshold",
        "swing",
        "off-state",
        "亚阈值"
      ]
    },
    {
      "node_id": "sp.mosfet.leakage",
      "name": "漏电流机制",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "sp.mosfet.subthreshold"
      ],
      "evidence_of_mastery": "能区分亚阈值漏电、栅极漏电、结漏电",
      "description": "CMOS功耗中静态（漏电）功耗占比随工艺节点缩小急剧上升。三大漏电机制：亚阈值漏电（沟道未完全关断）、栅极隧穿漏电（氧化层太薄）、PN结反偏漏电。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第12章末尾",
          "type": "教材",
          "note": "漏电流分类和物理机制"
        },
        {
          "title": "B站搜索: CMOS漏电流 静态功耗",
          "type": "视频",
          "note": "关注先进节点下漏电占比的数据"
        },
        {
          "title": "Wikipedia: Leakage (electronics)",
          "type": "文章",
          "note": "各种漏电机制的概览"
        }
      ],
      "match_terms": [
        "leakage",
        "gate leakage",
        "tunneling",
        "off-state current",
        "漏电"
      ]
    },
    {
      "node_id": "dev.shortchannel",
      "name": "短沟道效应",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "sp.mosfet.vth"
      ],
      "evidence_of_mastery": "能说明 DIBL、速度饱和、热载流子效应的物理机制",
      "description": "沟道长度缩小到与耗尽层宽度可比时，栅极对沟道的控制力下降。表现为：Vth随L减小而降低（roll-off）、DIBL（漏压影响势垒）、速度饱和、热载流子注入。FinFET正是为解决此问题而生。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第13章",
          "type": "教材",
          "note": "短沟道效应完整分类和物理图像"
        },
        {
          "title": "Taur & Ning《Fundamentals of Modern VLSI Devices》第3章",
          "type": "教材",
          "note": "进阶教材，DIBL和Vth roll-off的定量分析"
        },
        {
          "title": "B站搜索: 短沟道效应 DIBL SCE",
          "type": "视频",
          "note": "推荐有能带图动画的讲解"
        },
        {
          "title": "中国大学MOOC: 纳米电子器件",
          "type": "课程",
          "note": "搜索'纳米电子器件'或'先进半导体器件'"
        }
      ],
      "match_terms": [
        "short channel",
        "sce",
        "drain induced barrier lowering",
        "dibl",
        "punchthrough",
        "短沟道"
      ]
    },
    {
      "node_id": "dev.scaling",
      "name": "器件缩放理论",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "sp.mosfet.scaling"
      ],
      "evidence_of_mastery": "能区分恒定电场、恒定电压、通用缩放理论",
      "description": "Dennard恒定电场缩放：所有尺寸等比缩小κ，电压也缩小κ，电场不变→功耗密度不变。实际中电压缩放滞后于尺寸缩放（恒定电压缩放），导致电场增大、可靠性恶化。通用缩放是两者的折中。",
      "resources": [
        {
          "title": "Taur & Ning《Fundamentals of Modern VLSI Devices》第2章",
          "type": "教材",
          "note": "三种缩放理论的完整对比"
        },
        {
          "title": "Dennard et al. 1974 原始论文",
          "type": "论文",
          "note": "搜索'MOSFET scaling limits Dennard 1974'"
        },
        {
          "title": "B站搜索: Dennard缩放 恒定电场",
          "type": "视频",
          "note": "了解缩放理论的演变和失效原因"
        }
      ],
      "match_terms": [
        "technology node",
        "cmos technology",
        "scaling theory",
        "工艺节点",
        "缩放理论"
      ]
    },
    {
      "node_id": "dev.soi",
      "name": "SOI 器件",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "dev.shortchannel"
      ],
      "evidence_of_mastery": "能说明 SOI 的结构、优势和局限",
      "description": "绝缘体上硅（Silicon-on-Insulator）：在埋氧层上制作薄硅沟道，消除体效应、降低寄生电容、抑制闩锁效应。全耗尽SOI（FD-SOI）是FinFET的竞争方案，在射频和低功耗领域有优势。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第13章（SOI部分）",
          "type": "教材",
          "note": "SOI结构和基本工作原理"
        },
        {
          "title": "Wikipedia: Silicon on insulator",
          "type": "文章",
          "note": "FD-SOI vs FinFET 的工业背景"
        },
        {
          "title": "B站搜索: SOI器件 FD-SOI",
          "type": "视频",
          "note": "了解SOI的历史和现代应用"
        }
      ],
      "match_terms": [
        "soi",
        "silicon on insulator",
        "fdsoi",
        "绝缘体上硅"
      ]
    },
    {
      "node_id": "dev.finfet",
      "name": "FinFET",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "dev.shortchannel"
      ],
      "evidence_of_mastery": "能画出 FinFET 结构并说明其相比平面 MOSFET 的优势",
      "description": "FinFET（鳍式场效应管）：将沟道从平面变为竖直的'鳍片'，栅极三面包裹沟道，增强栅控能力，有效抑制短沟道效应。2011年Intel首次量产（22nm节点），开启了3D器件时代。鳍片宽度(Wfin)、高度(Hfin)、鳍间距是核心设计参数。",
      "resources": [
        {
          "title": "Hu et al. 1999 'FinFET—a self-aligned double-gate MOSFET'",
          "type": "论文",
          "note": "FinFET的奠基论文，搜索标题可找到"
        },
        {
          "title": "Taur & Ning 第5章（多栅器件）",
          "type": "教材",
          "note": "FinFET的电学分析"
        },
        {
          "title": "B站搜索: FinFET结构 工作原理",
          "type": "视频",
          "note": "推荐3D结构动画展示"
        },
        {
          "title": "IEEE Spectrum: The FinFET Revolution",
          "type": "文章",
          "note": "搜索'FinFET revolution IEEE Spectrum'了解产业化历程"
        }
      ],
      "match_terms": [
        "finfet",
        "multi-gate",
        "trigate",
        "鳍式"
      ]
    },
    {
      "node_id": "dev.gaa",
      "name": "GAA 器件",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "dev.finfet"
      ],
      "evidence_of_mastery": "能说明 GAA 相比 FinFET 的改进",
      "description": "全环绕栅极（Gate-All-Around）：栅极四面包裹沟道纳米片/纳米线，进一步提升栅控能力。Samsung 3nm GAA（2022量产）、Intel/TSMC 2nm节点均采用。相比FinFET，沟道宽度可在更宽范围内调节（设计灵活性↑）。",
      "resources": [
        {
          "title": "Wikipedia: Multigate device (GAA section)",
          "type": "文章",
          "note": "GAA的结构变体（纳米线 vs 纳米片）"
        },
        {
          "title": "IEDM/VLSI论文",
          "type": "论文",
          "note": "搜索'GAA nanosheet IEDM'获取最新进展"
        },
        {
          "title": "B站搜索: GAA 全环绕栅极 3nm",
          "type": "视频",
          "note": "了解GAA与FinFET的结构对比"
        },
        {
          "title": "三星/Intel 官方技术博客",
          "type": "文章",
          "note": "搜索'Samsung GAA 3nm'或'Intel RibbonFET'"
        }
      ],
      "match_terms": [
        "gaa",
        "gate all around",
        "nanosheet",
        "nanowire transistor",
        "全环绕栅",
        "纳米片"
      ]
    },
    {
      "node_id": "dev.hkmg",
      "name": "高κ金属栅",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "dev.shortchannel"
      ],
      "evidence_of_mastery": "能说明高κ材料如何解决栅极漏电问题",
      "description": "传统SiO₂栅氧化层薄至1-2nm时隧穿漏电严重。用高介电常数材料（HfO₂等）替代SiO₂，可在等效氧化层厚度（EOT）相同时使用更厚的物理层，大幅降低栅漏电。配合金属栅极解决费米能级钉扎问题。Intel 45nm节点（2007）首次引入。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第13章",
          "type": "教材",
          "note": "高κ/金属栅的物理动机"
        },
        {
          "title": "Wikipedia: High-k dielectric",
          "type": "文章",
          "note": "材料选择和产业时间线"
        },
        {
          "title": "B站搜索: 高K金属栅 HKMG",
          "type": "视频",
          "note": "了解为什么SiO₂不能再薄了"
        }
      ],
      "match_terms": [
        "high-k",
        "metal gate",
        "hkmg",
        "hafnium",
        "gate dielectric",
        "高k金属栅"
      ]
    },
    {
      "node_id": "dev.strain",
      "name": "应变硅技术",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "sp.carrier.transport"
      ],
      "evidence_of_mastery": "能说明应变如何提高载流子迁移率",
      "description": "通过机械应变改变硅的能带结构，降低载流子有效质量，从而提高迁移率。方法包括：SiGe源漏（压应变→PMOS）、接触刻蚀停止层（张应变→NMOS）、应变硅绝缘体（sSOI）。90nm节点开始广泛使用。",
      "resources": [
        {
          "title": "Wikipedia: Strained silicon",
          "type": "文章",
          "note": "各种应变技术的分类和原理"
        },
        {
          "title": "Taur & Ning 第4章",
          "type": "教材",
          "note": "迁移率增强因子分析"
        },
        {
          "title": "B站搜索: 应变硅 迁移率增强",
          "type": "视频",
          "note": "了解为什么应变能改善迁移率"
        }
      ],
      "match_terms": [
        "strain",
        "strained silicon",
        "stress engineering",
        "应变"
      ]
    },
    {
      "node_id": "dev.silicidation",
      "name": "硅化物技术",
      "kind": "fact",
      "layer": "进阶层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "proc.deposition"
      ],
      "evidence_of_mastery": "能说明硅化物的作用和常用材料",
      "description": "在源/漏/栅极表面形成金属硅化物（NiSi、CoSi₂、TiSi₂），大幅降低接触电阻。自对准硅化物工艺（salicide）确保只在硅暴露区域形成，不影响侧墙隔离。",
      "resources": [
        {
          "title": "《VLSI制造技术》",
          "type": "教材",
          "note": "硅化物工艺章节"
        },
        {
          "title": "Wikipedia: Silicide",
          "type": "文章",
          "note": "常用硅化物材料对比"
        },
        {
          "title": "B站搜索: 硅化物 自对准 salicide",
          "type": "视频",
          "note": "了解为什么需要硅化物"
        }
      ],
      "match_terms": [
        "silicide",
        "nisi",
        "tisi",
        "硅化物"
      ]
    },
    {
      "node_id": "dev.contact",
      "name": "接触与互连",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "dev.silicidation"
      ],
      "evidence_of_mastery": "能说明欧姆接触和肖特基接触的区别",
      "description": "欧姆接触：线性I-V，用于源漏电极；肖特基接触：整流特性。互连层（铜/钨）将器件连接成电路。接触电阻随节点缩小成为性能瓶颈，先进节点采用M0（零层金属）局部互连。",
      "resources": [
        {
          "title": "《半导体物理与器件》Neamen 第14章",
          "type": "教材",
          "note": "金属-半导体接触理论"
        },
        {
          "title": "Wikipedia: Ohmic contact / Schottky barrier",
          "type": "文章",
          "note": "两种接触的物理区别"
        },
        {
          "title": "B站搜索: 欧姆接触 肖特基势垒",
          "type": "视频",
          "note": "重点看能带图的区别"
        }
      ],
      "match_terms": [
        "contact resistance",
        "ohmic contact",
        "specific contact resistivity",
        "metal semiconductor contact",
        "欧姆接触",
        "接触电阻"
      ]
    },
    {
      "node_id": "dev.reliability",
      "name": "器件可靠性",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "dev.shortchannel"
      ],
      "evidence_of_mastery": "能区分 NBTI、HCI、TDDB 的物理机制",
      "description": "NBTI（负偏压温度不稳定性）：PMOS在负偏压下Vth漂移；HCI（热载流子注入）：高能载流子注入栅氧导致退化；TDDB（经时击穿）：栅氧在长期电场下逐渐劣化直至击穿。可靠性是产品寿命的决定因素。",
      "resources": [
        {
          "title": "Stathis et al. IBM可靠性论文",
          "type": "论文",
          "note": "搜索'NBTI HCI TDDB reliability review'"
        },
        {
          "title": "Wikipedia: Negative-bias temperature instability",
          "type": "文章",
          "note": "NBTI机制概览"
        },
        {
          "title": "B站搜索: 器件可靠性 NBTI HCI",
          "type": "视频",
          "note": "了解三种退化机制的物理图像"
        }
      ],
      "match_terms": [
        "reliability",
        "degradation",
        "nbti",
        "hci",
        "tddb",
        "lifetime",
        "failure",
        "robustness",
        "可靠性",
        "退化",
        "失效",
        "寿命"
      ]
    },
    {
      "node_id": "proc.litho",
      "name": "光刻",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [],
      "evidence_of_mastery": "能说明光刻分辨率公式和曝光方式",
      "description": "光刻是将电路图案转移到晶圆上的核心工艺。分辨率 R = k₁λ/NA（瑞利公式）。从紫外（UV）到深紫外（DUV, 193nm）再到极紫外（EUV, 13.5nm），波长不断缩短以支持更小特征尺寸。多重曝光（SADP/SAQP）是突破单次曝光分辨率极限的关键技术。",
      "resources": [
        {
          "title": "《VLSI制造技术》光刻章节",
          "type": "教材",
          "note": "瑞利公式、分辨率增强技术"
        },
        {
          "title": "Wikipedia: Photolithography / EUV lithography",
          "type": "文章",
          "note": "光刻技术演进时间线"
        },
        {
          "title": "B站搜索: 光刻工艺 EUV 多重曝光",
          "type": "视频",
          "note": "推荐ASML或半导体行业观察的科普视频"
        },
        {
          "title": "ASML官方技术介绍",
          "type": "文章",
          "note": "搜索'ASML lithography principles'"
        }
      ],
      "match_terms": [
        "lithography",
        "photolithography",
        "euv",
        "duv",
        "patterning",
        "mask",
        "光刻",
        "图形化"
      ]
    },
    {
      "node_id": "proc.etch",
      "name": "刻蚀",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "proc.litho"
      ],
      "evidence_of_mastery": "能区分干法刻蚀和湿法刻蚀的优缺点",
      "description": "刻蚀是将光刻后的图案转移到下层材料。湿法刻蚀：各向同性，用于清洗和大尺寸刻蚀；干法刻蚀（等离子体）：各向异性，可实现高深宽比精细图案。刻蚀选择性、均匀性、损伤是关键指标。FinFET的鳍片刻蚀是极难挑战（高深宽比、原子级精度）。",
      "resources": [
        {
          "title": "《VLSI制造技术》刻蚀章节",
          "type": "教材",
          "note": "干法/湿法对比、等离子体刻蚀原理"
        },
        {
          "title": "Wikipedia: Etching (microfabrication)",
          "type": "文章",
          "note": "刻蚀分类和关键参数"
        },
        {
          "title": "B站搜索: 半导体刻蚀 干法 湿法",
          "type": "视频",
          "note": "了解等离子体刻蚀的物理过程"
        }
      ],
      "match_terms": [
        "etch",
        "etching",
        "dry etch",
        "rie",
        "icp",
        "plasma etch",
        "刻蚀",
        "腐蚀"
      ]
    },
    {
      "node_id": "proc.deposition",
      "name": "薄膜沉积",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [],
      "evidence_of_mastery": "能区分 CVD 和 PVD 的适用场景",
      "description": "在晶圆上生长或沉积薄膜材料。CVD（化学气相沉积）：气体反应生成固态薄膜，均匀性好，用于介质层/多晶硅；PVD（物理气相沉积/溅射）：物理轰击靶材沉积金属，用于金属互连/阻挡层。ALD（原子层沉积）：逐原子层生长，用于超薄高κ层。",
      "resources": [
        {
          "title": "《VLSI制造技术》薄膜沉积章节",
          "type": "教材",
          "note": "CVD/PVD/ALD原理对比"
        },
        {
          "title": "Wikipedia: Chemical vapor deposition",
          "type": "文章",
          "note": "CVD的分类（LPCVD/PECVD/MOCVD）"
        },
        {
          "title": "B站搜索: 薄膜沉积 CVD PVD ALD",
          "type": "视频",
          "note": "了解三种方法的适用场景"
        }
      ],
      "match_terms": [
        "deposition",
        "cvd",
        "pvd",
        "epitaxy",
        "epitaxial",
        "sputter",
        "ald",
        "mocvd",
        "molecular beam",
        "mbe",
        "thin film",
        "外延",
        "沉积",
        "薄膜"
      ]
    },
    {
      "node_id": "proc.implant",
      "name": "离子注入",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [],
      "evidence_of_mastery": "能说明离子注入的原理和退火作用",
      "description": "将掺杂离子加速后注入硅片，精确控制掺杂浓度和深度。注入后晶格损伤严重，需退火修复并激活杂质。关键参数：能量（决定深度）、剂量（决定浓度）、注入角度。",
      "resources": [
        {
          "title": "《VLSI制造技术》离子注入章节",
          "type": "教材",
          "note": "注入原理、射程分布、损伤与退火"
        },
        {
          "title": "Wikipedia: Ion implantation",
          "type": "文章",
          "note": "工艺参数和设备原理"
        },
        {
          "title": "B站搜索: 离子注入 掺杂 退火",
          "type": "视频",
          "note": "了解注入后为什么必须退火"
        }
      ],
      "match_terms": [
        "ion implantation",
        "implant",
        "doping profile",
        "离子注入",
        "注入"
      ]
    },
    {
      "node_id": "proc.anneal",
      "name": "退火",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "proc.implant"
      ],
      "evidence_of_mastery": "能说明快速热退火和激光退火的区别",
      "description": "退火修复离子注入造成的晶格损伤并激活掺杂原子。快速热退火（RTA）：秒级升温，减少杂质扩散；激光退火（msA）：毫秒级局部加热，可实现超浅结。先进节点倾向更低热预算以控制杂质扩散。",
      "resources": [
        {
          "title": "《VLSI制造技术》退火章节",
          "type": "教材",
          "note": "RTA/激光退火/尖峰退火对比"
        },
        {
          "title": "B站搜索: 半导体退火 RTA 激光退火",
          "type": "视频",
          "note": "了解热预算对器件的影响"
        },
        {
          "title": "Wikipedia: Rapid thermal processing",
          "type": "文章",
          "note": "RTA原理和设备"
        }
      ],
      "match_terms": [
        "anneal",
        "annealing",
        "rta",
        "activation",
        "thermal budget",
        "退火",
        "激活"
      ]
    },
    {
      "node_id": "proc.cmp",
      "name": "化学机械抛光",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "proc.deposition"
      ],
      "evidence_of_mastery": "能说明 CMP 的原理和作用",
      "description": "CMP结合化学腐蚀和机械研磨实现晶圆全局平坦化。多层互连结构中每层金属/介质沉积后都需CMP。平坦度直接影响后续光刻的焦深余量。关键挑战：碟形凹陷（dishing）和侵蚀（erosion）。",
      "resources": [
        {
          "title": "《VLSI制造技术》CMP章节",
          "type": "教材",
          "note": "CMP原理、研磨液配方、终点检测"
        },
        {
          "title": "Wikipedia: Chemical mechanical polishing",
          "type": "文章",
          "note": "工艺原理和常见问题"
        },
        {
          "title": "B站搜索: CMP 化学机械抛光",
          "type": "视频",
          "note": "了解为什么需要平坦化"
        }
      ],
      "match_terms": [
        "cmp",
        "chemical mechanical",
        "planarization",
        "polishing",
        "平坦化",
        "抛光"
      ]
    },
    {
      "node_id": "proc.integration",
      "name": "工艺集成",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "ic.device",
      "scope": "domain",
      "prerequisites": [
        "proc.etch",
        "proc.deposition",
        "proc.implant"
      ],
      "evidence_of_mastery": "能画出一个简单器件的工艺流程图",
      "description": "将各单项工艺（光刻、刻蚀、沉积、注入、退火、CMP）按正确顺序组合，制造出完整器件。工艺集成需考虑：热预算兼容、材料选择、对准精度、良率优化。FinFET的集成复杂度远超平面MOSFET。",
      "resources": [
        {
          "title": "《VLSI制造技术》工艺集成章节",
          "type": "教材",
          "note": "CMOS完整工艺流程"
        },
        {
          "title": "B站搜索: CMOS工艺流程 FinFET制造",
          "type": "视频",
          "note": "推荐有完整流程图讲解的视频"
        },
        {
          "title": "Intel/TSMC技术论文",
          "type": "论文",
          "note": "搜索'FinFET process integration IEDM'"
        }
      ],
      "match_terms": [
        "process integration",
        "process flow",
        "fabrication",
        "device fabrication",
        "工艺流程",
        "工艺集成"
      ]
    },
    {
      "node_id": "char.iv",
      "name": "I-V 特性测量",
      "kind": "tool",
      "layer": "表征层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.mosfet.iv"
      ],
      "evidence_of_mastery": "能说明 I-V 测量的原理和参数提取方法",
      "description": "使用半导体参数分析仪（如Keithley 4200）测量器件的电流-电压特性。从I-V曲线可提取：Vth、SS、DIBL、迁移率、Ron等关键参数。测量条件（温度、扫速、衬底偏压）需严格控制。",
      "resources": [
        {
          "title": "Keithley 4200 用户手册",
          "type": "工具",
          "note": "搜索'Keithley 4200-SCS user manual'"
        },
        {
          "title": "《半导体器件表征技术》",
          "type": "教材",
          "note": "I-V/C-V测量的系统讲解"
        },
        {
          "title": "B站搜索: 半导体参数测试 I-V测量",
          "type": "视频",
          "note": "了解实际测量操作和数据处理"
        }
      ],
      "match_terms": [
        "measurement",
        "characterization",
        "parameter analyzer",
        "keithley",
        "curve tracer",
        "measured",
        "测试",
        "表征",
        "实测"
      ]
    },
    {
      "node_id": "char.cv",
      "name": "C-V 特性测量",
      "kind": "tool",
      "layer": "表征层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.mos.cap"
      ],
      "evidence_of_mastery": "能说明 C-V 测量的原理和参数提取方法",
      "description": "测量MOS电容的电容-电压特性。从C-V曲线可提取：氧化层厚度、平带电压、界面态密度、掺杂浓度。高频（1MHz）和准静态C-V各有用途，对比两者可分析界面态。",
      "resources": [
        {
          "title": "《半导体器件表征技术》",
          "type": "教材",
          "note": "C-V测量原理和参数提取方法"
        },
        {
          "title": "B站搜索: C-V测量 MOS电容表征",
          "type": "视频",
          "note": "了解高频/低频C-V曲线的区别"
        },
        {
          "title": "Wikipedia: MOS capacitor characterization",
          "type": "文章",
          "note": "C-V分析的标准方法"
        }
      ],
      "match_terms": [
        "c-v measurement",
        "capacitance voltage",
        "interface state",
        "dit",
        "界面态"
      ]
    },
    {
      "node_id": "char.vth.extract",
      "name": "阈值电压提取方法",
      "kind": "procedure",
      "layer": "表征层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "char.iv"
      ],
      "evidence_of_mastery": "能说明线性外推法和恒定电流法的区别",
      "description": "从I-V数据提取Vth的标准方法：线性外推法（在ID-VGS曲线最大跨导处切线与VGS轴交点）、恒定电流法（ID=某固定值时的VGS）。两种方法对短沟道器件给出不同结果，选择取决于应用场景。",
      "resources": [
        {
          "title": "《半导体器件表征技术》Vth提取章节",
          "type": "教材",
          "note": "各种提取方法的对比"
        },
        {
          "title": "B站搜索: 阈值电压提取 线性外推",
          "type": "视频",
          "note": "了解实际操作中如何选择方法"
        },
        {
          "title": "Wikipedia: Threshold voltage (measurement)",
          "type": "文章",
          "note": "提取方法的定义和适用条件"
        }
      ],
      "match_terms": [
        "parameter extraction",
        "extraction",
        "linear extrapolation",
        "transconductance",
        "参数提取"
      ]
    },
    {
      "node_id": "tool.tcad.device",
      "name": "器件仿真",
      "kind": "tool",
      "layer": "工具层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "sp.mosfet.iv"
      ],
      "evidence_of_mastery": "能用 TCAD 仿真一个 MOSFET 的 I-V 特性",
      "description": "使用Silvaco ATLAS或Synopsys Sentaurus等TCAD工具，求解泊松方程+载流子连续性方程，仿真器件电学特性。流程：定义几何结构→设置材料参数→施加偏压→求解→提取I-V。仿真能力是器件研究的核心工具。",
      "resources": [
        {
          "title": "Silvaco ATLAS 用户手册",
          "type": "工具",
          "note": "搜索'Silvaco ATLAS manual'"
        },
        {
          "title": "Synopsys Sentaurus Device 教程",
          "type": "工具",
          "note": "搜索'Sentaurus Device user guide'"
        },
        {
          "title": "B站搜索: TCAD仿真 MOSFET Silvaco",
          "type": "视频",
          "note": "推荐有完整操作步骤的教程"
        },
        {
          "title": "中国大学MOOC: 半导体器件仿真",
          "type": "课程",
          "note": "搜索'TCAD'或'半导体器件仿真'"
        }
      ],
      "match_terms": [
        "tcad",
        "simulation",
        "simulated",
        "sentaurus",
        "silvaco",
        "atlas",
        "device simulation",
        "numerical",
        "仿真"
      ]
    },
    {
      "node_id": "tool.tcad.process",
      "name": "工艺仿真",
      "kind": "tool",
      "layer": "工具层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "proc.integration"
      ],
      "evidence_of_mastery": "能用 TCAD 仿真一个简单工艺流程",
      "description": "使用Silvaco Athena或Synopsys Sentaurus Process仿真制造工艺流程。可模拟注入扩散、氧化生长、刻蚀、沉积等步骤，预测最终器件结构和掺杂分布。与器件仿真联合使用可建立工艺-结构-性能的关系。",
      "resources": [
        {
          "title": "Silvaco Athena 用户手册",
          "type": "工具",
          "note": "搜索'Silvaco Athena process simulation'"
        },
        {
          "title": "B站搜索: TCAD工艺仿真 Athena Sentaurus",
          "type": "视频",
          "note": "了解工艺仿真的基本流程"
        },
        {
          "title": "中国大学MOOC: 集成电路工艺仿真",
          "type": "课程",
          "note": "搜索'集成电路工艺仿真'"
        }
      ],
      "match_terms": [
        "process simulation",
        "athena",
        "sentaurus process",
        "工艺仿真"
      ]
    },
    {
      "node_id": "tool.tcad.calibration",
      "name": "TCAD 校准",
      "kind": "procedure",
      "layer": "工具层",
      "domain_id": "ic.device",
      "scope": "shared",
      "prerequisites": [
        "tool.tcad.device",
        "char.iv"
      ],
      "evidence_of_mastery": "能说明 TCAD 校准的原理和步骤",
      "description": "将TCAD仿真结果与实测数据对齐，通过调整物理模型参数（迁移率模型、复合参数等）使仿真准确反映真实器件行为。校准是TCAD可信的前提——未校准的仿真只能给定性趋势，不能做定量预测。",
      "resources": [
        {
          "title": "Silvaco ATLAS 校准案例",
          "type": "工具",
          "note": "搜索'TCAD calibration example MOSFET'"
        },
        {
          "title": "B站搜索: TCAD校准 仿真与实验对比",
          "type": "视频",
          "note": "了解校准的一般流程和注意事项"
        },
        {
          "title": "相关论文中的TCAD方法章节",
          "type": "论文",
          "note": "器件论文通常有一节专门讲TCAD校准过程"
        }
      ],
      "match_terms": [
        "calibration",
        "calibrated",
        "model parameter",
        "fitting",
        "校准"
      ]
    }
  ],
  "edges": [
    {
      "from": "sp.crystal",
      "to": "sp.carrier.stats",
      "type": "hard",
      "reason": "能带理论是载流子统计的基础",
      "skippable": false
    },
    {
      "from": "sp.carrier.stats",
      "to": "sp.carrier.transport",
      "type": "hard",
      "reason": "载流子浓度是输运方程的前提",
      "skippable": false
    },
    {
      "from": "sp.carrier.transport",
      "to": "sp.pn.equilibrium",
      "type": "hard",
      "reason": "漂移扩散是理解PN结平衡的前提",
      "skippable": false
    },
    {
      "from": "sp.pn.equilibrium",
      "to": "sp.pn.bias",
      "type": "hard",
      "reason": "平衡态是非平衡态的基准",
      "skippable": false
    },
    {
      "from": "sp.pn.bias",
      "to": "sp.pn.breakdown",
      "type": "hard",
      "reason": "击穿是反向偏置的极端情况",
      "skippable": false
    },
    {
      "from": "sp.pn.bias",
      "to": "sp.mos.cap",
      "type": "hard",
      "reason": "MOS电容的表面反型与PN结物理相通",
      "skippable": false
    },
    {
      "from": "sp.mos.cap",
      "to": "sp.mosfet.iv",
      "type": "hard",
      "reason": "MOS电容反型层是MOSFET沟道的物理基础",
      "skippable": false
    },
    {
      "from": "sp.mosfet.iv",
      "to": "sp.mosfet.vth",
      "type": "hard",
      "reason": "阈值电压是I-V特性的核心参数",
      "skippable": false
    },
    {
      "from": "sp.mosfet.vth",
      "to": "sp.mosfet.scaling",
      "type": "hard",
      "reason": "缩放对Vth的影响是核心问题",
      "skippable": false
    },
    {
      "from": "sp.mosfet.iv",
      "to": "sp.mosfet.subthreshold",
      "type": "hard",
      "reason": "亚阈值是I-V特性的关断区域",
      "skippable": false
    },
    {
      "from": "sp.mosfet.subthreshold",
      "to": "sp.mosfet.leakage",
      "type": "hard",
      "reason": "亚阈值漏电是漏电流的主要成分",
      "skippable": false
    },
    {
      "from": "sp.mosfet.vth",
      "to": "dev.shortchannel",
      "type": "hard",
      "reason": "阈值电压是理解短沟道效应的基础",
      "skippable": false
    },
    {
      "from": "sp.mosfet.scaling",
      "to": "dev.scaling",
      "type": "hard",
      "reason": "缩放基础引出完整缩放理论",
      "skippable": false
    },
    {
      "from": "dev.shortchannel",
      "to": "dev.soi",
      "type": "hard",
      "reason": "SOI是解决短沟道效应的方案之一",
      "skippable": false
    },
    {
      "from": "dev.shortchannel",
      "to": "dev.finfet",
      "type": "hard",
      "reason": "FinFET是解决短沟道效应的主流方案",
      "skippable": false
    },
    {
      "from": "dev.finfet",
      "to": "dev.gaa",
      "type": "hard",
      "reason": "GAA是FinFET的下一代演进",
      "skippable": false
    },
    {
      "from": "dev.shortchannel",
      "to": "dev.hkmg",
      "type": "hard",
      "reason": "高κ金属栅解决缩放带来的栅漏电",
      "skippable": false
    },
    {
      "from": "sp.carrier.transport",
      "to": "dev.strain",
      "type": "hard",
      "reason": "应变改变迁移率，需先懂输运",
      "skippable": false
    },
    {
      "from": "proc.deposition",
      "to": "dev.silicidation",
      "type": "hard",
      "reason": "硅化物通过沉积金属后退火形成",
      "skippable": false
    },
    {
      "from": "dev.silicidation",
      "to": "dev.contact",
      "type": "hard",
      "reason": "硅化物是形成良好欧姆接触的前提",
      "skippable": false
    },
    {
      "from": "dev.shortchannel",
      "to": "dev.reliability",
      "type": "hard",
      "reason": "短沟道效应加剧可靠性退化",
      "skippable": false
    },
    {
      "from": "proc.litho",
      "to": "proc.etch",
      "type": "hard",
      "reason": "光刻定义图案后由刻蚀转移",
      "skippable": false
    },
    {
      "from": "proc.implant",
      "to": "proc.anneal",
      "type": "hard",
      "reason": "注入后必须退火修复损伤",
      "skippable": false
    },
    {
      "from": "proc.deposition",
      "to": "proc.cmp",
      "type": "hard",
      "reason": "沉积后需CMP平坦化",
      "skippable": false
    },
    {
      "from": "proc.etch",
      "to": "proc.integration",
      "type": "hard",
      "reason": "刻蚀是工艺集成的核心步骤",
      "skippable": false
    },
    {
      "from": "proc.deposition",
      "to": "proc.integration",
      "type": "hard",
      "reason": "沉积是工艺集成的核心步骤",
      "skippable": false
    },
    {
      "from": "proc.implant",
      "to": "proc.integration",
      "type": "hard",
      "reason": "注入是工艺集成的核心步骤",
      "skippable": false
    },
    {
      "from": "sp.mosfet.iv",
      "to": "char.iv",
      "type": "hard",
      "reason": "测量需要理论指导",
      "skippable": false
    },
    {
      "from": "sp.mos.cap",
      "to": "char.cv",
      "type": "hard",
      "reason": "C-V测量基于MOS电容理论",
      "skippable": false
    },
    {
      "from": "char.iv",
      "to": "char.vth.extract",
      "type": "hard",
      "reason": "Vth提取从I-V数据出发",
      "skippable": false
    },
    {
      "from": "sp.mosfet.iv",
      "to": "tool.tcad.device",
      "type": "hard",
      "reason": "器件仿真需理解I-V物理",
      "skippable": false
    },
    {
      "from": "proc.integration",
      "to": "tool.tcad.process",
      "type": "hard",
      "reason": "工艺仿真需理解工艺流程",
      "skippable": false
    },
    {
      "from": "tool.tcad.device",
      "to": "tool.tcad.calibration",
      "type": "hard",
      "reason": "校准建立在器件仿真基础上",
      "skippable": false
    },
    {
      "from": "char.iv",
      "to": "tool.tcad.calibration",
      "type": "hard",
      "reason": "校准需要实测I-V数据",
      "skippable": false
    },
    {
      "from": "dev.scaling",
      "to": "dev.shortchannel",
      "type": "soft",
      "reason": "缩放理论有助于理解短沟道效应的背景",
      "skippable": true
    },
    {
      "from": "proc.litho",
      "to": "dev.finfet",
      "type": "soft",
      "reason": "了解光刻有助于理解FinFET的制造挑战",
      "skippable": true
    },
    {
      "from": "sp.pn.breakdown",
      "to": "dev.reliability",
      "type": "soft",
      "reason": "击穿机制与TDDB有物理关联",
      "skippable": true
    },
    {
      "from": "dev.hkmg",
      "to": "sp.mosfet.leakage",
      "type": "soft",
      "reason": "高κ方案可反向加深对栅漏电的理解",
      "skippable": true
    }
  ]
};
