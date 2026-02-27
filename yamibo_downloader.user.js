// ==UserScript==
// @name         百合会下载器
// @namespace    https://github.com/RRRRUDDDD/yamibo_downloader
// @version      1.2
// @description  用于下载百合会的小说与漫画，下载格式可选epub与txt
// @author       RUD
// @match        *://bbs.yamibo.com/thread-*
// @match        *://bbs.yamibo.com/forum.php?mod=viewthread*
// @match        *://bbs.yamibo.com/misc.php?mod=tag*
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// ==/UserScript==

(function() {
    'use strict';

    const FORMATS = ['EPUB', 'TXT', 'BOTH'];
    const FORMAT_NAMES = { 'EPUB': '仅 EPUB', 'TXT': '仅 TXT', 'BOTH': 'EPUB + TXT' };
    let currentFormat = GM_getValue('downloadFormat', 'EPUB');
    let menuCmdId = null;

    function registerMenu() {
        if (typeof GM_registerMenuCommand === 'undefined') return;
        if (menuCmdId !== null && typeof GM_unregisterMenuCommand !== 'undefined') {
            GM_unregisterMenuCommand(menuCmdId);
        }
        menuCmdId = GM_registerMenuCommand(`⚙️ 切换下载格式 (当前: ${FORMAT_NAMES[currentFormat]})`, () => {
            let nextIdx = (FORMATS.indexOf(currentFormat) + 1) % FORMATS.length;
            currentFormat = FORMATS[nextIdx];
            GM_setValue('downloadFormat', currentFormat);
            registerMenu();
            alert(`✅ 已切换下载格式为: ${FORMAT_NAMES[currentFormat]}`);
        });
    }
    registerMenu();

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

/*以下填寫自定義css樣式*/
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
        btn.innerText = mode === 'tag' ? '📚 提取本标签全部帖子' : '📚 提取本帖内容';
        btn.style.cssText = 'margin-left: 15px; padding: 4px 12px; cursor: pointer; background-color: #ff6699; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
        btn.onclick = startExtraction;

        if (mode === 'thread') {
            const titleSpan = document.querySelector('#thread_subject');
            if (titleSpan) titleSpan.parentNode.insertBefore(btn, titleSpan.nextSibling);
        } else if (mode === 'tag') {
            const header = document.querySelector('h1') || document.querySelector('.bm_h');
            if (header) header.appendChild(btn);
            else {
                btn.style.position = 'fixed'; btn.style.top = '20px'; btn.style.right = '20px'; btn.style.zIndex = '9999';
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

    async function startExtraction(e) {
        const btn = e.target;
        btn.disabled = true;
        btn.style.backgroundColor = '#999999';

        if (typeof fflate === 'undefined' && (currentFormat === 'EPUB' || currentFormat === 'BOTH')) {
            alert('❌ fflate 打包引擎未加载，请刷新页面。');
            resetButton(btn, getPageMode()); return;
        }

        const mode = getPageMode();
        let links = [];
        let threadTitle = '';

        if (mode === 'thread') {
            const firstPost = document.querySelector('.t_f');
            if (!firstPost) { alert('❌ 未能定位到一楼内容！'); resetButton(btn, mode); return; }
            const rawLinks = Array.from(firstPost.querySelectorAll('a')).filter(a => {
                const rawHref = a.getAttribute('href');
                return rawHref && (rawHref.includes('viewthread') || rawHref.includes('thread-') || rawHref.includes('redirect')) && !rawHref.includes('mod=attachment') && !rawHref.includes('action=reply');
            });
            links = rawLinks.map(a => ({ url: a.href, title: a.innerText.trim() }));
            threadTitle = document.querySelector('#thread_subject').innerText.trim();
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

        if (links.length === 0) { alert('❌ 没有找到有效的帖子链接！'); resetButton(btn, mode); return; }
        threadTitle = threadTitle.replace(/[\\/:*?"<>|]/g, '');

        const chapters = [];
        const imageRegistry = [];
        let imageCounter = 0;

        function parseToParagraphs(rootNode) {
            let paragraphs = [];
            let currentParagraph = '';

            function traverse(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    let text = escapeXML(node.textContent).replace(/[\r\n]+/g, '');
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

                    if (['B', 'STRONG', 'RUBY', 'RT', 'SPAN', 'FONT'].includes(tag)) {
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

        for (let i = 0; i < links.length; i++) {
            const linkObj = links[i];
            const linkTitle = linkObj.title || `第 ${i + 1} 章`;
            const url = linkObj.url;

            btn.innerText = `⏳ 获取章节: ${i + 1} / ${links.length}...`;

            try {
                const response = await fetch(url);
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                let pidMatch = url.match(/pid=(\d+)/) || url.match(/#pid(\d+)/);
                let pcbNode = null;

                if (pidMatch && pidMatch[1]) {
                    const msgNode = doc.getElementById('postmessage_' + pidMatch[1]);
                    if (msgNode) pcbNode = msgNode.closest('.pcb');
                }
                if (!pcbNode) pcbNode = doc.querySelector('.pcb');

                let chapterContent = '';
                if (pcbNode) {
                    const tfNode = pcbNode.querySelector('.t_f');
                    if (tfNode) chapterContent += parseToParagraphs(tfNode);

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
                        if (attachContent) chapterContent += `<div class="s-hr1"></div>${attachContent}`;
                    }
                }

                if (!chapterContent.trim()) chapterContent = '<p><i>（未提取到有效内容）</i></p>';
                chapters.push({ title: linkTitle, content: chapterContent, id: `chapter_${i+1}` });

                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
                chapters.push({ title: linkTitle, content: '<p><i>（网络请求失败）</i></p>', id: `chapter_${i+1}` });
            }
        }

        if ((currentFormat === 'EPUB' || currentFormat === 'BOTH') && imageRegistry.length > 0) {
            for (let i = 0; i < imageRegistry.length; i++) {
                const img = imageRegistry[i];
                btn.innerText = `🖼️ 下载插图: ${i + 1} / ${imageRegistry.length}...`;
                try {
                    if (img.url.startsWith('data:image')) {
                        const res = await fetch(img.url);
                        img.buffer = await res.arrayBuffer();
                    } else {
                        img.buffer = await fetchImageBuffer(img.url);
                    }
                    await new Promise(resolve => setTimeout(resolve, 150));
                } catch (err) {}
            }
        }

        btn.innerText = '📦 正在打包中...';
        setTimeout(() => {
            if (currentFormat === 'TXT' || currentFormat === 'BOTH') {
                generateTXT(threadTitle, chapters);
            }
            if (currentFormat === 'EPUB' || currentFormat === 'BOTH') {
                generateEPUB(threadTitle, chapters, imageRegistry, btn, mode);
            } else {
                btn.innerText = '✅ 下载完成！';
                setTimeout(() => resetButton(btn, mode), 3000);
            }
        }, 100);
    }

    function resetButton(btn, mode) {
        btn.disabled = false;
        btn.style.backgroundColor = '#ff6699';
        btn.innerText = mode === 'tag' ? '📚 提取本标签全部帖子' : '📚 提取本帖内容';
    }

    function generateTXT(title, chapters) {
        let txtContent = title + '\r\n\r\n';

        function domToBbcode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
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
                alert('❌ 排版封装失败！\n' + err.message);
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

            btn.innerText = '✅ 下载完成！';
            setTimeout(() => resetButton(btn, mode), 3000);
        });
    }
})();
