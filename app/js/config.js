// ============================================================
// 全局配置：所有「可调参数」都集中在这里
//
// 想改行为，先改这个文件，不要动 js/ 下面的算法文件。
// 每一项都写了：它是什么、改了会怎样。
// ============================================================
window.APP_CONFIG = {

  // ---------- 存储 ----------
  storage: {
    // 评分按「论文 + 节点」两级存，换论文不会互相覆盖
    scoresKey: "learning-path-scores-v2",
    // 用户自己导入的论文存在这里（localStorage 上限约 5MB，够存几百篇）
    libraryKey: "learning-path-library-v2",
    // 记住上次打开的是哪篇论文
    lastPaperKey: "learning-path-last-paper"
  },

  // ---------- 节点池 ----------
  // 参与自动匹配的节点池。新增一个领域（比如「光电子器件」）时：
  //   1. 在 data/ 下新建 nodes-xxx.js，往 window.NODE_POOLS 里塞一个池
  //   2. 在 index.html 里加一行 <script src="data/nodes-xxx.js">
  //   3. 把 domain_id 加进下面这个数组
  pools: ["ic.device", "power.wbg"],

  layers: ["基础层", "进阶层", "工艺层", "表征层", "工具层"],
  // vis-network 分层布局用的纵向层次（同层号的节点排在同一行）
  layerOrder: { "基础层": 0, "进阶层": 1, "工艺层": 1, "表征层": 2, "工具层": 2 },

  // ---------- 外部接口 ----------
  // 两个接口都返回 access-control-allow-origin: *，所以纯静态页面里可以直接 fetch，
  // 不需要后端服务器。已于 2026-09-12 实测通过。
  api: {
    crossrefBase: "https://api.crossref.org/works/",
    openAlexBase: "https://api.openalex.org/",
    // OpenAlex 的「礼貌池」：带上邮箱就不排限流队列。换成你自己的邮箱更稳。
    mailto: "learning-engine@example.com",
    userAgent: "LearningPathEngine/2.0",
    timeoutMs: 30000,
    // 一次批量请求最多带多少个 OpenAlex ID（官方上限 50）
    batchLimit: 50
  },

  // ---------- 自动路径生成（js/pathgen.js）----------
  // 下面的数字都是「经验值」，按 03-核心Schema设计-v2.0.md 的约定：
  // 并集阈值不做重点，AI 先设经验值，领域间仅小幅差别。
  // 觉得自动生成的路径选多了/选少了，就调这里。
  match: {
    // 一个匹配词在不同位置命中，权重不同（同一个词只取最高的一次，不累加）
    titleWeight: 3.0,      // 命中标题 —— 最强信号，通常是论文主题
    topicWeight: 2.5,      // 命中 OpenAlex 的 topics/keywords/concepts
    abstractWeight: 2.0,   // 只命中摘要 —— 通常是背景或结论里带到的
    manualBoost: 10.0,     // 论文文件里手工指定 focus_nodes 时的强制加权

    // ---- 两条防误命中的规则，配合 js/pathgen.js 的 hit() ----
    // 规范化后长度 ≤ 这个值的纯 ASCII 匹配词（ec / eg / sic / gan / bv / fin）
    // 要求「词首对齐」，否则 'ec' 会命中 "specific"、'sic' 会命中 "physics"。
    // 调大 → 更多词要求整词开头，更保守但可能漏掉粘连写法；调成 0 → 关掉这条规则。
    shortTermLen: 3,
    // 含空格的多词项压扁后至少这么长才做压扁匹配，
    // 否则 "i v"→"iv" 会命中 "gate drive" 压扁后的 "gatedrive"。
    // 调小 → 更容易命中 OpenAlex 粘连文本，也更容易跨词误命中。
    minCollapseLen: 6,

    // 「核心节点」判定门槛：得分 ≥ minSeedScore，
    // 或者（命中词数 ≥ minSeedTerms 且 得分 ≥ minSeedScoreSoft）
    minSeedScore: 3.0,
    minSeedTerms: 2,
    minSeedScoreSoft: 2.0,

    // 数量上限，防止图糊成一团
    maxSeeds: 22,          // 核心节点最多几个
    maxNodes: 48,          // 整张图（含前置与延伸）最多几个节点
    maxFrontier: 8,        // 延伸节点最多几个（固定往外探一跳）

    // 领域归属判定：某池的聚合匹配分 ≥ 最高分 × 这个比例，才算这篇论文的领域。
    // 判为「不属于」的池，它的 scope=shared 节点照样能用（半导体物理、表征、
    // TCAD 这些是通用的），只是它的 domain 专属节点不进候选——
    // 这就是 FinFET/GAA 不会被塞给功率器件论文的原因。
    // 调大 → 更单一领域；调小 → 更容易同时挂上多个领域。
    poolKeepRatio: 0.25
  },

  // ---------- 相关文献推荐（js/literature.js）----------
  recommend: {
    perCategory: 5,        // 每一类最多推荐几篇
    // 「经典文献」门槛：本文引用的文献里，被引数 ≥ 这个值才推荐
    minCitedForClassic: 100,
    // 「同主题高被引」只查最近几年的，避免推一堆上世纪的
    recentYears: 6,

    // 收窄检索用的「概念具体度」门槛。OpenAlex 给每个概念标了 level：
    //   0 = Materials science / Engineering 这类学科级
    //   1 = Optoelectronics 这类分支级
    //   2 = Planar / Voltage 这类属性级
    //   3 = Transistor 这类器件大类
    //   4 = MOSFET 这类具体器件
    // literature.js 的第 ②④ 类推荐，取 level ≥ 这个值里最具体的一个概念，
    // 和 primary_topic 取交集，把「整个材料体系」收窄到「这一类器件」。
    //   调到 4 → 只认最具体的器件概念，最准，但很多论文没有 level 4 的概念，
    //            会退回只用主题（等于没收窄）
    //   调到 2 → Planar / Voltage 这类属性词也会入选，2026-09-12 实测会把
    //            紫外探测器综述、p 型 TeO2 等无关文献放进推荐
    minConceptLevel: 3,

    // 五类推荐信号。全部为 2026-09-12 实测可用的 OpenAlex 查询。
    // 想增删类别，改这里 + literature.js 里对应的 builder 函数。
    categories: [
      { id: "author",     label: "同作者的其它同主题文章", enabled: true },
      { id: "team",       label: "同机构·同方向的文章",     enabled: true },
      { id: "reference",  label: "本文引用的奠基性文献",   enabled: true },
      { id: "topic",      label: "同主题的高被引文献",     enabled: true },
      { id: "citing",     label: "引用本文的后续工作",     enabled: true }
    ],

    // 已验证「不可靠」的信号，代码里明确不用，别再加回来：
    //   · OpenAlex 的 related_works 字段 —— 对本文返回了液晶、场论等
    //     完全无关的结果（它按 "planar" 做了字面匹配）
    //   · 单用 topics.id 过滤 —— 命中 11 万篇，被 ZnO/二维材料淹没，
    //     要用 primary_topic.id 才准
    //   · institutions.lineage 过滤 —— 接口直接返回 400
    //   · 单用 author.id 不过滤主题 —— OpenAlex 的作者消歧不准，
    //     贾仁需的 112 篇里混进了钙钛矿、电化学传感器等无关论文
    //   · 从标题里截前 N 个实词当检索词 —— 截到的是 Static/Dynamic/
    //     Performance/Medium-Voltage/V-6500，真正有信息量的 Ga2O3/SiC/
    //     Planar/Gate/MOSFETs 排在后面被截掉了，实测只命中本文自己
    //   · 只用 primary_topic.id 不加器件概念 —— 它是材料体系级的
    //     （本文 12426 篇），按被引降序拿到的是紫外探测器综述
  },

  // ---------- 界面文案 ----------
  text: {
    // 自动 vs 人工，界面上必须标清楚，不能让人误以为全是机器算出来的
    autoBadge: "自动生成",
    curatedBadge: "人工策划"
  }
};
