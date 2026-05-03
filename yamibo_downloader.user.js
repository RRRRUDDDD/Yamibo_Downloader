// ==UserScript==
// @name         百合会下载器
// @namespace    https://github.com/RRRRUDDDD/yamibo_downloader
// @version      2.4
// @description  用于下载百合会的小说与漫画，下载格式可选epub与txt
// @author       RUD
// @match        *://bbs.yamibo.com/thread-*
// @match        *://bbs.yamibo.com/forum.php?mod=viewthread*
// @match        *://bbs.yamibo.com/misc.php?mod=tag*
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/567671/%E7%99%BE%E5%90%88%E4%BC%9A%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/567671/%E7%99%BE%E5%90%88%E4%BC%9A%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FORMATS = ['EPUB', 'TXT', 'BOTH'];
    let currentFormat = GM_getValue('downloadFormat', 'EPUB');

    // ==========================================
    // css设定
    // ==========================================
    const CUSTOM_CSS = `/*預設文本樣式*/
body {
  padding: 0%;
  margin-top: 0%;
  margin-bottom: 0%;
  margin-left: 1%;
  margin-right: 1%;
  line-height: 130%;
  text-align: justify;
}

h1 {
  text-indent: 0;
  duokan-text-indent: 0;
  font-size: 1.5em;
  line-height: 100%;
  text-align: center;
  font-weight: bold;
  margin-top: 50%;
  font-family: ch3, illus1, sym;
}

h2 {
  text-indent: 0;
  duokan-text-indent: 0;
  line-height: 1.1em;
  font-weight: bold;
  margin: 2em 0 2em 1.7em;
  font-family: ch3, illus1, sym;
  font-size: 1.2em;
}

h3 {
  font-size: 0.95em;
  line-height: 120%;
  text-align: center;
  text-indent: 0em;
  duokan-text-indent: 0em;
  font-weight: bold;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}

h4 {
  font-size: 1.4em;
  text-align: center;
  line-height: 1.2em;
  text-indent: 0em;
  duokan-text-indent: 0em;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 1.5em;
  font-family: ch3, illus1, sym;
}

div {
  margin: 0px;
  padding: 0px;
  text-align: justify;
}

p {
  text-indent: 2em;
  duokan-text-indent: 2em;
  display: block;
  line-height: 1.3em;
  margin-top: 0.4em;
  margin-bottom: 0.4em;
}

/*預設目錄樣式*/
.contents {
  text-indent: 0em;
  duokan-text-indent: 0em;
  text-align: left;
  margin: 0 0 1em 0;
  font-family: title;
}

.mulu {
  text-indent: 0em;
  duokan-text-indent: 0em;
  text-align: left;
  padding: 0 0 0.6em 0;
  font-family: title, illus1;
}

.back {
  background-image: url(../Images/contents.jpg);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
}

.bg {
  background-image: url(../Images/contents.png);
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: 100% 100%;
}

a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

/*圖片相關*/
.illus {
  text-indent: 0em;
  duokan-text-indent: 0em;
  text-align: center;
}

.illus img {
  max-width: 100%;
}

.cover {
  margin: 0em;
  padding: 0em;
  text-indent: 0em;
  duokan-text-indent: 0em;
  text-align: center;
}

.coverborder {
  border-style: none;
  border-color: #716F71;
  border-width: 1px;
}

/*預設格式相關樣式*/
.right {
  text-indent: 0em;
  duokan-text-indent: 0em;
  text-align: right;
}

.left {
  text-indent: 0em;
  duokan-text-indent: 0em;
  text-align: left;
}

.center {
  text-indent: 0em;
  duokan-text-indent: 0em;
  text-align: center;
}

.zin {
  text-indent: 0em;
  duokan-text-indent: 0em;
}

.bold {
  font-weight: bold;
}

.vt {
  vertical-align: top;
}

.vb {
  vertical-align: bottom;
}

.vm {
  vertical-align: middle;
  vertical-align: duokan-middle-line;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.cl {
  clear: left;
}

.cr {
  clear: right;
}

.cb {
  clear: both;
}

.cc {
  margin: 0 auto;
  width: 300px;
}

.w {
  width: 100%;
}

.m0 {
  margin: 0;
}

.p0 {
  padding: 0;
}

.bs {
  border-spacing: 0;
}

.bc {
  border-collapse: collapse;
  line-height: 1em;
}

.lh {
  line-height: 1em;
}

.t-lt {
  text-decoration: line-through;
}

.rotate1 {
  -webkit-transform: rotate(-4deg);
  transform: rotate(-4deg);
}

.dot {
  -webkit-text-emphasis-style: filled dot;
  -webkit-text-emphasis-position: under;
  -epub-text-emphasis-style: filled circle;
  -epub-text-emphasis-position: under;
  text-emphasis: circle #000;
  text-emphasis-position: under;
}

ol {
  list-style: none;
}

.stress {
  font-weight: bold;
  font-size: 1.1em;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
}

.author {
  font-size: 1.2em;
  text-align: right;
  font-weight: bold;
  font-style: italic;
  margin-right: 1em;
}

.dash-break {
  word-break: break-all;
  word-wrap: break-word;
}

.no-d {
  text-decoration: none;
}

/*制作信息*/
.message {
  text-indent: 0em;
  duokan-text-indent: 0em;
  line-height: 1.2em;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  font-family: mes, sym;
}

.meg {
  text-indent: 0em;
  duokan-text-indent: 0em;
  font-size: 1.3em;
  font-weight: bold;
  line-height: 1.3em;
  margin: 0.5em 0;
  font-family: mes;
}

.tilh {
  text-indent: 0em;
  duokan-text-indent: 0;
  line-height: 1em;
  margin: 0;
}

/*文字大小*/
.em01 {
  font-size: 0.1em;
}

.em02 {
  font-size: 0.2em;
}

.em03 {
  font-size: 0.3em;
}

.em04 {
  font-size: 0.4em;
}

.em05 {
  font-size: 0.5em;
}

.em06 {
  font-size: 0.6em;
}

.em07 {
  font-size: 0.7em;
}

.em075 {
  font-size: 0.75em;
}

.em08 {
  font-size: 0.8em;
}

.em085 {
  font-size: 0.85em;
}

.em09 {
  font-size: 0.9em;
}

.em095 {
  font-size: 0.95em;
}

.em10 {
  font-size: 1em !important;
}

.em105 {
  font-size: 1.05em;
}

.em11 {
  font-size: 1.1em;
}

.em115 {
  font-size: 1.15em;
}

.em12 {
  font-size: 1.2em;
}

.em125 {
  font-size: 1.25em;
}

.em13 {
  font-size: 1.3em;
}

.em14 {
  font-size: 1.4em;
}

.em15 {
  font-size: 1.5em;
}

.em16 {
  font-size: 1.6em;
}

.em17 {
  font-size: 1.7em;
}

.em18 {
  font-size: 1.8em;
}

.em19 {
  font-size: 1.9em;
}

.em20 {
  font-size: 2em;
}

.em21 {
  font-size: 2.1em;
}

.em22 {
  font-size: 2.2em;
}

.em23 {
  font-size: 2.3em;
}

.em24 {
  font-size: 2.4em;
}

.em25 {
  font-size: 2.5em;
}

.em26 {
  font-size: 2.6em;
}

.em27 {
  font-size: 2.7em;
}

.em28 {
  font-size: 2.8em;
}

.em29 {
  font-size: 2.9em;
}

.em30 {
  font-size: 3em;
}

.em31 {
  font-size: 3.1em;
}

.em32 {
  font-size: 3.2em;
}

.em33 {
  font-size: 3.3em;
}

.em34 {
  font-size: 3.4em;
}

.em35 {
  font-size: 3.5em;
}

.em36 {
  font-size: 3.6em;
}

.em37 {
  font-size: 3.7em;
}

.em38 {
  font-size: 3.8em;
}

.em39 {
  font-size: 3.9em;
}

.em40 {
  font-size: 4em;
}

.em41 {
  font-size: 4.1em;
}

.em42 {
  font-size: 4.2em;
}

.em43 {
  font-size: 4.3em;
}

.em44 {
  font-size: 4.4em;
}

.em45 {
  font-size: 4.5em;
}

.em46 {
  font-size: 4.6em;
}

.em47 {
  font-size: 4.7em;
}

.em48 {
  font-size: 4.8em;
}

.em49 {
  font-size: 4.9em;
}

.em50 {
  font-size: 5em;
}

.em51 {
  font-size: 5.1em;
}

.em52 {
  font-size: 5.2em;
}

.em53 {
  font-size: 5.3em;
}

.em54 {
  font-size: 5.4em;
}

.em55 {
  font-size: 5.5em;
}

.em56 {
  font-size: 5.6em;
}

.em57 {
  font-size: 5.7em;
}

.em58 {
  font-size: 5.8em;
}

.em59 {
  font-size: 5.9em;
}

.em60 {
  font-size: 6em;
}

/*預設註釋樣式*/
.footnote {
  height: 1.2em !important;
  width: auto;
  border: 0;
}

.duokan-footnote {
  height: 1.2em !important;
  width: auto;
  border: 0;
}

.duokan-footnote-item {
  text-indent: 0em;
  duokan-text-indent: 0em;
  font-family: "DK-SONGTI";
  text-shadow: 0em 0em 0.1em #000000;
  font-size: 0.9em;
  text-align: left;
}

sup {
  font-size: 0.75em;
  line-height: 1.2;
  vertical-align: super !important;
}

/*字型*/
@font-face {
  font-family: "ch3";
  src: url(../Fonts/ch3.ttf);
}

.ch3 {
  font-family: ch3;
}

@font-face {
  font-family: "title";
  src: url(../Fonts/title.ttf);
}

.title {
  font-family: title;
}

@font-face {
  font-family: "illus1";
  src: url(../Fonts/illus1.ttf);
}

.illus1 {
  font-family: illus1;
}

@font-face {
  font-family: "illus2";
  src: url(../Fonts/illus2.ttf);
}

.illus2 {
  font-family: illus2;
}

@font-face {
  font-family: "mes";
  src: url(../Fonts/mes.ttf);
}

.mes {
  font-family: mes;
}

@font-face {
  font-family: "sym";
  src: url(../Fonts/sym.ttf);
}

.sym {
  font-family: sym;
}

@font-face {
  font-family: "emoji";
  src: url(../Fonts/emoji.ttf);
}

.emoji {
  font-family: emoji;
}

.spe {
  font-family: emoji, sym;
}

/*關於summary*/
.s-hr1 {
  margin: 1.0em -3em -1px -3em;
  border-top: solid 2px #000;
  line-height: 1em;
}

.s-hr2 {
  margin: 11px -3em -0.5em -3em;
  border-top: solid 2px #000;
  line-height: 1em;
}

.summary {
  margin: 0;
  padding: 0;
  text-align: center;
  text-indent: 0em;
  duokan-text-indent: 0em;
  font-family: "DK-SYMBOL";
}

.pius1 {
  font-size: 1.3em;
  text-align: center;
  line-height: 1.2em;
  text-indent: 0em;
  duokan-text-indent: 0em;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 1.5em;
  font-family: illus1;
}

.biaoti1 {
  text-align: center;
  text-indent: 0em;
  duokan-text-indent: 0em;
}

.biaoti2 {
  font-size: 0.9em;
  text-align: center;
  text-indent: 0em;
  duokan-text-indent: 0em;
  font-weight: bold;
}

.cut {
  line-height: 1.1em;
  margin: 3em 0 2em 1.5em;
  font-size: 1.1em;
  font-weight: bold;
  font-family: title;
}

.cut img {
  height: 2em;
}

.c1 {
  color: #FABC11;
}
`;

    const SOFTUI_STYLE = document.createElement('style');
    SOFTUI_STYLE.textContent = `
:root {
    --yd-primary: #732c19;
    --yd-primary-hover: #8a3520;
    --yd-primary-gradient: #a0452a;
    --yd-bg: #fcf4cf;
    --yd-text: #3d2014;
    --yd-text-secondary: #6b4a38;
    --yd-text-muted: #8a6550;
    --yd-text-dark: #4a2e1c;
    --yd-shadow-dark: rgba(80, 30, 10, 0.18);
    --yd-shadow-dark-sm: rgba(80, 30, 10, 0.1);
    --yd-shadow-dark-xs: rgba(80, 30, 10, 0.15);
    --yd-shadow-dark-md: rgba(80, 30, 10, 0.3);
    --yd-shadow-dark-lg: rgba(80, 30, 10, 0.35);
    --yd-shadow-dark-xl: rgba(80, 30, 10, 0.45);
    --yd-shadow-dark-hover: rgba(80, 30, 10, 0.25);
    --yd-shadow-dark-active: rgba(80, 30, 10, 0.2);
    --yd-shadow-dark-press: rgba(80, 30, 10, 0.4);
    --yd-shadow-light: rgba(255, 252, 230, 0.7);
    --yd-shadow-light-sm: rgba(255, 252, 230, 0.5);
    --yd-shadow-light-md: rgba(255, 252, 230, 0.9);
    --yd-shadow-light-lg: rgba(255, 252, 230, 1);
    --yd-shadow-light-hover: rgba(255, 252, 230, 0.8);
    --yd-shadow-inset-dark: rgba(50, 15, 5, 0.3);
    --yd-shadow-inset-dark-press: rgba(50, 15, 5, 0.4);
    --yd-shadow-inset-light: rgba(160, 70, 40, 0.4);
    --yd-highlight: rgba(115, 44, 25, 0.06);
    --yd-scrollbar: rgba(115, 44, 25, 0.25);
    --yd-overlay-bg: rgba(50, 30, 15, 0.5);
    --yd-overlay-bg-blur: rgba(50, 30, 15, 0.35);
    --yd-transition: 180ms ease;
    --yd-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
#yd-overlay,
#yd-overlay *,
#epub-export-btn,
#yd-progress-wrap {
    box-sizing: border-box;
    font-family: var(--yd-font);
}

/* ===== 主按钮 ===== */
#epub-export-btn {
    background: var(--yd-primary) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 8px 22px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    box-shadow: 4px 4px 10px var(--yd-shadow-dark-lg),
                -4px -4px 10px var(--yd-shadow-light) !important;
    transition: box-shadow var(--yd-transition), transform var(--yd-transition) !important;
    margin-left: 15px !important;
    letter-spacing: 0.5px !important;
    position: relative !important;
}
#epub-export-btn:hover {
    box-shadow: 6px 6px 14px var(--yd-shadow-dark-xl),
                -6px -6px 14px var(--yd-shadow-light-hover) !important;
    transform: translateY(-2px) !important;
}
#epub-export-btn:active {
    box-shadow: inset 3px 3px 7px var(--yd-shadow-dark-press),
                inset -3px -3px 7px var(--yd-shadow-light-sm) !important;
    transform: translateY(0) !important;
}
#epub-export-btn:disabled {
    opacity: 0.7 !important;
    cursor: not-allowed !important;
    transform: none !important;
}
#epub-export-btn.yd-fixed {
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    z-index: 9999 !important;
}

/* ===== 进度条 ===== */
#yd-progress-wrap {
    background: var(--yd-bg);
    border-radius: 10px;
    box-shadow: inset 3px 3px 6px var(--yd-shadow-dark-active),
                inset -3px -3px 6px var(--yd-shadow-light-hover);
    height: 8px;
    margin-top: 6px;
    overflow: hidden;
    display: none;
    width: 200px;
    position: absolute;
    bottom: -14px;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
}
#yd-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--yd-primary), var(--yd-primary-gradient));
    border-radius: 10px;
    width: 0%;
    transition: width 300ms ease;
}

/* ===== 遮罩层 ===== */
#yd-overlay {
    position: fixed !important;
    top: 0 !important; left: 0 !important;
    width: 100% !important; height: 100% !important;
    background: var(--yd-overlay-bg) !important;
    z-index: 10000 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}
@supports (backdrop-filter: blur(6px)) {
    #yd-overlay {
        background: var(--yd-overlay-bg-blur) !important;
        backdrop-filter: blur(6px) !important;
        -webkit-backdrop-filter: blur(6px) !important;
    }
}

/* ===== 弹窗主体 ===== */
#yd-modal {
    background: var(--yd-bg) !important;
    padding: 28px 30px !important;
    border-radius: 20px !important;
    width: 80% !important;
    max-width: 600px !important;
    max-height: 80vh !important;
    display: flex !important;
    flex-direction: column !important;
    box-shadow: 10px 10px 24px var(--yd-shadow-dark-md),
                -10px -10px 24px var(--yd-shadow-light-md) !important;
    color: var(--yd-text) !important;
}

/* ===== 弹窗标题 ===== */
#yd-modal .yd-title {
    margin: 0 0 18px 0 !important;
    padding-bottom: 14px !important;
    border-bottom: none !important;
    text-align: center !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    color: var(--yd-primary) !important;
    position: relative !important;
}
#yd-modal .yd-title::after {
    content: '' !important;
    display: block !important;
    width: 60px !important;
    height: 3px !important;
    background: var(--yd-primary) !important;
    border-radius: 2px !important;
    margin: 12px auto 0 !important;
}

/* ===== 格式选择 - 分段控件 ===== */
.yd-segment {
    display: flex !important;
    background: var(--yd-bg) !important;
    border-radius: 14px !important;
    box-shadow: inset 3px 3px 7px var(--yd-shadow-dark),
                inset -3px -3px 7px var(--yd-shadow-light-md) !important;
    padding: 4px !important;
    margin-bottom: 18px !important;
    gap: 0 !important;
}
.yd-segment input[type="radio"] {
    display: none !important;
}
.yd-segment label {
    flex: 1 !important;
    text-align: center !important;
    padding: 9px 0 !important;
    border-radius: 11px !important;
    cursor: pointer !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    color: var(--yd-text-muted) !important;
    transition: color var(--yd-transition), background var(--yd-transition), box-shadow var(--yd-transition) !important;
    margin: 0 !important;
    user-select: none !important;
}
.yd-segment label:hover {
    color: var(--yd-primary) !important;
}
.yd-segment input[type="radio"]:checked + label {
    background: var(--yd-primary) !important;
    color: #fff !important;
    box-shadow: 3px 3px 8px var(--yd-shadow-dark-md),
                -3px -3px 8px var(--yd-shadow-light-sm) !important;
    font-weight: 600 !important;
}

/* ===== 控制按钮（全选/反选） ===== */
.yd-ctrl-btn {
    background: var(--yd-bg) !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 7px 16px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    color: var(--yd-text-secondary) !important;
    cursor: pointer !important;
    box-shadow: 3px 3px 7px var(--yd-shadow-dark),
                -3px -3px 7px var(--yd-shadow-light-md) !important;
    transition: box-shadow var(--yd-transition), transform var(--yd-transition) !important;
    margin-right: 10px !important;
}
.yd-ctrl-btn:hover {
    box-shadow: 5px 5px 10px var(--yd-shadow-dark-hover),
                -5px -5px 10px var(--yd-shadow-light-lg) !important;
    transform: translateY(-1px) !important;
}
.yd-ctrl-btn:active {
    box-shadow: inset 2px 2px 5px var(--yd-shadow-dark-active),
                inset -2px -2px 5px var(--yd-shadow-light) !important;
    transform: translateY(0) !important;
}

/* ===== 章节列表容器 ===== */
.yd-list {
    flex: 1 !important;
    overflow-y: auto !important;
    background: var(--yd-bg) !important;
    border-radius: 14px !important;
    box-shadow: inset 3px 3px 7px var(--yd-shadow-dark-xs),
                inset -3px -3px 7px var(--yd-shadow-light-md) !important;
    padding: 14px 16px !important;
    margin-bottom: 18px !important;
    border: none !important;
}
.yd-list::-webkit-scrollbar {
    width: 6px !important;
}
.yd-list::-webkit-scrollbar-track {
    background: transparent !important;
}
.yd-list::-webkit-scrollbar-thumb {
    background: var(--yd-scrollbar) !important;
    border-radius: 3px !important;
}

/* ===== 章节列表项 ===== */
.yd-list label {
    display: flex !important;
    align-items: center !important;
    padding: 8px 10px !important;
    margin-bottom: 4px !important;
    border-radius: 10px !important;
    cursor: pointer !important;
    word-break: break-all !important;
    transition: background 150ms ease, box-shadow 150ms ease !important;
    font-size: 14px !important;
    color: var(--yd-text-dark) !important;
}
.yd-list label:hover {
    background: var(--yd-highlight) !important;
    box-shadow: 2px 2px 5px var(--yd-shadow-dark-sm),
                -2px -2px 5px var(--yd-shadow-light) !important;
}

/* ===== 自定义 Checkbox ===== */
.yd-list input[type="checkbox"] {
    -webkit-appearance: none !important;
    appearance: none !important;
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    border-radius: 6px !important;
    background: var(--yd-bg) !important;
    box-shadow: inset 2px 2px 4px var(--yd-shadow-dark),
                inset -2px -2px 4px var(--yd-shadow-light-md) !important;
    cursor: pointer !important;
    margin: 0 10px 0 0 !important;
    transition: background var(--yd-transition), box-shadow var(--yd-transition) !important;
    position: relative !important;
    border: none !important;
}
.yd-list input[type="checkbox"]:checked {
    background: var(--yd-primary) !important;
    box-shadow: inset 2px 2px 4px var(--yd-shadow-inset-dark),
                inset -2px -2px 4px var(--yd-shadow-inset-light) !important;
}
.yd-list input[type="checkbox"]:checked::after {
    content: '' !important;
    position: absolute !important;
    left: 6px !important;
    top: 2px !important;
    width: 6px !important;
    height: 11px !important;
    border: solid var(--yd-bg) !important;
    border-width: 0 2.5px 2.5px 0 !important;
    transform: rotate(45deg) !important;
}

/* ===== 单条章节"全楼层"开关 ===== */
.yd-op-mode {
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    margin-left: auto !important;
    padding: 2px 8px !important;
    font-size: 12px !important;
    color: var(--yd-text-secondary) !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    user-select: none !important;
    flex-shrink: 0 !important;
}
.yd-op-mode input[type="checkbox"] {
    width: 14px !important;
    height: 14px !important;
    min-width: 14px !important;
    margin: 0 !important;
    border-radius: 4px !important;
}
/* 覆写勾的位置/尺寸，匹配 14px 小框（默认 .yd-list 规则是给 20px 大框设计的） */
.yd-list .yd-op-mode input[type="checkbox"]:checked::after {
    left: 4px !important;
    top: 1px !important;
    width: 3.5px !important;
    height: 7.5px !important;
    border-width: 0 1.6px 1.6px 0 !important;
}
.yd-op-mode:has(input:checked) {
    color: var(--yd-primary) !important;
    font-weight: 500 !important;
}
.yd-list label .yd-chap-title {
    flex: 1 !important;
    min-width: 0 !important;
    overflow-wrap: anywhere !important;
}
.yd-allop-btn {
    margin-right: 10px !important;
}

/* ===== 操作按钮区域 ===== */
.yd-actions {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 10px !important;
}

/* ===== 次要按钮（取消、获取楼主楼层） ===== */
.yd-btn-secondary {
    background: var(--yd-bg) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 10px 22px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    color: var(--yd-text-secondary) !important;
    cursor: pointer !important;
    box-shadow: 4px 4px 10px var(--yd-shadow-dark),
                -4px -4px 10px var(--yd-shadow-light-md) !important;
    transition: box-shadow var(--yd-transition), transform var(--yd-transition) !important;
}
.yd-btn-secondary:hover {
    box-shadow: 6px 6px 12px var(--yd-shadow-dark-hover),
                -6px -6px 12px var(--yd-shadow-light-lg) !important;
    transform: translateY(-2px) !important;
}
.yd-btn-secondary:active {
    box-shadow: inset 3px 3px 6px var(--yd-shadow-dark-active),
                inset -3px -3px 6px var(--yd-shadow-light) !important;
    transform: translateY(0) !important;
}

/* ===== 主要按钮（确认提取） ===== */
.yd-btn-primary {
    background: var(--yd-primary) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 10px 26px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    box-shadow: 4px 4px 10px var(--yd-shadow-dark-lg),
                -4px -4px 10px var(--yd-shadow-light) !important;
    transition: background var(--yd-transition), box-shadow var(--yd-transition), transform var(--yd-transition) !important;
}
.yd-btn-primary:hover {
    background: var(--yd-primary-hover) !important;
    box-shadow: 6px 6px 14px var(--yd-shadow-dark-xl),
                -6px -6px 14px var(--yd-shadow-light-hover) !important;
    transform: translateY(-2px) !important;
}
.yd-btn-primary:active {
    box-shadow: inset 3px 3px 7px var(--yd-shadow-inset-dark-press),
                inset -3px -3px 7px var(--yd-shadow-light-sm) !important;
    transform: translateY(0) !important;
}

/* ===== 小号按钮修饰符 ===== */
.yd-btn-sm {
    padding: 7px 16px !important;
    font-size: 13px !important;
    border-radius: 10px !important;
}

/* ===== 格式标签 ===== */
.yd-format-label {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: var(--yd-primary) !important;
    margin-bottom: 10px !important;
    display: block !important;
}

/* ===== 控制栏 ===== */
.yd-ctrl-bar {
    margin-bottom: 12px !important;
    display: flex !important;
    align-items: center !important;
}
.yd-ctrl-bar .yd-ctrl-btn:last-of-type {
    margin-right: 0 !important;
}

/* ===== 按钮组 ===== */
.yd-btn-group {
    display: flex !important;
    gap: 10px !important;
}

/* ===== 筛选面板 ===== */
.yd-filter-panel {
    background: var(--yd-bg) !important;
    border-radius: 12px !important;
    box-shadow: inset 3px 3px 7px var(--yd-shadow-dark),
                inset -3px -3px 7px var(--yd-shadow-light-md) !important;
    padding: 14px 16px !important;
    margin-bottom: 12px !important;
    display: none !important;
}
.yd-filter-panel.yd-open {
    display: block !important;
}
.yd-filter-input {
    width: 100% !important;
    padding: 10px 14px !important;
    border: none !important;
    border-radius: 10px !important;
    background: var(--yd-bg) !important;
    box-shadow: inset 2px 2px 5px var(--yd-shadow-dark),
                inset -2px -2px 5px var(--yd-shadow-light-md) !important;
    font-size: 14px !important;
    color: var(--yd-text) !important;
    outline: none !important;
    font-family: var(--yd-font) !important;
    transition: box-shadow var(--yd-transition) !important;
}
.yd-filter-input:focus {
    box-shadow: inset 3px 3px 6px var(--yd-shadow-dark-md),
                inset -3px -3px 6px var(--yd-shadow-light) !important;
}
.yd-filter-input::placeholder {
    color: var(--yd-text-muted) !important;
    opacity: 0.7 !important;
}
.yd-filter-hint {
    font-size: 12px !important;
    color: var(--yd-text-muted) !important;
    margin-top: 8px !important;
    line-height: 1.5 !important;
}
.yd-filter-actions {
    display: flex !important;
    justify-content: flex-end !important;
    gap: 8px !important;
    margin-top: 10px !important;
}
`;
    (document.head || document.documentElement).appendChild(SOFTUI_STYLE);

    function getPageMode() {
        const href = window.location.href;
        if (href.includes('misc.php?mod=tag')) return 'tag';
        if (href.includes('thread-') || href.includes('viewthread')) return 'thread';
        return 'unknown';
    }

    function addButton() {
        if (document.getElementById('epub-export-btn')) return;
        const mode = getPageMode();
        if (mode === 'unknown') return;

        const btn = document.createElement('button');
        btn.id = 'epub-export-btn';
        btn.innerText = mode === 'tag' ? '提取本标签全部帖子' : '提取本帖内容';
        btn.onclick = startExtraction;

        const progressWrap = document.createElement('div');
        progressWrap.id = 'yd-progress-wrap';
        const progressBar = document.createElement('div');
        progressBar.id = 'yd-progress-bar';
        progressWrap.appendChild(progressBar);
        btn.appendChild(progressWrap);

        if (mode === 'thread') {
            const titleSpan = document.querySelector('#thread_subject');
            if (titleSpan) titleSpan.parentNode.insertBefore(btn, titleSpan.nextSibling);
        } else if (mode === 'tag') {
            const header = document.querySelector('h1') || document.querySelector('.bm_h');
            if (header) header.appendChild(btn);
            else {
                btn.classList.add('yd-fixed');
                document.body.appendChild(btn);
            }
        }
    }

    addButton();
    document.addEventListener('DOMContentLoaded', addButton);
    window.addEventListener('load', addButton);

    function escapeXML(str) {
        if (!str) return '';
        return str.replace(/[\x00-\x1F\x7F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    function createChapterLabel(link, idx) {
        const lbl = document.createElement('label');
        lbl.innerHTML = `<input type="checkbox" class="chap-cb" value="${idx}" checked><span class="yd-chap-title">${idx + 1}. ${escapeXML(link.title)}</span><span class="yd-op-mode" title="勾选后扫描该帖楼主全部楼层（适用于图片在二楼及以上的情况）"><input type="checkbox" class="chap-op-cb" value="${idx}"><span>全楼层</span></span>`;
        const opCb = lbl.querySelector('.chap-op-cb');
        const opWrap = lbl.querySelector('.yd-op-mode');
        opWrap.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            opCb.checked = !opCb.checked;
        });
        return lbl;
    }

    function parseFilterExpr(expr, total) {
        const indices = new Set();
        expr.split(',').forEach(part => {
            part = part.trim();
            if (!part) return;
            if (part.includes('-')) {
                const dashIdx = part.indexOf('-');
                const a = part.substring(0, dashIdx).trim();
                const b = part.substring(dashIdx + 1).trim();
                const start = a ? parseInt(a, 10) : 1;
                const end = b ? parseInt(b, 10) : total;
                if (isNaN(start) || isNaN(end)) return;
                for (let i = Math.max(1, start); i <= Math.min(total, end); i++) {
                    indices.add(i - 1);
                }
            } else {
                const n = parseInt(part, 10);
                if (!isNaN(n) && n >= 1 && n <= total) indices.add(n - 1);
            }
        });
        return indices;
    }

    function fetchImageBuffer(url) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET', url: url, responseType: 'arraybuffer', headers: { 'Referer': window.location.href },
                    onload: res => res.status >= 200 && res.status < 300 && res.response ? resolve(res.response) : reject(new Error(`HTTP ${res.status}`)),
                    onerror: () => reject(new Error('Network Error'))
                });
            } else {
                fetch(url).then(res => res.ok ? res.arrayBuffer() : Promise.reject(new Error(`HTTP ${res.status}`))).then(resolve).catch(reject);
            }
        });
    }

    function buildModal(links, mode, fetchOPFloorsHelper, onLinksUpdate) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.id = 'yd-overlay';

            const modal = document.createElement('div');
            modal.id = 'yd-modal';

            const title = document.createElement('h3');
            title.className = 'yd-title';
            title.innerText = '请选择要下载的格式与章节';
            modal.appendChild(title);

            const formatLabel = document.createElement('span');
            formatLabel.className = 'yd-format-label';
            formatLabel.innerText = '下载格式';
            modal.appendChild(formatLabel);

            const formatDiv = document.createElement('div');
            formatDiv.className = 'yd-segment';
            const isEpub = currentFormat === 'EPUB' ? 'checked' : '';
            const isTxt = currentFormat === 'TXT' ? 'checked' : '';
            const isBoth = currentFormat === 'BOTH' ? 'checked' : '';
            formatDiv.innerHTML = `
                <input type="radio" name="dl_format" value="EPUB" id="yd-fmt-epub" ${isEpub || (!isTxt && !isBoth ? 'checked' : '')}>
                <label for="yd-fmt-epub">EPUB</label>
                <input type="radio" name="dl_format" value="TXT" id="yd-fmt-txt" ${isTxt}>
                <label for="yd-fmt-txt">TXT</label>
                <input type="radio" name="dl_format" value="BOTH" id="yd-fmt-both" ${isBoth}>
                <label for="yd-fmt-both">EPUB + TXT</label>
            `;
            modal.appendChild(formatDiv);

            const ctrlDiv = document.createElement('div');
            ctrlDiv.className = 'yd-ctrl-bar';
            ctrlDiv.innerHTML = `
                <button id="btn-sel-all" class="yd-ctrl-btn">全选</button>
                <button id="btn-sel-inv" class="yd-ctrl-btn">反选</button>
                <span style="flex:1"></span>
                <button id="btn-all-op" type="button" class="yd-btn-primary yd-btn-sm yd-allop-btn" title="一键勾选/取消所有章节右侧的全楼层开关">全部按全楼层</button>
                <button id="btn-filter" class="yd-ctrl-btn">筛选</button>
            `;
            modal.appendChild(ctrlDiv);

            const filterPanel = document.createElement('div');
            filterPanel.className = 'yd-filter-panel';
            filterPanel.innerHTML = `
                <input type="text" class="yd-filter-input" id="yd-filter-expr" placeholder="">
                <div class="yd-filter-hint">通过序号进行快速筛选，语法：99 = 第99章 | 9-99 = 第9~99章 | 9- = 第9章起 | -99 = 到第99章。也可通过如1-5, 8, 12-组合使用（逗号分隔）</div>
                <div class="yd-filter-actions">
                    <button class="yd-ctrl-btn" id="btn-filter-cancel">收起</button>
                    <button class="yd-btn-primary yd-btn-sm" id="btn-filter-apply">应用</button>
                </div>
            `;
            modal.appendChild(filterPanel);

            const listDiv = document.createElement('div');
            listDiv.className = 'yd-list';
            links.forEach((link, idx) => {
                listDiv.appendChild(createChapterLabel(link, idx));
            });
            modal.appendChild(listDiv);

            const btnDiv = document.createElement('div');
            btnDiv.className = 'yd-actions';

            const leftBtnDiv = document.createElement('div');
            if (mode === 'thread') {
                const fetchOpBtn = document.createElement('button');
                fetchOpBtn.innerText = '获取楼主全部楼层';
                fetchOpBtn.className = 'yd-btn-secondary';
                fetchOpBtn.onclick = async () => {
                    fetchOpBtn.innerText = '获取中...';
                    fetchOpBtn.disabled = true;
                    const opLinks = await fetchOPFloorsHelper();
                    if (opLinks.length > 0) {
                        onLinksUpdate(opLinks);
                        links = opLinks;
                        listDiv.innerHTML = '';
                        links.forEach((link, idx) => {
                            listDiv.appendChild(createChapterLabel(link, idx));
                        });
                        fetchOpBtn.innerText = '已切换';
                    } else {
                        fetchOpBtn.innerText = '获取失败';
                        fetchOpBtn.disabled = false;
                    }
                };
                leftBtnDiv.appendChild(fetchOpBtn);
            }
            btnDiv.appendChild(leftBtnDiv);

            const rightBtnDiv = document.createElement('div');
            rightBtnDiv.className = 'yd-btn-group';
            const cancelBtn = document.createElement('button');
            cancelBtn.innerText = '取消';
            cancelBtn.className = 'yd-btn-secondary';
            cancelBtn.onclick = () => { document.body.removeChild(overlay); resolve(null); };

            const confirmBtn = document.createElement('button');
            confirmBtn.innerText = '确认提取';
            confirmBtn.className = 'yd-btn-primary';
            confirmBtn.onclick = () => {
                const format = overlay.querySelector('input[name="dl_format"]:checked').value;
                const selectedIdxs = Array.from(overlay.querySelectorAll('.chap-cb:checked')).map(cb => parseInt(cb.value));
                const opModeIdxs = new Set(Array.from(overlay.querySelectorAll('.chap-op-cb:checked')).map(cb => parseInt(cb.value)));
                document.body.removeChild(overlay);
                resolve({ format, selectedIdxs, opModeIdxs });
            };

            rightBtnDiv.appendChild(cancelBtn);
            rightBtnDiv.appendChild(confirmBtn);
            btnDiv.appendChild(rightBtnDiv);

            modal.appendChild(btnDiv);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            overlay.querySelector('#btn-sel-all').onclick = () => {
                overlay.querySelectorAll('.chap-cb').forEach(cb => cb.checked = true);
            };
            overlay.querySelector('#btn-sel-inv').onclick = () => {
                overlay.querySelectorAll('.chap-cb').forEach(cb => cb.checked = !cb.checked);
            };
            overlay.querySelector('#btn-all-op').onclick = () => {
                const cbs = overlay.querySelectorAll('.chap-op-cb');
                if (cbs.length === 0) return;
                const allChecked = Array.from(cbs).every(cb => cb.checked);
                cbs.forEach(cb => cb.checked = !allChecked);
            };
            overlay.querySelector('#btn-filter').onclick = () => {
                filterPanel.classList.toggle('yd-open');
                const input = overlay.querySelector('#yd-filter-expr');
                if (filterPanel.classList.contains('yd-open')) input.focus();
            };
            overlay.querySelector('#btn-filter-cancel').onclick = () => {
                filterPanel.classList.remove('yd-open');
            };
            overlay.querySelector('#btn-filter-apply').onclick = () => {
                const expr = overlay.querySelector('#yd-filter-expr').value.trim();
                if (!expr) return;
                const cbs = overlay.querySelectorAll('.chap-cb');
                const matched = parseFilterExpr(expr, cbs.length);
                cbs.forEach(cb => { cb.checked = matched.has(parseInt(cb.value)); });
                filterPanel.classList.remove('yd-open');
            };
            overlay.querySelector('#yd-filter-expr').onkeydown = (e) => {
                if (e.key === 'Enter') overlay.querySelector('#btn-filter-apply').click();
            };
        });
    }

    async function startExtraction(e) {
        const btn = e.target.closest('#epub-export-btn') || e.target;
        btn.disabled = true;

        if (typeof fflate === 'undefined' && (currentFormat === 'EPUB' || currentFormat === 'BOTH')) {
            alert('fflate 打包引擎未加载，请刷新页面。');
            resetButton(btn, getPageMode()); return;
        }

        const mode = getPageMode();
        let links = [];
        let threadTitle = '';

        // 提取楼主楼层抓取逻辑为独立函数，以便复用
        async function fetchOPFloorsHelper() {
            let opLinks = [];
            try {
                const firstPostDiv = document.querySelector('#postlist > div[id^="post_"]');
                const opAuthLink = firstPostDiv ? firstPostDiv.querySelector('.authi a') : null;
                const tidMatch = window.location.href.match(/tid=(\d+)/) || window.location.href.match(/thread-(\d+)/);

                if (opAuthLink && tidMatch) {
                    const uidMatch = opAuthLink.getAttribute('href').match(/uid[=-](\d+)/);
                    const tid = tidMatch[1];
                    if (uidMatch) {
                        const opUid = uidMatch[1];
                        let curPage = 1;
                        let maxPage = 1;

                        while (curPage <= maxPage) {
                            const pageUrl = window.location.origin + `/forum.php?mod=viewthread&tid=${tid}&page=${curPage}&authorid=${opUid}`;
                            const res = await fetch(pageUrl);
                            const htmlText = await res.text();
                            const doc = new DOMParser().parseFromString(htmlText, 'text/html');

                            if (curPage === 1) {
                                const pg = doc.querySelector('.pg');
                                if (pg) {
                                    const pgs = pg.querySelectorAll('a');
                                    pgs.forEach(a => {
                                        const href = a.getAttribute('href') || '';
                                        const m = href.match(/page=(\d+)/);
                                        if (m && parseInt(m[1], 10) > maxPage) maxPage = parseInt(m[1], 10);
                                    });
                                    const pgLabel = pg.querySelector('label span');
                                    if (pgLabel && pgLabel.title) {
                                        const m = pgLabel.title.match(/共\s*(\d+)\s*页/);
                                        if (m && parseInt(m[1], 10) > maxPage) maxPage = parseInt(m[1], 10);
                                    }
                                }
                            }

                            const posts = doc.querySelectorAll('#postlist > div[id^="post_"]');
                            posts.forEach(post => {
                                const pid = post.id.replace('post_', '');
                                const floorNode = post.querySelector('a[id^="postnum"]');
                                let floorName = `楼层 ${pid}`;
                                if (floorNode) {
                                    floorName = floorNode.innerText.trim().replace(/[\r\n]/g, '');
                                }
                                opLinks.push({
                                    url: window.location.origin + `/forum.php?mod=viewthread&tid=${tid}&page=${curPage}&authorid=${opUid}&pid=${pid}#pid${pid}`,
                                    title: floorName
                                });
                            });
                            curPage++;
                            await new Promise(resolve => setTimeout(resolve, 300)); // 延迟防拦截
                        }
                    }
                }
            } catch(err) {
                console.error('获取楼主楼层失败', err);
            }
            return opLinks;
        }

        if (mode === 'thread') {
            const firstPost = document.querySelector('.t_f');
            if (!firstPost) { alert('未能定位到一楼内容！'); resetButton(btn, mode); return; }
            const rawLinks = Array.from(firstPost.querySelectorAll('a')).filter(a => {
                const rawHref = a.getAttribute('href');
                return rawHref && (rawHref.includes('viewthread') || rawHref.includes('thread-') || rawHref.includes('redirect')) && !rawHref.includes('mod=attachment') && !rawHref.includes('action=reply');
            });
            links = rawLinks.map(a => ({ url: a.href, title: a.innerText.trim() }));
            threadTitle = document.querySelector('#thread_subject').innerText.trim();

            if (links.length === 0) {
                setBtnText(btn, '未检测到链接，正在扫描楼主全部楼层...');
                links = await fetchOPFloorsHelper();
            }

        } else if (mode === 'tag') {
            const rawLinks = Array.from(document.querySelectorAll('a')).filter(a => {
                const href = a.getAttribute('href') || '';
                return (href.includes('thread-') || href.includes('viewthread')) && !href.includes('page=') && !href.includes('authorid') && !href.includes('lastpost') && !href.includes('mod=space') && a.innerText.trim().length > 0;
            });
            const uniqueMap = new Map();
            rawLinks.forEach(a => {
                let tidMatch = a.href.match(/thread-(\d+)/) || a.href.match(/tid=(\d+)/);
                if (tidMatch) {
                    let tid = tidMatch[1];
                    let title = a.innerText.trim();
                    if (!uniqueMap.has(tid) || title.length > uniqueMap.get(tid).title.length) uniqueMap.set(tid, { url: a.href, title: title });
                }
            });
            links = Array.from(uniqueMap.values());
            let titleText = document.title;
            let tagMatch = titleText.match(/标签 - (.*?) -/);
            threadTitle = tagMatch ? tagMatch[1].trim() : '标签合集';
        }

        if (links.length === 0) { alert('没有找到有效的帖子链接，且抓取楼主楼层失败！'); resetButton(btn, mode); return; }
        threadTitle = threadTitle.replace(/[\\/:*?"<>|]/g, '');

        const userSelection = await buildModal(links, mode, fetchOPFloorsHelper, (newLinks) => { links = newLinks; });

        if (!userSelection) {
            resetButton(btn, mode);
            return;
        }

        if (userSelection.selectedIdxs.length === 0) {
            alert('必须至少选择一个章节！');
            resetButton(btn, mode);
            return;
        }

        currentFormat = userSelection.format;
        GM_setValue('downloadFormat', currentFormat);
        const opModeIdxs = userSelection.opModeIdxs || new Set();
        links = userSelection.selectedIdxs.map(idx => ({ ...links[idx], fullOpMode: opModeIdxs.has(idx) }));

        const chapters = [];
        const imageRegistry = [];
        let imageCounter = 0;

        function parseToParagraphs(rootNode) {
            let paragraphs = [];
            let currentParagraph = '';

            function traverse(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    let text = escapeXML(node.textContent.replace(/&/g, '＆')).replace(/[\r\n]+/g, '');
                    currentParagraph += text;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tag = node.tagName.toUpperCase();

                    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'HR'].includes(tag)) return;
                    if (node.style && node.style.display === 'none') return;
                    if (node.classList && (node.classList.contains('jammer') || node.classList.contains('pstatus'))) return;
                    if (tag === 'RP') return;

                    if (tag === 'BR') {
                        paragraphs.push(currentParagraph);
                        currentParagraph = '';
                        return;
                    }

                    if (tag === 'IMG') {
                        if (currentParagraph !== '') { paragraphs.push(currentParagraph); currentParagraph = ''; }
                        let src = node.getAttribute('zoomfile') || node.getAttribute('file') || node.getAttribute('src');
                        if (src && !src.includes('smiley') && !src.includes('smilies') && !src.includes('none.gif')) {
                            let absUrl = new URL(src, window.location.href).href;
                            imageCounter++;
                            let ext = 'jpg';
                            if (absUrl.toLowerCase().includes('.png') || absUrl.startsWith('data:image/png')) ext = 'png';
                            else if (absUrl.toLowerCase().includes('.gif') || absUrl.startsWith('data:image/gif')) ext = 'gif';
                            else if (absUrl.toLowerCase().includes('.webp') || absUrl.startsWith('data:image/webp')) ext = 'webp';

                            let localFileName = `img_${imageCounter}.${ext}`;
                            let localPath = `../Images/${localFileName}`;
                            let mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

                            imageRegistry.push({ id: `img_${imageCounter}`, url: absUrl, localPath: localPath, fileName: localFileName, mime: mimeType, buffer: null });
                            paragraphs.push(`<div class="illus duokan-image-single"><img alt="${localFileName}" src="${localPath}" /></div>`);
                        }
                        return;
                    }

                    if (['DIV', 'P', 'BLOCKQUOTE', 'UL', 'LI', 'IGNORE_JS_OP'].includes(tag)) {
                        if (currentParagraph !== '') { paragraphs.push(currentParagraph); currentParagraph = ''; }
                        Array.from(node.childNodes).forEach(traverse);
                        if (currentParagraph !== '') { paragraphs.push(currentParagraph); currentParagraph = ''; }
                        return;
                    }

                    if (['B', 'STRONG', 'RUBY', 'RT', 'SPAN'].includes(tag)) {
                        let before = currentParagraph;
                        currentParagraph = '';
                        Array.from(node.childNodes).forEach(traverse);
                        let inner = currentParagraph;
                        currentParagraph = before;
                        if (inner !== '') {
                            let attrs = '';
                            if (node.hasAttributes()) {
                                for (let i = 0; i < node.attributes.length; i++) {
                                    let attr = node.attributes[i];
                                    if (['style', 'color', 'class'].includes(attr.name)) {
                                        attrs += ` ${attr.name}="${escapeXML(attr.value)}"`;
                                    }
                                }
                            }
                            currentParagraph += `<${tag.toLowerCase()}${attrs}>${inner}</${tag.toLowerCase()}>`;
                        }
                        return;
                    }
                    Array.from(node.childNodes).forEach(traverse);
                }
            }

            traverse(rootNode);
            if (currentParagraph !== '') paragraphs.push(currentParagraph);

            while(paragraphs.length > 0 && paragraphs[0].trim() === '') paragraphs.shift();
            while(paragraphs.length > 0 && paragraphs[paragraphs.length - 1].trim() === '') paragraphs.pop();

            return paragraphs.map(p => {
                if (p.includes('<div class="illus duokan-image-single">')) return p;
                if (p.trim() === '') return `<p><br/></p>`;
                return `<p>${p.replace(/^[\s\u3000\xA0]+/, '')}</p>`;
            }).join('\n');
        }

        function parsePcbToContent(pcbNode) {
            let frag = '';
            if (!pcbNode) return frag;
            const tfNode = pcbNode.querySelector('.t_f');
            if (tfNode) frag += parseToParagraphs(tfNode);

            const pattlNode = pcbNode.querySelector('.pattl');
            if (pattlNode) {
                const attachImgs = pattlNode.querySelectorAll('img');
                let attachContent = '';
                attachImgs.forEach(imgNode => {
                    let src = imgNode.getAttribute('zoomfile') || imgNode.getAttribute('file') || imgNode.getAttribute('src');
                    if (src && !src.includes('smiley') && !src.includes('smilies') && !src.includes('none.gif')) {
                        let wrapper = document.createElement('div');
                        wrapper.appendChild(imgNode.cloneNode(true));
                        attachContent += parseToParagraphs(wrapper);
                    }
                });
                if (attachContent) frag += attachContent;
            }
            return frag;
        }

        function extractOPPcbsFromDoc(doc, opUid) {
            const result = [];
            const allPosts = doc.querySelectorAll('#postlist > div[id^="post_"]');
            allPosts.forEach(post => {
                const authLink = post.querySelector('.authi a[href*="uid"]');
                if (!authLink) return;
                const m = (authLink.getAttribute('href') || '').match(/uid[=-](\d+)/);
                if (m && m[1] === opUid) {
                    const pcb = post.querySelector('.pcb');
                    if (pcb) result.push(pcb);
                }
            });
            return result;
        }

        async function collectAllOPFloors(firstDoc, threadUrl, progressBtn, chIdx, chTotal) {
            const tidMatch = threadUrl.match(/tid=(\d+)/) || threadUrl.match(/thread-(\d+)/);
            const firstPost = firstDoc.querySelector('#postlist > div[id^="post_"]');
            const opAuthLink = firstPost ? firstPost.querySelector('.authi a[href*="uid"]') : null;
            const opUidMatch = opAuthLink ? (opAuthLink.getAttribute('href') || '').match(/uid[=-](\d+)/) : null;

            if (!opUidMatch || !tidMatch) {
                const pcb = firstDoc.querySelector('.pcb');
                return parsePcbToContent(pcb);
            }
            const opUid = opUidMatch[1];
            const tid = tidMatch[1];

            let content = '';
            extractOPPcbsFromDoc(firstDoc, opUid).forEach(p => {
                content += parsePcbToContent(p);
            });

            let maxPage = 1;
            const pg = firstDoc.querySelector('.pg');
            if (pg) {
                pg.querySelectorAll('a').forEach(a => {
                    const m = (a.getAttribute('href') || '').match(/page=(\d+)/);
                    if (m && parseInt(m[1], 10) > maxPage) maxPage = parseInt(m[1], 10);
                });
                const pgLabel = pg.querySelector('label span');
                if (pgLabel && pgLabel.title) {
                    const m = pgLabel.title.match(/共\s*(\d+)\s*页/);
                    if (m && parseInt(m[1], 10) > maxPage) maxPage = parseInt(m[1], 10);
                }
            }

            for (let p = 2; p <= maxPage; p++) {
                if (progressBtn) {
                    setBtnText(progressBtn, `获取章节: ${chIdx + 1} / ${chTotal}（楼主全楼层 第${p}/${maxPage}页…）`);
                }
                try {
                    const pageUrl = `${window.location.origin}/forum.php?mod=viewthread&tid=${tid}&page=${p}&authorid=${opUid}`;
                    const res = await fetch(pageUrl);
                    const html = await res.text();
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    extractOPPcbsFromDoc(doc, opUid).forEach(pcb => {
                        content += parsePcbToContent(pcb);
                    });
                    await new Promise(r => setTimeout(r, 300));
                } catch (_) { /* 忽略单页失败 */ }
            }

            return content;
        }

        for (let i = 0; i < links.length; i++) {
            const linkObj = links[i];
            const linkTitle = linkObj.title || `第 ${i + 1} 章`;
            const url = linkObj.url;
            const fullOp = !!linkObj.fullOpMode;

            setBtnText(btn, `获取章节: ${i + 1} / ${links.length}${fullOp ? '（楼主全楼层）' : ''}...`);
            updateProgress(btn, Math.round(((i + 1) / links.length) * 70));

            try {
                const response = await fetch(url);
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                let chapterContent = '';

                if (fullOp) {
                    chapterContent = await collectAllOPFloors(doc, url, btn, i, links.length);
                } else {
                    let pidMatch = url.match(/pid=(\d+)/) || url.match(/#pid(\d+)/);
                    let pcbNode = null;

                    if (pidMatch && pidMatch[1]) {
                        const msgNode = doc.getElementById('postmessage_' + pidMatch[1]);
                        if (msgNode) {
                            pcbNode = msgNode.closest('.pcb');
                        } else {
                            const postDiv = doc.getElementById('post_' + pidMatch[1]);
                            if (postDiv) pcbNode = postDiv.querySelector('.pcb');
                        }
                    }

                    if (!pcbNode) {
                        const allPosts = doc.querySelectorAll('#postlist > div[id^="post_"]');
                        if (allPosts.length > 1 && url.includes('page=') && !url.includes('page=1')) {
                            pcbNode = allPosts[1].querySelector('.pcb') || doc.querySelector('.pcb');
                        } else {
                            pcbNode = doc.querySelector('.pcb');
                        }
                    }

                    chapterContent += parsePcbToContent(pcbNode);
                }

                if (!chapterContent.trim()) chapterContent = '<p><i>（未提取到有效内容，可在确认面板勾选"全楼层"重试）</i></p>';
                chapters.push({ title: linkTitle, content: chapterContent, id: `chapter_${i+1}` });

                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
                chapters.push({ title: linkTitle, content: '<p><i>（网络请求失败）</i></p>', id: `chapter_${i+1}` });
            }
        }

        if ((currentFormat === 'EPUB' || currentFormat === 'BOTH') && imageRegistry.length > 0) {
            for (let i = 0; i < imageRegistry.length; i++) {
                const img = imageRegistry[i];
                setBtnText(btn, `下载插图: ${i + 1} / ${imageRegistry.length}...`);
                updateProgress(btn, 70 + Math.round(((i + 1) / imageRegistry.length) * 25));
                try {
                    if (img.url.startsWith('data:image')) {
                        const res = await fetch(img.url);
                        img.buffer = await res.arrayBuffer();
                    } else {
                        img.buffer = await fetchImageBuffer(img.url);
                    }
                    await new Promise(resolve => setTimeout(resolve, 150));
                } catch (err) {
                    console.warn(`插图下载失败: ${img.url}`, err);
                }
            }
        }

        setBtnText(btn, '正在打包中...');
        updateProgress(btn, 98);
        setTimeout(() => {
            threadTitle = threadTitle.replace(/&/g, '＆');
            chapters.forEach(ch => ch.title = ch.title.replace(/&/g, '＆'));

            if (currentFormat === 'TXT' || currentFormat === 'BOTH') {
                generateTXT(threadTitle, chapters);
            }
            if (currentFormat === 'EPUB' || currentFormat === 'BOTH') {
                generateEPUB(threadTitle, chapters, imageRegistry, btn, mode);
            } else {
                setBtnText(btn, '下载完成！');
                updateProgress(btn, 100);
                setTimeout(() => resetButton(btn, mode), 3000);
            }
        }, 100);
    }

    function setBtnText(btn, text) {
        const progressWrap = btn.querySelector('#yd-progress-wrap');
        btn.textContent = '';
        btn.appendChild(document.createTextNode(text));
        if (progressWrap) btn.appendChild(progressWrap);
    }

    function updateProgress(btn, percent) {
        const bar = btn.querySelector('#yd-progress-bar');
        const wrap = btn.querySelector('#yd-progress-wrap');
        if (bar && wrap) {
            wrap.style.display = 'block';
            bar.style.width = percent + '%';
        }
    }

    function resetButton(btn, mode) {
        btn.disabled = false;
        const wrap = btn.querySelector('#yd-progress-wrap');
        const bar = btn.querySelector('#yd-progress-bar');
        if (wrap) wrap.style.display = 'none';
        if (bar) bar.style.width = '0%';
        setBtnText(btn, mode === 'tag' ? '提取本标签全部帖子' : '提取本帖内容');
    }

    function generateTXT(title, chapters) {
        let txtContent = title + '\r\n\r\n';

        function domToBbcode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent.replace(/&/g, '＆');
            }
            if (node.nodeType === Node.ELEMENT_NODE) {
                let tag = node.tagName.toUpperCase();

                if (tag === 'RUBY') {
                    let rt = '';
                    node.querySelectorAll('rt').forEach(n => rt += n.textContent);
                    let base = '';
                    Array.from(node.childNodes).forEach(child => {
                        let childTag = child.nodeType === Node.ELEMENT_NODE ? child.tagName.toUpperCase() : '';
                        if (childTag !== 'RT' && childTag !== 'RP') {
                            base += domToBbcode(child);
                        }
                    });
                    return '[ruby=' + rt + ']' + base + '[/ruby]';
                }

                let inner = Array.from(node.childNodes).map(domToBbcode).join('');

                if (tag === 'B' || tag === 'STRONG') {
                    return '[b]' + inner + '[/b]';
                }
                return inner;
            }
            return '';
        }

        chapters.forEach(ch => {
            txtContent += '==== ' + ch.title + ' ====\r\n\r\n';

            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = ch.content;

            let txtLines = [];

            Array.from(tempDiv.children).forEach(node => {
                if (node.tagName === 'P') {
                    let html = node.innerHTML.trim().toLowerCase();
                    if (html === '' || html === '<br>' || html === '<br/>') {
                        txtLines.push('');
                    } else {
                        let text = domToBbcode(node);
                        text = text.replace(/[\u00A0\u200B\u200C\u200D\uFEFF]/g, ' ');
                        text = text.trim();
                        if (text) {
                            txtLines.push('　　' + text);
                        }
                    }
                } else if (node.tagName === 'DIV') {
                    if (node.classList.contains('illus')) {
                        let img = node.querySelector('img');
                        let alt = img ? (img.getAttribute('alt') || '') : '';
                        txtLines.push('');
                        txtLines.push(`[图片: ${alt}]`);
                        txtLines.push('');
                    } else if (node.classList.contains('s-hr1')) {
                        txtLines.push('');
                        txtLines.push('----------------');
                        txtLines.push('');
                    }
                }
            });

            let chTxt = txtLines.join('\r\n');
            chTxt = chTxt.replace(/^[\r\n]+|[\r\n]+$/g, '');

            txtContent += chTxt + '\r\n\r\n\r\n';
        });

        const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    }

    function generateEPUB(title, chapters, images, btn, mode) {
        const safeTitle = escapeXML(title);
        const safeUrl = escapeXML(window.location.href);
        const bookUUID = `urn:uuid:yamibo-${Date.now()}`;

        const epubObj = {
            "mimetype": [fflate.strToU8("application/epub+zip"), { level: 0 }],
            "META-INF": { "container.xml": fflate.strToU8(`<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`) },
            "OEBPS": { "Images": {}, "Text": {}, "Styles": { "style.css": fflate.strToU8(CUSTOM_CSS) } }
        };

        let manifestItems = '';
        let spineItems = '';
        let navPoints = '';

        manifestItems += `<item id="main-css" href="Styles/style.css" media-type="text/css"/>\n`;

        const dummy1x1 = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 11, 73, 68, 65, 84, 8, 215, 99, 96, 0, 2, 0, 0, 5, 0, 1, 226, 38, 5, 155, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

        images.forEach(img => {
            if (img.buffer && img.buffer.byteLength > 0) epubObj.OEBPS.Images[img.fileName] = new Uint8Array(img.buffer);
            else { epubObj.OEBPS.Images[img.fileName] = dummy1x1; img.mime = 'image/png'; }
            manifestItems += `<item id="${img.id}" href="Images/${img.fileName}" media-type="${img.mime}"/>\n`;
        });

        chapters.forEach((ch, index) => {
            const safeChTitle = escapeXML(ch.title);
            const htmlFileName = `${ch.id}.xhtml`;

            epubObj.OEBPS.Text[htmlFileName] = fflate.strToU8(
`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN" xmlns:epub="http://www.idpf.org/2007/ops" xmlns:xml="http://www.w3.org/XML/1998/namespace">
<head>
    <title>${safeChTitle}</title>
    <link href="../Styles/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <h2>${safeChTitle}</h2>
    ${ch.content}
</body>
</html>`);

            manifestItems += `<item id="${ch.id}" href="Text/${htmlFileName}" media-type="application/xhtml+xml"/>\n`;
            spineItems += `<itemref idref="${ch.id}"/>\n`;
            navPoints += `<navPoint id="navPoint-${index + 1}" playOrder="${index + 1}"><navLabel><text>${safeChTitle}</text></navLabel><content src="Text/${htmlFileName}"/></navPoint>`;
        });

        epubObj.OEBPS["content.opf"] = fflate.strToU8(
`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
        <dc:identifier id="BookId">${bookUUID}</dc:identifier>
        <dc:title>${safeTitle}</dc:title>
        <dc:language>zh-CN</dc:language>
        <dc:creator opf:role="aut">百合会，https://github.com/RRRRUDDDD/yamibo_downloader</dc:creator>
        <dc:source>${safeUrl}</dc:source>
        <dc:rights>https://github.com/RRRRUDDDD/yamibo_downloader</dc:rights>
    </metadata>
    <manifest>
        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
        ${manifestItems}
    </manifest>
    <spine toc="ncx">
        ${spineItems}
    </spine>
</package>`);

        epubObj.OEBPS["toc.ncx"] = fflate.strToU8(`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="${bookUUID}"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${safeTitle}</text></docTitle><navMap>${navPoints}</navMap></ncx>`);

        fflate.zip(epubObj, { level: 0 }, (err, zipped) => {
            if (err) {
                alert('排版封装失败！\n' + err.message);
                resetButton(btn, mode); return;
            }
            const blob = new Blob([zipped], { type: 'application/epub+zip' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${title}.epub`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            setBtnText(btn, '下载完成！');
            updateProgress(btn, 100);
            setTimeout(() => resetButton(btn, mode), 3000);
        });
    }
})();
