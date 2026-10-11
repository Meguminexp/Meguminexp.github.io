/* 《你好！一周年》— core.js
 * 命名空间 / 工具函数 / 事件总线
 * 经典脚本：同时可在浏览器与 Node（用于构建与测试）中运行
 */
(function (root) {
  'use strict';
  const YJ = root.YJ = root.YJ || {};
  YJ.version = '2.0.0';
  YJ.TITLE = '你好！一周年';

  YJ.util = {
    /* 创建元素：el('div', 'cls', '文本') */
    el(tag, cls, text) {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    },
    q(sel, ctx) { return (ctx || document).querySelector(sel); },
    qa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); },
    clamp(v, a, b) { return v < a ? a : (v > b ? b : v); },
    /* 转义 HTML（剧情文本走 textContent，此处用于少数需要内联的地方） */
    esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[c]));
    },
    deep(o) { return JSON.parse(JSON.stringify(o)); },
    now() { return Date.now(); },
    /* 时间戳 -> 2024/05/01 20:31 */
    fmtTime(ts) {
      if (!ts) return '—';
      const d = new Date(ts);
      const p = n => (n < 10 ? '0' + n : '' + n);
      return d.getFullYear() + '/' + p(d.getMonth() + 1) + '/' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    },
    /* 秒 -> 12:34 或 1:02:03 */
    fmtDur(ms) {
      const s = Math.max(0, Math.floor(ms / 1000));
      const p = n => (n < 10 ? '0' + n : '' + n);
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
      return h > 0 ? h + ':' + p(m) + ':' + p(ss) : m + ':' + p(ss);
    },
    /* 相对时间：3 分钟前 */
    ago(ts) {
      if (!ts) return '';
      const d = Date.now() - ts;
      if (d < 60000) return '刚刚';
      if (d < 3600000) return Math.floor(d / 60000) + ' 分钟前';
      if (d < 86400000) return Math.floor(d / 3600000) + ' 小时前';
      return Math.floor(d / 86400000) + ' 天前';
    },
    /* 截断文本（用于存档预览） */
    cut(s, n) { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n) + '…' : s; }
  };

  /* 极简事件总线 */
  YJ.bus = {
    _h: {},
    on(k, fn) { (this._h[k] = this._h[k] || []).push(fn); return () => this.off(k, fn); },
    off(k, fn) { const a = this._h[k]; if (a) this._h[k] = a.filter(f => f !== fn); },
    emit(k) {
      const args = Array.prototype.slice.call(arguments, 1);
      (this._h[k] || []).forEach(fn => { try { fn.apply(null, args); } catch (e) { console.warn('[YJ.bus] ' + k, e); } });
    }
  };

  /* 调试开关：URL 带 ?debug=1 */
  YJ.DEBUG = /(\?|&)debug=1/.test(typeof location !== 'undefined' ? location.search : '');
  /* ?chat=all —— 聊天窗口一次性展开全部消息（用于文档截图 / 校对） */
  YJ.CHAT_ALL = /(\?|&)chat=all/.test(typeof location !== 'undefined' ? location.search : '');
  YJ.log = function () {
    if (YJ.DEBUG && typeof console !== 'undefined') console.log.apply(console, ['[YJ]'].concat([].slice.call(arguments)));
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
