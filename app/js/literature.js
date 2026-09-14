// ============================================================
// js/literature.js —— 论文元数据抓取 + 相关文献推荐
//
// 全部在浏览器里直接调 Crossref 和 OpenAlex 的公开接口，不需要后端。
// 两个接口都返回 access-control-allow-origin: *（2026-09-12 实测）。
//
// 推荐只用「机器可核验」的证据：作者身份、机构、引用关系、主题分类、
// 发表年份、被引次数。推荐理由是把这些字段拼出来的，不做主观判断，
// 也不编造内容。需要人工润色时用「导出」按钮把清单交给 AI。
//
// 明确不用的信号（都实测过，不可靠）：
//   · OpenAlex 的 related_works 字段 —— 按字面词匹配，会给 Ga2O3 论文
//     推出液晶、场论的文章
//   · 单用 topics.id 过滤 —— 命中量太大（11 万篇），要用 primary_topic.id
//   · institutions.lineage —— 接口直接报 400
//   · 单用 author.id 不加主题过滤 —— OpenAlex 作者消歧不准，会混进
//     同一作者名下的无关方向论文
// ============================================================
window.Literature = (function () {

  var CFG = window.APP_CONFIG.api;
  var REC = window.APP_CONFIG.recommend;

  // ---------- 通用请求 ----------
  function getJSON(url) {
    var ctrl = ("AbortController" in window) ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, CFG.timeoutMs) : null;
    return fetch(url, {
      headers: { "Accept": "application/json", "User-Agent": CFG.userAgent },
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (timer) clearTimeout(timer);
      if (!r.ok) throw new Error("HTTP " + r.status + " — " + url);
      return r.json();
    }).catch(function (e) {
      if (timer) clearTimeout(timer);
      throw e;
    });
  }

  function mailto() { return "&mailto=" + encodeURIComponent(CFG.mailto); }

  // 拼 filter 时不能整体 encodeURIComponent：: , | 是 OpenAlex 的语法字符，
  // 编码后会失效。只对「值」做编码。
  function worksUrl(filter, extra) {
    return CFG.openAlexBase + "works?filter=" + filter + (extra || "") + mailto();
  }

  // ---------- 摘要还原 ----------
  // OpenAlex 把摘要存成倒排索引 {词: [位置...]}，要自己拼回来
  function rebuildAbstract(inv) {
    if (!inv) return "";
    var pos = {};
    Object.keys(inv).forEach(function (w) {
      inv[w].forEach(function (p) { pos[p] = w; });
    });
    var keys = Object.keys(pos).map(Number).sort(function (a, b) { return a - b; });
    return keys.map(function (k) { return pos[k]; }).join(" ");
  }

  function stripTags(s) {
    return (s || "").replace(/<[^>]*>/g, "").replace(/&#[xX]?[0-9a-fA-F]+;/g, function (m) {
      try {
        var code = /^&#[xX]/.test(m) ? parseInt(m.slice(3, -1), 16) : parseInt(m.slice(2, -1), 10);
        return String.fromCharCode(code);
      } catch (e) { return ""; }
    }).trim();
  }

  function firstSentence(text, maxLen) {
    if (!text) return "";
    var t = text.replace(/\s+/g, " ").trim();
    var m = t.match(/^[^.!?]{20,}[^.!?]*[.!?]/);
    var s = m ? m[0] : t;
    return s.length > maxLen ? s.slice(0, maxLen) + "…" : s;
  }

  // ---------- 抓取一篇论文 ----------
  // 返回归一化后的论文记录，字段与 data/papers.js 里人工固化的记录保持一致
  function fetchPaper(doi) {
    var cleanDoi = String(doi || "").trim().toLowerCase()
      .replace(/^https?:\/\/(dx\.)?doi\.org\//, "").replace(/^doi:\s*/, "");
    if (!/^10\.\d{4,9}\/\S+$/.test(cleanDoi)) {
      return Promise.reject(new Error("DOI 格式不对，应该形如 10.1109/tpel.2024.3522297"));
    }

    return Promise.all([
      // Crossref 给准确的题录（标题带 HTML 下标、卷期页、ORCID、机构全称）
      getJSON(CFG.crossrefBase + encodeURIComponent(cleanDoi)).catch(function () { return null; }),
      // OpenAlex 给摘要、主题分类、作者 ID、引用关系
      getJSON(CFG.openAlexBase + "works/doi:" + encodeURIComponent(cleanDoi) + "?mailto=" + encodeURIComponent(CFG.mailto)).catch(function () { return null; })
    ]).then(function (res) {
      var cr = res[0] ? res[0].message : null;
      var oa = res[1];
      if (!cr && !oa) throw new Error("Crossref 和 OpenAlex 都查不到这个 DOI");

      var title = stripTags(cr && cr.title && cr.title[0]) || (oa && oa.display_name) || "(无标题)";
      var authors = [];
      if (cr && cr.author) {
        authors = cr.author.map(function (a, i) {
          return {
            name: [a.given, a.family].filter(Boolean).join(" "),
            orcid: a.ORCID ? String(a.ORCID).replace(/^https?:\/\/orcid\.org\//, "") : "",
            openalex_id: "",
            position: i === 0 ? "first" : (i === cr.author.length - 1 ? "last" : "middle"),
            affiliations: (a.affiliation || []).map(function (x) { return x.name; })
          };
        });
      }
      if (oa && oa.authorships) {
        // 用 ORCID 或姓名把 OpenAlex 的作者 ID 对齐到 Crossref 的作者上
        var byOrcid = {}, byName = {};
        authors.forEach(function (a) {
          if (a.orcid) byOrcid[a.orcid] = a;
          byName[a.name.toLowerCase()] = a;
        });
        oa.authorships.forEach(function (as) {
          var au = as.author || {};
          var oid = (au.orcid || "").replace(/^https?:\/\/orcid\.org\//, "");
          var nm = (au.display_name || "").toLowerCase();
          var target = byOrcid[oid] || byName[nm];
          if (!target) {
            target = {
              name: au.display_name || "(未知作者)", orcid: oid, openalex_id: "",
              position: as.author_position || "middle",
              affiliations: (as.institutions || []).map(function (x) { return x.display_name; })
            };
            authors.push(target);
          }
          target.openalex_id = (au.id || "").replace("https://openalex.org/", "");
          if (!target.affiliations || !target.affiliations.length) {
            target.affiliations = (as.institutions || []).map(function (x) { return x.display_name; });
          }
        });
      }

      var institutions = [];
      if (oa) {
        (oa.authorships || []).forEach(function (as) {
          (as.institutions || []).forEach(function (i) {
            var id = (i.id || "").replace("https://openalex.org/", "");
            if (id && !institutions.some(function (x) { return x.id === id; })) {
              institutions.push({ id: id, name: i.display_name });
            }
          });
        });
      }

      var paper = {
        instance_id: "doi." + cleanDoi.replace(/[\/().]/g, "."),
        doi: cleanDoi,
        url: "https://doi.org/" + cleanDoi,
        title: title,
        journal: (cr && cr["container-title"] && cr["container-title"][0]) ||
                 (oa && oa.primary_location && oa.primary_location.source && oa.primary_location.source.display_name) || "",
        year: (cr && cr.published && cr.published["date-parts"][0][0]) || (oa && oa.publication_year) || null,
        volume: (cr && cr.volume) || (oa && oa.biblio && oa.biblio.volume) || "",
        issue: (cr && cr.issue) || (oa && oa.biblio && oa.biblio.issue) || "",
        pages: (cr && cr.page) || (oa && oa.biblio && (oa.biblio.first_page + "-" + oa.biblio.last_page)) || "",
        publisher: (cr && cr.publisher) || "",
        authors: authors,
        institutions: institutions,
        abstract: rebuildAbstract(oa && oa.abstract_inverted_index),
        topics: (oa && oa.topics || []).map(function (t) {
          return { id: (t.id || "").replace("https://openalex.org/", ""), name: t.display_name, score: t.score };
        }),
        keywords: (oa && oa.keywords || []).map(function (k) {
          return { name: k.display_name, score: k.score };
        }),
        concepts: (oa && oa.concepts || []).map(function (c) {
          // id 用来拼 OpenAlex 的 filter；level 是概念的具体程度
          // （0 = Materials science 这类学科级，4 = MOSFET 这类器件级），
          // 下面 pickSpecificConcept 靠它挑出最能代表本篇器件类型的概念
          return {
            id: (c.id || "").replace("https://openalex.org/", ""),
            name: c.display_name,
            score: c.score,
            level: (typeof c.level === "number") ? c.level : null
          };
        }),
        primary_topic: oa && oa.primary_topic
          ? { id: (oa.primary_topic.id || "").replace("https://openalex.org/", ""), name: oa.primary_topic.display_name }
          : null,
        openalex_id: (oa && oa.id || "").replace("https://openalex.org/", ""),
        referenced_works: (oa && oa.referenced_works || []).map(function (x) { return x.replace("https://openalex.org/", ""); }),
        cited_by_count: (oa && oa.cited_by_count) || (cr && cr["is-referenced-by-count"]) || 0,
        open_access_url: (oa && oa.open_access && oa.open_access.oa_url) || "",
        fetch: {
          crossref: !!cr,
          openalex: !!oa,
          at: new Date().toISOString().slice(0, 10)
        }
      };
      // 领域归属由节点池反向决定，见 PathGen.classifyPools
      paper.pools = window.PathGen ? window.PathGen.classifyPools(paper) : window.APP_CONFIG.pools.slice();
      return paper;
    });
  }

  // ---------- 作者画像 ----------
  function fetchAuthorProfile(openalexId) {
    if (!openalexId) return Promise.resolve(null);
    return getJSON(CFG.openAlexBase + "authors/" + openalexId + "?mailto=" + encodeURIComponent(CFG.mailto))
      .then(function (a) {
        return {
          name: a.display_name,
          orcid: (a.orcid || "").replace(/^https?:\/\/orcid\.org\//, ""),
          works_count: a.works_count,
          cited_by_count: a.cited_by_count,
          h_index: a.summary_stats ? a.summary_stats.h_index : null,
          i10_index: a.summary_stats ? a.summary_stats.i10_index : null,
          top_topics: (a.topics || []).slice(0, 5).map(function (t) {
            return { name: t.display_name, count: t.count };
          }),
          institutions: (a.last_known_institutions || []).map(function (i) { return i.display_name; })
        };
      }).catch(function () { return null; });
  }

  // ---------- 把 OpenAlex 的 work 变成推荐条目 ----------
  function toItem(w, reason) {
    var doi = (w.doi || "").replace(/^https?:\/\/doi\.org\//, "");
    var venue = (w.primary_location && w.primary_location.source && w.primary_location.source.display_name) || "";
    var auth = (w.authorships || []).slice(0, 3).map(function (a) { return a.author && a.author.display_name; }).filter(Boolean);
    return {
      title: w.display_name || "(无标题)",
      year: w.publication_year,
      venue: venue,
      cited_by_count: w.cited_by_count || 0,
      authors_short: auth.join(", ") + ((w.authorships || []).length > 3 ? " 等" : ""),
      link: doi ? "https://doi.org/" + doi : (w.id || ""),
      openalex_id: (w.id || "").replace("https://openalex.org/", ""),
      is_oa: !!(w.open_access && w.open_access.is_oa),
      oa_url: (w.open_access && w.open_access.oa_url) || (w.best_oa_location && w.best_oa_location.pdf_url) || "",
      description: firstSentence(rebuildAbstract(w.abstract_inverted_index), 150),
      reason: reason
    };
  }

  // ---------- 检索条件的收窄工具 ----------

  // 从论文的 concepts 里挑出「最具体」的一个，用来收窄检索范围。
  //
  // 为什么需要：primary_topic 是材料体系级的（本文是 T12529「Ga2O3 and
  // related materials」，覆盖 12426 篇），按被引降序拿回来的前几名是紫外
  // 探测器综述——对读懂一篇功率 MOSFET 论文没用。concepts 里的 level 字段
  // 标了具体程度（0 = Materials science 这类学科级，4 = MOSFET 这类器件级），
  // 取 level 最大的那个就能把范围收到器件类型上。
  //
  // 2026-09-12 实测（本文 DOI 10.1109/tpel.2024.3522297）：
  //   只按 primary_topic           → 12426 篇，前排是探测器综述
  //   primary_topic + Transistor(3) →   927 篇，混进 p 型 TeO2、GaN 光晶体管
  //   primary_topic + MOSFET(4)     →   346 篇，前排全是 Ga2O3 功率 MOSFET
  // level 越高越准，所以门槛设在 config 的 recommend.minConceptLevel。
  function pickSpecificConcept(paper) {
    var best = null;
    (paper.concepts || []).forEach(function (c) {
      if (!c || !c.id || typeof c.level !== "number") return;
      if (c.level < REC.minConceptLevel) return;
      if (!best || c.level > best.level ||
          (c.level === best.level && (c.score || 0) > (best.score || 0))) {
        best = c;
      }
    });
    return best;
  }

  // 依次尝试多个 filter，用第一个「没报错且有结果」的。
  // 收窄条件（概念、主题）有可能过严导致 0 命中，这时退回宽条件，
  // 但只在真的空掉时才退——宁可给 3 条高度相关，也不用无关文献凑满 5 条。
  function tryFilters(candidates, extra) {
    var i = 0;
    function attempt() {
      if (i >= candidates.length) return Promise.resolve({ results: [], filter: null });
      var f = candidates[i++];
      return getJSON(worksUrl(f, extra)).then(function (r) {
        var list = r.results || [];
        if (list.length) return { results: list, filter: f };
        return attempt();
      }).catch(function () { return attempt(); });
    }
    return attempt();
  }

  // ---------- 五类推荐 ----------

  // ① 同作者的其它同主题文章
  function byAuthor(paper) {
    var topicId = (paper.topics && paper.topics[0] && paper.topics[0].id) || "";
    var topicName = (paper.topics && paper.topics[0] && paper.topics[0].name) || "";
    // 优先查末位作者（通常是导师/PI），再查第一作者
    var order = paper.authors.slice().sort(function (a, b) {
      var rank = function (x) { return x.position === "last" ? 0 : x.position === "first" ? 1 : 2; };
      return rank(a) - rank(b);
    }).filter(function (a) { return a.openalex_id; }).slice(0, 2);

    if (!order.length) return Promise.resolve([]);

    // 记住每条原始记录是从哪位作者名下查到的，去重之后还要用它拼推荐理由
    var authorOf = {};

    return Promise.all(order.map(function (a) {
      // 关键：author.id 必须配 topics.id，否则 OpenAlex 的作者消歧会混进无关方向
      var filter = topicId
        ? "author.id:" + a.openalex_id + ",topics.id:" + topicId
        : "author.id:" + a.openalex_id;
      return getJSON(worksUrl(filter, "&sort=publication_year:desc&per-page=" + (REC.perCategory * 3)))
        .then(function (r) {
          var works = r.results || [];
          works.forEach(function (w) { authorOf[w.id] = a; });
          return dedupe(works, paper);          // 去重必须在原始记录这一层做
        }).catch(function () { return []; });
    })).then(function (lists) {
      return dedupe(flatten(lists), paper).slice(0, REC.perCategory).map(function (w) {
        var a = authorOf[w.id] || {};
        return toItem(w, "同作者（" + (a.name || "?") +
          (a.position === "last" ? "，末位/通讯" : a.position === "first" ? "，第一作者" : "") + "）" +
          " · " + (w.publication_year || "?") + " 年" +
          (topicName ? " · 主题同属「" + topicName + "」" : "") +
          " · 被引 " + (w.cited_by_count || 0) + " 次");
      });
    });
  }

  // ② 同机构 · 同方向（= 作者所在团队的类似方向文章）
  //
  // 原来用「标题关键词 + 全文检索」，2026-09-12 实测很糟：标题里真正有
  // 信息量的词是 Ga2O3 / SiC / Planar / Gate / MOSFETs，但按出现顺序截前 6 个
  // 截到的是 Static / Dynamic / Performance / Medium-Voltage / V-6500，
  // 检索只命中本文自己（1 条，去重后为 0）。
  // 改成结构化过滤：机构 + 主题 + 器件概念，三个条件都直接取自接口字段，
  // 不依赖分词质量。同一查询换成结构化条件后命中 43 篇，全是本校 Ga2O3 MOSFET。
  function byTeam(paper) {
    var inst = (paper.institutions || [])[0];
    if (!inst || !inst.id) return Promise.resolve([]);
    var pt = paper.primary_topic;
    if (!pt || !pt.id) return Promise.resolve([]);

    var cc = pickSpecificConcept(paper);
    var base = "institutions.id:" + inst.id + ",primary_topic.id:" + pt.id;
    // 从严到宽。最宽只到「机构 + 主题」：再退一步就只剩机构，
    // 那会拿回全校各方向的最新文章，属于凑数，宁可这一类显示没有结果。
    var filters = cc ? [base + ",concepts.id:" + cc.id, base] : [base];

    return tryFilters(filters, "&sort=publication_year:desc&per-page=" + REC.perCategory * 3)
      .then(function (out) {
        var usedConcept = out.filter && out.filter.indexOf("concepts.id") >= 0;
        return dedupe(out.results, paper).slice(0, REC.perCategory).map(function (w) {
          return toItem(w, "同机构（" + inst.name + "）· 同主题（" + pt.name + "）" +
            (usedConcept && cc ? " · 同器件类型（" + cc.name + "）" : "") +
            " · " + (w.publication_year || "?") + " 年 · 被引 " + (w.cited_by_count || 0) + " 次" +
            " → 这个团队在同一方向上还做了什么");
        });
      });
  }

  // ③ 本文引用的奠基性文献（一次批量请求取回全部，按被引数排序）
  function byReference(paper) {
    var ids = (paper.referenced_works || []).slice(0, CFG.batchLimit);
    if (!ids.length) return Promise.resolve([]);
    return getJSON(worksUrl("ids.openalex:" + ids.join("|"), "&per-page=" + CFG.batchLimit))
      .then(function (r) {
        return (r.results || [])
          .filter(function (w) { return (w.cited_by_count || 0) >= REC.minCitedForClassic; })
          .sort(function (a, b) { return b.cited_by_count - a.cited_by_count; })
          .slice(0, REC.perCategory)
          .map(function (w) {
            return toItem(w, "被本文引用 · 被引 " + w.cited_by_count + " 次（" + (w.publication_year || "?") + " 年）" +
              " → 属于本文所依赖的奠基性结论，读正文前先补齐它，性价比最高");
          });
      }).catch(function () { return []; });
  }

  // ④ 同主题的高被引文献（这个方向的入门地图）
  //
  // 只用 primary_topic 不够：它是材料体系级的，本文对应 T12529「Ga2O3 and
  // related materials」共 12426 篇，按被引降序拿回来的前排是紫外探测器综述，
  // 对读懂一篇中压功率 MOSFET 论文没有用。再和器件概念（本文是 level 4 的
  // MOSFET）取交集后剩 346 篇，前排全是 Ga2O3 功率 MOSFET 的关键文献。
  function byTopic(paper) {
    var pt = paper.primary_topic;
    if (!pt || !pt.id) return Promise.resolve([]);
    var from = ((paper.year || new Date().getFullYear()) - REC.recentYears) + "-01-01";
    var cc = pickSpecificConcept(paper);

    var base = "primary_topic.id:" + pt.id + ",from_publication_date:" + from;
    var filters = cc ? [base + ",concepts.id:" + cc.id, base] : [base];

    return tryFilters(filters, "&sort=cited_by_count:desc&per-page=" + REC.perCategory * 3)
      .then(function (out) {
        var usedConcept = out.filter && out.filter.indexOf("concepts.id") >= 0;
        return dedupe(out.results, paper).slice(0, REC.perCategory).map(function (w) {
          return toItem(w, "与本文同主题（" + pt.name + "）" +
            (usedConcept && cc ? " · 同器件类型（" + cc.name + "）" : "") +
            " · 近 " + REC.recentYears + " 年高被引" +
            " · 被引 " + (w.cited_by_count || 0) + " 次 · " + (w.publication_year || "?") + " 年" +
            " → 适合当作这个方向的入门地图");
        });
      });
  }

  // ⑤ 引用本文的后续工作
  function byCiting(paper) {
    if (!paper.openalex_id) return Promise.resolve([]);
    return getJSON(worksUrl("cites:" + paper.openalex_id, "&sort=publication_year:desc&per-page=" + REC.perCategory))
      .then(function (r) {
        return (r.results || []).map(function (w) {
          return toItem(w, "引用了本文 · " + (w.publication_year || "?") + " 年" +
            " → 可以看到本文的结论后来被谁沿用、被怎样检验");
        });
      }).catch(function () { return []; });
  }

  var BUILDERS = {
    author: byAuthor, team: byTeam, reference: byReference, topic: byTopic, citing: byCiting
  };

  // ---------- 工具函数 ----------
  function flatten(arrs) {
    return arrs.reduce(function (a, b) { return a.concat(b); }, []);
  }

  // 去重。只能传 OpenAlex 接口返回的「原始记录」：取键依赖 id / doi /
  // display_name 三个字段，而 toItem 之后的展示对象这三个都没有，
  // 传进来会让除第一条以外的结果全被判成重复（第 ① 类推荐曾因此只出 1 条）。
  function dedupe(items, paper) {
    var seen = {};
    if (paper.openalex_id) seen["https://openalex.org/" + paper.openalex_id] = true;
    if (paper.doi) seen["https://doi.org/" + paper.doi] = true;
    return items.filter(function (w) {
      var key = w.id || w.doi || w.display_name;
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  // 生成时间用本地时间。toISOString() 返回的是 UTC，在中国会显示成早 8 小时
  // 的时间（23:06 显示成 15:06），看起来像缓存了半天的旧数据。
  function localStamp(d) {
    function p(n) { return n < 10 ? "0" + n : String(n); }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) +
           " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  // ---------- 主入口 ----------
  function recommend(paper) {
    var cats = REC.categories.filter(function (c) { return c.enabled; });
    return Promise.all(cats.map(function (c) {
      var build = BUILDERS[c.id];
      if (!build) return Promise.resolve({ id: c.id, label: c.label, items: [], error: "未知类别" });
      return build(paper)
        .then(function (items) { return { id: c.id, label: c.label, items: items, error: null }; })
        .catch(function (e) { return { id: c.id, label: c.label, items: [], error: String(e && e.message || e) }; });
    })).then(function (categories) {
      // 作者画像：第一作者 + 末位作者，最多两个请求
      var picks = [];
      var last = paper.authors.filter(function (a) { return a.position === "last" && a.openalex_id; })[0];
      var first = paper.authors.filter(function (a) { return a.position === "first" && a.openalex_id; })[0];
      if (last) picks.push(last);
      if (first && (!last || first.openalex_id !== last.openalex_id)) picks.push(first);
      return Promise.all(picks.map(function (a) {
        return fetchAuthorProfile(a.openalex_id).then(function (p) {
          return p ? Object.assign({ position: a.position, affiliations: a.affiliations }, p) : null;
        });
      })).then(function (profiles) {
        return {
          categories: categories,
          authorProfiles: profiles.filter(Boolean),
          generatedAt: localStamp(new Date()),
          total: categories.reduce(function (n, c) { return n + c.items.length; }, 0)
        };
      });
    });
  }

  // ---------- 导出成 Markdown（交给 AI 润色推荐理由用） ----------
  function toMarkdown(paper, rec) {
    var L = [];
    L.push("# 相关文献推荐清单：" + paper.title);
    L.push("");
    L.push("- DOI: " + (paper.doi || ""));
    L.push("- 出处: " + [paper.journal, paper.year, paper.volume && ("vol." + paper.volume), paper.pages].filter(Boolean).join(", "));
    L.push("- 作者: " + paper.authors.map(function (a) { return a.name; }).join("; "));
    L.push("- 生成时间: " + rec.generatedAt + "（Crossref + OpenAlex 自动抓取，理由未经人工润色）");
    L.push("");
    rec.categories.forEach(function (c) {
      L.push("## " + c.label + "（" + c.items.length + " 条）");
      L.push("");
      if (!c.items.length) { L.push("_无结果_"); L.push(""); return; }
      c.items.forEach(function (it, i) {
        L.push((i + 1) + ". **" + it.title + "** (" + it.year + ")");
        L.push("   - 链接: " + it.link);
        L.push("   - 出处: " + it.venue + " ｜ 被引 " + it.cited_by_count + " 次" + (it.is_oa ? " ｜ 有开放获取版本" : ""));
        if (it.authors_short) L.push("   - 作者: " + it.authors_short);
        if (it.description) L.push("   - 摘要首句: " + it.description);
        L.push("   - 自动理由: " + it.reason);
      });
      L.push("");
    });
    if (rec.authorProfiles && rec.authorProfiles.length) {
      L.push("## 作者画像");
      L.push("");
      rec.authorProfiles.forEach(function (p) {
        L.push("- " + p.name + "（" + p.position + "）: 论文 " + p.works_count + " 篇，总被引 " + p.cited_by_count +
               "，h 指数 " + p.h_index + "，主要主题: " + p.top_topics.map(function (t) { return t.name + "(" + t.count + ")"; }).join("、"));
      });
    }
    return L.join("\n");
  }

  // 只导出 app.js 真正会用到的四个入口，其余都是模块内部实现
  return {
    fetchPaper: fetchPaper,
    recommend: recommend,
    fetchAuthorProfile: fetchAuthorProfile,
    toMarkdown: toMarkdown
  };
})();
