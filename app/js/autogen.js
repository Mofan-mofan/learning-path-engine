// ============================================================
// js/autogen.js —— 从 DOI 到一篇「完整可用」的论文记录
//
// 这是整条自动流水线的编排层，把三个模块串起来：
//   Literature.fetchPaper(doi)   抓元数据（Crossref + OpenAlex）
//   PathGen.classifyPools(paper) 判定领域归属（该用哪几个节点池）
//   PathGen.generate(paper)      生成路径、节点足迹、诊断信息
//   draftRubric / draftTasks     起草 Rubric 判据与练习任务
//
// 哪些是自动的、哪些不是，必须说清楚（界面上也会标出来）：
//   自动：题录、摘要、作者与机构、领域归属、节点选择、主轴/分支、
//         拓扑排序、Rubric 的节点足迹、练习骨架、五类相关文献推荐
//   不自动：节点本身的知识内容（description / resources / 掌握标准）
//           —— 这些来自 data/nodes-*.js 的节点池，是人工/AI 事先写好的。
//           换句话说，引擎能自动决定「读这篇论文要学哪些知识点、按什么
//           顺序学、去哪找资料、该读哪些相关文献」，但知识点本身的讲解
//           质量取决于节点池的覆盖度和质量。
//   半自动：Rubric 判据文字与练习任务。导入时只能生成通用模板，
//           因为写得具体需要论文正文里的真实数字。想要高质量版本，
//           用「导出」把记录交给 AI 按论文内容改写，再存回论文库。
// ============================================================
window.AutoGen = (function () {

  // 根据节点足迹查节点名，用于把模板文字写得具体一点
  function namesOf(ids, nodeMap) {
    return (ids || []).map(function (id) {
      return nodeMap[id] ? nodeMap[id].name : id;
    });
  }

  // ---------- 起草 Rubric ----------
  // 判据文字只能是通用模板：具体到「能算出 2.53 GW/cm²」这种，
  // 必须读到论文正文才写得出来。这里如实标注 rubric_source='auto'。
  function draftRubric(res, nodeMap) {
    var N = res.footprints;
    var L = [
      {
        level: 1, name: "复述",
        evidence: "能说出这篇论文解决了什么问题、用了什么方法、主要结论是什么",
        hint: "关注节点：" + namesOf(N[1], nodeMap).join("、"),
        uses_nodes: N[1]
      },
      {
        level: 2, name: "复现",
        evidence: "能复现论文的核心计算或仿真结果，并说明每个输入参数的来源",
        hint: "需要用到：" + namesOf(N[2], nodeMap).join("、"),
        uses_nodes: N[2]
      },
      {
        level: 3, name: "批判",
        evidence: "能指出论文假设的局限、结论的适用边界，以及未被解释或未被讨论的现象",
        hint: "从这些角度切入：" + namesOf(N[3], nodeMap).join("、"),
        uses_nodes: N[3]
      },
      {
        level: 4, name: "推进",
        evidence: "能提出一条可验证的改进方向，说明预期收益、代价与最小成本的验证方案",
        hint: "可往这些方向推进：" + namesOf(N[4], nodeMap).join("、"),
        uses_nodes: N[4]
      }
    ];
    return { levels: L, rubric_source: "auto" };
  }

  // ---------- 起草练习任务 ----------
  function draftTasks(paper, res, nodeMap) {
    var N = res.footprints;
    var iid = paper.instance_id;
    var shortTitle = paper.title.length > 60 ? paper.title.slice(0, 60) + "…" : paper.title;

    function make(taskId, level, type, title, instructions, success) {
      return {
        task_id: taskId,
        title: title,
        type: type,
        instructions: instructions,
        success_criteria: success,
        targets: N[level],
        bridges_to: { instance_id: iid, level: level }
      };
    }

    var base = "task." + iid.replace(/[^a-z0-9]/gi, "").slice(-16);

    return {
      tasks: [
        make(base + ".l1", 1, "recall", "L1 复述：这篇论文讲了什么",
          "只读标题、摘要和结论，用自己的话回答：\n" +
          "1. 论文要解决的问题是什么？\n" +
          "2. 用的方法是什么（实验 / 仿真 / 建模 / 综述）？\n" +
          "3. 主要结论有哪几条？\n" +
          "4. 这些结论的证据强度如何——是实测数据、仿真结果，还是作者推断？\n\n" +
          "涉及节点：" + namesOf(N[1], nodeMap).join("、"),
          "四问都能答，且第 4 问能明确区分证据类型"),

        make(base + ".l2", 2, "implementation", "L2 复现：把论文的核心结果算一遍",
          "1. 找出论文最核心的一个定量结论（一个公式、一个关键参数、或一张主图）。\n" +
          "2. 自己独立算一遍或复现一遍，不许直接抄论文的数字。\n" +
          "3. 与论文对比，算出偏差，并解释偏差来自哪里（取值不同 / 模型简化 / 单位换算 / 我算错了）。\n\n" +
          "需要用到：" + namesOf(N[2], nodeMap).join("、"),
          "偏差能被解释清楚；说不出偏差来源就说明还没真正复现"),

        make(base + ".l3", 3, "critique", "L3 批判：这篇论文的结论能信几分",
          "1. 列出至少 3 个直接决定结论、但你无法从论文中独立验证的输入（材料参数、工艺条件、模型假设、测试条件）。\n" +
          "2. 对每一个判断：它偏差 20% 会不会翻转结论？\n" +
          "3. 论文的结论在什么条件下不成立？作者有没有把适用边界说清楚？\n" +
          "4. 摘要或结论里有没有表述含糊、量纲不清、归属不明的地方？回到正文核对。\n\n" +
          "从这些角度切入：" + namesOf(N[3], nodeMap).join("、"),
          "能指出至少 3 个不可验证的输入并给出灵敏度判断；能指出至少 1 处表述不清"),

        make(base + ".l4", 4, "design", "L4 推进：给出一个可验证的改进方向",
          "1. 这篇论文留下的最大短板是什么？\n" +
          "2. 提出一条改进路线，说明物理依据。\n" +
          "3. 定量估算预期收益（不要只说「会改善」）。\n" +
          "4. 说清代价：工艺复杂度、成本、良率、引入的新风险。\n" +
          "5. 设计一个最小成本的验证方案（仿真或实验）。\n" +
          "6. 换一个视角：如果这条路线成立，最先落地的应用场景会是什么？\n\n" +
          "可往这些方向推进：" + namesOf(N[4], nodeMap).join("、"),
          "方案在物理上成立、有定量估算、代价说清楚、验证路径可执行" )
      ],
      tasks_source: "auto"
    };
  }

  // ---------- 组装成一条完整的论文记录 ----------
  function buildRecord(paper, res) {
    var nodeMap = {};
    res.nodes.forEach(function (n) { nodeMap[n.node_id] = n; });

    var rubric = draftRubric(res, nodeMap);
    var drafted = draftTasks(paper, res, nodeMap);

    var record = Object.assign({}, paper, {
      short_title: (paper.title || "").length > 34
        ? (paper.title || "").slice(0, 34) + "…"
        : (paper.title || ""),
      path_source: "auto",
      path_generated_at: new Date().toISOString().slice(0, 16).replace("T", " "),
      focus_nodes: paper.focus_nodes || [],
      difficulty_tier: guessTier(res),
      rubric: rubric,
      practice_tasks: drafted.tasks,
      rubric_source: "auto",
      tasks_source: "auto",
      // 只存摘要信息，不存整张图：路径每次打开都会按同一套规则重算，
      // 结果一致（算法是确定性的，不含随机数），存图反而容易和代码失同步。
      path_summary: res.summary,
      implied_prerequisites: res.implied_prerequisites
    });
    return record;
  }

  // 难度分档的经验判断：需要补的前置越多、延伸方向越多，说明这篇论文越靠后沿
  function guessTier(res) {
    var s = res.summary;
    var tier = 1;
    if (s.seedCount >= 6) tier = 2;
    if (s.seedCount >= 12 || s.prereqCount >= 12) tier = 3;
    if (s.seedCount >= 18 && s.prereqCount >= 16) tier = 4;
    return tier;
  }

  // ---------- 主入口：DOI → 论文记录 ----------
  // onStage(text) 用于把进度回报给界面
  function importFromDoi(doi, onStage) {
    var say = onStage || function () {};
    say("正在从 Crossref / OpenAlex 抓取题录与摘要…");

    return window.Literature.fetchPaper(doi).then(function (paper) {
      if (!paper.title) throw new Error("接口返回了空标题，这个 DOI 可能不存在");

      say("抓取成功，正在判定所属领域…");
      // fetchPaper 里已经算过 pools，这里只是把它记下来便于界面展示
      paper.pools = paper.pools && paper.pools.length ? paper.pools : window.APP_CONFIG.pools.slice();

      say("正在按标题 + 摘要 + 主题词匹配知识点、生成学习路径…");
      var res = window.PathGen.generate(paper, paper.pools);
      if (!res.nodes.length) {
        throw new Error("一个知识点都没匹配上。这篇论文可能不属于当前节点池覆盖的领域" +
                        "（现有池：" + window.APP_CONFIG.pools.join("、") + "）");
      }

      var record = buildRecord(paper, res);
      record.generation = {
        pools: paper.pools.slice(),
        summary: res.summary,
        at: record.path_generated_at
      };
      return { paper: record, result: res };
    });
  }

  return {
    importFromDoi: importFromDoi,
    buildRecord: buildRecord,
    draftRubric: draftRubric,
    draftTasks: draftTasks
  };
})();
