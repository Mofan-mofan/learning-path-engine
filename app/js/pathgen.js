// ============================================================
// js/pathgen.js —— 自动学习路径生成
//
// 输入：一篇论文的元数据（标题 / 摘要 / 主题词）+ 若干节点池
// 输出：PathGraph（Schema v2.0）+ 诊断信息
//
// 算法严格照 05-IC器件方向Schema实填与最小闭环.md 的规则实现：
//   ① spine（主轴）   = 基础层的 hard 链，固定、有序、所有人一样
//   ② branches（分支）= 按成果倒推，= hard闭包(implied_prerequisites ∪ N_k) − spine
//   ③ ordering（排序）= 全图拓扑序，hard 边是可行性约束，soft 边只做偏好
//   ④ soft 依赖不阻塞、明标可跳过（v2.0 决策一）
//
// 三类节点角色（界面上会用不同颜色区分）：
//   seed     核心节点：论文标题/摘要/主题词直接命中的，是这篇论文真正在讲的东西
//   prereq   前置节点：seed 沿 hard 依赖倒推出来的，不懂它就看不懂 seed
//   frontier 延伸节点：从 seed 沿依赖边再往前一跳，论文没做但紧挨着的方向 → 喂给 L4「推进」
//
// 阈值全部在 js/config.js 的 match 段里，是「经验值」（v2.0 约定：不做重点）。
// ============================================================
window.PathGen = (function () {

  // ---------- 1. 文本规范化 ----------
  // Crossref 的标题里带 <sub> 标签（如 Ga<sub>2</sub>O<sub>3</sub>），
  // OpenAlex 的标题里是普通数字（Ga2O3），摘要里还可能出现下标字符（Ga₂O₃）。
  // 不先统一，同一篇论文的三个来源会匹配不上同一批节点。
  var SUB_MAP = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
  var GREEK_MAP = { "α": "a", "β": "b", "γ": "g", "δ": "d", "ε": "e", "λ": "l", "μ": "u", "π": "p", "σ": "s", "τ": "t" };

  function normalize(text) {
    if (!text) return "";
    var t = String(text);
    t = t.replace(/<[^>]*>/g, " ");                                  // 去 HTML 标签
    t = t.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, function (c) { return SUB_MAP[c]; });
    t = t.replace(/[αβγδελμπστ]/g, function (c) { return GREEK_MAP[c] || c; });
    t = t.replace(/[ΑΒΓΔΕΛΜΠΣΤ]/g, function (c) { return GREEK_MAP[c.toLowerCase()] || c; });
    t = t.toLowerCase();
    t = t.replace(/[\u00a0\u2009\u2013\u2014\u2010\u2212]/g, " ");   // 各种空格与破折号
    t = t.replace(/[^a-z0-9\u4e00-\u9fff]+/g, " ");                  // 其余标点一律变空格
    t = t.replace(/\s+/g, " ").trim();
    return t;
  }

  // 去掉所有空格的版本，专门用来匹配 ga2o3 / ron sp 这类被标点拆散的写法
  function collapse(normText) {
    return normText.replace(/ /g, "");
  }

  // 一个匹配词在一段规范化文本里是否命中
  // 为什么要做两次：OpenAlex 用倒排索引还原摘要，下标与公式处的空格会丢失，
  // "turn-on voltage" 会变成 "turn-onvoltage"、"Ga2O3 planar" 会变成 "Ga2O3planar"。
  // 只按原样匹配会大面积漏判，所以再把匹配词也压扁后找一次。
  //
  // 但这两趟都必须加限制，否则误命中比漏判更糟（实测过的三例）：
  //   · 'ec'（想匹配临界场强 E_c）命中了 "specific"、"electronic"
  //   · 'eg'（想匹配禁带宽度 E_g）命中了压扁后的 "the gate"→"thegate"
  //   · 'i v'（想匹配 I-V 曲线）压扁成 "iv" 后会命中 "gate drive"→"gatedrive"
  // 于是有了下面三条规则。
  function hit(term, normText, collapsedText, cfg) {
    if (!term) return false;

    // ① 短词（规范化后是 1~shortTermLen 个纯 ASCII 字符）要求「词首对齐」：
    //    命中处的前一个字符不能是字母或数字，挡掉 specific 里的 ec、physics 里的 sic。
    //    词尾故意不要求——OpenAlex 会把词粘起来（SiCmosfets、FinFETs、Ron,sp），
    //    词尾也对齐的话 sic / fin / ron 会全部漏判。
    //    残留风险是同形词（"finally" 里的 fin），所以匹配词里凡已有更长写法的
    //    短词都删掉了，见 data/nodes-*.js。
    if (new RegExp("^[a-z0-9]{1," + cfg.shortTermLen + "}$").test(term)) {
      return hitWordStart(term, normText);
    }

    // ② 其余词按子串匹配（长词子串命中粘连 token 是期望行为，如 "mosfet" 命中 "gatemosfets"）
    if (normText.indexOf(term) >= 0) return true;

    // ③ 压扁这一趟只给「本身含空格的多词项」用，且压扁后要够长，
    //    否则就退化成上面那种跨词误命中。
    if (term.indexOf(" ") < 0) return false;
    var flat = term.replace(/ /g, "");
    if (flat.length < cfg.minCollapseLen) return false;
    return collapsedText.indexOf(flat) >= 0;
  }

  // 词首对齐查找：命中处位于开头，或前一个字符不是字母数字
  function hitWordStart(term, text) {
    var from = 0, i;
    while ((i = text.indexOf(term, from)) >= 0) {
      if (i === 0 || !/[a-z0-9]/.test(text.charAt(i - 1))) return true;
      from = i + 1;
    }
    return false;
  }

  // ---------- 2. 建立「草堆」：论文的三处可检索文本 ----------
  function buildHaystack(paper) {
    var titleRaw = [paper.title || "", paper.subtitle || ""].join(" ");
    // 主题词来源：OpenAlex 的 topics / keywords / concepts / primary_topic
    var topicWords = [];
    ["topics", "keywords", "concepts"].forEach(function (k) {
      (paper[k] || []).forEach(function (t) {
        if (typeof t === "string") topicWords.push(t);
        else if (t && t.name) topicWords.push(t.name);
        else if (t && t.display_name) topicWords.push(t.display_name);
      });
    });
    if (paper.primary_topic) {
      topicWords.push(paper.primary_topic.name || paper.primary_topic.display_name || "");
    }
    // 作者手填的关键词也算主题词
    (paper.keywords || []).forEach(function (k) { topicWords.push(k); });

    var title = normalize(titleRaw);
    var topics = normalize(topicWords.join(" "));
    var abstract = normalize(paper.abstract || "");

    return {
      title: title, titleC: collapse(title),
      topics: topics, topicsC: collapse(topics),
      abstract: abstract, abstractC: collapse(abstract)
    };
  }

  // ---------- 3. 给单个节点打分 ----------
  function scoreNode(node, hay, focusSet, cfg) {
    var terms = node.match_terms || [];
    var score = 0;
    var hitTitle = [], hitTopic = [], hitAbstract = [];

    terms.forEach(function (rawTerm) {
      var term = normalize(rawTerm);
      if (!term) return;
      // 同一个词只取它命中的最高权重，不重复累加
      var inTitle = hit(term, hay.title, hay.titleC, cfg);
      var inTopic = hit(term, hay.topics, hay.topicsC, cfg);
      var inAbs = hit(term, hay.abstract, hay.abstractC, cfg);
      var w = 0;
      if (inTitle) { w = Math.max(w, cfg.titleWeight); hitTitle.push(rawTerm); }
      if (inTopic) { w = Math.max(w, cfg.topicWeight); hitTopic.push(rawTerm); }
      if (inAbs) { w = Math.max(w, cfg.abstractWeight); hitAbstract.push(rawTerm); }
      score += w;
    });

    // 论文文件里手工指定的重点节点，直接顶到最前
    if (focusSet[node.node_id]) {
      score += cfg.manualBoost;
      hitTitle.push("(人工指定)");
    }

    return {
      score: Math.round(score * 100) / 100,
      termCount: hitTitle.length + hitTopic.length + hitAbstract.length,
      titleHit: hitTitle.length > 0,
      hitTitle: hitTitle, hitTopic: hitTopic, hitAbstract: hitAbstract
    };
  }

  // ---------- 4. 候选节点：哪些池的节点允许进这篇论文 ----------
  // shared 节点跨领域通用（半导体物理、表征、TCAD 这些），任何论文都能用；
  // domain 节点只属于自己那个领域（FinFET/GAA 只该出现在 IC 论文里），
  // 只有论文声明了这个池才允许进候选。
  //
  // opts.sharedFromAllPools：
  //   true（默认，自动生成用）—— 别的池的 shared 节点也进候选，
  //        这样功率器件论文才能拿到「半导体物理」「TCAD」这些通用前置。
  //   false（人工策划的论文用）—— 只显示论文自己声明的池里的节点，
  //        否则 FinFET 那篇会被塞进一堆功率器件节点。
  function buildCandidates(pools, opts) {
    var sharedFromAllPools = !opts || opts.sharedFromAllPools !== false;
    var byId = {}, list = [], edges = [];
    (window.APP_CONFIG.pools || []).forEach(function (pid) {
      var pool = (window.NODE_POOLS || {})[pid];
      if (!pool) return;
      var declared = pools.indexOf(pid) >= 0;
      pool.nodes.forEach(function (n) {
        if (byId[n.node_id]) return;                       // 跨池重名，先到先得
        var eligible = declared || (sharedFromAllPools && n.scope === "shared");
        if (eligible) {
          byId[n.node_id] = n;
          list.push(n);
        }
      });
      // 边只要两端都在候选里就收进来（下面 generate 会再过滤一次）
      pool.edges.forEach(function (e) { edges.push(e); });
    });
    return { byId: byId, list: list, edges: edges };
  }

  // ---------- 5. hard 闭包：沿依赖边倒推前置知识 ----------
  function hardClosure(seeds, cand) {
    var incoming = {};
    cand.edges.forEach(function (e) {
      if (e.type !== "hard") return;
      if (!cand.byId[e.from] || !cand.byId[e.to]) return;
      (incoming[e.to] = incoming[e.to] || []).push(e.from);
    });
    // 节点自带的 prerequisites 也算 hard 依赖（两处取并集，防止数据不一致）
    cand.list.forEach(function (n) {
      (n.prerequisites || []).forEach(function (p) {
        if (!cand.byId[p]) return;
        var arr = incoming[n.node_id] = incoming[n.node_id] || [];
        if (arr.indexOf(p) < 0) arr.push(p);
      });
    });

    var seen = {}, out = [], queue = seeds.slice();
    while (queue.length) {
      var id = queue.shift();
      if (seen[id]) continue;
      seen[id] = true;
      out.push(id);
      (incoming[id] || []).forEach(function (p) { if (!seen[p]) queue.push(p); });
    }
    return out;
  }

  // ---------- 6. 拓扑排序：hard 是约束，soft 是偏好 ----------
  // Kahn 算法。每轮从「hard 前置已全部排完」的节点里挑一个，
  // 挑选顺序体现 soft 偏好：soft 前置排得越全的越优先，其次按层、再按匹配分。
  function topoOrder(ids, cand, scoreOf) {
    var idSet = {};
    ids.forEach(function (i) { idSet[i] = true; });

    var hardIn = {}, softIn = {};
    ids.forEach(function (i) { hardIn[i] = []; softIn[i] = []; });
    cand.edges.forEach(function (e) {
      if (!idSet[e.from] || !idSet[e.to]) return;
      if (e.type === "hard") hardIn[e.to].push(e.from);
      else softIn[e.to].push(e.from);
    });
    // prerequisites 字段里的依赖同样纳入 hard 约束
    ids.forEach(function (i) {
      (cand.byId[i].prerequisites || []).forEach(function (p) {
        if (idSet[p] && hardIn[i].indexOf(p) < 0) hardIn[i].push(p);
      });
    });

    var layerOrder = window.APP_CONFIG.layerOrder || {};
    var placed = {}, order = [];
    var remaining = ids.slice();

    while (remaining.length) {
      var best = null, bestKey = null;
      for (var k = 0; k < remaining.length; k++) {
        var id = remaining[k];
        var ready = hardIn[id].every(function (p) { return !!placed[p]; });
        if (!ready) continue;
        // soft 偏好：已排完的 soft 前置占比越高越优先（没有 soft 前置的按 1 算，不吃亏）
        var softTotal = softIn[id].length;
        var softDone = softIn[id].filter(function (p) { return !!placed[p]; }).length;
        var softReady = softTotal ? softDone / softTotal : 1;
        // 排序键：soft 满足度（降）→ 层（升）→ 匹配分（降）→ 字典序（保证稳定可复现）
        var key = [-softReady, layerOrder[cand.byId[id].layer] || 1, -scoreOf(id), id];
        if (!bestKey || cmpKey(key, bestKey) < 0) { bestKey = key; best = id; }
      }
      if (!best) {
        // 理论上到不了这里：validate_pools.py 已确认 hard 依赖无环。
        // 万一数据被改坏了，剩下的按层序补进去，保证界面不空白。
        best = remaining.sort(function (a, b) {
          return (layerOrder[cand.byId[a].layer] || 1) - (layerOrder[cand.byId[b].layer] || 1);
        })[0];
      }
      order.push(best);
      placed[best] = true;
      remaining.splice(remaining.indexOf(best), 1);
    }
    return order;
  }

  function cmpKey(a, b) {
    for (var i = 0; i < a.length; i++) {
      if (a[i] < b[i]) return -1;
      if (a[i] > b[i]) return 1;
    }
    return 0;
  }

  // ---------- 7. 延伸节点：论文没做、但紧挨着的下一步 ----------
  // 方向：沿依赖边正向（from → to）走一跳。因为边表示「from 是 to 的前置」，
  // 所以从已选节点往前走，得到的就是「学完这些之后能去做什么」。
  function findFrontier(selectedIds, cand, scoreOf, cfg) {
    var sel = {};
    selectedIds.forEach(function (i) { sel[i] = true; });
    var counter = {};
    cand.edges.forEach(function (e) {
      if (!sel[e.from] || sel[e.to]) return;
      if (!cand.byId[e.to]) return;
      counter[e.to] = (counter[e.to] || 0) + (e.type === "hard" ? 2 : 1);
    });
    return Object.keys(counter)
      .map(function (id) { return { id: id, links: counter[id], score: scoreOf(id) }; })
      .sort(function (a, b) {
        return (b.links - a.links) || (b.score - a.score) || (a.id < b.id ? -1 : 1);
      })
      .slice(0, cfg.maxFrontier)
      .map(function (x) { return x.id; });
  }

  // ---------- 8. Rubric 的节点足迹 N_k ----------
  // v2.0 决策三：成果与节点是概率性关系，N_k 只是「诊断用的足迹」，不是硬门槛。
  // 这里按角色的语义分工自动分配：
  //   L1 复述 → 标题命中的核心概念（论文讲了什么）
  //   L2 复现 → 工具/流程类节点 + 定量概念（要动手就得会用这些）
  //   L3 批判 → 只在摘要/主题里命中的节点（边界条件、限制、失效机理）
  //   L4 推进 → 延伸节点（下一步能做什么）
  function buildFootprints(roleOf, scoreOf, cand, cfg) {
    var seeds = [], tools = [], bg = [];
    Object.keys(roleOf).forEach(function (id) {
      var n = cand.byId[id];
      if (!n) return;
      var d = roleOf[id];
      if (d.role === "seed") {
        if (d.titleHit) seeds.push(id);
        else bg.push(id);
        if (n.kind === "tool" || n.kind === "procedure") tools.push(id);
      }
    });
    var byScore = function (a, b) { return (scoreOf(b) - scoreOf(a)) || (a < b ? -1 : 1); };
    seeds.sort(byScore); tools.sort(byScore); bg.sort(byScore);

    var frontier = Object.keys(roleOf).filter(function (id) { return roleOf[id].role === "frontier"; });
    var quantitative = seeds.filter(function (id) {
      return cand.byId[id].kind === "concept" && cand.byId[id].layer !== "基础层";
    });

    var uniq = function (arr) {
      var s = {}, o = [];
      arr.forEach(function (x) { if (!s[x]) { s[x] = 1; o.push(x); } });
      return o;
    };

    var N = [];
    N[1] = uniq(seeds).slice(0, 3);
    N[2] = uniq(tools.concat(quantitative)).slice(0, 5);
    N[3] = uniq(bg.concat(tools)).slice(0, 4);
    N[4] = uniq(frontier).slice(0, 4);

    // 兜底：任何一级都不允许空，否则就绪度算不出来
    var fallback = uniq(seeds.concat(tools, bg)).slice(0, 3);
    [1, 2, 3, 4].forEach(function (L) { if (!N[L].length) N[L] = fallback.slice(); });
    return N;
  }

  // ---------- 8.5 领域归属判定：这篇论文该用哪几个节点池 ----------
  // 注意语义：被排除的池，它的 scope='shared' 节点仍然可用
  // （buildCandidates 里已经这么写了），只是它的 domain 专属节点不进候选。
  // 所以一篇 Ga2O3/SiC 功率器件论文即使判定为只属于 power.wbg，
  // 依然能拿到「半导体物理 / 表征 / TCAD」这些通用节点，
  // 但不会把 FinFET、GAA、CMP 这类 CMOS 专属节点拉进来。
  function classifyPools(paper) {
    var cfg = window.APP_CONFIG.match;
    var hay = buildHaystack(paper);
    var pools = window.APP_CONFIG.pools || [];

    var scored = pools.map(function (pid) {
      var pool = (window.NODE_POOLS || {})[pid];
      if (!pool) return { id: pid, agg: 0 };
      var scores = pool.nodes.map(function (n) { return scoreNode(n, hay, {}, cfg).score; })
                             .sort(function (a, b) { return b - a; });
      // 取前 8 个节点的分求和，代表「这个池能覆盖这篇论文多少」
      var agg = scores.slice(0, 8).reduce(function (a, b) { return a + b; }, 0);
      return { id: pid, agg: agg };
    }).sort(function (a, b) { return (b.agg - a.agg) || (a.id < b.id ? -1 : 1); });

    if (!scored.length) return [];
    var best = scored[0].agg;
    var chosen = scored.filter(function (p, i) {
      return i === 0 || (best > 0 && p.agg >= best * cfg.poolKeepRatio);
    }).map(function (p) { return p.id; });

    // 一个池都没匹配上（比如导入了非半导体论文），退回到全部池，
    // 至少让图能画出来，并在界面上提示「匹配度低，结果仅供参考」
    return chosen.length ? chosen : pools.slice();
  }

  // ---------- 9. 主入口 ----------
  function generate(paper, pools) {
    var cfg = window.APP_CONFIG.match;
    var cand = buildCandidates(pools || paper.pools || []);
    var hay = buildHaystack(paper);
    var focusSet = {};
    (paper.focus_nodes || []).forEach(function (id) { focusSet[id] = true; });

    // 打分
    var diag = {};
    cand.list.forEach(function (n) {
      diag[n.node_id] = scoreNode(n, hay, focusSet, cfg);
    });
    var scoreOf = function (id) { return (diag[id] || {}).score || 0; };

    // 选核心节点
    var seeds = cand.list.filter(function (n) {
      var d = diag[n.node_id];
      if (focusSet[n.node_id]) return true;
      if (d.score >= cfg.minSeedScore) return true;
      return d.termCount >= cfg.minSeedTerms && d.score >= cfg.minSeedScoreSoft;
    }).sort(function (a, b) {
      return (diag[b.node_id].score - diag[a.node_id].score) || (a.node_id < b.node_id ? -1 : 1);
    }).slice(0, cfg.maxSeeds).map(function (n) { return n.node_id; });

    // hard 闭包 → 前置节点
    var closed = hardClosure(seeds, cand);

    // 延伸节点
    var frontier = findFrontier(closed, cand, scoreOf, cfg);

    // 合成最终节点集合，并按 maxNodes 截断（截断时先砍延伸，再砍分低的前置）
    var roleOf = {};
    closed.forEach(function (id) {
      roleOf[id] = {
        role: seeds.indexOf(id) >= 0 ? "seed" : "prereq",
        titleHit: (diag[id] || {}).titleHit || false
      };
    });
    frontier.forEach(function (id) {
      if (!roleOf[id]) roleOf[id] = { role: "frontier", titleHit: false };
    });

    var ids = Object.keys(roleOf);
    if (ids.length > cfg.maxNodes) {
      var rank = { frontier: 0, prereq: 1, seed: 2 };
      ids.sort(function (a, b) {
        var ra = rank[roleOf[a].role], rb = rank[roleOf[b].role];
        if (ra !== rb) return rb - ra;                      // seed > prereq > frontier
        return (scoreOf(b) - scoreOf(a)) || (a < b ? -1 : 1);
      });
      ids = ids.slice(0, cfg.maxNodes);
      var keep = {};
      ids.forEach(function (i) { keep[i] = true; });
      Object.keys(roleOf).forEach(function (i) { if (!keep[i]) delete roleOf[i]; });
      ids = Object.keys(roleOf);
    }

    // 排序
    var ordering = topoOrder(ids, cand, scoreOf);

    // spine = 基础层的 hard 链（doc05：固定、有序、所有人一样）
    var spine = ordering.filter(function (id) { return cand.byId[id].layer === "基础层"; });
    var branch = ordering.filter(function (id) { return spine.indexOf(id) < 0; });

    // N_k 足迹
    var N = buildFootprints(roleOf, scoreOf, cand, cfg);

    // 只保留两端都在图里的边
    var idSet = {};
    ids.forEach(function (i) { idSet[i] = true; });
    var edges = cand.edges.filter(function (e) { return idSet[e.from] && idSet[e.to]; });

    // implied_prerequisites：论文默认要用、但这一级 Rubric 用不到的背景（doc05 定义）
    var usedByRubric = {};
    [1, 2, 3, 4].forEach(function (L) { N[L].forEach(function (id) { usedByRubric[id] = true; }); });
    var implied = ordering.filter(function (id) { return !usedByRubric[id] && roleOf[id].role !== "frontier"; });

    return {
      nodes: ordering.map(function (id) { return cand.byId[id]; }),
      edges: edges,
      path_graph: {
        spine: spine,
        branches: [{ instance_id: paper.instance_id, nodes: branch }],
        ordering: ordering
      },
      footprints: N,
      implied_prerequisites: implied,
      diagnostics: ordering.map(function (id) {
        var d = diag[id] || { score: 0, hitTitle: [], hitTopic: [], hitAbstract: [] };
        return {
          node_id: id,
          role: roleOf[id].role,
          score: d.score,
          hitTitle: d.hitTitle,
          hitTopic: d.hitTopic,
          hitAbstract: d.hitAbstract
        };
      }),
      summary: {
        seedCount: ids.filter(function (i) { return roleOf[i].role === "seed"; }).length,
        prereqCount: ids.filter(function (i) { return roleOf[i].role === "prereq"; }).length,
        frontierCount: ids.filter(function (i) { return roleOf[i].role === "frontier"; }).length,
        edgeCount: edges.length,
        // 摘要有没有拿到，直接决定自动生成的质量，界面上要提示
        hasAbstract: !!(paper.abstract && paper.abstract.length > 80),
        hasTopics: !!((paper.topics || []).length || (paper.keywords || []).length)
      }
    };
  }

  return {
    generate: generate,
    classifyPools: classifyPools,
    normalize: normalize,
    buildHaystack: buildHaystack,
    buildCandidates: buildCandidates
  };
})();
