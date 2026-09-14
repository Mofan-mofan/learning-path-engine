// ============================================================
// 节点池 B：宽禁带功率器件方向（25 节点 / 40 依赖边）
//
// 为什么要有这个池：节点池 A（IC器件方向）覆盖的是 CMOS 逻辑器件
// 的缩放路线（FinFET/GAA/高κ金属栅）。而 Ga2O3、SiC、GaN 这类
// 功率器件论文的关切点完全不同——耐压、比导通电阻、开关损耗、
// 短路鲁棒性、散热。用池 A 去匹配功率器件论文，会生成一条
// 「学 FinFET 才能读 Ga2O3 MOSFET」的荒谬路径。
//
// 粒度遵循 04-IC器件方向粒度锚提取.md 的判据：
//   · 教材「一节」级（不是一章，也不是一小节）
//   · 可判性：一条练习能整体判定这个节点是否达标
//   · 不可再分性：不能想象「一个达标、另一个不达标」的合理学习者
//   · 两个概念总是合并讲解 → 合并为一个节点
//
// 跨池依赖：本池节点的 prerequisites 可以引用池 A 的 node_id
// （如 sp.pn.breakdown）。论文通过 pools 字段声明用哪几个池，
// js/app.js 会把这几个池合并成一张图。
//
// scope 取值说明：本池 25 个节点全部是 scope = "domain"，没有 shared。
//   shared 的语义是「任何半导体论文都可复用」。本池的节点（SiC/Ga2O3 材料、
//   平面栅/沟槽栅、耐压-导通折中、短路鲁棒性、熔体生长、动态/热表征）都是
//   功率器件语境专属的；若标成 shared，一篇 CMOS/FinFET 论文只要摘要里出现
//   gate oxide、planar、etch、doping、TCAD 这些词，就会被塞进功率器件节点，
//   正好破坏 scope 机制想防的跨领域污染。
//   功率论文需要的通用前置从池 A 的 22 个 shared 节点来（半导体物理、
//   I-V/C-V 表征、TCAD、光刻/刻蚀/沉积/注入/退火），所以全标 domain 不会缺东西。
//
// 文献引用核验说明（2026-09-12）：
//   resources 里标 [已核验] 的条目，是当天用 OpenAlex 接口实际查到、
//   并确认被 10.1109/tpel.2024.3522297 这篇论文引用或与其同主题的文献，
//   括号内数字为当时的被引次数。标 [经典教材] 的是领域公认教材，
//   未逐条核验版次页码。其余为检索式入口（B站/Wikipedia/Google Scholar），
//   点开后由使用者自行判断质量。
// ============================================================
window.NODE_POOLS = window.NODE_POOLS || {};

window.NODE_POOLS["power.wbg"] = {
  "domain_id": "power.wbg",
  "name": "宽禁带功率器件方向",
  "source": "2026-09-12 依据 04 号文档的粒度锚判据新建；首个锚定论文为 10.1109/tpel.2024.3522297",
  "outcome_archetypes": ["comprehension"],
  "layers": {
    "基础层": "所有人必经的材料与物理基础",
    "进阶层": "功率器件方向核心（耐压-导通-开关-热-可靠性）",
    "工艺层": "功率器件方向需了解",
    "表征层": "功率器件方向需掌握",
    "工具层": "功率器件方向需使用"
  },
  "nodes": [
    {
      "node_id": "pw.material.wbg",
      "name": "宽禁带半导体材料体系",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["sp.crystal"],
      "evidence_of_mastery": "能列出 SiC / GaN / Ga2O3 的 Eg、临界击穿场强、电子迁移率、热导率的数量级，并说明各自适用的电压等级",
      "description": "禁带宽度大于 Si（1.12 eV）的半导体统称宽禁带（WBG）材料：4H-SiC 约 3.26 eV、GaN 约 3.4 eV、β-Ga2O3 约 4.8 eV、金刚石约 5.5 eV。禁带宽度决定本征载流子浓度和临界击穿场强，而临界击穿场强决定「同样的耐压可以把漂移区做多薄、掺多低」——这是宽禁带器件优于 Si 的物理根源。评价一种功率材料只需盯住四个参数：禁带宽度 Eg、临界击穿场强 Ec、电子迁移率 μn、热导率 κ。前三项决定电学极限，κ 决定热学极限，而功率器件的失效往往先撞上热学极限。",
      "resources": [
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》第1-2章", "type": "教材", "note": "[经典教材] 功率器件的圣经，第2章有各材料参数与优值的完整对比表" },
        { "title": "A Survey of Wide Bandgap Power Semiconductor Devices (IEEE TPEL 2014)", "type": "论文", "note": "[已核验] 被引 2622 次，且被本论文引用；三种 WBG 材料的器件现状总览" },
        { "title": "B站搜索: 宽禁带半导体 第三代半导体 SiC GaN", "type": "视频", "note": "建立材料参数与电压等级的直观对应" },
        { "title": "Wikipedia: Wide-bandgap semiconductor", "type": "文章", "note": "有一张各材料参数对照表，适合快速回忆数量级" }
      ],
      "match_terms": ["wide bandgap", "wbg", "bandgap material", "ga2o3", "gallium oxide", "sic", "silicon carbide", "gan", "gallium nitride", "diamond", "ultra-wide", "uwbg", "宽禁带", "第三代半导体", "氧化镓", "碳化硅", "氮化镓"]
    },
    {
      "node_id": "pw.material.sic",
      "name": "4H-SiC 材料体系",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["pw.material.wbg"],
      "evidence_of_mastery": "能说明 SiC 在中压段的工程优势来自哪三个参数，以及它的成本与工艺瓶颈分别在哪",
      "description": "4H-SiC 是目前唯一大规模商用的宽禁带功率材料：Eg ≈ 3.26 eV，临界击穿场强 ≈ 2.2 MV/cm（约为 Si 的 8 倍），体电子迁移率 ≈ 700–1000 cm²/(V·s)，热导率 ≈ 370 W/(m·K)（约为 Si 的 2.5–3 倍、Ga2O3 的 30 倍左右）。650 V 到 10 kV 全电压段都有商用产品，MOSFET/SBD 产线成熟。两个短板：①单晶靠物理气相传输（PVT，升华法）在约 2300 °C 下生长，速率仅约 0.3–0.5 mm/h，衬底成本高；②SiO2/SiC 界面态密度高，反型层迁移率被压到体迁移率的 1/20 以下。因为热导率高、有双极器件路线（体二极管可导电调制），SiC 常被当作 Ga2O3 的对照基线。",
      "resources": [
        { "title": "Kimoto, Material science and device physics in SiC technology for high-voltage power devices (JJAP 2015)", "type": "论文", "note": "[经典教材] SiC 器件物理最常被引的综述之一，界面态与迁移率章节尤为关键" },
        { "title": "Review of Silicon Carbide Processing for Power MOSFET (2022)", "type": "论文", "note": "[已核验] 被引 200 次，与本论文关键词高度重合；从工艺角度讲 SiC MOSFET" },
        { "title": "B站搜索: 碳化硅 SiC 功率器件 衬底", "type": "视频", "note": "关注 PVT 生长与位错控制的科普讲解" },
        { "title": "Wikipedia: Silicon carbide", "type": "文章", "note": "物性参数表齐全，含多型（3C/4H/6H）差异" }
      ],
      "match_terms": ["sic", "silicon carbide", "4h-sic", "4h", "sic mosfet", "pvt", "sublimation growth", "碳化硅", "si c"]
    },
    {
      "node_id": "pw.material.ga2o3",
      "name": "β-Ga2O3 材料体系",
      "kind": "concept",
      "layer": "基础层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["pw.material.wbg"],
      "evidence_of_mastery": "能说出 Ga2O3 相对 SiC 的一个决定性优势和一个决定性劣势，并解释各自的物理来源",
      "description": "β-Ga2O3 是最稳定的氧化镓相：Eg ≈ 4.8–4.9 eV，临界击穿场强 ≈ 8 MV/cm（约为 SiC 的 3 倍），意味着同样耐压下漂移区可以更薄、掺杂更低，理论比导通电阻远低于 SiC。决定性优势在生长：可用熔体法（CZ 直拉、EFG 导模、VT 垂直温度梯度凝固）在常压下生长，衬底成本有数量级的下降空间。两个决定性劣势：①电子迁移率受极性光学声子散射限制，室温理论上限约 100–200 cm²/(V·s)，低于 SiC；②受主能级过深，几乎不存在可用的 p 型掺杂，因此做不了双极器件（IGBT/BJT）、做不了常规 p-n 结终端。此外热导率仅约 10–13 W/(m·K) 且各向异性（b 轴方向更低），散热是工程落地的最大障碍。",
      "resources": [
        { "title": "Recent progress on the electronic structure, defect, and doping properties of Ga2O3 (2020)", "type": "论文", "note": "[已核验] 被引 593 次，同主题高被引综述；讲清「为什么掺不出 p 型」" },
        { "title": "Ultra-wide bandgap semiconductor Ga2O3 power diodes (2022)", "type": "论文", "note": "[已核验] 被引 654 次，同主题最高被引综述之一；器件路线全景" },
        { "title": "Intrinsic electron mobility limits in β-Ga2O3 (APL 2016)", "type": "论文", "note": "[已核验] 被引 424 次，且被本论文引用；迁移率上限的第一性原理来源" },
        { "title": "Anisotropic thermal conductivity in single crystal β-gallium oxide (APL 2015)", "type": "论文", "note": "[已核验] 被引 581 次，且被本论文引用；热导率各向异性的实验依据，直接关系短路鲁棒性结论" }
      ],
      "match_terms": ["ga2o3", "gallium oxide", "beta-ga2o3", "β-ga2o3", "b-ga2o3", "ga 2 o 3", "ultra-wide bandgap", "uwbg", "melt growth", "czochralski", "edge-defined film-fed", "efg", "氧化镓", "镓氧化物", "熔体法"]
    },
    {
      "node_id": "pw.app.mv",
      "name": "中压应用场景与电压等级",
      "kind": "fact",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": [],
      "evidence_of_mastery": "能说出 3300 V / 4500 V / 6500 V 三档各自对应的典型应用，以及电压等级如何反过来约束器件设计",
      "description": "功率器件按电压等级分层：650 V/1200 V 面向车载与工业电源，3300 V 面向轨道交通牵引变流器，4500 V 面向中压变频与风电变流器，6500 V 面向固态变压器、柔直配电与牵引供电。等级越高，对开关频率的要求越低（损耗与 dv/dt 约束），对串联均压、绝缘配合、边缘终端的要求越高。因此读一篇中压器件论文，第一步不是看结构图，而是确认它假设的电压等级与应用工况——同样一个 Ron,sp 数值，在 1200 V 段可能很差，在 6500 V 段可能极优。本论文即固定 3300 / 4500 / 6500 V 三档做同口径对比。",
      "resources": [
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》应用与电压等级章节", "type": "教材", "note": "[经典教材] 各电压段的器件选型逻辑" },
        { "title": "B站搜索: 轨道交通 牵引变流器 IGBT 电压等级", "type": "视频", "note": "从系统侧理解为什么需要 3300 V/6500 V" },
        { "title": "Wikipedia: Solid-state transformer", "type": "文章", "note": "中压器件最有想象力的应用场景之一" }
      ],
      "match_terms": ["medium voltage", "medium-voltage", "3300 v", "4500 v", "6500 v", "3.3 kv", "6.5 kv", "high voltage", "traction", "railway", "solid state transformer", "sst", "mvdc", "grid", "voltage rating", "voltage class", "中压", "高压", "轨道交通", "固态变压器", "电压等级"]
    },
    {
      "node_id": "pw.bv.drift",
      "name": "击穿电压与漂移区设计",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["sp.pn.breakdown", "pw.material.wbg"],
      "evidence_of_mastery": "给定目标击穿电压，能用一维近似估算所需漂移区厚度与掺杂浓度的量级",
      "description": "单极功率器件的耐压由一层低掺杂漂移区承担。一维近似下，非穿通结构 BV ≈ Ec·t/2，穿通结构下 BV 与掺杂浓度近似成反比、与厚度成正比。由此得到功率器件的根本权衡：耐压越高 → 漂移区必须更厚、掺杂更低 → 漂移区电阻越大。这一步是所有功率器件结构设计的起点：先用材料的 Ec 反解出 (t_drift, N_drift) 组合，再谈元胞布局。Ga2O3 的 Ec 约为 SiC 的 3 倍，同样 3300 V 下所需漂移区更薄，这正是它比导通电阻更低的来源。",
      "resources": [
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》击穿电压与漂移区章节", "type": "教材", "note": "[经典教材] 一维解析公式的完整推导与查表法" },
        { "title": "B站搜索: 功率器件 击穿电压 漂移区 设计", "type": "视频", "note": "重点看耐压-厚度-掺杂三者权衡的图示" },
        { "title": "Wikipedia: Power MOSFET", "type": "文章", "note": "有漂移区结构与耐压关系的说明图" }
      ],
      "match_terms": ["breakdown voltage", "blocking voltage", "voltage rating", "bv", "breakdown", "avalanche", "drift region", "drift layer", "drift", "depletion width", "punch through", "non-punch", "doping concentration", "critical electric field", "ec", "耐压", "漂移区", "击穿电压", "阻断", "雪崩"]
    },
    {
      "node_id": "pw.ron.decomp",
      "name": "比导通电阻 Ron,sp 分解",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["sp.mosfet.iv", "pw.mos.planar"],
      "evidence_of_mastery": "能画出平面栅 MOSFET 的 Ron,sp 串联分解示意图，并指出中压器件的主导项",
      "description": "比导通电阻 Ron,sp = Ron × 元胞面积，单位 Ω·cm²，它把不同尺寸、不同厂家的器件归一到同一口径，是功率器件最核心的单一指标。平面栅 MOSFET 的 Ron,sp 是一串电阻之和：源极接触电阻、N+ 源区、反型层沟道（界面散射使沟道迁移率远低于体迁移率，常是主导项）、颈区/JFET 区、漂移区、衬底、漏极接触。中压器件漂移区占比大，但沟道与 JFET 区仍可能贡献可观比例。任何「降低导通损耗」的改进方案，都必须先定位是哪一段在起主导作用——TCAD 对比研究的标准输出就是这张分解图。",
      "resources": [
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》MOSFET 比导通电阻章节", "type": "教材", "note": "[经典教材] 逐段给出解析表达式，可直接对照论文数据" },
        { "title": "B站搜索: 功率MOSFET 导通电阻 Ron 分解", "type": "视频", "note": "看电流路径与电阻分段的动画讲解" },
        { "title": "Wikipedia: Power MOSFET", "type": "文章", "note": "含 on-resistance 各成分的结构示意图" }
      ],
      "match_terms": ["on-resistance", "on resistance", "ron", "specific on-resistance", "ron sp", "ron,sp", "mohm", "conduction loss", "channel resistance", "drift resistance", "jfet", "neck region", "accumulation layer", "导通电阻", "比导通电阻", "导通损耗", "沟道电阻"]
    },
    {
      "node_id": "pw.fom.baliga",
      "name": "Baliga 优值与材料极限",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["pw.bv.drift", "pw.ron.decomp"],
      "evidence_of_mastery": "能用 BV²/Ron,sp 复核论文给出的优值，并解释材料本征优值中为什么临界场强是三次方项",
      "description": "两个层次的优值必须分清：材料本征 Baliga 优值 BFOM = εr·μn·Ec³/4，描述材料极限；工程器件优值常写成 BV²/Ron,sp，描述实际做出来的器件。因为 Ec 是三次方项，材料耐压能力的收益远大于迁移率的收益——这解释了为什么 Ga2O3 尽管迁移率低于 SiC，理论优值反而高出近一个数量级。反过来说，若一篇论文只报 Ron,sp 而不报对应的 BV，或者只报材料优值而不报实测器件优值，其对比结论都不可信。本论文给出 3300 V 档 Ga2O3 平面栅 MOSFET 的 Ron,sp = 5.85 mΩ·cm²、BV = 3840 V，对应 BFOM ≈ 2.53 GW/cm²，可用 BV²/Ron,sp 自行复核。",
      "resources": [
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》材料优值章节", "type": "教材", "note": "[经典教材] BFOM 公式的推导过程与各材料对比表" },
        { "title": "A Survey of Wide Bandgap Power Semiconductor Devices (IEEE TPEL 2014)", "type": "论文", "note": "[已核验] 被引 2622 次；含各材料 BFOM 与实测器件优值的对照" },
        { "title": "Wikipedia: Figure of merit (electronics)", "type": "文章", "note": "各类电子学优值的定义汇总" }
      ],
      "match_terms": ["baliga", "figure of merit", "fom", "bfom", "power figure of merit", "merit", "gw/cm2", "mw/cm2", "theoretical limit", "优值", "品质因数", "材料极限"]
    },
    {
      "node_id": "pw.mos.planar",
      "name": "平面栅功率 MOSFET 结构",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["sp.mosfet.vth", "pw.bv.drift"],
      "evidence_of_mastery": "能画出平面栅元胞的电流路径，并把每一段对应到 Ron,sp 的一个成分",
      "description": "平面栅结构中栅极与源极位于同一平面，反型层沟道横向导电，电流随后经颈区/JFET 区转向，垂直穿过漂移区到达漏极。优点是工艺相对简单、栅氧长在平整晶面上质量可控、短路耐量通常优于沟槽栅；缺点是存在 JFET 区附加电阻、元胞密度低于沟槽栅、沟道迁移率受界面粗糙度散射压制。本论文对比的正是 Ga2O3 与 SiC 的平面栅结构，且为垂直（vertical）型——即电流方向垂直于衬底，漂移区在垂直方向承担耐压。",
      "resources": [
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》平面栅/线性元胞章节", "type": "教材", "note": "[经典教材] 元胞剖面图与逐段电阻解析式" },
        { "title": "Progress of Ultra-Wide Bandgap Ga2O3 Semiconductor Materials in Power MOSFETs (2019)", "type": "论文", "note": "[已核验] 被引 214 次，本团队同方向；Ga2O3 MOSFET 结构演进综述" },
        { "title": "B站搜索: 功率MOSFET 平面栅 结构 VDMOS", "type": "视频", "note": "重点看电流路径的动画" }
      ],
      "match_terms": ["planar gate", "planar mosfet", "planar structure", "planar", "vertical mosfet", "vertical", "cell pitch", "unit cell", "linear cell", "vdmos", "平面栅", "垂直结构", "元胞"]
    },
    {
      "node_id": "pw.mos.trench",
      "name": "沟槽栅功率 MOSFET 结构",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["pw.mos.planar"],
      "evidence_of_mastery": "能说明沟槽栅降低 Ron,sp 的机理，以及它必须额外解决的两个问题",
      "description": "沟槽栅把栅极刻进沟槽，沟道纵向导电，从而消除 JFET 区、提高元胞密度，SiC 沟槽栅已量产且 Ron,sp 低于同代平面栅。代价有两处：①沟槽底部拐角处栅氧电场集中，必须加屏蔽结构（屏蔽栅/分裂栅/p+ 屏蔽），否则栅氧可靠性与开关特性都会劣化；②沟槽侧壁质量取决于刻蚀工艺，侧壁粗糙度直接变成界面态，反过来压低沟道迁移率——这使沟槽栅的收益在部分工艺条件下被抵消。对 Ga2O3 而言，沟槽栅还额外受制于刻蚀工艺不成熟与无 p 型掺杂（做不了 p+ 屏蔽）。",
      "resources": [
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》沟槽栅章节", "type": "教材", "note": "[经典教材] 沟槽栅与屏蔽栅结构的解析对比" },
        { "title": "B站搜索: SiC 沟槽栅 MOSFET trench", "type": "视频", "note": "对比平面栅与沟槽栅的电流路径差异" },
        { "title": "Wikipedia: Power MOSFET", "type": "文章", "note": "含 trench 结构剖面图" }
      ],
      "match_terms": ["trench", "trench gate", "trenched", "shielded gate", "split gate", "沟槽栅", "屏蔽栅", "trench mosfet"]
    },
    {
      "node_id": "pw.switching.dyn",
      "name": "开关特性与开关损耗",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["sp.mos.cap", "pw.ron.decomp"],
      "evidence_of_mastery": "能写出总损耗的构成式，并解释为什么高压器件不能只看 Ron,sp",
      "description": "器件总损耗 = 导通损耗（由 Ron 与电流有效值决定）+ 开关损耗（每次开通/关断的能量 Eon、Eoff 乘以开关频率）。开关过程由器件电容 Ciss/Coss/Crss（Crss 即 Miller 电容）与栅极电荷 Qg 决定，还受栅极电阻、驱动电流、回路寄生电感强烈影响。中压器件的 Crss 与 Qg 通常远大于低压器件，且中压应用的开关频率本身不高，因此「Ron,sp 更低」不必然等于「总损耗更低」——这正是本论文标题同时给出 static 与 dynamic performance 的原因。论文结论之一：3300 V/1000 μm 的 Ga2O3 平面栅 MOSFET 开关损耗与 SiC 基本相当。",
      "resources": [
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》开关瞬态与损耗章节", "type": "教材", "note": "[经典教材] Eon/Eoff 的计算方法与电容非线性处理" },
        { "title": "B站搜索: MOSFET 开关损耗 米勒电容 栅极电荷", "type": "视频", "note": "开关瞬态波形逐段讲解，配合损耗公式" },
        { "title": "Wikipedia: Power MOSFET", "type": "文章", "note": "含栅极电荷曲线与开关过程分段说明" }
      ],
      "match_terms": ["switching loss", "switching", "switching performance", "dynamic performance", "dynamic", "turn-on", "turn-off", "eon", "eoff", "switching energy", "gate charge", "qg", "coss", "ciss", "crss", "miller capacitance", "switching frequency", "开关损耗", "动态性能", "栅极电荷", "米勒电容", "开关特性"]
    },
    {
      "node_id": "pw.bodydiode.rr",
      "name": "体二极管与反向恢复",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["sp.pn.bias", "pw.switching.dyn"],
      "evidence_of_mastery": "能解释 trr 与 Qrr 的物理来源，并说明为什么双极注入会加剧反向恢复",
      "description": "桥式拓扑中，MOSFET 源-漏之间天然形成的体二极管会在死区时间先导通，随后被反向电压关断——这个关断过程就是反向恢复，其特征量是反向恢复时间 trr 和反向恢复电荷 Qrr。物理来源是导通期间注入并存储在漂移区/体区的少数载流子必须在关断时被抽走或复合掉；注入越多（电导调制越强），Qrr 越大。因此 SiC MOSFET 的双极体二极管 Qrr 较大，而 Ga2O3 因无 p 型掺杂、只能走单极或肖特基路线，反向恢复电荷可以做得很小。本论文给出 Ga2O3 沟道二极管的 trr = 8.5 ns、Qrr = 18 nC。代价是：Qrr 小往往意味着导通压降更高，二者需要一起看。",
      "resources": [
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》体二极管与反向恢复章节", "type": "教材", "note": "[经典教材] Qrr 与少子寿命的解析关系" },
        { "title": "B站搜索: 反向恢复 体二极管 功率MOSFET", "type": "视频", "note": "看反向恢复电流波形与换流过程" },
        { "title": "Wikipedia: Diode#Reverse recovery", "type": "文章", "note": "trr/Qrr 的定义与测量约定" }
      ],
      "match_terms": ["reverse recovery", "recovery time", "recovery charge", "body diode", "trr", "qrr", "freewheeling", "commutation", "bipolar injection", "conductivity modulation", "反向恢复", "体二极管", "续流", "电导调制"]
    },
    {
      "node_id": "pw.thermal",
      "name": "热管理、自热与电热耦合",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["pw.material.ga2o3", "pw.material.sic"],
      "evidence_of_mastery": "能写出结温的估算式，并说明为什么 Ga2O3 器件仿真必须打开电热耦合方程",
      "description": "功率器件的实际极限常常不是电击穿而是热失效。结温 Tj = Ta + P·Rth，其中 P 是损耗（主要来自 Ron 的焦耳热），Rth 由材料热导率 κ、器件厚度、键合/衬底与封装热阻串联而成。Ga2O3 的 κ 仅约 10–13 W/(m·K) 且各向异性，比 SiC 低约 30 倍，因此同样的损耗下结温升得快得多，热 runaway 风险高。仿真上必须求解晶格热流方程（lattice heat flow）与电学方程耦合，才能得到正确的自热行为、温度依赖的迁移率退化与短路过程；只做等温仿真的功率器件结论不可用。补偿手段是异质集成到高热导衬底与优化封装。",
      "resources": [
        { "title": "Anisotropic thermal conductivity in single crystal β-gallium oxide (APL 2015)", "type": "论文", "note": "[已核验] 被引 581 次，且被本论文引用；κ 各向异性的原始实验数据" },
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》热管理与封装章节", "type": "教材", "note": "[经典教材] 热阻网络与结温估算" },
        { "title": "B站搜索: 功率器件 自热 热阻 结温", "type": "视频", "note": "热阻串联网络的直观讲解" }
      ],
      "match_terms": ["thermal conductivity", "thermal", "self-heating", "self heating", "junction temperature", "thermal resistance", "thermal management", "lattice heat", "electro-thermal", "electrothermal", "heat capacity", "heat dissipation", "rth", "热导率", "自热", "结温", "散热", "热阻", "热容", "电热耦合"]
    },
    {
      "node_id": "pw.sc.robustness",
      "name": "短路鲁棒性",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["pw.switching.dyn", "pw.thermal"],
      "evidence_of_mastery": "能说明短路耐量的物理决定因素，并解释为什么 Ga2O3 的短路耐量弱于 SiC",
      "description": "短路耐量（SCWT，short-circuit withstand time）指桥臂发生短路时器件在驱动保护动作前能撑住的时间，商用器件通常要求 2–3 μs 以上。失效链条是：短路瞬间器件同时承受高电压与大电流 → 焦耳热在微秒量级内积聚 → 结温飙升 → 依次触发热失控（本征载流子激发使电流进一步增大）、栅氧失效、源极金属熔融。链条的时间常数由热导率与晶格热容决定，所以低 κ 材料的 SCWT 天然更短。本论文的核心负面结论正在于此：Ga2O3 平面栅 MOSFET 的短路鲁棒性弱于 SiC，主要原因是热导率低与晶格热容小——这也是它走向工程应用必须先解决的问题。",
      "resources": [
        { "title": "B站搜索: IGBT 短路 鲁棒性 SCWT", "type": "视频", "note": "短路工况波形与失效过程演示" },
        { "title": "Google Scholar 检索: short circuit ruggedness SiC MOSFET", "type": "论文", "note": "该方向文献密集，优先看有实测 SCWT 数据的" },
        { "title": "Wikipedia: Short circuit (electronics)", "type": "文章", "note": "基础定义与保护策略" }
      ],
      "match_terms": ["short circuit", "short-circuit", "sc robustness", "scwt", "withstand time", "fault", "ruggedness", "robustness", "thermal runaway", "短路", "鲁棒性", "耐量", "热失控"]
    },
    {
      "node_id": "pw.gateoxide",
      "name": "功率 MOS 栅氧与界面态",
      "kind": "concept",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["sp.mos.cap", "sp.mosfet.vth"],
      "evidence_of_mastery": "能说明界面态如何同时影响沟道迁移率与阈值电压稳定性，并比较 SiC 与 Ga2O3 的栅介质选择",
      "description": "功率 MOSFET 的栅氧处境比逻辑器件苛刻得多：阻断态下漂移区的高电场会通过栅氧分担，平面栅尤甚，需靠场限板或 p 型屏蔽把氧化层电场压到安全值以下。SiC 的 SiO2/SiC 界面态密度比 SiO2/Si 高 1–2 个数量级，这些近界面陷阱会俘获载流子，既压低反型层迁移率（沟道电阻变大），又造成阈值电压漂移与迟滞。Ga2O3 上一般不用 SiO2，而用 Al2O3、HfO2 等高κ介质，核心问题变成带阶（band alignment）是否足以承受阻断态电场、以及界面态与深能级缺陷。本论文报出 Ga2O3 平面栅的栅氧最大电场，正是这一约束的体现。",
      "resources": [
        { "title": "Kimoto, Material science and device physics in SiC technology (JJAP 2015)", "type": "论文", "note": "[经典教材] SiO2/SiC 界面态与迁移率退化的权威论述" },
        { "title": "B站搜索: MOSFET 界面态 阈值电压漂移 栅氧", "type": "视频", "note": "看界面态俘获电荷的过程示意" },
        { "title": "Wikipedia: Interface states", "type": "文章", "note": "界面态的定义、测量与对器件的影响" }
      ],
      "match_terms": ["gate oxide", "gate dielectric", "gate ox", "interface state", "interface trap", "dit", "high-k", "high k", "al2o3", "hfo2", "band alignment", "threshold voltage instability", "vth drift", "oxide field", "oxide reliability", "栅氧", "界面态", "高k介质", "带阶", "阈值电压漂移"]
    },
    {
      "node_id": "pw.perf.compare",
      "name": "功率器件性能对比方法学",
      "kind": "procedure",
      "layer": "进阶层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["pw.fom.baliga", "pw.switching.dyn"],
      "evidence_of_mastery": "能指出一篇器件对比论文中至少两处口径不一致的地方，并说明应如何修正",
      "description": "跨材料、跨结构对比必须「同口径」，否则结论无意义。四条口径：①电压等级一致（3300 V 的 Ga2O3 与 1200 V 的 SiC 不可直接比 Ron,sp）；②归一化方式一致（用 Ron,sp = Ron×A，而非裸 Ron）；③测试/仿真条件一致（Vgs、Id、母线电压、负载电感、栅极电阻、结温）；④静态与动态指标同时给出。读对比类论文时应把这四条当作检查清单逐条核对，任何一条不满足都要在结论上打折。这也是从「读懂一篇论文」升级到「评价一篇论文」的关键动作，对应 Rubric 的 L3 批判层。",
      "resources": [
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》器件对比与优值章节", "type": "教材", "note": "[经典教材] 标准对比口径与常见误用" },
        { "title": "A Survey of Wide Bandgap Power Semiconductor Devices (IEEE TPEL 2014)", "type": "论文", "note": "[已核验] 被引 2622 次；学习一篇严谨的多材料对比该怎么写" },
        { "title": "B站搜索: 功率器件 对比 SiC GaN 优值", "type": "视频", "note": "看不同来源的数据为何互相矛盾" }
      ],
      "match_terms": ["comparison", "comparative", "compared", "benchmark", "state-of-the-art", "performance comparison", "investigation", "对比", "比较", "同口径", "基准", "综述"]
    },
    {
      "node_id": "pw.proc.growth",
      "name": "单晶生长与同质外延",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["proc.deposition", "pw.material.wbg"],
      "evidence_of_mastery": "能对比 SiC 与 Ga2O3 的衬底生长方式，并说明中压器件对外延层的具体要求",
      "description": "SiC 单晶用物理气相传输（PVT/升华法）在约 2300 °C 下生长，速率仅约 0.3–0.5 mm/h，位错（微管、螺位错 TSD、刃位错 TED、基面位错 BPD）控制是良率与成本的关键；器件层用 CVD 同质外延。Ga2O3 可用熔体法（CZ 直拉、EFG 导模、VT）在常压下生长，成本低、可做大尺寸，这是它相对 SiC 的结构性优势；但高质量厚漂移层的同质外延仍不成熟，MOCVD 速率与纯度受限、HVPE 速率高但表面粗糙、MBE 质量好但太慢。中压（3300 V 以上）器件需要几十微米厚、掺杂浓度低且纵向分布均匀的外延层，掺杂均匀性直接决定 BV 的一致性——这是外延环节最难的地方。",
      "resources": [
        { "title": "MOCVD grown epitaxial β-Ga2O3 thin film with an electron mobility of 176 cm2/V·s (APL 2018)", "type": "论文", "note": "[已核验] 被引 267 次，且被本论文引用；同质外延质量的外延参数与迁移率实测" },
        { "title": "Recent progress on the electronic structure, defect, and doping properties of Ga2O3 (2020)", "type": "论文", "note": "[已核验] 被引 593 次；缺陷与掺杂部分解释了外延层的电学上限" },
        { "title": "B站搜索: 碳化硅 单晶生长 PVT 外延", "type": "视频", "note": "晶体生长过程的可视化讲解" }
      ],
      "match_terms": ["epitaxy", "epitaxial", "epitaxial growth", "bulk crystal", "crystal growth", "substrate", "wafer", "czochralski", "efg", "edge-defined", "pvt", "physical vapor transport", "mocvd", "hvpe", "mbe", "drift layer", "dislocation", "外延", "单晶", "衬底", "晶圆", "位错", "生长"]
    },
    {
      "node_id": "pw.proc.doping",
      "name": "宽禁带掺杂难题",
      "kind": "concept",
      "layer": "工艺层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["proc.implant", "pw.material.ga2o3"],
      "evidence_of_mastery": "能解释 Ga2O3 无 p 型掺杂会导致哪些器件类型不可行，以及工程上如何绕过",
      "description": "SiC：n 型掺 N，p 型掺 Al，均需离子注入后高温退火激活；受主电离能高（Al 约 200 meV），室温下电离不完全，建模时必须显式开启「不完全电离」模型，否则会高估载流子浓度、低估导通电阻。Ga2O3：n 型掺 Si/Sn/Ge 且可在熔体生长阶段直接掺入，成本极低；但受主能级过深，实际上没有可用的 p 型掺杂。这条约束的连锁后果是：做不了 IGBT/BJT 这类双极器件（无电导调制，大电流下导通压降吃亏）、做不了常规 p-n 结边缘终端（要靠离子注入形成 p 区或改用异质 p 型氧化物如 NiO）、体二极管只能走肖特基或异质结路线。理解这一点，就理解了 Ga2O3 整条器件路线为什么长成现在这样。",
      "resources": [
        { "title": "Recent progress on the electronic structure, defect, and doping properties of Ga2O3 (2020)", "type": "论文", "note": "[已核验] 被引 593 次；掺杂与缺陷章节是本节点的主依据" },
        { "title": "Manganese in β-Ga2O3: a deep acceptor with a large nonradiative electron capture", "type": "论文", "note": "[已核验] 本团队同方向近期工作；深能级受主的典型案例" },
        { "title": "B站搜索: 半导体 离子注入 退火 激活", "type": "视频", "note": "注入-退火-激活的通用流程" }
      ],
      "match_terms": ["p-type doping", "p-type", "n-type", "acceptor", "donor", "doping", "activation energy", "incomplete ionization", "si doping", "sn doping", "nitrogen", "aluminum implant", "unipolar", "bipolar", "deep level", "掺杂", "p型", "受主", "施主", "不完全电离", "激活"]
    },
    {
      "node_id": "pw.proc.etch",
      "name": "宽禁带材料刻蚀",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["proc.etch", "pw.material.sic"],
      "evidence_of_mastery": "能说明为什么 SiC 沟槽栅工艺难度高于平面栅，并指出刻蚀损伤会劣化哪个电学参数",
      "description": "SiC 化学惰性极强，湿法几乎无效，只能靠氟基等离子体（SF6/O2、CF4）的 ICP/RIE 做物理-化学混合刻蚀；刻蚀后表面存在晶格损伤层与碳残留，若不去除会直接变成界面态，压低沟道迁移率并造成 Vth 不稳。Ga2O3 可用碱性湿法（KOH、TMAH）做各向异性刻蚀，也可干法刻蚀，但干法速率、选择比与损伤控制仍不成熟。沟槽栅结构的可行性本质上取决于侧壁刻蚀质量：侧壁粗糙度 → 界面态 → 沟道迁移率 → Ron,sp，这条链是功率器件工艺与电学性能的交汇点。",
      "resources": [
        { "title": "Review of Silicon Carbide Processing for Power MOSFET (2022)", "type": "论文", "note": "[已核验] 被引 200 次；刻蚀、注入、氧化各环节的工艺难点汇总" },
        { "title": "B站搜索: 干法刻蚀 ICP RIE 等离子体", "type": "视频", "note": "物理刻蚀与化学刻蚀的比例如何影响侧壁形貌" },
        { "title": "Wikipedia: Plasma etching", "type": "文章", "note": "刻蚀机理与各向异性来源" }
      ],
      "match_terms": ["etching", "etch", "dry etch", "wet etch", "icp", "rie", "fluorine", "sf6", "plasma damage", "sidewall", "trench etch", "koh", "tmah", "刻蚀", "侧壁", "刻蚀损伤", "湿法"]
    },
    {
      "node_id": "pw.proc.ohmic",
      "name": "宽禁带欧姆接触",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["proc.deposition", "pw.proc.doping"],
      "evidence_of_mastery": "能说明欧姆接触电阻计入 Ron,sp 的哪一段，以及 SiC 与 Ga2O3 接触工艺的差异",
      "description": "SiC 的 n+ 源/漏与背面接触通常需要 Ni 基金属化并在约 1000 °C 下退火形成镍硅化物，才能获得足够低的比接触电阻率；高温退火同时带来表面形貌恶化与掺杂再分布问题。Ga2O3 的欧姆接触相对容易（Ti/Au、Ni/Au 经中低温退火即可），这是它工艺上的一个便利，但接触的热稳定性与长期可靠性仍是隐患，尤其在结温本就偏高的情况下。无论哪种材料，源/漏接触电阻都直接串进 Ron,sp，在低压段器件中甚至可能是主导项；中压段占比下降但不可忽略。",
      "resources": [
        { "title": "Review of Silicon Carbide Processing for Power MOSFET (2022)", "type": "论文", "note": "[已核验] 被引 200 次；含金属化与接触退火工艺窗口" },
        { "title": "Google Scholar 检索: ohmic contact Ga2O3 specific contact resistivity", "type": "论文", "note": "该子方向文献量大，优先看给出比接触电阻率实测值的" },
        { "title": "Wikipedia: Ohmic contact", "type": "文章", "note": "接触电阻的定义与测量方法（TLM/CTLM）" }
      ],
      "match_terms": ["ohmic contact", "contact resistance", "contact resistivity", "metallization", "metal contact", "ti/au", "ni/au", "nickel silicide", "contact anneal", "欧姆接触", "金属化", "接触电阻"]
    },
    {
      "node_id": "pw.proc.termination",
      "name": "边缘终端与场限环",
      "kind": "procedure",
      "layer": "工艺层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["sp.pn.breakdown", "pw.bv.drift"],
      "evidence_of_mastery": "能解释为什么实测击穿电压远低于一维理论值，并列举两种终端方案的工艺代价",
      "description": "芯片边缘存在曲率效应，电场会集中，若不做边缘终端，实测 BV 可能只有一维理论值的几分之一。常用方案：结终端扩展（JTE，在边缘形成一段渐变掺杂的 p 区把电场摊平）、场限环、场板（用金属电极分压）、斜角磨角、以及超结终端。JTE 的性能对注入剂量极其敏感，剂量窗口窄、工艺容差小，通常要用多区 JTE 或渐变 JTE 来放宽。Ga2O3 因无 p 型掺杂，JTE 只能靠离子注入形成 p 区（激活率低、重复性差）或改用异质 p 型氧化物（如 NiO），这使得中压 Ga2O3 器件的终端设计往往比元胞设计更难。",
      "resources": [
        { "title": "High voltage vertical Ga2O3 JBS diode with fluorine ion implanted edge termination", "type": "论文", "note": "[已核验] 本团队 2026 年最新工作，直接示范 Ga2O3 的边缘终端怎么做" },
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》边缘终端章节", "type": "教材", "note": "[经典教材] JTE 剂量窗口的解析求解" },
        { "title": "B站搜索: 功率器件 边缘终端 场限环 JTE", "type": "视频", "note": "电场集中与终端方案的图示" }
      ],
      "match_terms": ["edge termination", "termination", "junction termination extension", "jte", "field plate", "field limiting ring", "guard ring", "bevel", "mesa", "nio", "field crowding", "curvature", "边缘终端", "终端", "场限环", "场板", "电场集中"]
    },
    {
      "node_id": "pw.hetero.integration",
      "name": "异质集成与衬底转移",
      "kind": "concept",
      "layer": "工艺层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["pw.proc.growth", "pw.thermal"],
      "evidence_of_mastery": "能说明异质集成如何补偿 Ga2O3 的低热导率，以及它引入的新成本与新风险",
      "description": "针对 Ga2O3 热导率过低这一根本短板，工程路线是把器件层与高热导衬底组合：先在 Ga2O3 或牺牲衬底上做出器件层/外延层，再通过晶圆级异质集成或离子注入剥离（ion-cutting / smart-cut）转移到 SiC、Si、AlN 甚至金刚石衬底上，也可用原子层键合直接对接。收益是热阻显著下降、结温与短路耐量提升；代价是键合界面本身会引入一层界面热阻（可能抵消部分收益）、工艺步骤与成本增加、良率与热应力匹配（热膨胀系数差异导致翘曲或开裂）成为新问题。这是 Ga2O3 从「材料优值漂亮」走向「工程可用」的关键一跃。",
      "resources": [
        { "title": "First Demonstration of Waferscale Heterogeneous Integration of Ga2O3 MOSFETs on SiC and Sapphire", "type": "论文", "note": "[已核验] 被引 84 次，本团队同方向；晶圆级异质集成的实验示范" },
        { "title": "β-Ga2O3 MOSFETs on the Si substrate fabricated by the ion-cutting process", "type": "论文", "note": "[已核验] 被引 53 次，本团队同方向；离子剥离转移路线" },
        { "title": "Wikipedia: Wafer bonding", "type": "文章", "note": "键合工艺分类与界面热阻来源" }
      ],
      "match_terms": ["heterogeneous integration", "hetero integration", "wafer bonding", "bonding", "ion cutting", "ion-cutting", "smart cut", "substrate transfer", "atomic layer bonding", "on sic", "on si substrate", "异质集成", "晶圆键合", "衬底转移", "离子剥离"]
    },
    {
      "node_id": "pw.char.dyn",
      "name": "双脉冲测试与动态参数提取",
      "kind": "tool",
      "layer": "表征层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["char.iv", "pw.switching.dyn"],
      "evidence_of_mastery": "能说明双脉冲测试两个脉冲各自的作用，并列出三个会污染测量结果的寄生参数",
      "description": "双脉冲测试（DPT）是提取 Eon、Eoff、trr、Qrr 的行业标准方法：第一个脉冲把电感电流建立到目标值（模拟负载电流），关断后被测器件承受母线电压；第二个脉冲观察开通瞬态，其后的关断瞬态给出 Eoff。测量结果的三个主要污染源：母线去耦不足导致电压跌落、负载回路寄生电感引起电压尖峰、栅极回路电感与栅极电阻设置不一致。此外结温必须受控——动态参数对温度非常敏感。仿真得到的开关波形只有与 DPT 实测对齐后，动态性能结论才算可信。",
      "resources": [
        { "title": "Google Scholar 检索: double pulse test switching loss measurement methodology", "type": "论文", "note": "有多篇专门讨论 DPT 测量误差与修正的文献" },
        { "title": "B站搜索: 双脉冲测试 开关损耗 测量", "type": "视频", "note": "波形逐段讲解，配合探头与去耦配置" },
        { "title": "Wikipedia: Power MOSFET", "type": "文章", "note": "开关能量与测试条件的定义" }
      ],
      "match_terms": ["double pulse", "dpt", "double-pulse", "switching measurement", "dynamic characterization", "hard switching", "soft switching", "oscilloscope", "current probe", "双脉冲", "开关测试", "波形测量"]
    },
    {
      "node_id": "pw.char.thermal",
      "name": "热特性与结温表征",
      "kind": "tool",
      "layer": "表征层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["pw.thermal", "char.iv"],
      "evidence_of_mastery": "能列举两种结温测量方法及其各自的适用条件与误差来源",
      "description": "结温无法直接测，工程上用热敏电参数法（TSEP）：选一个随温度单调变化的电学量作为温度计，如 Vgs(on)、体二极管正向压降、栅极充电电荷、关断延迟时间，先标定再反推瞬态结温。空间分布则用红外热成像（需处理发射率与空间分辨率）或热反射法。瞬态热阻抗曲线 Zth(t) 可通过一次功率阶跃响应测得，反解出各层热阻与热容组成的 Foster/Cauer 网络，是封装与衬底热设计的关键输入。注意：静态电学测试若不控温，测出的 Ron,sp 会被自热污染，与等温仿真对不上。",
      "resources": [
        { "title": "Google Scholar 检索: thermal sensitive electrical parameter junction temperature power device", "type": "论文", "note": "TSEP 方法学与各候选量的对比文献" },
        { "title": "B站搜索: 功率器件 结温测量 热敏参数 红外热成像", "type": "视频", "note": "看实测流程与标定步骤" },
        { "title": "Wikipedia: Junction temperature", "type": "文章", "note": "结温定义与热阻网络模型" }
      ],
      "match_terms": ["tsep", "thermal sensitive", "thermal characterization", "transient thermal impedance", "zth", "infrared thermography", "thermal imaging", "junction temperature measurement", "calorimetric", "热敏电参数", "瞬态热阻抗", "红外热成像", "结温测量"]
    },
    {
      "node_id": "pw.tool.tcad.power",
      "name": "功率器件 TCAD 建模",
      "kind": "tool",
      "layer": "工具层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["tool.tcad.device", "pw.bv.drift"],
      "evidence_of_mastery": "能为一种新材料搭建含雪崩与电热耦合的功率 MOSFET TCAD 模型，并说明每个关键材料参数的取值来源",
      "description": "功率器件仿真比逻辑器件仿真多出四件事：①材料参数库——禁带宽度、介电常数、临界场强、迁移率模型（含掺杂/温度/电场依赖）、不完全电离参数、异质结带阶，每个参数都要有文献出处；②雪崩击穿模型——电离系数按材料取值，它直接决定仿真出的 BV，取值错则全部耐压结论失效；③电热耦合——打开晶格热流方程，否则自热、迁移率退化与短路过程全错；④网格策略——几十微米的漂移区与亚微米级的沟道共存，必须在沟道/氧化层界面局部加密，同时控制总网格量。本论文的静态、动态与短路结论全部来自这一类仿真，因此判断其可信度，第一步就是核查这四个部分的参数来源与校准方式。",
      "resources": [
        { "title": "Synopsys Sentaurus Device 用户手册（材料参数与物理模型章节）", "type": "工具", "note": "搜索 'Sentaurus Device user guide physics models'；宽禁带材料参数库的标准参考" },
        { "title": "Silvaco ATLAS 用户手册（宽禁带材料模型章节）", "type": "工具", "note": "搜索 'Silvaco ATLAS manual GaN SiC material models'" },
        { "title": "Google Scholar 检索: TCAD simulation Ga2O3 MOSFET calibration", "type": "论文", "note": "优先看明确写出雪崩电离系数与热参数取值的论文" },
        { "title": "B站搜索: TCAD 功率器件 仿真 Sentaurus Silvaco", "type": "视频", "note": "功率器件建模的完整流程演示" }
      ],
      "match_terms": ["tcad", "simulation", "simulated", "sentaurus", "silvaco", "atlas", "device simulation", "numerical simulation", "avalanche model", "ionization coefficient", "lattice temperature", "electro-thermal simulation", "material parameter", "mesh", "model", "仿真", "数值模拟", "雪崩模型", "电热耦合", "网格"]
    },
    {
      "node_id": "pw.tool.lossmodel",
      "name": "损耗建模与电路级评估",
      "kind": "tool",
      "layer": "工具层",
      "domain_id": "power.wbg",
      "scope": "domain",
      "prerequisites": ["pw.switching.dyn", "pw.perf.compare"],
      "evidence_of_mastery": "能对一个给定拓扑与工况算出总损耗，并指出损耗的主导项",
      "description": "器件级指标最终要落到系统级才有意义。做法是把器件的 Ron、Qg、Coss、trr/Qrr 与温度系数代入目标拓扑（两电平换流器、三电平 NPC/ANPC、MMC）与工况（母线电压、开关频率、负载电流、功率因数、结温），分别算出导通损耗、开关损耗、反向恢复损耗与驱动损耗，再叠加得到总损耗与效率。这一步才能回答「这个器件在这个应用里到底是否更优」——中压牵引变流器开关频率低，导通损耗主导，Ron,sp 低的 Ga2O3 优势明显；而高频电源里开关损耗主导，结论可能反转。常用工具：PLECS、PSIM、Saber，或 LTspice 配合厂商 SPICE 模型。",
      "resources": [
        { "title": "PLECS 官方损耗计算教程（Loss Calculation）", "type": "工具", "note": "搜索 'PLECS loss calculation thermal model tutorial'；把 datasheet 曲线变成损耗模型的标准流程" },
        { "title": "Baliga《Fundamentals of Power Semiconductor Devices》损耗与效率章节", "type": "教材", "note": "[经典教材] 各损耗分量的解析式" },
        { "title": "B站搜索: 变换器 损耗计算 PLECS 效率", "type": "视频", "note": "从器件参数到系统效率的完整算例" }
      ],
      "match_terms": ["loss model", "power loss", "loss calculation", "plecs", "psim", "saber", "spice", "converter", "topology", "mmc", "npc", "efficiency", "system level", "application", "损耗建模", "损耗计算", "效率", "拓扑", "电路级", "系统级"]
    }
  ],
  "edges": [
    { "from": "sp.crystal", "to": "pw.material.wbg", "type": "hard", "reason": "能带与禁带宽度是宽禁带材料概念的物理前提", "skippable": false },
    { "from": "pw.material.wbg", "to": "pw.material.sic", "type": "hard", "reason": "先建立四参数评价框架，再看具体材料", "skippable": false },
    { "from": "pw.material.wbg", "to": "pw.material.ga2o3", "type": "hard", "reason": "先建立四参数评价框架，再看具体材料", "skippable": false },
    { "from": "pw.material.sic", "to": "pw.material.ga2o3", "type": "soft", "reason": "SiC 是成熟基线，先懂它更容易看清 Ga2O3 的差异所在", "skippable": true },
    { "from": "sp.pn.breakdown", "to": "pw.bv.drift", "type": "hard", "reason": "击穿机制与临界场强是漂移区设计的直接依据", "skippable": false },
    { "from": "pw.material.wbg", "to": "pw.bv.drift", "type": "hard", "reason": "临界场强来自材料，耐压设计必须先知道用哪种材料", "skippable": false },
    { "from": "sp.mosfet.vth", "to": "pw.mos.planar", "type": "hard", "reason": "平面栅元胞的工作前提是理解阈值电压与反型层", "skippable": false },
    { "from": "pw.bv.drift", "to": "pw.mos.planar", "type": "hard", "reason": "元胞尺寸与漂移区参数互为约束", "skippable": false },
    { "from": "sp.mosfet.iv", "to": "pw.ron.decomp", "type": "hard", "reason": "导通电阻分解建立在 I-V 特性之上", "skippable": false },
    { "from": "pw.mos.planar", "to": "pw.ron.decomp", "type": "hard", "reason": "必须先有元胞结构的电流路径，才能分段谈电阻", "skippable": false },
    { "from": "pw.bv.drift", "to": "pw.fom.baliga", "type": "hard", "reason": "优值公式的两个变量之一是击穿电压", "skippable": false },
    { "from": "pw.ron.decomp", "to": "pw.fom.baliga", "type": "hard", "reason": "优值公式的另一个变量是比导通电阻", "skippable": false },
    { "from": "pw.mos.planar", "to": "pw.mos.trench", "type": "hard", "reason": "沟槽栅是相对平面栅的改进，需先懂平面栅的短板", "skippable": false },
    { "from": "pw.proc.etch", "to": "pw.mos.trench", "type": "soft", "reason": "了解刻蚀难度有助于理解沟槽栅在 Ga2O3 上为何迟迟不成熟", "skippable": true },
    { "from": "sp.mos.cap", "to": "pw.switching.dyn", "type": "hard", "reason": "开关过程由器件电容与栅电荷决定", "skippable": false },
    { "from": "pw.ron.decomp", "to": "pw.switching.dyn", "type": "hard", "reason": "总损耗 = 导通损耗 + 开关损耗，需先懂前者", "skippable": false },
    { "from": "sp.pn.bias", "to": "pw.bodydiode.rr", "type": "hard", "reason": "反向恢复是 PN 结非平衡态的开关瞬态表现", "skippable": false },
    { "from": "pw.switching.dyn", "to": "pw.bodydiode.rr", "type": "hard", "reason": "反向恢复发生在换流过程中，属于开关瞬态的一部分", "skippable": false },
    { "from": "pw.proc.doping", "to": "pw.bodydiode.rr", "type": "soft", "reason": "懂「Ga2O3 无 p 型掺杂」才能理解它的体二极管为何走单极路线", "skippable": true },
    { "from": "pw.material.ga2o3", "to": "pw.thermal", "type": "hard", "reason": "热导率是材料属性，必须先知道数值与各向异性", "skippable": false },
    { "from": "pw.material.sic", "to": "pw.thermal", "type": "soft", "reason": "以 SiC 的高热导率作参照，才能量化 Ga2O3 的散热差距", "skippable": true },
    { "from": "pw.switching.dyn", "to": "pw.sc.robustness", "type": "hard", "reason": "短路是极端工况下的电流-电压同时应力，需先懂正常开关", "skippable": false },
    { "from": "pw.thermal", "to": "pw.sc.robustness", "type": "hard", "reason": "短路耐量的时间常数由热导率与热容决定", "skippable": false },
    { "from": "pw.hetero.integration", "to": "pw.sc.robustness", "type": "soft", "reason": "异质集成是提升短路耐量的主要工程手段", "skippable": true },
    { "from": "sp.mos.cap", "to": "pw.gateoxide", "type": "hard", "reason": "栅氧问题本质是 MOS 电容的界面与击穿问题", "skippable": false },
    { "from": "sp.mosfet.vth", "to": "pw.gateoxide", "type": "hard", "reason": "界面态造成阈值电压漂移，需先懂阈值电压", "skippable": false },
    { "from": "pw.mos.planar", "to": "pw.gateoxide", "type": "soft", "reason": "平面栅在阻断态下的氧化层电场分担问题是结构特有的", "skippable": true },
    { "from": "pw.fom.baliga", "to": "pw.perf.compare", "type": "hard", "reason": "对比方法学的核心工具就是优值归一化", "skippable": false },
    { "from": "pw.switching.dyn", "to": "pw.perf.compare", "type": "hard", "reason": "同口径对比必须同时覆盖静态与动态指标", "skippable": false },
    { "from": "pw.app.mv", "to": "pw.perf.compare", "type": "soft", "reason": "先明确电压等级与应用工况，对比才有意义", "skippable": true },
    { "from": "pw.app.mv", "to": "pw.bv.drift", "type": "soft", "reason": "知道目标电压等级，才好判断漂移区设计的取舍", "skippable": true },
    { "from": "proc.deposition", "to": "pw.proc.growth", "type": "hard", "reason": "外延生长是薄膜沉积在功率器件场景下的专门化", "skippable": false },
    { "from": "pw.material.wbg", "to": "pw.proc.growth", "type": "hard", "reason": "生长方式的选择由材料体系决定（熔体法 vs 升华法）", "skippable": false },
    { "from": "proc.implant", "to": "pw.proc.doping", "type": "hard", "reason": "宽禁带掺杂主要靠离子注入加高温退火激活", "skippable": false },
    { "from": "pw.material.ga2o3", "to": "pw.proc.doping", "type": "hard", "reason": "「无 p 型掺杂」这一约束来自材料的受主能级", "skippable": false },
    { "from": "proc.etch", "to": "pw.proc.etch", "type": "hard", "reason": "通用刻蚀原理之上叠加宽禁带材料的特殊性", "skippable": false },
    { "from": "pw.material.sic", "to": "pw.proc.etch", "type": "soft", "reason": "SiC 的化学惰性是刻蚀难度的来源", "skippable": true },
    { "from": "proc.deposition", "to": "pw.proc.ohmic", "type": "hard", "reason": "金属化属于薄膜沉积工艺", "skippable": false },
    { "from": "pw.proc.doping", "to": "pw.proc.ohmic", "type": "soft", "reason": "接触电阻强烈依赖表面掺杂浓度", "skippable": true },
    { "from": "sp.pn.breakdown", "to": "pw.proc.termination", "type": "hard", "reason": "边缘终端解决的是电场集中导致的提前击穿", "skippable": false },
    { "from": "pw.bv.drift", "to": "pw.proc.termination", "type": "hard", "reason": "终端方案的设计目标是达到一维理论耐压", "skippable": false },
    { "from": "pw.proc.doping", "to": "pw.proc.termination", "type": "soft", "reason": "无 p 型掺杂使 JTE 实现方式受限，这是 Ga2O3 终端难做的根因", "skippable": true },
    { "from": "pw.proc.growth", "to": "pw.hetero.integration", "type": "hard", "reason": "异质集成的前提是先有可用的器件层/外延层", "skippable": false },
    { "from": "pw.thermal", "to": "pw.hetero.integration", "type": "hard", "reason": "异质集成的动机是热管理，需先理解热瓶颈", "skippable": false },
    { "from": "char.iv", "to": "pw.char.dyn", "type": "hard", "reason": "动态参数提取建立在静态测试能力之上", "skippable": false },
    { "from": "pw.switching.dyn", "to": "pw.char.dyn", "type": "hard", "reason": "测什么由开关过程的物理分段决定", "skippable": false },
    { "from": "pw.thermal", "to": "pw.char.thermal", "type": "hard", "reason": "测什么由热网络的物理模型决定", "skippable": false },
    { "from": "char.iv", "to": "pw.char.thermal", "type": "soft", "reason": "热敏电参数法本身就是借用静态 I-V 量作温度计", "skippable": true },
    { "from": "tool.tcad.device", "to": "pw.tool.tcad.power", "type": "hard", "reason": "通用器件仿真能力之上叠加功率器件特有的四类模型", "skippable": false },
    { "from": "pw.bv.drift", "to": "pw.tool.tcad.power", "type": "hard", "reason": "雪崩模型与漂移区网格策略由耐压需求决定", "skippable": false },
    { "from": "pw.switching.dyn", "to": "pw.tool.lossmodel", "type": "hard", "reason": "损耗模型的输入就是器件的开关与导通参数", "skippable": false },
    { "from": "pw.perf.compare", "to": "pw.tool.lossmodel", "type": "soft", "reason": "系统级损耗是「同口径对比」的最终落点", "skippable": true }
  ]
};
