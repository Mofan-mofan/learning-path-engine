// ============================================================
// js/app.js —— 界面状态机
//
// 这个文件只管「界面怎么显示、点了按钮做什么」，不算路径、不抓接口：
//   · 路径怎么算   → js/pathgen.js
//   · 文献怎么抓   → js/literature.js
//   · 导入流水线   → js/autogen.js
//   · 数据怎么存   → js/store.js
//   · 阈值/开关    → js/config.js
//
// 一篇论文的显示内容由 computeView() 算出来，分两种模式：
//   curated —— 路径写死在 data/papers.js 里（原来的 FinFET 示例）
//   auto    —— 每次打开都用 pathgen 现算（算法是确定性的，结果稳定）
// ============================================================
const { createApp, ref, reactive, computed, onMounted, watch, nextTick } = Vue;

createApp({
  setup() {
    const CFG = window.APP_CONFIG;

    // ---------- 状态 ----------
    const papers = ref([]);            // 论文库（固化 + 导入）
    const currentId = ref("");         // 当前论文
    const view = ref(null);            // 当前论文算出来的显示内容
    const activeTab = ref("paper");    // 右侧面板：paper | node | lit
    const selectedNode = ref(null);
    const filterLayer = ref("全部");
    const showPath = ref(false);
    const showUnselected = ref(false);
    const showImport = ref(false);
    const graphContainer = ref(null);
    const scores = ref({});            // 当前论文的评分 { node_id: 0-10 }

    const importState = reactive({ doi: "", busy: false, error: "", stage: "", ok: "" });
    const litState = reactive({ busy: false, error: "", data: null, fromCache: false, stage: "" });
    const exportState = reactive({ open: false, title: "", text: "", copied: false });

    let network = null;
    let allNodesById = {};             // 全部池的节点索引，用于跨图查名字

    // ---------- 全部节点索引（只建一次）----------
    function buildNodeIndex() {
      allNodesById = {};
      (CFG.pools || []).forEach(function (pid) {
        const pool = (window.NODE_POOLS || {})[pid];
        if (!pool) return;
        pool.nodes.forEach(function (n) { if (!allNodesById[n.node_id]) allNodesById[n.node_id] = n; });
      });
    }

    const getNodeName = function (nodeId) {
      const n = allNodesById[nodeId];
      return n ? n.name : nodeId;
    };

    // ---------- 评分 ----------
    function loadScores() {
      scores.value = window.Store.getScores(currentId.value);
    }
    const getScore = function (nodeId) { return scores.value[nodeId] || 0; };
    function setScore(nodeId, val) {
      scores.value[nodeId] = val;
      const ok = window.Store.setScore(currentId.value, nodeId, val);
      if (!ok) importState.error = "浏览器存储空间不足，这次的评分没能保存下来";
      updateNodeColors();
    }
    const scoreClass = function (s) { return s >= 7 ? "score-high" : s >= 4 ? "score-mid" : "score-low"; };

    // ---------- Rubric / 练习任务的字段补全 ----------
    // 人工策划的论文里 uses_nodes 和 targets 是写死的；
    // 自动生成的论文只写了判据文字，节点足迹由算法填。
    function normalizeRubric(paper, footprints, nodeIds) {
      const levels = ((paper.rubric || {}).levels || []).map(function (L) {
        let uses = (L.uses_nodes && L.uses_nodes.length) ? L.uses_nodes.slice()
                 : (footprints && footprints[L.level] ? footprints[L.level].slice() : []);
        // 只保留确实在图里的节点，否则就绪度会算出 NaN
        if (nodeIds) uses = uses.filter(function (id) { return nodeIds[id]; });
        return { level: L.level, name: L.name, evidence: L.evidence, hint: L.hint || "", uses_nodes: uses };
      });
      return { levels: levels, source: (paper.rubric || {}).rubric_source || (paper.path_source === "auto" ? "auto" : "curated") };
    }

    function normalizeTasks(paper, footprints, nodeIds) {
      return (paper.practice_tasks || []).map(function (t) {
        const lv = (t.bridges_to || {}).level || t.level || 1;
        let targets = (t.targets && t.targets.length) ? t.targets.slice()
                    : (footprints && footprints[lv] ? footprints[lv].slice() : []);
        if (nodeIds) targets = targets.filter(function (id) { return nodeIds[id]; });
        return Object.assign({}, t, { level: lv, targets: targets });
      });
    }

    // ---------- 算出一篇论文的显示内容 ----------
    function computeView(paper) {
      const pools = (paper.pools && paper.pools.length) ? paper.pools.slice() : CFG.pools.slice();
      const poolNames = pools.map(function (id) {
        return ((window.NODE_POOLS || {})[id] || {}).name || id;
      });

      let v;
      if (paper.path_source === "curated") {
        // 人工策划：显示该领域节点池的全部节点，路径用论文里写死的那份
        const cand = window.PathGen.buildCandidates(pools, { sharedFromAllPools: false });
        const spine = ((paper.path_graph || {}).spine || []).slice();
        const branch = ((paper.path_graph || {}).branches || []).reduce(function (a, b) {
          return a.concat(b.nodes || []);
        }, []);
        const roleOf = {};
        cand.list.forEach(function (n) {
          roleOf[n.node_id] = spine.indexOf(n.node_id) >= 0 ? "spine"
                            : branch.indexOf(n.node_id) >= 0 ? "branch" : "other";
        });
        const rest = cand.list.filter(function (n) { return roleOf[n.node_id] === "other"; })
                              .map(function (n) { return n.node_id; });
        const ordering = spine.concat(branch, rest);
        const idset = {};
        ordering.forEach(function (i) { idset[i] = true; });
        const edges = cand.edges.filter(function (e) { return idset[e.from] && idset[e.to]; });
        v = {
          mode: "curated", paper: paper, pools: pools, poolNames: poolNames,
          nodes: cand.list.filter(function (n) { return idset[n.node_id]; }),
          edges: edges, roleOf: roleOf, diagnostics: {},
          path_graph: { spine: spine, branches: (paper.path_graph || {}).branches || [], ordering: ordering },
          summary: {
            seedCount: spine.length + branch.length, prereqCount: rest.length,
            frontierCount: 0, edgeCount: edges.length,
            hasAbstract: !!(paper.abstract && paper.abstract.length > 80),
            hasTopics: !!((paper.topics || []).length || (paper.keywords || []).length)
          }
        };
      } else {
        // 自动生成：只显示这篇论文真正需要的节点子集
        const res = window.PathGen.generate(paper, pools);
        const roleOf = {}, diagnostics = {};
        res.diagnostics.forEach(function (d) { roleOf[d.node_id] = d.role; diagnostics[d.node_id] = d; });
        v = {
          mode: "auto", paper: paper, pools: pools, poolNames: poolNames,
          nodes: res.nodes, edges: res.edges, roleOf: roleOf, diagnostics: diagnostics,
          path_graph: res.path_graph, footprints: res.footprints,
          implied: res.implied_prerequisites, summary: res.summary
        };
      }

      const nodeIds = {};
      v.nodes.forEach(function (n) { nodeIds[n.node_id] = true; });
      v.rubric = normalizeRubric(paper, v.footprints, nodeIds);
      v.practice_tasks = normalizeTasks(paper, v.footprints, nodeIds);
      v.branchNodes = (v.path_graph.branches || []).reduce(function (a, b) { return a.concat(b.nodes || []); }, []);
      v.pathNodeIds = v.path_graph.spine.concat(v.branchNodes);
      return v;
    }

    // 「显示未选中的节点」开关：把候选池里没被选中的节点也画出来，做对比用
    const displayView = computed(function () {
      const v = view.value;
      if (!v) return null;
      if (!showUnselected.value || v.mode !== "auto") return v;
      const cand = window.PathGen.buildCandidates(v.pools);
      const have = {};
      v.nodes.forEach(function (n) { have[n.node_id] = true; });
      const extra = cand.list.filter(function (n) { return !have[n.node_id]; });
      if (!extra.length) return v;
      const roleOf = Object.assign({}, v.roleOf);
      extra.forEach(function (n) { roleOf[n.node_id] = "unselected"; });
      const nodes = v.nodes.concat(extra);
      const idset = {};
      nodes.forEach(function (n) { idset[n.node_id] = true; });
      return Object.assign({}, v, {
        nodes: nodes, roleOf: roleOf,
        edges: cand.edges.filter(function (e) { return idset[e.from] && idset[e.to]; })
      });
    });

    const currentPaper = computed(function () { return view.value ? view.value.paper : null; });

    // ---------- 进度与就绪度 ----------
    const overallProgress = computed(function () {
      const v = displayView.value;
      if (!v) return 0;
      const ids = v.pathNodeIds;
      if (!ids.length) return 0;
      const total = ids.reduce(function (s, id) { return s + Math.min(getScore(id), 7); }, 0);
      return Math.round(total / (ids.length * 7) * 100);
    });

    const layerProgress = computed(function () {
      const v = displayView.value;
      if (!v) return [];
      return CFG.layers.map(function (name) {
        const nodes = v.nodes.filter(function (n) { return n.layer === name; });
        if (!nodes.length) return { name: name, percent: 0, count: 0 };
        const avg = nodes.reduce(function (s, n) { return s + getScore(n.node_id); }, 0) / nodes.length;
        return { name: name, percent: Math.round(avg / 10 * 100), count: nodes.length };
      }).filter(function (x) { return x.count > 0; });
    });

    // 当前这张图里真实存在的层，工具栏只显示这些按钮
    // （不同论文的节点池层数不一样，写死五个会出现点了没反应的死按钮）
    const availableLayers = computed(function () {
      const v = displayView.value;
      if (!v) return [];
      return CFG.layers.filter(function (name) {
        return v.nodes.some(function (n) { return n.layer === name; });
      });
    });

    const rubricReadiness = computed(function () {
      const v = displayView.value;
      if (!v) return [];
      return v.rubric.levels.map(function (L) {
        const ss = L.uses_nodes.map(getScore);
        if (!ss.length) return { level: L.level, name: L.name, ready: false, detail: "未匹配到节点" };
        const avg = ss.reduce(function (a, b) { return a + b; }, 0) / ss.length;
        const min = Math.min.apply(null, ss);
        const weak = L.uses_nodes.filter(function (id) { return getScore(id) < 5; });
        return {
          level: L.level, name: L.name, evidence: L.evidence, hint: L.hint,
          uses_nodes: L.uses_nodes, ready: avg >= 6 && min >= 4,
          detail: weak.length ? "薄弱：" + weak.map(getNodeName).join("、") : "相关节点均已达标"
        };
      });
    });

    // ---------- 节点详情 ----------
    const isInPath = function (nodeId) {
      const v = displayView.value;
      return !!v && v.pathNodeIds.indexOf(nodeId) >= 0;
    };

    // 这个节点在不在当前这张图里。
    // 节点的 prerequisites 可以跨领域池引用，那种前置点进去能看说明，
    // 但不属于这篇论文的路径，界面上要标灰，别让人以为漏画了。
    const inGraph = function (nodeId) {
      const v = displayView.value;
      return !!v && v.nodes.some(function (n) { return n.node_id === nodeId; });
    };

    const roleLabel = function (nodeId) {
      const v = displayView.value;
      if (!v) return "";
      const map = {
        seed: "核心节点", prereq: "前置节点", frontier: "延伸节点",
        spine: "主轴节点", branch: "分支节点", other: "池内其它节点", unselected: "未被选中"
      };
      return map[v.roleOf[nodeId]] || "";
    };

    // 延伸节点：路径往外一跳，是 L4「推进」级练习的入口
    const frontierNodes = computed(function () {
      const v = displayView.value;
      if (!v) return [];
      return v.nodes.filter(function (n) { return v.roleOf[n.node_id] === "frontier"; });
    });

    // 「分支」区块显示用的列表：把延伸节点剔出去。
    // pathgen 生成的 branch = 全图 − 主轴，延伸节点也在里面，
    // 直接渲染会让同一个节点同时出现在「分支（这篇论文直接考的内容）」
    // 和「延伸（论文没直接考）」两块里，说明文字自相矛盾。
    // 人工策划的论文没有 frontier 这个角色，剔完和原来一样。
    const branchBlocks = computed(function () {
      const v = displayView.value;
      if (!v) return [];
      return (v.path_graph.branches || [])
        .map(function (b) {
          return (b.nodes || []).filter(function (id) { return v.roleOf[id] !== "frontier"; });
        })
        .filter(function (ids) { return ids.length > 0; });
    });

    // 当前选中节点的自动匹配诊断（命中了哪些词、得了多少分）
    // 人工策划的路径不是算出来的，没有诊断信息
    const nodeDiag = computed(function () {
      const v = displayView.value;
      if (!v || !selectedNode.value || v.mode !== "auto") return null;
      return v.diagnostics[selectedNode.value.node_id] || null;
    });

    const getDiagram = function (nodeId) {
      return (window.GRAPH_DIAGRAMS && window.GRAPH_DIAGRAMS[nodeId]) || "";
    };

    // 后继节点：图里依赖这个节点的其它节点（"学完它能去哪"）
    const nextNodes = function (nodeId) {
      const v = displayView.value;
      if (!v) return [];
      return v.edges.filter(function (e) { return e.from === nodeId; })
                    .map(function (e) { return { id: e.to, type: e.type, reason: e.reason }; });
    };

    const prevNodes = function (nodeId) {
      const v = displayView.value;
      if (!v) return [];
      return v.edges.filter(function (e) { return e.to === nodeId; })
                    .map(function (e) { return { id: e.from, type: e.type, reason: e.reason }; });
    };

    const getNodeTasks = function (nodeId) {
      const v = displayView.value;
      if (!v) return [];
      return v.practice_tasks.filter(function (t) { return t.targets.indexOf(nodeId) >= 0; });
    };

    // 学习资源链接：先看人工策划的覆盖层，否则按标题/类型构造检索链接
    const urlForResource = function (nodeId, r) {
      const overlay = window.RESOURCE_URLS && window.RESOURCE_URLS[nodeId + "|" + r.title];
      if (overlay) return overlay;
      const t = (r.title || "").trim();
      if (/^B站(搜索)?[:：]/.test(t)) {
        return "https://search.bilibili.com/all?keyword=" + encodeURIComponent(t.replace(/^B站(搜索)?[:：]\s*/, ""));
      }
      if (/^Wikipedia[:：]/i.test(t)) {
        return "https://en.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(t.replace(/^Wikipedia[:：]\s*/i, "")) + "&go=Go";
      }
      if (/^Google Scholar/i.test(t)) {
        return "https://scholar.google.com/scholar?q=" + encodeURIComponent(t.replace(/^Google Scholar(检索)?[:：]?\s*/i, ""));
      }
      if (r.type === "论文") return "https://scholar.google.com/scholar?q=" + encodeURIComponent(t);
      return "https://www.bing.com/search?q=" + encodeURIComponent(t);
    };

    const kindLabel = function (kind) {
      return { concept: "概念", fact: "事实", procedure: "流程", tool: "工具" }[kind] || kind;
    };

    function selectNodeById(nodeId) {
      const v = displayView.value;
      if (!v) return;
      const node = v.nodes.find(function (n) { return n.node_id === nodeId; }) || allNodesById[nodeId];
      if (!node) return;
      selectedNode.value = node;
      activeTab.value = "node";
    }

    // ---------- 图谱绘制 ----------
    const GROUP_COLORS = {
      spine:      { background: "#fef3c7", border: "#f59e0b" },
      branch:     { background: "#d1fae5", border: "#10b981" },
      seed:       { background: "#dbeafe", border: "#2563eb" },
      prereq:     { background: "#f1f5f9", border: "#94a3b8" },
      frontier:   { background: "#fae8ff", border: "#c026d3" },
      other:      { background: "#f8fafc", border: "#cbd5e1" },
      unselected: { background: "#ffffff", border: "#e2e8f0" }
    };

    function buildGraph() {
      const v = displayView.value;
      if (!v || !graphContainer.value) return;

      const nodes = new vis.DataSet(v.nodes.map(function (n) {
        const role = v.roleOf[n.node_id] || "other";
        return {
          id: n.node_id,
          label: n.name,
          layer: CFG.layerOrder[n.layer] !== undefined ? CFG.layerOrder[n.layer] : 1,
          group: role,
          title: n.layer + " · " + kindLabel(n.kind) + " · " + roleLabel(n.node_id) + "\n评分: " + getScore(n.node_id) + "/10",
          font: { size: 13, face: "Microsoft YaHei, sans-serif", color: role === "unselected" ? "#94a3b8" : "#1e293b" },
          shape: "box",
          margin: { top: 6, bottom: 6, left: 8, right: 8 },
          borderWidth: 2,
          shapeProperties: { borderDashes: role === "frontier" ? [5, 5] : false }
        };
      }));

      const edges = new vis.DataSet(v.edges.map(function (e, i) {
        return {
          id: "edge-" + e.from + "-" + e.to + "-" + i,
          from: e.from, to: e.to, arrows: "to",
          dashes: e.type === "soft",
          color: { color: e.type === "hard" ? "#475569" : "#cbd5e1", highlight: "#2563eb", hover: "#2563eb" },
          width: e.type === "hard" ? 1.5 : 1,
          title: (e.type === "hard" ? "硬依赖（不可跳过）" : "软依赖（可跳过）") + "：" + (e.reason || ""),
          smooth: { type: "cubicBezier", forceDirection: "vertical", roundness: 0.4 }
        };
      }));

      const options = {
        layout: {
          hierarchical: {
            enabled: true, direction: "UD", sortMethod: "directed",
            levelSeparation: 100, nodeSpacing: 140, treeSpacing: 160,
            blockShifting: true, edgeMinimization: true, parentCentralization: true
          }
        },
        physics: false,
        interaction: { hover: true, tooltipDelay: 200, zoomView: true, dragView: true },
        groups: Object.keys(GROUP_COLORS).reduce(function (acc, k) {
          const c = GROUP_COLORS[k];
          acc[k] = { color: { background: c.background, border: c.border, highlight: { background: c.background, border: c.border } } };
          return acc;
        }, {}),
        nodes: { shadow: { enabled: true, color: "rgba(0,0,0,0.06)", size: 4, x: 0, y: 2 } }
      };

      if (network) { network.destroy(); network = null; }
      network = new vis.Network(graphContainer.value, { nodes: nodes, edges: edges }, options);
      network.on("click", function (params) {
        if (params.nodes.length > 0) selectNodeById(params.nodes[0]);
      });
      network.once("stabilized", function () { network.fit({ animation: false }); });
      network.fit({ animation: false });

      updateNodeColors();
      applyFilter();
      applyPathHighlight();
    }

    // 评分变化时给节点上色（保留主轴/核心的边框色作为身份标识）
    function updateNodeColors() {
      const v = displayView.value;
      if (!network || !v) return;
      const ds = network.body.data.nodes;
      v.nodes.forEach(function (n) {
        const s = getScore(n.node_id);
        const role = v.roleOf[n.node_id] || "other";
        let bg, border;
        if (s >= 8) { bg = "#bbf7d0"; border = "#16a34a"; }
        else if (s >= 5) { bg = "#d9f99d"; border = "#65a30d"; }
        else if (s >= 3) { bg = "#fef08a"; border = "#ca8a04"; }
        else if (s >= 1) { bg = "#fecaca"; border = "#dc2626"; }
        else { bg = GROUP_COLORS[role].background; border = GROUP_COLORS[role].border; }
        ds.update({ id: n.node_id, color: { background: bg, border: border, highlight: { background: bg, border: border } } });
      });
    }

    function applyPathHighlight() {
      const v = displayView.value;
      if (!network || !v) return;
      const inPath = {};
      v.pathNodeIds.forEach(function (id) { inPath[id] = true; });
      v.nodes.forEach(function (n) {
        const on = !showPath.value || !!inPath[n.node_id];
        network.body.data.nodes.update({ id: n.node_id, opacity: on ? 1.0 : 0.25 });
      });
      v.edges.forEach(function (e, i) {
        const id = "edge-" + e.from + "-" + e.to + "-" + i;
        const on = !showPath.value || (inPath[e.from] && inPath[e.to]);
        const cur = network.body.data.edges.get(id);
        if (cur) network.body.data.edges.update({ id: id, color: Object.assign({}, cur.color, { opacity: on ? 1 : 0.12 }) });
      });
      applyFilter();
    }

    function applyFilter() {
      const v = displayView.value;
      if (!network || !v) return;
      const hidden = {};
      v.nodes.forEach(function (n) {
        const h = filterLayer.value !== "全部" && n.layer !== filterLayer.value;
        network.body.data.nodes.update({ id: n.node_id, hidden: h });
        if (h) hidden[n.node_id] = true;
      });
      v.edges.forEach(function (e, i) {
        const id = "edge-" + e.from + "-" + e.to + "-" + i;
        network.body.data.edges.update({ id: id, hidden: !!hidden[e.from] || !!hidden[e.to] });
      });
    }

    // ---------- 切换论文 ----------
    function selectPaper(instanceId, opts) {
      const paper = window.Store.findPaper(instanceId);
      if (!paper) return;
      currentId.value = instanceId;
      selectedNode.value = null;
      filterLayer.value = "全部";
      window.Store.setLastPaper(instanceId);

      try {
        view.value = computeView(paper);
      } catch (e) {
        view.value = null;
        importState.error = "计算学习路径时出错：" + (e && e.message || e);
        return;
      }
      loadScores();
      activeTab.value = "paper";
      nextTick(buildGraph);

      // 相关文献：有缓存直接用，没有就联网抓
      const cached = window.Store.getCachedRecommendation(instanceId);
      litState.data = cached || null;
      litState.fromCache = !!cached;
      litState.error = "";
      if (!cached || (opts && opts.forceLiterature)) ensureLiterature(!!(opts && opts.forceLiterature));
    }

    // ---------- 相关文献 ----------
    function ensureLiterature(force) {
      const v = view.value;
      if (!v) return;
      const paper = v.paper;
      if (!paper.doi) {
        litState.error = "这篇论文没有登记 DOI，无法自动检索相关文献。可以在 data/papers.js 里补上 doi 字段。";
        litState.data = null;
        return;
      }
      const cached = window.Store.getCachedRecommendation(paper.instance_id);
      if (cached && !force) {
        litState.data = cached; litState.fromCache = true; litState.error = "";
        return;
      }

      litState.busy = true; litState.error = ""; litState.fromCache = false;
      litState.stage = "正在抓取论文元数据…";

      window.Literature.fetchPaper(paper.doi).then(function (full) {
        // 固化论文缺的字段（如 referenced_works）用抓取结果补上，
        // 但已经写好的字段（摘要、领域归属）不覆盖，保证可复现
        Object.keys(full).forEach(function (k) {
          const cur = paper[k];
          const empty = cur === undefined || cur === null || (Array.isArray(cur) && cur.length === 0);
          if (empty) paper[k] = full[k];
        });
        full.pools = paper.pools;
        litState.stage = "元数据已就绪，正在检索五类相关文献…";
        return window.Literature.recommend(full);
      }).then(function (rec) {
        litState.data = rec;
        litState.fromCache = false;
        window.Store.cacheRecommendation(paper.instance_id, rec);
        if (!window.Store.isCurated(paper.instance_id)) window.Store.saveImported(paper);
        if (!rec.total) litState.error = "接口返回了空结果，可能是这篇论文太新还没被索引";
      }).catch(function (e) {
        litState.error = "抓取失败：" + (e && e.message || e) +
          "　（如果是在本地直接双击打开的页面，试试用 python -m http.server 起个本地服务再访问）";
        litState.data = cached || null;
        litState.fromCache = !!cached;
      }).then(function () {
        litState.busy = false; litState.stage = "";
      });
    }

    // ---------- 导入论文 ----------
    function doImport() {
      const doi = (importState.doi || "").trim();
      if (!doi) { importState.error = "请先填一个 DOI"; return; }
      importState.busy = true; importState.error = ""; importState.ok = "";

      window.AutoGen.importFromDoi(doi, function (stage) { importState.stage = stage; })
        .then(function (out) {
          const saved = window.Store.saveImported(out.paper);
          if (!saved.ok) {
            importState.error = "论文已生成，但浏览器存储空间不足，没能保存下来（关掉页面就会丢）";
          }
          papers.value = window.Store.allPapers();
          importState.ok = "已生成：" + out.paper.title.slice(0, 60) + "…　路径含 " +
            out.result.nodes.length + " 个知识点（核心 " + out.result.summary.seedCount +
            " / 前置 " + out.result.summary.prereqCount + " / 延伸 " + out.result.summary.frontierCount + "）";
          selectPaper(out.paper.instance_id, { forceLiterature: true });
          showImport.value = false;
          importState.doi = "";
        })
        .catch(function (e) {
          importState.error = String(e && e.message || e) +
            "　（本地双击打开页面时浏览器可能拦住跨域请求，可改用 python -m http.server）";
        })
        .then(function () { importState.busy = false; importState.stage = ""; });
    }

    function removePaper(instanceId) {
      if (window.Store.isCurated(instanceId)) {
        importState.error = "固化论文写在 data/papers.js 里，不能在界面上删除";
        return;
      }
      window.Store.removeImported(instanceId);
      papers.value = window.Store.allPapers();
      if (currentId.value === instanceId) {
        selectPaper(papers.value.length ? papers.value[0].instance_id : "");
      }
    }

    // ---------- 导出 ----------
    function openExport(kind) {
      const v = view.value;
      if (!v) return;
      let title = "", text = "";
      if (kind === "literature") {
        if (!litState.data) { exportState.open = true; exportState.title = "还没有推荐结果"; exportState.text = "先点「重新检索」拿到结果再导出。"; return; }
        title = "相关文献推荐清单（Markdown）";
        text = window.Literature.toMarkdown(v.paper, litState.data);
      } else {
        title = "论文记录 + 生成结果（交给 AI 改写 Rubric 与练习任务）";
        text = buildAiHandoff(v);
      }
      exportState.open = true; exportState.title = title; exportState.text = text; exportState.copied = false;
    }

    // 把「机器算出来的骨架」打包成一段可以直接贴给 AI 的文字
    function buildAiHandoff(v) {
      const p = v.paper;
      const L = [];
      L.push("请把下面这篇论文的学习路径记录改写成人工策划质量。");
      L.push("要求：① rubric 各级 evidence 要写成能判定通过/不通过的具体行为，用到论文里的真实数字；");
      L.push("② practice_tasks 四个练习的 instructions 要具体到可执行，success_criteria 要可判；");
      L.push("③ 只改这两个字段，nodes / edges / path_graph 是算法算出来的，不要动；");
      L.push("④ 输出成 data/papers.js 里那种 JSON 格式。\n");
      L.push("## 论文题录");
      L.push(JSON.stringify({
        instance_id: p.instance_id, title: p.title, doi: p.doi, journal: p.journal,
        year: p.year, volume: p.volume, issue: p.issue, pages: p.pages,
        authors: p.authors.map(function (a) { return a.name + (a.position ? "(" + a.position + ")" : ""); }),
        institutions: p.institutions.map(function (i) { return i.name; }),
        primary_topic: p.primary_topic, pools: v.pools
      }, null, 2));
      L.push("\n## 摘要（" + (p.abstract_quality === "reconstructed" ? "OpenAlex 还原版，下标处有空格缺失" : "原文") + "）");
      L.push(p.abstract || "（无）");
      L.push("\n## 算法生成的路径");
      L.push(JSON.stringify({
        summary: v.summary,
        spine: v.path_graph.spine.map(function (id) { return id + " = " + getNodeName(id); }),
        branches: v.branchNodes.map(function (id) { return id + " = " + getNodeName(id); }),
        footprints: v.footprints ? Object.keys(v.footprints).reduce(function (a, k) {
          a["L" + k] = v.footprints[k].map(function (id) { return id + " = " + getNodeName(id); });
          return a;
        }, {}) : "（人工策划，见 rubric.levels[].uses_nodes）"
      }, null, 2));
      L.push("\n## 当前 rubric（待改写）");
      L.push(JSON.stringify(v.rubric, null, 2));
      L.push("\n## 当前 practice_tasks（待改写）");
      L.push(JSON.stringify(v.practice_tasks, null, 2));
      return L.join("\n");
    }

    function copyExport() {
      const ta = document.getElementById("export-text");
      if (!ta) return;
      ta.focus(); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      // file:// 下 navigator.clipboard 常常不可用，所以用 execCommand 兜底
      if (!ok && navigator.clipboard) {
        navigator.clipboard.writeText(exportState.text).then(function () { exportState.copied = true; }, function () {});
        return;
      }
      exportState.copied = ok;
    }

    // ---------- 初始化 ----------
    onMounted(function () {
      buildNodeIndex();
      papers.value = window.Store.allPapers();
      const last = window.Store.getLastPaper();
      const first = papers.value.length ? papers.value[0].instance_id : "";
      if (first) selectPaper(last && window.Store.findPaper(last) ? last : first);
    });

    watch(filterLayer, applyFilter);
    watch(showPath, applyPathHighlight);
    watch(showUnselected, function () { selectedNode.value = null; nextTick(buildGraph); });

    return {
      CFG, papers, currentId, currentPaper, view, displayView, activeTab,
      selectedNode, filterLayer, showPath, showUnselected, showImport, graphContainer,
      scores, getScore, setScore, scoreClass, getNodeName, getDiagram, kindLabel,
      roleLabel, isInPath, inGraph, nextNodes, prevNodes, getNodeTasks,
      overallProgress, layerProgress, rubricReadiness, availableLayers,
      frontierNodes, branchBlocks, nodeDiag,
      selectNodeById, selectPaper, removePaper,
      importState, doImport, litState, ensureLiterature,
      exportState, openExport, copyExport,
      urlForResource
    };
  }
}).mount("#app");
