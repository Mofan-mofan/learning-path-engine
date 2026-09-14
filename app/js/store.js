// ============================================================
// js/store.js —— 论文库的读写
//
// 两个来源合成一个列表：
//   · data/papers.js 里「固化论文」（跟着 app 一起发布，打开就能用，
//     不需要联网）
//   · 用户自己用 DOI 导入的论文（存在浏览器 localStorage 里）
//
// 评分单独存，键名带上 instance_id，所以换论文不会互相覆盖。
// ============================================================
window.Store = (function () {

  var CFG = window.APP_CONFIG.storage;

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;   // 隐私模式或存储被禁用时不崩，退回默认值
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;      // 超过配额时返回 false，由界面提示用户
    }
  }

  // ---------- 论文库 ----------
  function curatedPapers() {
    return (window.PAPERS || []).slice();
  }

  function importedPapers() {
    return readJSON(CFG.libraryKey, []);
  }

  // 全部论文：固化的在前，导入的按导入时间倒序
  function allPapers() {
    var imported = importedPapers().slice().sort(function (a, b) {
      return String(b.importedAt || "").localeCompare(String(a.importedAt || ""));
    });
    return curatedPapers().concat(imported);
  }

  function findPaper(instanceId) {
    var list = allPapers();
    for (var i = 0; i < list.length; i++) {
      if (list[i].instance_id === instanceId) return list[i];
    }
    return null;
  }

  function isCurated(instanceId) {
    return curatedPapers().some(function (p) { return p.instance_id === instanceId; });
  }

  // 保存一篇导入的论文。同一 DOI 再导入就是覆盖（更新元数据与推荐结果）。
  function saveImported(paper) {
    var list = importedPapers();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].instance_id === paper.instance_id) { idx = i; break; }
    }
    var record = Object.assign({}, paper, {
      importedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      source: "imported"
    });
    if (idx >= 0) list[idx] = record; else list.push(record);
    var ok = writeJSON(CFG.libraryKey, list);
    return { ok: ok, paper: record };
  }

  function removeImported(instanceId) {
    var list = importedPapers().filter(function (p) { return p.instance_id !== instanceId; });
    writeJSON(CFG.libraryKey, list);
    // 顺手清掉它的评分
    var all = readJSON(CFG.scoresKey, {});
    if (all[instanceId]) { delete all[instanceId]; writeJSON(CFG.scoresKey, all); }
    return list;
  }

  // ---------- 评分（按论文分开存）----------
  // 结构：{ "论文instance_id": { "节点node_id": 0-10 } }
  function allScores() {
    return readJSON(CFG.scoresKey, {});
  }

  function getScores(instanceId) {
    return allScores()[instanceId] || {};
  }

  function setScore(instanceId, nodeId, value) {
    var all = allScores();
    all[instanceId] = all[instanceId] || {};
    all[instanceId][nodeId] = value;
    return writeJSON(CFG.scoresKey, all);
  }

  function clearScores(instanceId) {
    var all = allScores();
    delete all[instanceId];
    return writeJSON(CFG.scoresKey, all);
  }

  // ---------- 相关文献推荐的本地缓存 ----------
  // 推荐结果挂在论文记录上（paper.recommendation），导入的论文随记录一起进
  // localStorage；固化论文不能改文件，所以缓存在这里单独存一份。
  var REC_CACHE_PREFIX = "rec-cache.";

  function getCachedRecommendation(instanceId) {
    return readJSON(REC_CACHE_PREFIX + instanceId, null);
  }

  function cacheRecommendation(instanceId, rec) {
    return writeJSON(REC_CACHE_PREFIX + instanceId, rec);
  }

  // ---------- 上次打开的论文 ----------
  function getLastPaper() {
    try { return localStorage.getItem(CFG.lastPaperKey) || ""; } catch (e) { return ""; }
  }

  function setLastPaper(instanceId) {
    try { localStorage.setItem(CFG.lastPaperKey, instanceId); } catch (e) { /* 忽略 */ }
  }

  // ---------- 导出 / 清空 ----------
  function exportLibrary() {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      importedPapers: importedPapers(),
      scores: allScores()
    }, null, 2);
  }

  return {
    allPapers: allPapers,
    curatedPapers: curatedPapers,
    importedPapers: importedPapers,
    findPaper: findPaper,
    isCurated: isCurated,
    saveImported: saveImported,
    removeImported: removeImported,
    getScores: getScores,
    setScore: setScore,
    clearScores: clearScores,
    getCachedRecommendation: getCachedRecommendation,
    cacheRecommendation: cacheRecommendation,
    getLastPaper: getLastPaper,
    setLastPaper: setLastPaper,
    exportLibrary: exportLibrary
  };
})();
