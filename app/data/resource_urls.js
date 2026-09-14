// 学习资源链接覆盖层：键 = "node_id|资源标题"，值 = 点击跳转的 URL。
// 约定：Wikipedia 用直接词条页；B站用站内搜索页；教材/课程/工具/论文用检索页（保证点击必达）。
// 增补/改链接只改这个文件，无需动 nodes-*.js 或代码。
// 注意：这里目前只覆盖 IC 器件方向（sp./dev./proc./char./tool.）的资源，
// 宽禁带功率器件方向（pw.）的节点还没登记，点开会走 app.js 里的兜底检索链接。
window.RESOURCE_URLS = {
  // ---- 基础层 ----
  'sp.crystal|《半导体物理与器件》Neamen 第1章': 'https://www.bing.com/search?q=半导体物理与器件+Neamen+晶体结构+能带',
  'sp.crystal|B站: 半导体物理 能带理论': 'https://search.bilibili.com/all?keyword=半导体物理+能带理论',
  'sp.crystal|Wikipedia: Band structure': 'https://en.wikipedia.org/wiki/Band_structure',

  'sp.carrier.stats|《半导体物理与器件》Neamen 第3-4章': 'https://www.bing.com/search?q=Neamen+半导体物理+费米能级+载流子浓度',
  'sp.carrier.stats|中国大学MOOC: 半导体物理学': 'https://www.bing.com/search?q=半导体物理学+中国大学MOOC',
  'sp.carrier.stats|B站: 费米能级 载流子浓度': 'https://search.bilibili.com/all?keyword=费米能级+载流子浓度',

  'sp.carrier.transport|《半导体物理与器件》Neamen 第5章': 'https://www.bing.com/search?q=Neamen+半导体+漂移扩散+迁移率',
  'sp.carrier.transport|MIT OCW 6.013': 'https://www.bing.com/search?q=MIT+OCW+6.013+Electromagnetics',
  'sp.carrier.transport|B站: 载流子漂移扩散 迁移率': 'https://search.bilibili.com/all?keyword=载流子+漂移+扩散+迁移率',

  'sp.pn.equilibrium|《半导体物理与器件》Neamen 第7章': 'https://www.bing.com/search?q=Neamen+PN结+内建电势+耗尽层',
  'sp.pn.equilibrium|Pierret《半导体器件基础》第5章': 'https://www.bing.com/search?q=Pierret+半导体器件基础+PN结',
  'sp.pn.equilibrium|B站: PN结 耗尽层 内建电场': 'https://search.bilibili.com/all?keyword=PN结+耗尽层+内建电场',
  'sp.pn.equilibrium|Wikipedia: p–n junction': 'https://en.wikipedia.org/wiki/P%E2%80%93n_junction',

  'sp.pn.bias|《半导体物理与器件》Neamen 第8章': 'https://www.bing.com/search?q=Neamen+PN结+正向偏置+反向偏置',
  'sp.pn.bias|中国大学MOOC: 半导体器件物理': 'https://www.bing.com/search?q=半导体器件物理+中国大学MOOC',
  'sp.pn.bias|B站: PN结正向偏置 反向偏置': 'https://search.bilibili.com/all?keyword=PN结+正向偏置+反向偏置',

  'sp.pn.breakdown|《半导体物理与器件》Neamen 第9章': 'https://www.bing.com/search?q=Neamen+PN结击穿+齐纳+雪崩',
  'sp.pn.breakdown|Wikipedia: Zener diode': 'https://en.wikipedia.org/wiki/Zener_diode',
  'sp.pn.breakdown|Wikipedia: Avalanche breakdown': 'https://en.wikipedia.org/wiki/Avalanche_breakdown',
  'sp.pn.breakdown|B站: PN结击穿 齐纳 雪崩': 'https://search.bilibili.com/all?keyword=PN结+击穿+齐纳+雪崩',

  'sp.mos.cap|《半导体物理与器件》Neamen 第10章': 'https://www.bing.com/search?q=Neamen+MOS电容+C-V特性',
  'sp.mos.cap|Pierret《半导体器件基础》第8章': 'https://www.bing.com/search?q=Pierret+MOS+电容',
  'sp.mos.cap|B站: MOS电容 C-V曲线': 'https://search.bilibili.com/all?keyword=MOS电容+CV曲线',

  'sp.mosfet.iv|《半导体物理与器件》Neamen 第11-12章': 'https://www.bing.com/search?q=Neamen+MOSFET+IV特性+推导',
  'sp.mosfet.iv|Razavi《模拟CMOS集成电路设计》第3章': 'https://www.bing.com/search?q=Razavi+模拟CMOS集成电路设计',
  'sp.mosfet.iv|中国大学MOOC: 微电子器件': 'https://www.bing.com/search?q=微电子器件+MOSFET+中国大学MOOC',
  'sp.mosfet.iv|B站: MOSFET I-V特性推导': 'https://search.bilibili.com/all?keyword=MOSFET+IV特性+推导',

  'sp.mosfet.vth|《半导体物理与器件》Neamen 第11章': 'https://www.bing.com/search?q=Neamen+阈值电压+Vth+推导',
  'sp.mosfet.vth|B站: 阈值电压 推导 MOSFET': 'https://search.bilibili.com/all?keyword=阈值电压+MOSFET+推导',
  'sp.mosfet.vth|Wikipedia: Threshold voltage': 'https://en.wikipedia.org/wiki/Threshold_voltage',

  'sp.mosfet.scaling|《半导体物理与器件》Neamen 第13章': 'https://www.bing.com/search?q=Dennard+scaling+器件缩放',
  'sp.mosfet.scaling|IRDS 路线图': 'https://www.bing.com/search?q=International+Roadmap+for+Devices+and+Systems',
  'sp.mosfet.scaling|B站: 摩尔定律 器件缩放': 'https://search.bilibili.com/all?keyword=摩尔定律+器件缩放+Dennard',

  'sp.mosfet.subthreshold|《半导体物理与器件》Neamen 第12章': 'https://www.bing.com/search?q=亚阈值摆幅+subthreshold+swing+推导',
  'sp.mosfet.subthreshold|B站: 亚阈值摆幅': 'https://search.bilibili.com/all?keyword=亚阈值摆幅',
  'sp.mosfet.subthreshold|Wikipedia: Subthreshold slope': 'https://en.wikipedia.org/wiki/Subthreshold_slope',

  'sp.mosfet.leakage|《半导体物理与器件》Neamen 第12章末尾': 'https://www.bing.com/search?q=CMOS+漏电流+机制+分类',
  'sp.mosfet.leakage|B站: CMOS漏电流 静态功耗': 'https://search.bilibili.com/all?keyword=CMOS+漏电流+静态功耗',
  'sp.mosfet.leakage|Wikipedia: Leakage (electronics)': 'https://en.wikipedia.org/wiki/Leakage_(electronics)',

  // ---- 进阶层 ----
  'dev.shortchannel|《半导体物理与器件》Neamen 第13章': 'https://www.bing.com/search?q=短沟道效应+SCE+DIBL+教材',
  'dev.shortchannel|Taur & Ning《Fundamentals of Modern VLSI Devices》': 'https://www.bing.com/search?q=Taur+Ning+Fundamentals+of+Modern+VLSI+Devices',
  'dev.shortchannel|B站: 短沟道效应 DIBL': 'https://search.bilibili.com/all?keyword=短沟道效应+DIBL',
  'dev.shortchannel|中国大学MOOC: 纳米电子器件': 'https://www.bing.com/search?q=纳米电子器件+先进半导体器件+MOOC',

  'dev.scaling|Taur & Ning 第2章': 'https://www.bing.com/search?q=constant+field+scaling+constant+voltage+scaling',
  'dev.scaling|Dennard et al. 1974 原始论文': 'https://scholar.google.com/scholar?q=Dennard+1974+design+of+ion-implanted+MOSFETs',
  'dev.scaling|B站: Dennard缩放': 'https://search.bilibili.com/all?keyword=Dennard+缩放',

  'dev.soi|《半导体物理与器件》Neamen 第13章（SOI部分）': 'https://www.bing.com/search?q=SOI+器件+FD-SOI+原理',
  'dev.soi|Wikipedia: Silicon on insulator': 'https://en.wikipedia.org/wiki/Silicon_on_insulator',
  'dev.soi|B站: SOI器件 FD-SOI': 'https://search.bilibili.com/all?keyword=SOI+FD-SOI',

  'dev.finfet|Hu et al. 1999 FinFET 奠基论文': 'https://scholar.google.com/scholar?q=FinFET+a+self-aligned+double-gate+MOSFET+Hu+1999',
  'dev.finfet|B站: FinFET结构 工作原理': 'https://search.bilibili.com/all?keyword=FinFET+结构+工作原理',
  'dev.finfet|IEEE Spectrum: The FinFET Revolution': 'https://www.bing.com/search?q=IEEE+Spectrum+FinFET+revolution',
  'dev.finfet|Wikipedia: Multigate transistor': 'https://en.wikipedia.org/wiki/Multigate_transistor',

  'dev.gaa|Wikipedia: Multigate device (GAA)': 'https://en.wikipedia.org/wiki/Multigate_transistor',
  'dev.gaa|IEDM/VLSI 论文': 'https://scholar.google.com/scholar?q=GAA+nanosheet+transistor+IEDM',
  'dev.gaa|B站: GAA 全环绕栅极': 'https://search.bilibili.com/all?keyword=GAA+全环绕栅极',
  'dev.gaa|三星/Intel 官方技术': 'https://www.bing.com/search?q=Samsung+GAA+3nm+RibbonFET',

  'dev.hkmg|《半导体物理与器件》Neamen 第13章': 'https://www.bing.com/search?q=高K金属栅+HKMG+原理',
  'dev.hkmg|Wikipedia: High-k dielectric': 'https://en.wikipedia.org/wiki/High-%CE%BA_dielectric',
  'dev.hkmg|B站: 高K金属栅 HKMG': 'https://search.bilibili.com/all?keyword=高K金属栅+HKMG',

  'dev.strain|Wikipedia: Strained silicon': 'https://en.wikipedia.org/wiki/Strained_silicon',
  'dev.strain|Taur & Ning 第4章': 'https://www.bing.com/search?q=strained+silicon+mobility+enhancement',
  'dev.strain|B站: 应变硅 迁移率增强': 'https://search.bilibili.com/all?keyword=应变硅+迁移率',

  'dev.silicidation|《VLSI制造技术》硅化物章节': 'https://www.bing.com/search?q=硅化物+salicide+自对准+工艺',
  'dev.silicidation|Wikipedia: Silicide': 'https://en.wikipedia.org/wiki/Silicide',
  'dev.silicidation|B站: 硅化物 自对准': 'https://search.bilibili.com/all?keyword=硅化物+salicide',

  'dev.contact|《半导体物理与器件》Neamen 第14章': 'https://www.bing.com/search?q=欧姆接触+肖特基接触+金属半导体',
  'dev.contact|Wikipedia: Schottky barrier': 'https://en.wikipedia.org/wiki/Schottky_barrier',
  'dev.contact|B站: 欧姆接触 肖特基势垒': 'https://search.bilibili.com/all?keyword=欧姆接触+肖特基势垒',

  'dev.reliability|可靠性综述论文': 'https://scholar.google.com/scholar?q=NBTI+HCI+TDDB+reliability+review',
  'dev.reliability|Wikipedia: Negative-bias temperature instability': 'https://en.wikipedia.org/wiki/Negative-bias_temperature_instability',
  'dev.reliability|B站: 器件可靠性 NBTI HCI': 'https://search.bilibili.com/all?keyword=器件可靠性+NBTI+HCI',

  // ---- 工艺层 ----
  'proc.litho|《VLSI制造技术》光刻章节': 'https://www.bing.com/search?q=光刻+瑞利公式+分辨率+EUV',
  'proc.litho|Wikipedia: Photolithography': 'https://en.wikipedia.org/wiki/Photolithography',
  'proc.litho|Wikipedia: EUV lithography': 'https://en.wikipedia.org/wiki/Extreme_ultraviolet_lithography',
  'proc.litho|B站: 光刻工艺 EUV 多重曝光': 'https://search.bilibili.com/all?keyword=光刻+EUV+多重曝光',
  'proc.litho|ASML 官方技术介绍': 'https://www.bing.com/search?q=ASML+lithography+principles',

  'proc.etch|《VLSI制造技术》刻蚀章节': 'https://www.bing.com/search?q=干法刻蚀+湿法刻蚀+等离子体',
  'proc.etch|Wikipedia: Etching (microfabrication)': 'https://en.wikipedia.org/wiki/Etching_(microfabrication)',
  'proc.etch|B站: 半导体刻蚀 干法 湿法': 'https://search.bilibili.com/all?keyword=半导体+刻蚀+干法+湿法',

  'proc.deposition|《VLSI制造技术》薄膜沉积章节': 'https://www.bing.com/search?q=CVD+PVD+ALD+薄膜沉积+区别',
  'proc.deposition|Wikipedia: Chemical vapor deposition': 'https://en.wikipedia.org/wiki/Chemical_vapor_deposition',
  'proc.deposition|B站: 薄膜沉积 CVD PVD ALD': 'https://search.bilibili.com/all?keyword=薄膜沉积+CVD+PVD+ALD',

  'proc.implant|《VLSI制造技术》离子注入章节': 'https://www.bing.com/search?q=离子注入+原理+退火+掺杂',
  'proc.implant|Wikipedia: Ion implantation': 'https://en.wikipedia.org/wiki/Ion_implantation',
  'proc.implant|B站: 离子注入 掺杂 退火': 'https://search.bilibili.com/all?keyword=离子注入+掺杂+退火',

  'proc.anneal|《VLSI制造技术》退火章节': 'https://www.bing.com/search?q=快速热退火+RTA+激光退火',
  'proc.anneal|B站: 半导体退火 RTA': 'https://search.bilibili.com/all?keyword=半导体+退火+RTA',
  'proc.anneal|Wikipedia: Rapid thermal processing': 'https://en.wikipedia.org/wiki/Rapid_thermal_processing',

  'proc.cmp|《VLSI制造技术》CMP章节': 'https://www.bing.com/search?q=CMP+化学机械抛光+原理',
  'proc.cmp|Wikipedia: Chemical mechanical polishing': 'https://en.wikipedia.org/wiki/Chemical-mechanical_polishing',
  'proc.cmp|B站: CMP 化学机械抛光': 'https://search.bilibili.com/all?keyword=CMP+化学机械抛光',

  'proc.integration|《VLSI制造技术》工艺集成章节': 'https://www.bing.com/search?q=CMOS+工艺流程+工艺集成',
  'proc.integration|B站: CMOS工艺流程 FinFET制造': 'https://search.bilibili.com/all?keyword=CMOS+工艺流程+FinFET+制造',
  'proc.integration|FinFET 集成论文': 'https://scholar.google.com/scholar?q=FinFET+process+integration+IEDM',

  // ---- 表征层 ----
  'char.iv|Keithley 4200 用户手册': 'https://www.bing.com/search?q=Keithley+4200-SCS+user+manual',
  'char.iv|《半导体器件表征技术》': 'https://www.bing.com/search?q=半导体器件表征+IV+CV+测量',
  'char.iv|B站: 半导体参数测试 I-V测量': 'https://search.bilibili.com/all?keyword=半导体+参数测试+IV测量',

  'char.cv|《半导体器件表征技术》': 'https://www.bing.com/search?q=MOS电容+CV+表征+界面态',
  'char.cv|B站: C-V测量 MOS电容表征': 'https://search.bilibili.com/all?keyword=CV测量+MOS电容+表征',
  'char.cv|Wikipedia: MOS capacitor': 'https://en.wikipedia.org/wiki/MOS_capacitor',

  'char.vth.extract|《半导体器件表征技术》Vth提取章节': 'https://www.bing.com/search?q=阈值电压提取+线性外推+恒定电流法',
  'char.vth.extract|B站: 阈值电压提取': 'https://search.bilibili.com/all?keyword=阈值电压+提取+方法',
  'char.vth.extract|Wikipedia: Threshold voltage': 'https://en.wikipedia.org/wiki/Threshold_voltage',

  // ---- 工具层 ----
  'tool.tcad.device|Silvaco ATLAS 手册': 'https://www.bing.com/search?q=Silvaco+ATLAS+manual',
  'tool.tcad.device|Synopsys Sentaurus Device 教程': 'https://www.bing.com/search?q=Sentaurus+Device+user+guide',
  'tool.tcad.device|B站: TCAD仿真 MOSFET Silvaco': 'https://search.bilibili.com/all?keyword=TCAD+仿真+MOSFET+Silvaco',
  'tool.tcad.device|中国大学MOOC: 半导体器件仿真': 'https://www.bing.com/search?q=半导体器件仿真+TCAD+MOOC',

  'tool.tcad.process|Silvaco Athena 手册': 'https://www.bing.com/search?q=Silvaco+Athena+process+simulation',
  'tool.tcad.process|B站: TCAD工艺仿真': 'https://search.bilibili.com/all?keyword=TCAD+工艺仿真+Athena',
  'tool.tcad.process|中国大学MOOC: 集成电路工艺仿真': 'https://www.bing.com/search?q=集成电路工艺仿真+MOOC',

  'tool.tcad.calibration|TCAD 校准案例': 'https://www.bing.com/search?q=TCAD+calibration+example+MOSFET',
  'tool.tcad.calibration|B站: TCAD校准': 'https://search.bilibili.com/all?keyword=TCAD+校准',
  'tool.tcad.calibration|器件论文的 TCAD 方法章节': 'https://scholar.google.com/scholar?q=TCAD+calibration+MOSFET+method'
};
