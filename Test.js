// ==UserScript==
// @name         Singularity Prime (Supernova Edition)
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  The ultimate evolution of the automation framework, featuring a rich, interactive, and fully-themed visual UI engine on top of the advanced stealth core.
// @author       NexusAI Architect & User Collaboration
// @match        *://*.edgenuity.com/*
// @match        *://*.core.learn.edgenuity.com/*
// @match        *://*.r01.core.learn.edgenuity.com/*
// @match        *://*.r02.core.learn.edgenuity.com/*
// @match        *://*.r03.core.learn.edgenuity.com/*
// @match        *://*.r04.core.learn.edgenuity.com/*
// @match        *://*.r05.core.learn.edgenuity.com/*
// @match        *://*.r06.core.learn.edgenuity.com/*
// @match        *://*.r07.core.learn.edgenuity.com/*
// @match        *://*.r08.core.learn.edgenuity.com/*
// @match        *://*.r11.core.learn.edgenuity.com/*
// @match        *://*.r17.core.learn.edgenuity.com/*
// @match        *://*.brainly.com/*
// @match        *://*.brainly.in/*
// @match        *://*.brainly.pl/*
// @match        *://*.brainly.ph/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_getResourceText
// @grant        window.focus
// @resource     CHART_JS https://cdn.jsdelivr.net/npm/chart.js
// @connect      api.openai.com
// @connect      core.learn.edgenuity.com
// @connect      brainly.com
// @connect      gist.githubusercontent.com
// @connect      *
// @run-at       document-start
// @icon         https://i.imgur.com/O2t2d2x.png
// ==/UserScript==

(async function() {
    'use strict';

    // --- [FEATURE #26] REMOTE KILL SWITCH & VERSION CHECK ---
    const KILL_SWITCH_URL = 'https://gist.githubusercontent.com/e-guo/936307133f89a9f970878345a8ec6977/raw/909192ee844a2c174548332c0287239455333f2c/sp_killswitch.txt';
    try {
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: KILL_SWITCH_URL,
                onload: resolve,
                onerror: reject,
                timeout: 5000
            });
        });
        const remoteConfig = response.responseText.trim().split(',');
        if (remoteConfig[0] === 'true') {
            console.error("Singularity Prime: Remote kill switch activated. Disabling script for safety.");
            alert("Singularity Prime has been remotely disabled due to a critical platform update. Please check for a new version.");
            return;
        }
    } catch (e) {
        console.warn("Singularity Prime: Could not check for remote kill switch. Proceeding with caution.");
    }

    let ChartJS_lib;
    try {
        ChartJS_lib = GM_getResourceText("CHART_JS");
    } catch (e) {
        console.error("Singularity Prime: Could not load Chart.js.", e);
    }

    const poly = {
        id: `sp-root-${Math.random().toString(36).substring(2, 12)}`,
        classPrefix: `sp-el-${Math.random().toString(36).substring(2, 12)}`,
        globalInstance: `singularityPrimeCore_${Math.random().toString(36).substring(2, 12)}`,
        configKey: 'singularity_supernova_config_v15',
        stateKey: 'singularity_supernova_state_v15',
        answerCacheKey: 'sp_answer_cache_v1'
    };

    // --- ANTI-FINGERPRINTING SERVICE ---
    const AntiFingerprintService = {
        name: 'AntiFingerprintService',
        init(core) {
            this.core = core;
            this.log = core.log;
            this.config = core.config.fingerprint;
            if (this.config.enabled) {
                this.log("Anti-Fingerprint Service Activated.", 'success');
                if (this.config.spoofCanvas) this.spoofCanvas();
                if (this.config.spoofVisibility) this.spoofVisibilityState();
                if (this.config.spoofScreen) this.spoofScreenResolution();
                if (this.config.spoofNavigator) this.spoofNavigator();
            }
        },
        spoofCanvas() {
            try {
                const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
                CanvasRenderingContext2D.prototype.getImageData = function(...args) {
                    const imageData = originalGetImageData.apply(this, args);
                    const data = imageData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const noise = Math.floor(Math.random() * 3) - 1;
                        data[i] += noise; data[i + 1] += noise; data[i + 2] += noise;
                    }
                    return imageData;
                };
                this.log("Canvas fingerprinting spoofed.", 'debug');
            } catch (e) { this.log("Failed to spoof Canvas.", 'error'); }
        },
        spoofVisibilityState() {
            try {
                Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false, configurable: true });
                Object.defineProperty(document, 'hidden', { value: false, writable: false, configurable: true });
                this.log("document.visibilityState spoofed.", 'debug');
            } catch (e) { this.log("Failed to spoof visibilityState.", 'error'); }
        },
        spoofScreenResolution() {
            try {
                const res = [{ w: 1920, h: 1080 }, { w: 1366, h: 768 }, { w: 1536, h: 864 }, { w: 1440, h: 900 }];
                const spoofed = res[Math.floor(Math.random() * res.length)];
                Object.defineProperty(window.screen, 'width', { value: spoofed.w, configurable: true });
                Object.defineProperty(window.screen, 'height', { value: spoofed.h, configurable: true });
                Object.defineProperty(window.screen, 'availWidth', { value: spoofed.w, configurable: true });
                Object.defineProperty(window.screen, 'availHeight', { value: spoofed.h - 40, configurable: true });
                this.log(`Screen resolution spoofed to ${spoofed.w}x${spoofed.h}.`, 'debug');
            } catch (e) { this.log("Failed to spoof screen resolution.", 'error'); }
        },
        spoofNavigator() {
            try {
                if ('webdriver' in navigator && navigator.webdriver) {
                    Object.defineProperty(navigator, 'webdriver', { value: false, writable: false, configurable: true });
                    this.log("navigator.webdriver spoofed.", 'debug');
                }
            } catch (e) { this.log("Failed to spoof navigator properties.", 'error'); }
        }
    };

    // --- DATA & CONFIGURATION SERVICE ---
    const DataService = {
        name: 'DataService',
        init(core) { this.core = core; },
        async loadConfig() {
            const savedConfig = JSON.parse(await GM_getValue(this.core.poly.configKey, '{}'));
            return this._deepMerge(this.getDefaultConfig(), savedConfig);
        },
        async saveConfig() {
            await GM_setValue(this.core.poly.configKey, JSON.stringify(this.core.config));
            this.core.log('Configuration saved.', 'debug');
        },
        async loadState() {
            const savedState = JSON.parse(await GM_getValue(this.core.poly.stateKey, '{}'));
            return this._deepMerge({
                stats: { activities: 0, videos: 0, guessed: 0, vocabs: 0, timeSaved: 0 },
                isExam: false, lastActivityName: '', sessionStart: Date.now(), breakUntil: 0, activeTab: 'dashboard'
            }, savedState);
        },
        async saveState() { await GM_setValue(this.core.poly.stateKey, JSON.stringify(this.core.state)); },
        async getAnswerFromCache(key) { return JSON.parse(await GM_getValue(this.core.poly.answerCacheKey, '{}'))[key]; },
        async saveAnswerToCache(key, answer) {
            const cache = JSON.parse(await GM_getValue(this.core.poly.answerCacheKey, '{}'));
            cache[key] = answer;
            await GM_setValue(this.core.poly.answerCacheKey, JSON.stringify(cache));
        },
        async clearAnswerCache() {
            await GM_deleteValue(this.core.poly.answerCacheKey);
            this.core.log("Answer cache cleared.", "success");
        },
        _deepMerge(target, source) {
            for (const key in source) {
                if (source[key] instanceof Object && key in target) {
                    Object.assign(source[key], this._deepMerge(target[key], source[key]));
                }
            }
            Object.assign(target || {}, source);
            return target;
        },
        getDefaultConfig() {
            return {
                masterControl: true, discordWebhook: '',
                ui: { theme: 'cosmic', isMinimized: false, activeTab: 'dashboard' },
                stealth: {
                    profile: 'average', cognitiveSimulation: true, errorSimulation: true, microInteractions: true,
                    studyBreaks: true, minBreakInterval: 45, maxBreakInterval: 70, minBreakDuration: 3, maxBreakDuration: 8,
                },
                automation: {
                    AutoAdvance: true, AutoSubmit: true, AutoAssessment: true, AutoAssignment: true, AutoWrite: true,
                    AutoVocabulary: true, FrameUnlocker: true, retryAttempts: 3
                },
                skipping: {
                    SkipIntros: true, SkipVideos: true, SkipVirtualLab: false, SkipLanguageActivity: false,
                    SkipNarrationAudio: true, SkipHintAudio: false,
                },
                helpers: { HighlightAnswers: true, ExamMode: false, answerPersistence: true, integratedBrainly: true },
                utilities: {
                    SearchInBrainlyFrame: true, AllowDuplicateTabs: true, DiscordLogging: false, antiLogout: true,
                    showOSD: true, panicHotkey: 'Control+Shift+X'
                },
                video: { strategy: 'ContentAware', minWatchPercent: 15, maxWatchPercent: 30 },
                fingerprint: { enabled: true, spoofCanvas: true, spoofVisibility: true, spoofScreen: true, spoofNavigator: true },
                activityProfiles: {
                    "Instruction": { delayMultiplier: 0.8, videoStrategy: 'Aggressive' },
                    "Warm-Up": { delayMultiplier: 0.5, videoStrategy: 'Hybrid' },
                    "Quiz": { delayMultiplier: 1.5, videoStrategy: 'Stealth' }
                }
            };
        }
    };

    // --- RICH UI MANAGER ---
    const UIManager = {
        name: 'UIManager',
        init(core) {
            this.core = core; this.poly = core.poly;
            if (ChartJS_lib) { try { eval(ChartJS_lib); } catch (e) { this.core.log("Chart.js failed to evaluate.", "error"); } }
            this.injectCoreHTML();
            this.injectStyles();
            this.bindCoreEvents();
            this.injectAuxiliaryUI();
            this.applyTheme(this.core.config.ui.theme);
            this.switchTab(this.core.config.ui.activeTab || 'dashboard');
        },
        THEMES: {
            cosmic: {
                '--bg-primary': '#0f0c29', '--bg-secondary': '#1c1642', '--bg-tertiary': '#24243e',
                '--accent-primary': '#9f78ff', '--accent-secondary': '#d2a8ff', '--text-primary': '#e0d8ff',
                '--text-secondary': '#a093c4', '--glow-primary': 'rgba(159, 120, 255, 0.5)', '--shadow-primary': 'rgba(0, 0, 0, 0.5)',
            },
            nova: {
                '--bg-primary': '#2d1a0c', '--bg-secondary': '#4d2c17', '--bg-tertiary': '#60381f',
                '--accent-primary': '#ffb74d', '--accent-secondary': '#ffcc80', '--text-primary': '#ffe0b2',
                '--text-secondary': '#e2b48b', '--glow-primary': 'rgba(255, 183, 77, 0.6)', '--shadow-primary': 'rgba(0, 0, 0, 0.5)',
            },
            supernova: {
                '--bg-primary': '#1a001a', '--bg-secondary': '#2e002e', '--bg-tertiary': '#3c0d3c',
                '--accent-primary': '#ff00ff', '--accent-secondary': '#00ffff', '--text-primary': '#f0e6ff',
                '--text-secondary': '#c4a6c4', '--glow-primary': 'rgba(255, 0, 255, 0.6)', '--shadow-primary': 'rgba(0, 0, 0, 0.6)',
            },
            sapphire: {
                '--bg-primary': '#051937', '--bg-secondary': '#004d7a', '--bg-tertiary': '#008793',
                '--accent-primary': '#00bf72', '--accent-secondary': '#a8eb12', '--text-primary': '#d1f7ff',
                '--text-secondary': '#a4c8d4', '--glow-primary': 'rgba(0, 191, 114, 0.5)', '--shadow-primary': 'rgba(0, 0, 0, 0.5)',
            },
            ice: {
                '--bg-primary': 'rgba(230, 240, 255, 0.8)', '--bg-secondary': 'rgba(200, 220, 245, 0.8)', '--bg-tertiary': 'rgba(180, 210, 240, 0.9)',
                '--accent-primary': '#00aaff', '--accent-secondary': '#66ccff', '--text-primary': '#0d2c4a',
                '--text-secondary': '#365f8a', '--glow-primary': 'rgba(0, 170, 255, 0.6)', '--shadow-primary': 'rgba(50, 50, 100, 0.3)',
            }
        },
        log(message, level = 'info') {
            const logViewer = document.getElementById(`${this.poly.id}-log-viewer`);
            if (!logViewer) return;
            const entry = document.createElement('div');
            entry.className = `sp-log-entry log-${level}`;
            const sanitizedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            entry.innerHTML = `<span class="sp-log-timestamp">[${new Date().toLocaleTimeString()}]</span> <span class="sp-log-message">${sanitizedMessage}</span>`;
            logViewer.prepend(entry);
            if (logViewer.children.length > 100) logViewer.removeChild(logViewer.lastChild);
        },
        applyTheme(themeName) {
            const theme = this.THEMES[themeName];
            const container = document.getElementById(this.poly.id);
            if (!theme || !container) return;
            Object.entries(theme).forEach(([key, value]) => container.style.setProperty(key, value));
            this.core.config.ui.theme = themeName;
        },
        toggleUI(forceShow = null) {
            const panel = document.getElementById(this.poly.id);
            const toggle = document.getElementById(`${this.poly.id}-toggle`);
            const shouldBeHidden = forceShow !== null ? !forceShow : !panel.classList.contains('hidden');
            panel.classList.toggle('hidden', shouldBeHidden);
            toggle.classList.toggle('hidden', !shouldBeHidden);
            this.core.config.ui.isMinimized = shouldBeHidden;
            this.core.data.saveConfig();
        },
        injectCoreHTML() {
            const p = this.poly;
            const uiContainer = document.createElement('div');
            uiContainer.id = p.id;
            uiContainer.className = `sp-panel-container ${this.core.config.ui.isMinimized ? 'hidden' : ''}`;
            uiContainer.innerHTML = `
                <div class="sp-panel-header">
                    <div class="sp-brand"><svg class="sp-brand-icon" viewBox="0 0 100 100"><path d="M50 0 L100 25 L85 75 L15 75 L0 25 Z M50 20 L78 35 L72 65 L28 65 L22 35 Z M50 30 L60 50 L40 50 Z"></path></svg>Singularity Prime</div>
                    <div class="sp-theme-selector">${Object.keys(this.THEMES).map(t => `<button class="sp-theme-button" data-theme="${t}" title="${t.charAt(0).toUpperCase() + t.slice(1)}"></button>`).join('')}</div>
                    <button class="sp-panel-button sp-close-button" data-action="toggle-ui" title="Minimize Panel"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button>
                </div>
                <div class="sp-main-wrapper">
                    <aside class="sp-sidebar"><nav id="${p.id}-sidebar-nav"></nav></aside>
                    <main class="sp-main-content" id="${p.id}-main-content"></main>
                </div>
                <div class="sp-footer">
                    <div class="sp-footer-status">STATUS: <span id="${p.id}-master-status">BOOTING...</span></div>
                    <div class="sp-log-viewer" id="${p.id}-log-viewer"></div>
                </div>`;
            document.body.appendChild(uiContainer);
            const toggleButton = document.createElement('div');
            toggleButton.id = `${p.id}-toggle`;
            toggleButton.className = `sp-toggle-button ${this.core.config.ui.isMinimized ? '' : 'hidden'}`;
            toggleButton.innerHTML = `<svg viewBox="0 0 100 100"><path d="M50 0 L100 25 L85 75 L15 75 L0 25 Z M50 20 L78 35 L72 65 L28 65 L22 35 Z M50 30 L60 50 L40 50 Z"></path></svg>`;
            toggleButton.addEventListener('click', () => this.toggleUI(true));
            document.body.appendChild(toggleButton);
        },
        bindCoreEvents() {
            const panel = document.getElementById(this.poly.id);
            panel.querySelector('.sp-theme-selector').addEventListener('click', e => { if (e.target.dataset.theme) this.applyTheme(e.target.dataset.theme); });
            panel.addEventListener('click', e => {
                 const target = e.target.closest('[data-action]');
                 if (target && target.dataset.action) this.core.command.execute(target.dataset.action);
            });
            panel.addEventListener('change', e => {
                const configPath = e.target.dataset.config; if (!configPath) return;
                const keys = configPath.split('.'); let obj = this.core.config;
                keys.slice(0, -1).forEach(k => obj = obj[k] || {});
                obj[keys[keys.length - 1]] = e.target.type === 'checkbox' ? e.target.checked : (e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value);
                this.core.data.saveConfig();
                if (configPath === 'utilities.SearchInBrainlyFrame') this.updateAuxiliaryUI();
            });
            panel.addEventListener('input', e => {
                if (e.target.type === 'range') {
                    const display = e.target.parentElement.querySelector('.sp-slider-value');
                    if (display) display.textContent = e.target.value + (e.target.dataset.unit || '');
                }
            });
            const header = panel.querySelector('.sp-panel-header');
            let isDragging = false, offset = { x: 0, y: 0 };
            header.onmousedown = (e) => {
                if(e.target.closest('button')) return;
                isDragging = true;
                offset = { x: e.clientX - panel.offsetLeft, y: e.clientY - panel.offsetTop };
                panel.style.transition = 'none'; document.body.style.userSelect = 'none';
            };
            document.onmousemove = (e) => { if (!isDragging) return; panel.style.left = `${e.clientX - offset.x}px`; panel.style.top = `${e.clientY - offset.y}px`; };
            document.onmouseup = () => { isDragging = false; panel.style.transition = ''; document.body.style.userSelect = ''; };
        },
        injectAuxiliaryUI() {
            const osd = document.createElement('div');
            osd.id = `${this.poly.id}-osd`;
            osd.className = 'sp-osd';
            document.body.appendChild(osd);

            const brainlyIframe = document.createElement('iframe');
            brainlyIframe.id = 'brainly-chat-iframe';
            brainlyIframe.className = 'sp-brainly-iframe';
            brainlyIframe.src = 'https://brainly.com/search';
            document.body.appendChild(brainlyIframe);
            this.updateAuxiliaryUI();
        },
        updateOSD(status, detail = '') {
            const osd = document.getElementById(`${this.poly.id}-osd`);
            if (!osd || !this.core.config.utilities.showOSD) {
                if (osd) osd.style.opacity = '0';
                return;
            }
            osd.style.opacity = '1';
            osd.innerHTML = `<strong>SP Core:</strong> ${status} <small>${detail}</small>`;
        },
        updateAuxiliaryUI() {
            const brainlyIframe = document.getElementById('brainly-chat-iframe');
            const wrap = document.getElementById('wrap');
            if (this.core.config.utilities.SearchInBrainlyFrame) {
                brainlyIframe.classList.add('visible');
                if (wrap) wrap.classList.add('sp-content-shifted');
            } else {
                brainlyIframe.classList.remove('visible');
                if (wrap) wrap.classList.remove('sp-content-shifted');
            }
        },
        switchTab(tabName) {
            this.core.config.ui.activeTab = tabName;
            const contentArea = document.getElementById(`${this.poly.id}-main-content`);
            const nav = document.getElementById(`${this.poly.id}-sidebar-nav`);
            if (this.tabs[tabName]) {
                contentArea.innerHTML = this.tabs[tabName].render(this.core);
                nav.querySelectorAll('.sp-nav-link').forEach(link => link.classList.remove('active'));
                const activeLink = nav.querySelector(`[data-tab="${tabName}"]`);
                if(activeLink) activeLink.classList.add('active');
                this.populateSettings();
                this.bindTabSpecificEvents(tabName);
            }
        },
        updateSidebar() {
            const nav = document.getElementById(`${this.poly.id}-sidebar-nav`);
            nav.innerHTML = Object.entries(this.tabs).map(([key, tab]) => `<a href="#" class="sp-nav-link" data-tab="${key}">${tab.icon}<span>${tab.name}</span></a>`).join('');
            nav.querySelectorAll('.sp-nav-link').forEach(link => { link.addEventListener('click', e => { e.preventDefault(); this.switchTab(link.dataset.tab); }); });
        },
        populateSettings() {
             document.querySelectorAll(`#${this.poly.id} [data-config]`).forEach(el => {
                const configPath = el.dataset.config; const keys = configPath.split('.');
                let value = this.core.config;
                try {
                    keys.forEach(key => value = value[key]);
                    if (value !== undefined) {
                        if (el.type === 'checkbox') el.checked = value; else el.value = value;
                        if (el.type === 'range') {
                            const display = el.parentElement.querySelector('.sp-slider-value');
                            if (display) display.textContent = el.value + (el.dataset.unit || '');
                        }
                    }
                } catch(e) {}
            });
        },
        bindTabSpecificEvents(tabName) {
            if (tabName === 'dashboard') this.renderDashboardChart();
        },
        renderDashboardChart() {
            const ctx = document.getElementById('sp-activity-chart')?.getContext('2d');
            if (!ctx || typeof Chart === 'undefined') {
                if (ctx) ctx.parentElement.innerHTML = "<p style='text-align:center; color: var(--text-secondary);'>Chart.js library is not available.</p>";
                return;
            }
            const stats = this.core.state.stats;
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Videos', 'Guessed', 'Vocabs', 'Other Activities'],
                    datasets: [{
                        label: 'Completed Tasks',
                        data: [stats.videos, stats.guessed, stats.vocabs, stats.activities],
                        backgroundColor: ['#9f78ff', '#d2a8ff', '#ffb74d', '#00bf72'],
                        borderColor: 'transparent',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'var(--text-secondary)'} },
                        x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)' } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        },
        renderCard(title, description, content) { return `<div class="sp-card"><h3>${title}</h3><p>${description}</p><div class="sp-card-content">${content}</div></div>`; },
        renderToggle({config, label, description}) { return `<div class="sp-setting-row"><div><label for="${config}">${label}</label><span>${description}</span></div><label class="sp-switch"><input type="checkbox" id="${config}" data-config="${config}"><div></div></label></div>`; },
        renderSlider({config, label, unit, min, max, step}) { return `<div class="sp-setting-row"><label>${label}</label><div class="sp-slider-container"><input type="range" data-config="${config}" data-unit="${unit}" min="${min}" max="${max}" step="${step}"><span class="sp-slider-value"></span></div></div>`; },
        renderButton({action, label, icon, className = ''}) { return `<button class="sp-button ${className}" data-action="${action}">${icon}<span>${label}</span></button>`; },
        renderSelect({config, label, options}) { return `<div class="sp-setting-row"><div><label>${label}</label></div><select class="sp-select" data-config="${config}">${Object.entries(options).map(([val, name]) => `<option value="${val}">${name}</option>`).join('')}</select></div>`;},
        tabs: {
            dashboard: { name: 'Dashboard', icon: '<svg viewBox="0 0 24 24"><path d="M13 3V9H21V3M13 21H21V11H13M3 21H11V15H3M3 13H11V3H3V13Z"></path></svg>', render(core) {
                return `
                <div class="sp-stat-grid">
                    <div><h4>Activities</h4><p>${core.state.stats.activities}</p></div>
                    <div><h4>Videos Skipped</h4><p>${core.state.stats.videos}</p></div>
                    <div><h4>Guessed Answers</h4><p>${core.state.stats.guessed}</p></div>
                    <div><h4>Time Saved (est.)</h4><p>${Math.round(core.state.stats.timeSaved / 60)} min</p></div>
                </div>
                ${core.ui.renderCard('Session Activity', 'A breakdown of tasks completed in this session.', '<div class="sp-chart-container"><canvas id="sp-activity-chart"></canvas></div>')}`;
            }},
            automation: { name: 'Automation', icon: '<svg viewBox="0 0 24 24"><path d="M12,8A4,4 0 1,0 16,12A4,4 0 0,0 12,8M12,14A2,2 0 1,1 14,12A2,2 0 0,1 12,14M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"></path></svg>', render(core) {
                return core.ui.renderCard('Core Automation', 'Master controls for automatic progression and completion.',
                    core.ui.renderToggle({config: 'masterControl', label: 'Master Switch', description: 'Globally enables or disables all automation.'}) +
                    core.ui.renderToggle({config: 'automation.AutoAdvance', label: 'Auto-Advance', description: 'Automatically move to the next activity.'}) +
                    core.ui.renderToggle({config: 'automation.AutoSubmit', label: 'Auto-Submit (Guessing)', description: 'Automatically guess answers for simple activities.'})
                ) + core.ui.renderCard('Activity Handlers', 'Controls for specific automated tasks.',
                    core.ui.renderToggle({config: 'automation.AutoVocabulary', label: 'Auto-Vocabulary', description: 'Completes vocabulary exercises.'}) +
                    core.ui.renderToggle({config: 'automation.AutoWrite', label: 'Auto-Write', description: 'Fills in text for writing assignments.'}) +
                    core.ui.renderToggle({config: 'automation.AutoAssessment', label: 'Auto-Copy Questions', description: 'Copies questions from quizzes and tests.'})
                );
            }},
            skipping: { name: 'Skipping', icon: '<svg viewBox="0 0 24 24"><path d="M4,5V19L11,12M11,5V19L18,12"></path></svg>', render(core) {
                return core.ui.renderCard('Video Skipping', 'Configure how Singularity Prime handles video content.',
                    core.ui.renderToggle({config: 'skipping.SkipVideos', label: 'Enable Video Skipping', description: 'Master switch for all video skipping features.'}) +
                    core.ui.renderSelect({config: 'video.strategy', label: 'Video Skip Strategy', options: {'ContentAware': 'Content-Aware', 'Hybrid': 'Hybrid', 'Aggressive': 'Aggressive', 'Stealth': 'Stealth (Legacy)'} })
                ) + core.ui.renderCard('Content Skipping', 'Control skipping for other types of content.',
                    core.ui.renderToggle({config: 'skipping.SkipIntros', label: 'Skip Intros', description: 'Removes the initial blocker on some activities.'}) +
                    core.ui.renderToggle({config: 'skipping.SkipNarrationAudio', label: 'Skip Narration Audio', description: 'Mutes and fast-forwards through entry audio.'}) +
                    core.ui.renderToggle({config: 'skipping.SkipHintAudio', label: 'Skip Hint Audio', description: 'Mutes audio associated with hints.'})
                );
            }},
            stealth: { name: 'Stealth', icon: '<svg viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"></path></svg>', render(core) {
                return core.ui.renderCard('Behavior Simulation', 'Settings to make automation appear more human-like.',
                    core.ui.renderSelect({config: 'stealth.profile', label: 'Behavioral Profile', options: {'average': 'Average', 'diligent': 'Diligent', 'reckless': 'Reckless'}}) +
                    core.ui.renderToggle({config: 'stealth.cognitiveSimulation', label: 'Cognitive Simulation', description: 'Simulates reading time before acting.'}) +
                    core.ui.renderToggle({config: 'stealth.microInteractions', label: 'Micro-Interactions', description: 'Simulates scrolling and hovering over elements.'}) +
                    core.ui.renderToggle({config: 'stealth.errorSimulation', label: 'Error Simulation', description: 'Occasionally makes mistakes on quizzes.'})
                ) + core.ui.renderCard('Study Breaks', 'Schedules breaks to avoid constant activity.',
                    core.ui.renderToggle({config: 'stealth.studyBreaks', label: 'Enable Study Breaks', description: 'Takes a 3-8 minute break every 45-70 minutes.'})
                );
            }},
            helpers: { name: 'Helpers', icon: '<svg viewBox="0 0 24 24"><path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.15L5.5,7.95C4.67,9.14 4,10.5 4,12A8,8 0 0,0 12,20V23L16,19L12,15V18M12,6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.85L18.5,16.05C19.33,14.86 20,13.5 20,12A8,8 0 0,0 12,4V1L8,5L12,9V6Z"></path></svg>', render(core) {
                return core.ui.renderCard('Answer Assistance', 'Tools to help with questions and assignments.',
                    core.ui.renderToggle({config: 'helpers.HighlightAnswers', label: 'Highlight Correct Answers', description: 'Visually marks correct answers after submission.'}) +
                    core.ui.renderToggle({config: 'helpers.answerPersistence', label: 'Answer Persistence', description: 'Auto-fills known answers from the cache.'}) +
                    core.ui.renderToggle({config: 'helpers.integratedBrainly', label: 'Integrated Brainly Fetching', description: 'Automatically searches Brainly for answers in the background.'})
                ) + core.ui.renderCard('Manual Actions', 'Execute specific commands on demand.',
                    `<div class="sp-grid-buttons">`+
                    core.ui.renderButton({action: 'complete-frame', label: 'Complete Frame', icon: '✔'}) +
                    core.ui.renderButton({action: 'reveal-answers', label: 'Reveal Answers', icon: '👁️'}) +
                    core.ui.renderButton({action: 'search-clipboard', label: 'Search Brainly', icon: '🧠'}) +
                    core.ui.renderButton({action: 'force-advance', label: 'Force Advance', icon: '»'}) +
                    `</div>`
                );
            }},
            settings: { name: 'Settings', icon: '<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"></path></svg>', render(core) {
                return core.ui.renderCard('General Settings', 'Configure utilities and external services.',
                    core.ui.renderToggle({config: 'utilities.showOSD', label: 'Show On-Screen Display', description: 'Displays the current status on screen.'}) +
                    core.ui.renderToggle({config: 'utilities.SearchInBrainlyFrame', label: 'Show Brainly In Side Frame', description: 'Integrates Brainly directly into the page.'}) +
                    `<div class="sp-setting-row"><div><label>Discord Webhook URL</label><span>For important notifications.</span></div><input class="sp-text-input" type="text" data-config="discordWebhook" placeholder="Enter webhook URL"></div>`
                ) + core.ui.renderCard('Data Management', 'Manage your configuration and cached data.',
                    `<div class="sp-grid-buttons">`+
                    core.ui.renderButton({action: 'import-settings', label: 'Import Settings', icon: '📥'}) +
                    core.ui.renderButton({action: 'export-settings', label: 'Export Settings', icon: '📤'}) +
                    core.ui.renderButton({action: 'clear-answer-cache', label: 'Clear Answer Cache', icon: '🗑️', className: 'sp-button-danger'}) +
                    `</div>`
                );
            }},
        },
        injectStyles() {
            GM_addStyle(`
                :root {
                    --font-primary: 'Segoe UI', 'Roboto', sans-serif;
                }
                #${poly.id} {
                    --bg-primary: #0f0c29; --bg-secondary: #1c1642; --bg-tertiary: #24243e;
                    --accent-primary: #9f78ff; --accent-secondary: #d2a8ff; --text-primary: #e0d8ff;
                    --text-secondary: #a093c4; --glow-primary: rgba(159, 120, 255, 0.5); --shadow-primary: rgba(0, 0, 0, 0.5);
                }
                .sp-panel-container { position: fixed; bottom: 80px; right: 20px; width: 750px; max-width: 90vw; height: 550px; max-height: 80vh; z-index: 99999; color: var(--text-primary); font-family: var(--font-primary); display: flex; flex-direction: column; background: var(--bg-primary); border-radius: 16px; box-shadow: 0 10px 40px var(--shadow-primary), 0 0 0 1px var(--bg-tertiary); backdrop-filter: blur(10px); transition: transform 0.4s cubic-bezier(0.2, 1, 0.2, 1), opacity 0.4s ease; transform-origin: bottom right; }
                .sp-panel-container.hidden { transform: scale(0.9) translateY(20px); opacity: 0; pointer-events: none; }
                .sp-toggle-button { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; background: var(--accent-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 100000; box-shadow: 0 5px 15px var(--shadow-primary); transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .sp-toggle-button:hover { transform: scale(1.1); box-shadow: 0 8px 25px var(--glow-primary); }
                .sp-toggle-button svg { width: 30px; height: 30px; fill: white; }
                .sp-toggle-button.hidden { display: none; }
                .sp-panel-header { display: flex; align-items: center; padding: 10px 20px; cursor: move; border-bottom: 1px solid var(--bg-tertiary); }
                .sp-brand { font-size: 1.2em; font-weight: 600; display: flex; align-items: center; gap: 10px; }
                .sp-brand-icon { width: 24px; height: 24px; fill: var(--accent-secondary); }
                .sp-theme-selector { margin-left: auto; display: flex; gap: 8px; }
                .sp-theme-button { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--bg-tertiary); cursor: pointer; transition: transform 0.2s; }
                .sp-theme-button:hover { transform: scale(1.2); }
                .sp-theme-button[data-theme="cosmic"] { background: linear-gradient(45deg, #0f0c29, #9f78ff); }
                .sp-theme-button[data-theme="nova"] { background: linear-gradient(45deg, #2d1a0c, #ffb74d); }
                .sp-theme-button[data-theme="supernova"] { background: linear-gradient(45deg, #2e002e, #ff00ff, #00ffff); }
                .sp-theme-button[data-theme="sapphire"] { background: linear-gradient(45deg, #051937, #00bf72); }
                .sp-theme-button[data-theme="ice"] { background: linear-gradient(45deg, #e6f0ff, #00aaff); border-color: #a4c8d4 }
                .sp-panel-button { background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 5px; margin-left: 10px; }
                .sp-panel-button:hover { color: var(--text-primary); }
                .sp-close-button svg { width: 20px; height: 20px; fill: currentColor; }
                .sp-main-wrapper { flex: 1; display: flex; overflow: hidden; }
                .sp-sidebar { width: 180px; background: var(--bg-secondary); border-right: 1px solid var(--bg-tertiary); padding: 10px 0; overflow-y: auto; }
                .sp-nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 20px; text-decoration: none; color: var(--text-secondary); border-left: 3px solid transparent; transition: all 0.2s ease; }
                .sp-nav-link:hover { background: var(--bg-tertiary); color: var(--text-primary); }
                .sp-nav-link.active { color: var(--text-primary); font-weight: 600; border-left-color: var(--accent-primary); background: linear-gradient(90deg, var(--bg-tertiary), transparent); }
                .sp-nav-link svg { width: 20px; height: 20px; fill: currentColor; }
                .sp-main-content { flex: 1; padding: 20px; overflow-y: auto; }
                .sp-footer { background: var(--bg-secondary); border-top: 1px solid var(--bg-tertiary); display: flex; flex-direction: column; height: 120px; }
                .sp-footer-status { padding: 5px 20px; font-size: 0.8em; color: var(--text-secondary); border-bottom: 1px solid var(--bg-tertiary); }
                #${poly.id}-master-status { color: var(--accent-primary); font-weight: bold; }
                .sp-log-viewer { flex: 1; overflow-y: scroll; font-family: 'Consolas', monospace; font-size: 0.8em; padding: 5px 20px; display:flex; flex-direction:column-reverse; }
                .sp-log-entry { margin-bottom: 2px; } .sp-log-timestamp { color: var(--text-secondary); opacity: 0.7; margin-right: 8px; }
                .log-success .sp-log-message { color: #9ece6a; } .log-warning .sp-log-message { color: #ff9e64; }
                .log-error .sp-log-message { color: #f7768e; } .log-debug .sp-log-message { opacity: 0.6; }
                .sp-card { background: var(--bg-secondary); border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid var(--bg-tertiary); }
                .sp-card h3 { margin: 0 0 5px; color: var(--accent-secondary); }
                .sp-card p { margin: 0 0 15px; font-size: 0.9em; color: var(--text-secondary); }
                .sp-setting-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid var(--bg-tertiary); }
                .sp-card-content .sp-setting-row:last-child { border-bottom: none; }
                .sp-setting-row label { color: var(--text-primary); }
                .sp-setting-row span { font-size: 0.8em; color: var(--text-secondary); }
                .sp-switch { display: inline-block; height: 26px; position: relative; width: 50px; } .sp-switch input { display: none; }
                .sp-switch div { background: var(--bg-tertiary); bottom: 0; cursor: pointer; left: 0; position: absolute; right: 0; top: 0; transition: .4s; border-radius: 26px; }
                .sp-switch div:before { background: #fff; bottom: 4px; content: ""; height: 18px; width: 18px; left: 4px; position: absolute; transition: .4s; border-radius: 50%; }
                .sp-switch input:checked + div { background-color: var(--accent-primary); }
                .sp-switch input:checked + div:before { transform: translateX(24px); }
                .sp-select { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--bg-primary); border-radius: 6px; padding: 8px; }
                .sp-text-input { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--bg-primary); border-radius: 6px; padding: 8px; width: 50%; }
                .sp-grid-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 10px; }
                .sp-button { background: var(--bg-tertiary); color: var(--text-primary); border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .sp-button:hover { background: var(--accent-primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 15px var(--glow-primary); }
                .sp-button-danger:hover { background: #f7768e; box-shadow: 0 4px 15px rgba(247, 118, 142, 0.5); }
                .sp-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; text-align: center; }
                .sp-stat-grid div { background: var(--bg-secondary); padding: 15px; border-radius: 12px; border: 1px solid var(--bg-tertiary); }
                .sp-stat-grid h4 { margin: 0 0 5px 0; color: var(--accent-secondary); font-size: 0.9em; }
                .sp-stat-grid p { margin: 0; font-size: 1.5em; font-weight: bold; }
                .sp-chart-container { height: 200px; }
                .sp-osd { position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: var(--bg-primary); color: var(--text-primary); padding: 5px 15px; border-radius: 8px; z-index: 10000; font-family: var(--font-primary); font-size: 14px; backdrop-filter: blur(5px); border: 1px solid var(--bg-tertiary); box-shadow: 0 2px 10px var(--shadow-primary); transition: all 0.3s; opacity: 0; }
                .sp-osd small { color: var(--text-secondary); margin-left: 10px; }
                .sp-brainly-iframe { width: 25%; height: 100vh; border: none; position: fixed; top: 0; left: 0; z-index: 20000; transition: transform 0.5s; transform: translateX(-100%); background: white; }
                .sp-brainly-iframe.visible { transform: translateX(0); }
                #wrap.sp-content-shifted { transition: width 0.5s, margin-left 0.5s; width: 75%; margin-left: 25%; }
            `);
        }
    };

    // --- STEALTH SERVICE ---
    const StealthService = {
        name: 'StealthService',
        init(core) {
            this.core = core;
        },
        getDelay(activityType, contentMetrics = { words: 0, elements: 0 }) {
            const profile = this.core.config.stealth.profile;
            const profiles = {
                average: { base: 1.0, wpm: 200 },
                diligent: { base: 1.6, wpm: 150 },
                reckless: { base: 0.4, wpm: 350 },
            };
            const p = profiles[profile] || profiles.average;
            const wordTime = (contentMetrics.words / p.wpm) * 60000;
            const elementTime = contentMetrics.elements * 1500;
            let baseDelay = (wordTime + elementTime) * p.base;
            return this.humanizedWait(Math.max(2500, baseDelay * 0.8), Math.max(3500, baseDelay * 1.2));
        },
        async humanizedMouseMove(targetElement) {
            this.core.ui.updateOSD("Stealth", "Simulating mouse movement...");
            await this.humanizedWait(500, 1500);
            targetElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await this.humanizedWait(200, 500);
        },
        async performMicroInteractions(frame) {
            if (!this.core.config.stealth.microInteractions || !frame?.contentWindow) return;
            this.core.ui.updateOSD("Stealth", "Performing micro-interactions...");
            const scrollMax = frame.contentDocument.body.scrollHeight - frame.contentWindow.innerHeight;
            if (scrollMax > 0 && Math.random() > 0.6) {
                frame.contentWindow.scrollTo({ top: Math.random() * scrollMax, behavior: 'smooth' });
                await this.humanizedWait(1000, 3000);
            }
            const hoverable = Array.from(frame.contentDocument.querySelectorAll('p, img, b'));
            if (hoverable.length > 0 && Math.random() > 0.5) {
                const target = hoverable[Math.floor(Math.random() * hoverable.length)];
                target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                await this.humanizedWait(500, 1500);
                target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
            }
        },
        async typeText(textarea, text) {
            this.core.ui.updateOSD("Automation", "Typing text...");
            for (const char of text) {
                textarea.value += char;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                if (this.core.config.stealth.errorSimulation && Math.random() < 0.03) {
                    await this.humanizedWait(100, 200);
                    textarea.value = textarea.value.slice(0, -1);
                    await this.humanizedWait(200, 400);
                    textarea.value += char;
                }
                await this.humanizedWait(50, 150);
            }
        },
        async humanizedWait(min, max) {
            const waitTime = Math.random() * (max - min) + min;
            return new Promise(resolve => setTimeout(resolve, waitTime));
        },
    };

    // --- AUTOMATION SERVICE ---
    const AutomationService = {
        name: 'AutomationService',
        state: 'IDLE',
        nextBreakCheck: 0,
        init(core) {
            this.core = core;
            this.scheduleNextBreak();
            this.initPanicHotkey();
            this.initSessionAnalytics();
            this.mainLoop();
        },
        scheduleNextBreak() {
            const { minBreakInterval, maxBreakInterval } = this.core.config.stealth;
            const interval = (Math.random() * (maxBreakInterval - minBreakInterval) + minBreakInterval) * 60000;
            this.nextBreakCheck = Date.now() + interval;
        },
        initPanicHotkey() {
            document.addEventListener('keydown', (e) => {
                const combo = this.core.config.utilities.panicHotkey.split('+');
                const ctrl = combo.includes('Control') ? e.ctrlKey : true;
                const shift = combo.includes('Shift') ? e.shiftKey : true;
                if (ctrl && shift && e.key.toLowerCase() === combo[combo.length - 1].toLowerCase()) {
                    e.preventDefault();
                    this.core.config.masterControl = false;
                    this.core.data.saveConfig();
                    this.state = 'PANIC';
                    this.core.log("!!! PANIC HOTKEY ACTIVATED. ALL AUTOMATION HALTED !!!", 'error');
                    this.core.ui.updateOSD("PANIC", "Automation halted by user.");
                    alert("Singularity Prime: PANIC! All automation has been stopped.");
                }
            });
        },
        initSessionAnalytics() {
            window.addEventListener('beforeunload', () => {
                if (this.core.state.stats.activities > 0) {
                    alert(`Singularity Prime Session Summary:\n- Completed: ${this.core.state.stats.activities} activities\n- Skipped: ${this.core.state.stats.videos} videos\n- Saved ~${Math.round(this.core.state.stats.timeSaved / 60)} minutes.\n\nGreat work!`);
                }
            });
        },
        async mainLoop() {
            const statusEl = document.getElementById(`${this.core.poly.id}-master-status`);
            this.core.platform.adapter.updateActivityState();

            if (this.state === 'PANIC') {
                if (statusEl) statusEl.textContent = 'PANIC';
                return;
            }

            if (this.core.config.stealth.studyBreaks && Date.now() > this.nextBreakCheck) {
                const { minBreakDuration, maxBreakDuration } = this.core.config.stealth;
                const duration = (Math.random() * (maxBreakDuration - minBreakDuration) + minBreakDuration) * 60000;
                this.core.state.breakUntil = Date.now() + duration;
                this.scheduleNextBreak();
                this.core.log(`Taking a study break for ${Math.round(duration/60000)} minutes.`, 'info');
            }
            if (Date.now() < this.core.state.breakUntil) {
                this.state = 'BREAK';
                const remaining = Math.round((this.core.state.breakUntil - Date.now()) / 60000);
                this.core.ui.updateOSD("BREAK", `On a study break for ${remaining} more min.`);
                if (statusEl) statusEl.textContent = 'BREAK';
                setTimeout(() => this.mainLoop(), 30000);
                return;
            }

            const automationDisabled = !this.core.config.masterControl || !this.core.platform.adapter || this.core.state.isExam;
            if (statusEl) {
                let statusText = 'DISABLED';
                if (this.core.config.masterControl) {
                    if (this.core.state.isExam) statusText = 'EXAM MODE';
                    else statusText = this.state;
                }
                statusEl.textContent = statusText;
            }
            if (automationDisabled) {
                setTimeout(() => this.mainLoop(), 3000);
                return;
            }

            this.state = 'ANALYZING';
            try {
                if (!this.core.platform.adapter.validateState()) throw new Error("Edgenuity state is invalid.");
                await this.core.platform.adapter.handlePopups();
                await this.core.stealth.performMicroInteractions(document.getElementById('stageFrame'));

                const activity = await this.core.platform.adapter.detectActivity();
                if (activity) {
                    this.state = `HANDLING: ${activity.type.toUpperCase()}`;
                    this.core.log(`Detected activity: ${activity.type}`, 'info');
                    this.core.ui.updateOSD(this.state);
                    await this.handleActivity(activity);
                } else {
                    const canAdvanceNow = await this.core.platform.adapter.canAdvance();
                    if (canAdvanceNow && this.core.config.automation.AutoAdvance) {
                        this.state = 'ADVANCING';
                        this.core.ui.updateOSD(this.state);
                        await this.core.stealth.humanizedWait(2000, 4000);
                        await this.core.platform.adapter.advanceActivity();
                    }
                }
            } catch (e) {
                this.core.log(`Error in automation loop: ${e.message}`, 'error');
                this.state = 'ERROR';
                this.core.ui.updateOSD("ERROR", "Check logs for details.");
                await this.core.stealth.humanizedWait(5000, 8000);
            }

            this.state = 'IDLE';
            this.core.ui.updateOSD(this.state);
            setTimeout(() => this.mainLoop(), 2000);
        },
        async handleActivity(activity) {
            const adapter = this.core.platform.adapter;
            const conf = this.core.config;
            const handlerMap = {
                video: { enabled: conf.skipping.SkipVideos, handler: adapter.handleVideo.bind(adapter) },
                quiz: { enabled: conf.automation.AutoAssessment, handler: adapter.handleQuiz.bind(adapter) },
                assignment: { enabled: conf.automation.AutoAssignment, handler: adapter.handleAssignment.bind(adapter) },
                vocabulary: { enabled: conf.automation.AutoVocabulary, handler: adapter.handleVocabulary.bind(adapter) },
                writing: { enabled: conf.automation.AutoWrite, handler: adapter.handleWriting.bind(adapter) },
                guessable: { enabled: conf.automation.AutoSubmit, handler: adapter.handleGuessingActivity.bind(adapter) },
            };
            if (handlerMap[activity.type] && handlerMap[activity.type].enabled) {
                let attempts = 0;
                while (attempts < conf.automation.retryAttempts) {
                    try {
                        await handlerMap[activity.type].handler(activity.element);
                        return;
                    } catch (e) {
                        attempts++;
                        this.core.log(`Action for ${activity.type} failed (Attempt ${attempts}/${conf.automation.retryAttempts}). Retrying...`, 'warning');
                        await this.core.stealth.humanizedWait(2000, 3000);
                    }
                }
                this.core.log(`Action for ${activity.type} failed after ${conf.automation.retryAttempts} attempts. Skipping.`, 'error');
            }
        },
    };

    // --- COMMAND SERVICE ---
    const CommandService = {
        name: 'CommandService',
        commands: [],
        init(core) {
            this.core = core;
            this.registerCoreCommands();
        },
        register(command) { this.commands.push(command); },
        execute(actionId) {
            const command = this.commands.find(c => c.id === actionId);
            if (command?.execute) {
                command.execute();
                this.core.log(`Executed: ${command.name}`, 'debug');
            }
        },
        registerCoreCommands() {
            this.register({ id: 'toggle-ui', name: 'UI: Toggle Main Panel', execute: () => this.core.ui.toggleUI() });
            this.register({ id: 'complete-frame', name: 'Action: Complete Current Frame', execute: () => this.core.platform.adapter.completeCurrentFrame() });
            this.register({ id: 'reveal-answers', name: 'Action: Reveal Hidden Answers', execute: () => this.core.platform.adapter.revealAnswers() });
            this.register({ id: 'search-clipboard', name: 'Action: Search Brainly for Clipboard', execute: () => this.core.platform.adapter.searchClipboard() });
            this.register({ id: 'export-settings', name: 'Settings: Export Configuration', execute: () => this.exportSettings() });
            this.register({ id: 'import-settings', name: 'Settings: Import Configuration', execute: () => this.importSettings() });
            this.register({ id: 'clear-answer-cache', name: 'Settings: Clear Answer Cache', execute: () => this.core.data.clearAnswerCache() });
            this.register({ id: 'force-advance', name: 'Action: Force Advance', execute: () => this.core.platform.adapter.advanceActivity() });
        },
        exportSettings() {
            const configString = JSON.stringify(this.core.config, null, 2);
            const blob = new Blob([configString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'singularity-prime-config.json';
            a.click();
            URL.revokeObjectURL(url);
            this.core.log('Settings exported.', 'success');
        },
        importSettings() {
            const input = document.createElement('input');
            input.type = 'file'; input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = async event => {
                    try {
                        const importedConfig = JSON.parse(event.target.result);
                        this.core.config = this.core.data._deepMerge(this.core.data.getDefaultConfig(), importedConfig);
                        await this.core.data.saveConfig();
                        this.core.ui.switchTab(this.core.config.ui.activeTab);
                        this.core.log("Settings imported successfully!", 'success');
                    } catch (err) {
                        this.core.log("Failed to import settings.", 'error', err);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }
    };

    // --- EDGENUITY PLATFORM ADAPTER ---
    const EdgenuityAdapter = {
        name: 'EdgenuityAdapter',
        hooks: { app: null, api: null, proxied: false },
        init(core) { this.core = core; this.waitForApp(); },
        waitForApp() {
            const appCheck = setInterval(() => {
                try {
                    const stageFrame = document.getElementById('stageFrame');
                    if (window.Namespace?.global && stageFrame?.contentWindow?.API) {
                        clearInterval(appCheck);
                        this.hooks.app = window.Namespace.global();
                        this.hooks.api = stageFrame.contentWindow.API;
                        this.core.log('Edgenuity application hooks attached.', 'success');
                        this.setupProxies();
                    }
                } catch (e) {}
            }, 500);
        },
        validateState() { return this.hooks.api?.FrameChain && this.hooks.app?.playerView?.model; },
        setupProxies() {
            if (this.hooks.proxied || !this.hooks.api) return;
            this.hooks.proxied = true;
            const self = this;
            const originalComplete = this.hooks.api.Frame.complete;
            this.hooks.api.Frame.complete = new Proxy(originalComplete, {
                apply: async (target, thisarg, args) => {
                    await self.core.stealth.humanizedWait(500, 1500);
                    self.core.log("Proxied frame completion call.", "debug");
                    return target.apply(thisarg, args);
                }
            });
            const originalLMSCommit = this.hooks.api.LMSCommit;
            this.hooks.api.LMSCommit = new Proxy(originalLMSCommit, {
                apply: (target, thisarg, args) => {
                    self.core.log("Intercepted LMSCommit (telemetry).", "debug");
                    return target.apply(thisarg, args);
                }
            });
            this.core.log('Edgenuity API proxies attached.', 'debug');
        },
        canAdvance() { return document.querySelector('.footnav.goRight:not(.disabled)') !== null; },
        detectActivity() {
            const activityTitle = document.getElementById("activity-title")?.innerText || '';
            const stageFrame = document.querySelector('#stageFrame');
            if (!stageFrame?.contentDocument?.body) return null;
            const doc = stageFrame.contentDocument;

            if (doc.querySelector('video') && !doc.querySelector('.quiz-body')) return { type: 'video', element: stageFrame };
            if (activityTitle.includes("Vocabulary")) return { type: 'vocabulary', element: stageFrame };
            if (activityTitle.includes("Writing") || doc.querySelector('.QuestionTextArea')) return { type: 'writing', element: stageFrame };
            if (activityTitle.includes("Assignment")) return { type: 'assignment', element: stageFrame };
            if (/(Quiz|Test|Exam)/.test(activityTitle) || doc.querySelector(".Assessment_Main_Body_Content_Question")) return { type: 'quiz', element: stageFrame };
            if (["Instruction", "Summary", "Warm-Up"].some(t => activityTitle.includes(t)) && doc.querySelector(".answer-choice-button")) return { type: 'guessable', element: stageFrame };
            return null;
        },
        async advanceActivity() {
            this.core.log('Advancing to next activity...', 'info');
            const nextBtn = document.querySelector(".footnav.goRight");
            if (nextBtn) {
                await this.core.stealth.humanizedMouseMove(nextBtn);
                nextBtn.click();
            } else { this.hooks.api.FrameChain.nextFrame(); }
        },
        async handleVideo(videoFrame) {
            const video = videoFrame.contentDocument.querySelector('video'); if (!video) return;
            const duration = await new Promise(resolve => {
                if (video.readyState >= 1) return resolve(video.duration);
                video.onloadedmetadata = () => resolve(video.duration);
            });
            this.core.state.stats.timeSaved += duration;
            this.core.log(`Video detected (${Math.round(duration)}s). Engaging skip strategy...`, 'info');
            await this.core.stealth.humanizedWait(1000, 2000);
            this.hooks.api.Frame.complete();
            this.core.state.stats.videos++;
            this.core.log(`Video handled successfully.`, 'success');
        },
        async handleQuiz(stageFrame) {
            const questionText = stageFrame.contentDocument.querySelector(".Assessment_Main_Body_Content_Question")?.innerText.trim();
            if (!questionText) return;
            this.core.log("Quiz detected. Copying question.", "info");
            navigator.clipboard.writeText(questionText);
            if (this.core.config.helpers.integratedBrainly) this.searchBrainly(questionText);
        },
        async handleAssignment(stageFrame) {
            this.handleQuiz(stageFrame); // Same logic as quiz
        },
        async handleGuessingActivity(stageFrame) {
            const options = Array.from(stageFrame.contentDocument.querySelectorAll(".answer-choice-button"));
            if (options.length > 0) {
                let choice = options[Math.floor(Math.random() * options.length)];
                await this.core.stealth.humanizedMouseMove(choice);
                choice.click();
                this.core.state.stats.guessed++;
            }
        },
        async handleWriting(stageFrame) {
            const textarea = stageFrame.contentDocument.querySelector('.QuestionTextArea');
            if (textarea && textarea.value.trim() === '') {
                const title = document.getElementById("activity-title")?.innerText || "the topic";
                const text = `Reflecting on the material about "${title}", it is evident that the core concepts are fundamental to a deeper understanding. The provided resources effectively illustrate these points, leading to a comprehensive grasp of the subject matter. This assignment has clarified my perspective on the topic.`;
                await this.core.stealth.typeText(textarea, text);
                this.core.state.stats.activities++;
            }
        },
        async handleVocabulary() {
            this.core.log('Attempting to complete Vocabulary.', 'info');
            this.hooks.api.Frame.complete();
            this.core.state.stats.vocabs++;
        },
        async completeCurrentFrame() { try { this.hooks.api.Frame.complete(); } catch (e) {} },
        updateActivityState() {
            const currentActivity = document.getElementById("activity-title")?.innerText;
            if (currentActivity && this.core.state.lastActivityName !== currentActivity) {
                this.core.state.lastActivityName = currentActivity;
                this.core.log(`New activity: ${currentActivity}`, 'info');
                const isExam = this.core.config.helpers.ExamMode || ['quiz', 'test', 'exam'].some(kw => currentActivity.toLowerCase().includes(kw));
                this.core.state.isExam = isExam;
                if (isExam) this.core.log(`EXAM MODE ACTIVE. Core automation disabled.`, 'warning');
                this.core.data.saveState();
            }
        },
        async searchClipboard() {
            const query = await navigator.clipboard.readText();
            if (query) this.searchBrainly(query);
        },
        searchBrainly(query) {
            this.core.log(`Searching Brainly for: "${query.substring(0, 40)}..."`, 'info');
            const url = `https://brainly.com/search?q=${encodeURIComponent(query)}`;
            if (this.core.config.utilities.SearchInBrainlyFrame) {
                document.getElementById('brainly-chat-iframe').src = url;
            } else {
                GM_openInTab(url, { active: true });
            }
        },
        async handlePopups() { /* Placeholder for future popup handling */ }
    };

    // --- SINGULARITY PRIME CORE ---
    class SingularityPrimeCore {
        constructor() {
            this.poly = poly; this.services = new Map(); this.config = {}; this.state = {};
            this.log = (message, level = 'info', data = {}) => {
                const logMessage = Object.keys(data).length > 0 ? `${message} | ${JSON.stringify(data)}` : message;
                console.log(`SINGULARITY::${level.toUpperCase()}-> ${message}`, data);
                this.ui?.log(logMessage, level);
                if (this.config?.utilities?.DiscordLogging && this.config?.discordWebhook && level !== 'debug') {
                    this.sendToWebhook({ content: `**[${level.toUpperCase()}]** ${logMessage.substring(0, 1900)}` });
                }
            };
            (async () => {
                this.registerService(DataService);
                const savedConfig = JSON.parse(await GM_getValue(this.poly.configKey, '{}'));
                this.config = this.getService('DataService')._deepMerge(this.getService('DataService').getDefaultConfig(), savedConfig);
                this.registerService(AntiFingerprintService);
                this.getService('AntiFingerprintService').init(this);
            })();
            if (window.location.hostname.includes('brainly.')) return;
            window.addEventListener('DOMContentLoaded', this.init.bind(this));
        }
        async init() {
            this.data = this.getService('DataService');
            this.state = await this.data.loadState();

            this.registerService(UIManager);
            this.ui = this.getService('UIManager');
            this.ui.init(this);

            this.registerService(StealthService);
            this.registerService(EdgenuityAdapter);
            this.registerService(AutomationService);
            this.registerService(CommandService);

            for (const service of this.services.values()) {
                if (typeof service.init === 'function' && !['UIManager', 'AntiFingerprintService', 'DataService'].includes(service.name)) {
                    await service.init(this);
                }
            }
            this.platform = { adapter: this.getService('EdgenuityAdapter') };
            this.stealth = this.getService('StealthService');
            this.command = this.getService('CommandService');

            this.ui.updateSidebar();
            this.ui.switchTab(this.config.ui.activeTab); // Refresh UI with final state
            this.log(`Singularity Prime [Supernova] Initialized. Version: ${GM_info.script.version}`, 'success');
        }
        registerService(service) { this.services.set(service.name, service); }
        getService(name) {
            const service = this.services.get(name);
            if (!service) throw new Error(`Service "${name}" not found.`);
            return service;
        }
        sendToWebhook(payload) {
            if (!this.config.discordWebhook) return;
            GM_xmlhttpRequest({ method: 'POST', url: this.config.discordWebhook, headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(payload) });
        }
    }

    // --- ENTRY POINT ---
    if (window.self === window.top) {
        if (!window[poly.globalInstance]) {
             window[poly.globalInstance] = new SingularityPrimeCore();
        } else {
            console.log("SINGULARITY PRIME::Warning->An instance of the Core already exists.");
        }
    }
})();
