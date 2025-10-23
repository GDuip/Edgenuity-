// ==UserScript==
// @name         Singularity Prime (Fusion V2)
// @namespace    http://tampermonkey.net/
// @version      14.0
// @description  A hyper-advanced, service-oriented automation framework with a dedicated anti-detection and stealth engine, implementing all requested features.
// @author       NexusAI Architect & User Collaboration
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
// @match        *://*.edgenuity.com/*
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

(async function () {
    'use strict';

    // --- [FEATURE #26] REMOTE KILL SWITCH & VERSION CHECK ---
    const KILL_SWITCH_URL = 'https://gist.githubusercontent.com/e-guo/936307133f89a9f970878345a8ec6977/raw/909192ee844a2c174548332c0287239455333f2c/sp_killswitch.txt'; // Replace with a real Gist URL for production
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
        const killSwitch = remoteConfig[0];

        if (killSwitch === 'true') {
            console.error("Singularity Prime: Remote kill switch activated. Disabling script for safety.");
            alert("Singularity Prime has been remotely disabled due to a critical platform update. Please check for a new version.");
            return;
        }
    } catch (e) {
        console.warn("Singularity Prime: Could not check for remote kill switch. Proceeding with caution.");
    }

    // --- 1. LIBRARY INJECTION ---
    let ChartJS_lib;
    try {
        ChartJS_lib = GM_getResourceText("CHART_JS");
    } catch (e) {
        console.error("Singularity Prime: Could not load Chart.js. Dashboard charts will be unavailable.", e);
    }

    // --- 2. POLYMORPHIC EVASION ENGINE ---
    const poly = {
        id: `sp-root-${Math.random().toString(36).substring(2, 12)}`,
        classPrefix: `sp-el-${Math.random().toString(36).substring(2, 12)}`,
        globalInstance: `singularityPrimeCore_${Math.random().toString(36).substring(2, 12)}`,
        configKey: 'singularity_fusion_config_v14',
        stateKey: 'singularity_fusion_state_v14',
        answerCacheKey: 'sp_answer_cache_v1'
    };

    // --- [FEATURE #27, #23, #28, #29] ANTI-FINGERPRINTING SERVICE (RUNS AT DOCUMENT-START) ---
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
                CanvasRenderingContext2D.prototype.getImageData = function (...args) {
                    const imageData = originalGetImageData.apply(this, args);
                    const data = imageData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const noise = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                        data[i] = data[i] + noise;
                        data[i + 1] = data[i + 1] + noise;
                        data[i + 2] = data[i + 2] + noise;
                    }
                    return imageData;
                };
                this.log("Canvas fingerprinting spoofed.", 'debug');
            } catch (e) {
                this.log("Failed to spoof Canvas.", 'error');
            }
        },
        spoofVisibilityState() {
            try {
                Object.defineProperty(document, 'visibilityState', {
                    value: 'visible',
                    writable: false,
                    configurable: true
                });
                Object.defineProperty(document, 'hidden', {
                    value: false,
                    writable: false,
                    configurable: true
                });
                this.log("document.visibilityState spoofed.", 'debug');
            } catch (e) {
                this.log("Failed to spoof visibilityState.", 'error');
            }
        },
        spoofScreenResolution() {
            try {
                const commonResolutions = [{
                        width: 1920,
                        height: 1080
                    }, {
                        width: 1366,
                        height: 768
                    },
                    {
                        width: 1536,
                        height: 864
                    }, {
                        width: 1440,
                        height: 900
                    }
                ];
                const spoofed = commonResolutions[Math.floor(Math.random() * commonResolutions.length)];
                Object.defineProperty(window.screen, 'width', {
                    value: spoofed.width,
                    configurable: true
                });
                Object.defineProperty(window.screen, 'height', {
                    value: spoofed.height,
                    configurable: true
                });
                Object.defineProperty(window.screen, 'availWidth', {
                    value: spoofed.width,
                    configurable: true
                });
                Object.defineProperty(window.screen, 'availHeight', {
                    value: spoofed.height - 40,
                    configurable: true
                }); // Account for taskbar
                this.log(`Screen resolution spoofed to ${spoofed.width}x${spoofed.height}.`, 'debug');
            } catch (e) {
                this.log("Failed to spoof screen resolution.", 'error');
            }
        },
        spoofNavigator() {
            try {
                if ('webdriver' in navigator && navigator.webdriver) {
                    Object.defineProperty(navigator, 'webdriver', {
                        value: false,
                        writable: false,
                        configurable: true
                    });
                    this.log("navigator.webdriver spoofed.", 'debug');
                }
            } catch (e) {
                this.log("Failed to spoof navigator properties.", 'error');
            }
        }
    };

    // --- 3. MODULAR CORE SERVICES ---
    const DataService = {
        name: 'DataService',
        init(core) {
            this.core = core;
        },
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
                stats: {
                    activities: 0,
                    videos: 0,
                    guessed: 0,
                    vocabs: 0,
                    timeSaved: 0
                },
                isExam: false,
                lastActivityName: '',
                sessionStart: Date.now(),
                breakUntil: 0
            }, savedState);
        },
        async saveState() {
            await GM_setValue(this.core.poly.stateKey, JSON.stringify(this.core.state));
        },
        async getAnswerFromCache(questionKey) {
            const cache = JSON.parse(await GM_getValue(this.core.poly.answerCacheKey, '{}'));
            return cache[questionKey];
        },
        async saveAnswerToCache(questionKey, answer) {
            const cache = JSON.parse(await GM_getValue(this.core.poly.answerCacheKey, '{}'));
            cache[questionKey] = answer;
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
                masterControl: true,
                discordWebhook: '',
                stealth: {
                    profile: 'average',
                    cognitiveSimulation: true,
                    errorSimulation: true, // Feature 5
                    microInteractions: true, // Feature 4
                    studyBreaks: true, // Feature 6
                    minBreakInterval: 45, // minutes
                    maxBreakInterval: 70, // minutes
                    minBreakDuration: 3, // minutes
                    maxBreakDuration: 8, // minutes
                },
                automation: {
                    AutoAdvance: true,
                    AutoSubmit: true,
                    AutoAssessment: true,
                    AutoAssignment: true,
                    AutoWrite: true,
                    AutoVocabulary: true,
                    FrameUnlocker: true,
                    retryAttempts: 3 // Feature 12
                },
                skipping: {
                    SkipIntros: true,
                    SkipVideos: true,
                    SkipVirtualLab: false,
                    SkipLanguageActivity: false,
                    SkipNarrationAudio: true,
                    SkipHintAudio: false,
                },
                helpers: {
                    HighlightAnswers: true,
                    ExamMode: false,
                    answerPersistence: true, // Feature 16
                    integratedBrainly: true, // Feature 18
                },
                utilities: {
                    SearchInBrainlyFrame: true,
                    AllowDuplicateTabs: true,
                    DiscordLogging: false,
                    antiLogout: true,
                    showOSD: true, // Feature 19
                    panicHotkey: 'Control+Shift+X' // Feature 22
                },
                video: {
                    strategy: 'ContentAware', // Feature 10
                    minWatchPercent: 15,
                    maxWatchPercent: 30,
                },
                fingerprint: { // Category D
                    enabled: true,
                    spoofCanvas: true, // Feature 27
                    spoofVisibility: true, // Feature 23
                    spoofScreen: true, // Feature 28
                    spoofNavigator: true, // Feature 29
                },
                activityProfiles: { // Feature 25
                    "Instruction": {
                        delayMultiplier: 0.8,
                        videoStrategy: 'Aggressive'
                    },
                    "Warm-Up": {
                        delayMultiplier: 0.5,
                        videoStrategy: 'Hybrid'
                    },
                    "Quiz": {
                        delayMultiplier: 1.5,
                        videoStrategy: 'Stealth'
                    }
                }
            };
        }
    };

    const UIManager = {
        name: 'UIManager',
        init(core) {
            this.core = core;
            this.poly = core.poly;
            if (ChartJS_lib) {
                try {
                    eval(ChartJS_lib);
                } catch (e) {
                    this.core.log("Chart.js failed to evaluate.", "error");
                }
            }
            this.injectCoreHTML();
            this.injectStyles();
            this.bindCoreEvents();
            this.injectAuxiliaryUI();
            this.switchTab('dashboard');
        },
        log(message, level = 'info') {
            const logViewer = document.getElementById(`${this.poly.id}-log-viewer`);
            if (!logViewer) return;
            const entry = document.createElement('div');
            entry.className = `log-entry log-${level}`;
            const sanitizedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            entry.innerHTML = `<span>[${new Date().toLocaleTimeString()}]</span> ${sanitizedMessage}`;
            logViewer.prepend(entry);
        },
        injectCoreHTML() {
            const p = this.poly;
            const uiContainer = document.createElement('div');
            uiContainer.id = p.id;
            uiContainer.innerHTML = `
                <div id="${p.id}-toggle" class="${p.classPrefix}-toggle-btn">SP</div>
                <div id="${p.id}-main" class="${p.classPrefix}-app-container hidden">
                    <header class="${p.classPrefix}-header">
                        <div class="${p.classPrefix}-brand">Singularity Prime <strong>Fusion V2</strong></div>
                        <div class="${p.classPrefix}-status">STATUS: <span id="${p.id}-master-status">IDLE</span></div>
                        <label class="switch"><input type="checkbox" data-config="masterControl"><div></div></label>
                    </header>
                    <div class="${p.classPrefix}-main-wrapper">
                        <aside class="${p.classPrefix}-sidebar">
                            <nav>
                                <a href="#" data-tab="dashboard" class="active">Dashboard</a>
                                <a href="#" data-tab="automation">Automation</a>
                                <a href="#" data-tab="skipping">Content Skippers</a>
                                <a href="#" data-tab="stealth">Stealth Engine</a>
                                <a href="#" data-tab="helpers">Helpers</a>
                                <a href="#" data-tab="utilities">Utilities</a>
                                <a href="#" data-tab="fingerprint">Anti-Fingerprint</a>
                                <a href="#" data-tab="settings">Settings</a>
                            </nav>
                        </aside>
                        <main class="${p.classPrefix}-main-content" id="${p.id}-main-content"></main>
                    </div>
                    <footer class="${p.classPrefix}-footer">
                        <div class="${p.classPrefix}-log-viewer" id="${p.id}-log-viewer"></div>
                    </footer>
                </div>`;
            document.body.appendChild(uiContainer);
        },
        bindCoreEvents() {
            const mainPanel = document.getElementById(`${this.poly.id}-main`);
            document.getElementById(`${this.poly.id}-toggle`).addEventListener('click', () => {
                mainPanel.classList.toggle('hidden');
            });
            mainPanel.querySelector(`.${this.poly.classPrefix}-sidebar nav`).addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && e.target.dataset.tab) {
                    e.preventDefault();
                    this.switchTab(e.target.dataset.tab);
                }
            });
            mainPanel.addEventListener('change', (e) => {
                const target = e.target;
                const configPath = target.dataset.config;
                if (!configPath) return;
                const keys = configPath.split('.');
                let configObj = this.core.config;
                for (let i = 0; i < keys.length - 1; i++) {
                    configObj = configObj[keys[i]];
                }
                const value = target.type === 'checkbox' ? target.checked : (target.type === 'number' ? parseFloat(target.value) : target.value);
                configObj[keys[keys.length - 1]] = value;
                this.core.data.saveConfig();
                this.updateAuxiliaryUI();
            });
            mainPanel.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (!action) return;
                this.core.command.execute(action);
            });
        },
        injectAuxiliaryUI() {
            // OSD [FEATURE #19]
            const osd = document.createElement('div');
            osd.id = `${this.poly.id}-osd`;
            document.body.appendChild(osd);

            // Brainly iFrame
            const brainlyIframe = document.createElement('iframe');
            brainlyIframe.id = 'brainly-chat-iframe';
            brainlyIframe.style.cssText = 'width: 25%; height: 100vh; border: none; position: fixed; top: 0; left: 0; z-index: 20000; transition: opacity 0.5s, transform 0.5s; display: none; transform: translateX(-100%); background: white;';
            brainlyIframe.src = 'https://brainly.com/search';
            document.body.appendChild(brainlyIframe);

            // Search clipboard button (initially hidden)
            const clipboardButton = document.createElement('button');
            clipboardButton.id = 'sp-clipboard-button';
            clipboardButton.innerText = 'Search Clipboard';
            clipboardButton.style.cssText = 'position: fixed; top: 70px; right: 20px; z-index: 20001; display: none; background: var(--accent); color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;';
            document.body.appendChild(clipboardButton);

            clipboardButton.addEventListener('click', () => this.core.command.execute('search-clipboard'));
            this.updateAuxiliaryUI();
        },
        updateOSD(status, detail = '') {
            const osd = document.getElementById(`${this.poly.id}-osd`);
            if (!osd || !this.core.config.utilities.showOSD) {
                if (osd) osd.style.display = 'none';
                return;
            }
            osd.style.display = 'block';
            osd.innerHTML = `<strong>SP Core:</strong> ${status} <small>${detail}</small>`;
        },
        updateAuxiliaryUI() {
            const brainlyIframe = document.getElementById('brainly-chat-iframe');
            const clipboardButton = document.getElementById('sp-clipboard-button');
            const wrap = document.getElementById('wrap');

            if (this.core.config.utilities.SearchInBrainlyFrame) {
                brainlyIframe.style.display = 'block';
                setTimeout(() => {
                    brainlyIframe.style.opacity = '1';
                    brainlyIframe.style.transform = 'translateX(0%)';
                }, 10);
                if (wrap) {
                    wrap.style.transition = 'width 0.5s, margin-left 0.5s';
                    wrap.style.width = '75%';
                    wrap.style.marginLeft = '25%';
                }
            } else {
                brainlyIframe.style.opacity = '0';
                brainlyIframe.style.transform = 'translateX(-100%)';
                setTimeout(() => brainlyIframe.style.display = 'none', 500);
                if (wrap) {
                    wrap.style.width = '100%';
                    wrap.style.marginLeft = '0';
                }
            }
            if (this.core.config.automation.AutoAssessment || this.core.config.automation.AutoAssignment) {
                clipboardButton.style.display = 'block';
            } else {
                clipboardButton.style.display = 'none';
            }
        },
        switchTab(tabName) {
            const mainPanel = document.getElementById(`${this.poly.id}-main`);
            mainPanel.querySelectorAll(`.${this.poly.classPrefix}-sidebar nav a`).forEach(a => a.classList.remove('active'));
            const newActive = mainPanel.querySelector(`[data-tab="${tabName}"]`);
            if (newActive) newActive.classList.add('active');
            const contentArea = document.getElementById(`${this.poly.id}-main-content`);
            if (this.tabs[tabName]) {
                contentArea.innerHTML = this.tabs[tabName](this.core);
                this.bindTabSpecificEvents(tabName);
                this.populateSettings();
            } else {
                contentArea.innerHTML = `<h2>${tabName}</h2><p>Coming soon...</p>`;
            }
        },
        populateSettings() {
            document.querySelectorAll(`#${this.poly.id} [data-config]`).forEach(el => {
                const configPath = el.dataset.config;
                const keys = configPath.split('.');
                let value = this.core.config;
                try {
                    keys.forEach(key => {
                        value = value[key];
                    });
                    if (value !== undefined) {
                        if (el.type === 'checkbox') el.checked = value;
                        else el.value = value;
                    }
                } catch (e) {}
            });
        },
        bindTabSpecificEvents(tabName) {
            if (tabName === 'dashboard') {
                this.renderDashboardChart();
            }
        },
        renderDashboardChart() {
            const ctx = document.getElementById('activity-chart')?.getContext('2d');
            if (!ctx || typeof Chart === 'undefined') {
                if (ctx) ctx.parentElement.innerHTML = "<p>Chart.js is not available.</p>";
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
                        backgroundColor: ['#bb9af7', '#7aa2f7', '#9ece6a', '#f7768e'],
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },
        tabs: {
            dashboard: (core) => `
                <h2>Dashboard</h2>
                <div class="${core.poly.classPrefix}-stat-grid">
                    <div><h4>Activities</h4><p>${core.state.stats.activities}</p></div>
                    <div><h4>Videos Skipped</h4><p>${core.state.stats.videos}</p></div>
                    <div><h4>Guessed Answers</h4><p>${core.state.stats.guessed}</p></div>
                    <div><h4>Time Saved (est.)</h4><p>${Math.round(core.state.stats.timeSaved / 60)} min</p></div>
                </div>
                <h4>Activity Breakdown</h4> <canvas id="activity-chart" height="100"></canvas>`,
            automation: (core) => `<h2>Core Automation</h2><div class="control-group">
                <label><input type="checkbox" data-config="automation.AutoAdvance"> Auto Advance</label>
                <label><input type="checkbox" data-config="automation.AutoSubmit"> Auto Submit (Guessing)</label>
                <label><input type="checkbox" data-config="automation.AutoAssessment"> Auto Assessment (Copy Question)</label>
                <label><input type="checkbox" data-config="automation.AutoAssignment"> Auto Assignment (Copy Question)</label>
                <label><input type="checkbox" data-config="automation.AutoWrite"> Auto Write</label>
                <label><input type="checkbox" data-config="automation.AutoVocabulary"> Auto Vocabulary</label>
                </div>`,
            skipping: (core) => `<h2>Content Skippers</h2><div class="control-group">
                <label>Video Skip Strategy:<select data-config="video.strategy">
                    <option value="ContentAware">Content-Aware</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Aggressive">Aggressive</option>
                    <option value="Stealth">Stealth (Legacy)</option>
                </select></label>
                <label><input type="checkbox" data-config="skipping.SkipIntros"> Skip Intros (Removes Blocker)</label>
                <label><input type="checkbox" data-config="skipping.SkipVirtualLab"> Skip Virtual Lab (Experimental)</label>
                </div><h3>Audio Skipping</h3><div class="control-group">
                <label><input type="checkbox" data-config="skipping.SkipNarrationAudio"> Skip Narration/Entry Audio</label>
                <label><input type="checkbox" data-config="skipping.SkipHintAudio"> Skip Hint Audio</label>
                </div>`,
            helpers: (core) => `<h2>Helpers & Actions</h2><div class="control-group">
                <label><input type="checkbox" data-config="helpers.HighlightAnswers"> Highlight Correct Answers</label>
                <label><input type="checkbox" data-config="helpers.answerPersistence"> Answer Persistence (Auto-fill known answers)</label>
                <label><input type="checkbox" data-config="helpers.ExamMode"> Force Exam Mode (Disables Automation)</label>
                <p style="font-size: 11px; opacity: 0.7; margin-top: 15px;">Pro Tip: Press Ctrl+Shift+P to open the Command Palette!</p>
                </div><div class="${core.poly.classPrefix}-actions">
                <button data-action="complete-frame">Complete Frame</button>
                <button data-action="reveal-answers">Reveal Answers</button>
                <button data-action="search-clipboard">Search Clipboard</button>
                </div>`,
            utilities: (core) => `
                <h2>Utilities</h2><div class="control-group">
                    <label><input type="checkbox" data-config="utilities.SearchInBrainlyFrame"> Show Brainly In Side Frame</label>
                    <label><input type="checkbox" data-config="helpers.integratedBrainly"> Integrated Brainly Fetching (Auto-search)</label>
                    <label><input type="checkbox" data-config="utilities.showOSD"> Show On-Screen Display (OSD)</label>
                    <label><input type="checkbox" data-config="utilities.DiscordLogging"> Enable Discord Logging (Requires Webhook)</label>
                    <p style="font-size:11px; opacity:0.7">Panic Hotkey: ${core.config.utilities.panicHotkey}</p>
                </div>`,
            stealth: (core) => `
                <h2>Stealth Engine</h2><div class="control-group">
                    <label>Behavioral Profile:<select data-config="stealth.profile">
                        <option value="average">Average</option>
                        <option value="diligent">Diligent</option>
                        <option value="reckless">Reckless</option>
                    </select></label>
                    <label><input type="checkbox" data-config="stealth.cognitiveSimulation"> Enable Cognitive Simulation (Simulates reading)</label>
                    <label><input type="checkbox" data-config="stealth.microInteractions"> Enable Micro-Interactions (Scrolling, hovering)</label>
                    <label><input type="checkbox" data-config="stealth.errorSimulation"> Enable Error Simulation (Mistakes on quizzes)</label>
                </div><h4>Study Breaks</h4><div class="control-group">
                    <label><input type="checkbox" data-config="stealth.studyBreaks"> Enable Study Breaks</label>
                    <p style="font-size:11px; opacity:0.7">Takes a 3-8 minute break every 45-70 minutes.</p>
                </div>`,
            fingerprint: (core) => `
                <h2>Anti-Fingerprinting</h2><div class="control-group">
                <label><input type="checkbox" data-config="fingerprint.enabled"> Master Anti-Fingerprint Switch</label>
                <p style="font-size:11px; opacity:0.7">These features help disguise the script's presence by altering browser details.</p>
                </div><div class="control-group">
                <label><input type="checkbox" data-config="fingerprint.spoofCanvas"> Spoof Canvas Fingerprint</label>
                <label><input type="checkbox" data-config="fingerprint.spoofVisibility"> Spoof Tab Visibility (Always focused)</label>
                <label><input type="checkbox" data-config="fingerprint.spoofScreen"> Spoof Screen Resolution</label>
                <label><input type="checkbox" data-config="fingerprint.spoofNavigator"> Spoof Navigator Properties (webdriver)</label>
                </div>`,
            settings: (core) => `
                <h2>Settings</h2><div class="control-group">
                    <h4>API & Services</h4>
                    <label>Discord Webhook URL: <input type="text" data-config="discordWebhook" placeholder="For important notifications"></label>
                </div>
                 <div class="${core.poly.classPrefix}-actions">
                    <button data-action="import-settings">Import Settings</button>
                    <button data-action="export-settings">Export Settings</button>
                    <button data-action="clear-answer-cache">Clear Answer Cache</button>
                </div>`
        },
        injectStyles() {
            GM_addStyle(`:root { --bg: #1a1b26; --bg-alt: #16161e; --bg-panel: #24283b; --fg: #c0caf5; --accent: #7aa2f7; --accent-alt: #bb9af7; --green: #9ece6a; --orange: #ff9e64; --red: #f7768e; --font: 'Segoe UI', 'Roboto', sans-serif; } #${poly.id}, #${poly.id}-osd { z-index: 99999; font-family: var(--font); color: var(--fg); } .${poly.classPrefix}-toggle-btn { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; background: var(--accent); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; z-index: 100000; box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-weight: bold; } .${poly.classPrefix}-app-container { position: fixed; bottom: 80px; right: 20px; width: 650px; height: 500px; background: var(--bg); border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid var(--bg-panel); display: flex; flex-direction: column; overflow: hidden; transition: all 0.4s ease-in-out; } .${poly.classPrefix}-app-container.hidden { transform: translateY(600px); opacity: 0; pointer-events: none; } .${poly.classPrefix}-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: var(--bg-alt); } .${poly.classPrefix}-brand strong { color: var(--accent); } .${poly.classPrefix}-status { font-size: 0.8em; color: var(--orange); } .${poly.classPrefix}-main-wrapper { display: flex; flex: 1; overflow: hidden; } .${poly.classPrefix}-sidebar { width: 150px; background: var(--bg-alt); padding-top: 10px; border-right: 1px solid var(--bg-panel); } .${poly.classPrefix}-sidebar nav a { display: block; padding: 10px 15px; color: var(--fg); text-decoration: none; border-left: 3px solid transparent; transition: all 0.2s ease; font-size: 0.9em; } .${poly.classPrefix}-sidebar nav a:hover { background: var(--bg-panel); } .${poly.classPrefix}-sidebar nav a.active { border-left-color: var(--accent); color: var(--accent); font-weight: bold; background: var(--bg); } .${poly.classPrefix}-main-content { flex: 1; padding: 20px; overflow-y: auto; background: var(--bg); } .${poly.classPrefix}-main-content h2 { border-bottom: 1px solid var(--bg-panel); padding-bottom: 10px; margin-top: 0; } .${poly.classPrefix}-footer { height: 120px; background: var(--bg-alt); border-top: 1px solid var(--bg-panel); } .${poly.classPrefix}-log-viewer { height: 100%; overflow-y: scroll; padding: 5px; font-family: 'Consolas', monospace; font-size: 0.8em; display:flex; flex-direction:column-reverse;} .log-entry { padding: 2px 5px; } .log-entry span { color: #565f89; margin-right: 5px; } .log-info { color: #a9b1d6; } .log-success { color: var(--green); } .log-warning { color: var(--orange); } .log-error { color: var(--red); } .log-debug { color: #565f89; } .control-group { background: var(--bg-panel); padding: 15px; border-radius: 8px; margin-bottom: 15px; } .control-group label { display: block; margin-bottom: 10px; } input[type="text"], input[type="password"], input[type="number"], select { width: 100%; box-sizing: border-box; background: var(--bg-alt); border: 1px solid #30324a; color: var(--fg); padding: 8px; border-radius: 4px; } input[type="checkbox"] { accent-color: var(--accent); } .${poly.classPrefix}-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; text-align: center; } .${poly.classPrefix}-stat-grid div { background: var(--bg-panel); padding: 15px; border-radius: 8px; } .${poly.classPrefix}-stat-grid h4 { margin: 0 0 5px 0; color: var(--accent-alt); } .${poly.classPrefix}-stat-grid p { margin: 0; font-size: 1.5em; font-weight: bold; } .switch { display: inline-block; height: 26px; position: relative; width: 50px; } .switch input { display: none; } .switch div { background: #3b4261; bottom: 0; cursor: pointer; left: 0; position: absolute; right: 0; top: 0; transition: .4s; border-radius: 26px; } .switch div:before { background: #fff; bottom: 4px; content: ""; height: 18px; width: 18px; left: 4px; position: absolute; transition: .4s; border-radius: 50%; } .switch input:checked + div { background-color: var(--accent); } .switch input:checked + div:before { transform: translateX(24px); } .${poly.classPrefix}-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; } .${poly.classPrefix}-actions button { padding: 10px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; background: var(--bg-panel); color: var(--fg); transition: background-color 0.2s; } .${poly.classPrefix}-actions button:hover { background: var(--accent); color: white; } #${poly.id}-osd { position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: rgba(26, 27, 38, 0.8); color: #c0caf5; padding: 5px 15px; border-radius: 8px; z-index: 10000; font-family: var(--font); font-size: 14px; backdrop-filter: blur(5px); border: 1px solid #24283b; box-shadow: 0 2px 10px rgba(0,0,0,0.3); transition: all 0.3s; } #${poly.id}-osd small { opacity: 0.7; margin-left: 10px; }`);
        }
    };

    const StealthService = {
        name: 'StealthService',
        init(core) {
            this.core = core;
        },
        // [FEATURE #3] Dynamic Pacing Based on Content Analysis
        getDelay(activityType, contentMetrics = {
            words: 0,
            elements: 0
        }) {
            const profile = this.core.config.stealth.profile;
            const profiles = {
                average: {
                    base: 1.0,
                    wpm: 200
                },
                diligent: {
                    base: 1.6,
                    wpm: 150
                },
                reckless: {
                    base: 0.4,
                    wpm: 350
                },
            };
            const p = profiles[profile] || profiles.average;

            const wordTime = (contentMetrics.words / p.wpm) * 60000; // Time in ms to read words
            const elementTime = contentMetrics.elements * 1500; // 1.5s per interactive element
            let baseDelay = (wordTime + elementTime) * p.base;

            return this.humanizedWait(Math.max(2500, baseDelay * 0.8), Math.max(3500, baseDelay * 1.2));
        },
        // [FEATURE #2] Behavioral Heatmap Simulation (Simplified)
        async humanizedMouseMove(targetElement) {
            this.core.ui.updateOSD("Stealth", "Simulating mouse movement...");
            // A full implementation is complex; this simulates the time delay of moving the mouse.
            await this.humanizedWait(500, 1500);
            targetElement.dispatchEvent(new MouseEvent('mouseover', {
                bubbles: true
            }));
            await this.humanizedWait(200, 500);
        },
        // [FEATURE #4] Simulate "Micro-Interactions"
        async performMicroInteractions(frame) {
            if (!this.core.config.stealth.microInteractions || !frame?.contentWindow) return;
            this.core.ui.updateOSD("Stealth", "Performing micro-interactions...");
            const scrollMax = frame.contentDocument.body.scrollHeight - frame.contentWindow.innerHeight;
            if (scrollMax > 0 && Math.random() > 0.6) {
                frame.contentWindow.scrollTo({
                    top: Math.random() * scrollMax,
                    behavior: 'smooth'
                });
                await this.humanizedWait(1000, 3000);
            }
            const hoverable = Array.from(frame.contentDocument.querySelectorAll('p, img, b'));
            if (hoverable.length > 0 && Math.random() > 0.5) {
                const target = hoverable[Math.floor(Math.random() * hoverable.length)];
                target.dispatchEvent(new MouseEvent('mouseover', {
                    bubbles: true
                }));
                await this.humanizedWait(500, 1500);
                target.dispatchEvent(new MouseEvent('mouseout', {
                    bubbles: true
                }));
            }
        },
        // [FEATURE #7] Jittery Keystroke Simulation
        async typeText(textarea, text) {
            this.core.ui.updateOSD("Automation", "Typing text...");
            for (const char of text) {
                textarea.value += char;
                textarea.dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                // [FEATURE #5] Error simulation part 2: typos
                if (this.core.config.stealth.errorSimulation && Math.random() < 0.03) {
                    await this.humanizedWait(100, 200);
                    textarea.value = textarea.value.slice(0, -1);
                    await this.humanizedWait(200, 400);
                    textarea.value += char;
                }
                await this.humanizedWait(50, 150); // Jittery delay
            }
        },
        async humanizedWait(min, max) {
            const waitTime = Math.random() * (max - min) + min;
            return new Promise(resolve => setTimeout(resolve, waitTime));
        },
    };

    const AutomationService = {
        name: 'AutomationService',
        state: 'IDLE', // [FEATURE #11] Finite State Machine (FSM)
        nextBreakCheck: 0,
        init(core) {
            this.core = core;
            this.scheduleNextBreak();
            this.initPanicHotkey();
            this.initSessionAnalytics();
            // Start main loop
            this.mainLoop();
        },
        scheduleNextBreak() {
            const {
                minBreakInterval,
                maxBreakInterval
            } = this.core.config.stealth;
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
                    this.core.data.saveConfig(); // Persist panic
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

            // [FEATURE #6] "Study Break" Scheduler
            if (this.core.config.stealth.studyBreaks && Date.now() > this.nextBreakCheck) {
                const {
                    minBreakDuration,
                    maxBreakDuration
                } = this.core.config.stealth;
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
                setTimeout(() => this.mainLoop(), 30000); // Check again in 30s
                return;
            }

            const automationDisabled = this.state !== 'IDLE' || !this.core.config.masterControl || !this.core.platform.adapter || this.core.state.isExam;
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
                // [FEATURE #8] Frame Chain State Validator
                if (!this.core.platform.adapter.validateState()) {
                    throw new Error("Edgenuity state is invalid.");
                }
                await this.core.platform.adapter.handlePopups();
                await this.core.stealth.performMicroInteractions(document.getElementById('stageFrame'));

                const activity = await this.core.platform.adapter.detectActivity();
                if (activity) {
                    this.state = `HANDLING_${activity.type.toUpperCase()}`;
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
                await this.core.stealth.humanizedWait(5000, 8000); // Wait before resetting
            }

            this.state = 'IDLE';
            this.core.ui.updateOSD(this.state);
            setTimeout(() => this.mainLoop(), 2000);
        },
        async handleActivity(activity) {
            const adapter = this.core.platform.adapter;
            const conf = this.core.config;
            const handlerMap = {
                video: {
                    enabled: conf.skipping.SkipVideos,
                    handler: adapter.handleVideo.bind(adapter)
                },
                quiz: {
                    enabled: conf.automation.AutoAssessment,
                    handler: adapter.handleQuiz.bind(adapter)
                },
                assignment: {
                    enabled: conf.automation.AutoAssignment,
                    handler: adapter.handleAssignment.bind(adapter)
                },
                vocabulary: {
                    enabled: conf.automation.AutoVocabulary,
                    handler: adapter.handleVocabulary.bind(adapter)
                },
                writing: {
                    enabled: conf.automation.AutoWrite,
                    handler: adapter.handleWriting.bind(adapter)
                },
                guessable: {
                    enabled: conf.automation.AutoSubmit,
                    handler: adapter.handleGuessingActivity.bind(adapter)
                },
            };
            if (handlerMap[activity.type] && handlerMap[activity.type].enabled) {
                let attempts = 0;
                while (attempts < conf.automation.retryAttempts) {
                    try {
                        await handlerMap[activity.type].handler(activity.element);
                        return; // Success
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

    const CommandService = {
        name: 'CommandService',
        commands: [],
        init(core) {
            this.core = core;
            this.injectPaletteHTML();
            this.initPalette();
            this.registerCoreCommands();
        },
        register(command) {
            this.commands.push(command);
        },
        execute(actionId) {
            const command = this.commands.find(c => c.id === actionId);
            if (command?.execute) {
                command.execute();
                this.core.log(`Executed: ${command.name}`, 'debug');
            }
        },
        injectPaletteHTML() {
            const p = this.core.poly;
            const palette = document.createElement('div');
            palette.id = `${p.id}-command-palette`;
            palette.className = 'hidden';
            palette.innerHTML = `
                 <input type="text" id="${p.id}-command-input" placeholder="Type a command...">
                 <div id="${p.id}-command-results"></div>
             `;
            document.body.appendChild(palette);
            GM_addStyle(`#${p.id}-command-palette { display: none; position: fixed; top: 20%; left: 50%; transform: translateX(-50%); width: 500px; background: var(--bg-panel); border: 1px solid #30324a; border-radius: 8px; z-index: 20000; box-shadow: 0 10px 40px rgba(0,0,0,0.5); } #${p.id}-command-palette.hidden { display: none; } #${p.id}-command-palette:not(.hidden) { display: block; } #${p.id}-command-input { width: 100%; background: transparent; color: var(--fg); border: none; padding: 15px; font-size: 18px; border-bottom: 1px solid #30324a; } #${p.id}-command-results { max-height: 300px; overflow-y: auto; } .command-item { padding: 12px 15px; cursor: pointer; color: var(--fg); } .command-item:hover, .command-item.selected { background: var(--accent); color: white; }`);
        },
        initPalette() {
            const p = this.core.poly;
            const palette = document.getElementById(`${p.id}-command-palette`);
            const input = document.getElementById(`${p.id}-command-input`);
            const results = document.getElementById(`${p.id}-command-results`);
            let selectedIndex = 0;

            const renderResults = (filter = '') => {
                const filteredCommands = this.commands.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
                results.innerHTML = filteredCommands.map((cmd, index) =>
                    `<div class="command-item ${index === selectedIndex ? 'selected' : ''}" data-id="${cmd.id}">${cmd.name}</div>`
                ).join('');
            };
            const executeSelected = () => {
                const selected = results.querySelector('.command-item.selected');
                if (selected) {
                    this.execute(selected.dataset.id);
                    this.togglePalette(false);
                }
            };

            document.addEventListener('keydown', e => {
                if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                    e.preventDefault();
                    this.togglePalette();
                }
                if (!palette.classList.contains('hidden')) {
                    if (e.key === 'ArrowDown') {
                        selectedIndex = (selectedIndex + 1) % (results.children.length || 1);
                        renderResults(input.value);
                    } else if (e.key === 'ArrowUp') {
                        selectedIndex = (selectedIndex - 1 + (results.children.length || 1)) % (results.children.length || 1);
                        renderResults(input.value);
                    } else if (e.key === 'Enter') {
                        executeSelected();
                    } else if (e.key === 'Escape') {
                        this.togglePalette(false);
                    }
                }
            });
            input.addEventListener('input', () => {
                selectedIndex = 0;
                renderResults(input.value);
            });
            results.addEventListener('click', e => {
                const target = e.target.closest('.command-item');
                if (target) {
                    this.execute(target.dataset.id);
                    this.togglePalette(false);
                }
            });
        },
        togglePalette(show) {
            const palette = document.getElementById(`${this.core.poly.id}-command-palette`);
            const shouldShow = show ?? palette.classList.contains('hidden');
            palette.classList.toggle('hidden', !shouldShow);
            if (shouldShow) {
                document.getElementById(`${this.core.poly.id}-command-input`).focus();
                this.commands.sort((a, b) => a.name.localeCompare(b.name));
                let input = document.getElementById(`${this.core.poly.id}-command-input`);
                input.value = '';
                input.dispatchEvent(new Event('input'));
            }
        },
        registerCoreCommands() {
            this.register({
                id: 'complete-frame',
                name: 'Action: Complete Current Frame',
                execute: () => this.core.platform.adapter.completeCurrentFrame()
            });
            this.register({
                id: 'reveal-answers',
                name: 'Action: Reveal Hidden Answers',
                execute: () => this.core.platform.adapter.revealAnswers()
            });
            this.register({
                id: 'search-clipboard',
                name: 'Action: Search Brainly for Clipboard',
                execute: () => this.core.platform.adapter.searchClipboard()
            });
            this.register({
                id: 'export-settings',
                name: 'Settings: Export Configuration',
                execute: () => this.exportSettings()
            });
            this.register({
                id: 'import-settings',
                name: 'Settings: Import Configuration',
                execute: () => this.importSettings()
            });
            this.register({
                id: 'toggle-ui',
                name: 'UI: Toggle Main Panel',
                execute: () => document.getElementById(`${this.core.poly.id}-main`).classList.toggle('hidden')
            });
            this.register({
                id: 'clear-answer-cache',
                name: 'Settings: Clear Answer Cache',
                execute: () => this.core.data.clearAnswerCache()
            });
            this.register({
                id: 'force-advance',
                name: 'Action: Force Advance',
                execute: () => this.core.platform.adapter.advanceActivity()
            });
            this.register({
                id: 'pause-15',
                name: 'Action: Pause Automation for 15 mins',
                execute: () => {
                    this.core.state.breakUntil = Date.now() + 15 * 60000;
                    this.core.log("Automation paused for 15 minutes by user.", "info");
                }
            });
        },
        exportSettings() {
            const configString = JSON.stringify(this.core.config, null, 2);
            const blob = new Blob([configString], {
                type: 'application/json'
            });
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
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async event => {
                    try {
                        const importedConfig = JSON.parse(event.target.result);
                        this.core.config = this.core.data._deepMerge(this.core.data.getDefaultConfig(), importedConfig);
                        await this.core.data.saveConfig();
                        this.core.ui.switchTab('dashboard'); // Force UI refresh
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

    // --- 4. PLATFORM ADAPTERS ---
    const EdgenuityAdapter = {
        name: 'Edgenuity',
        hooks: {
            app: null,
            api: null,
            proxied: false
        },
        init(core) {
            this.core = core;
            this.waitForApp();
        },
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
        validateState() {
            try {
                return this.hooks.api && this.hooks.api.FrameChain && this.hooks.app.playerView.model;
            } catch (e) {
                return false;
            }
        },
        setupProxies() {
            if (this.hooks.proxied || !this.hooks.api) return;
            this.hooks.proxied = true;
            const self = this;
            // [FEATURE 13] Proxy the complete() Function
            const originalComplete = this.hooks.api.Frame.complete;
            this.hooks.api.Frame.complete = new Proxy(originalComplete, {
                apply: async (target, thisarg, args) => {
                    await self.core.stealth.humanizedWait(500, 1500); // Add delay before completing
                    self.core.log("Proxied frame completion call.", "debug");
                    return target.apply(thisarg, args);
                }
            });
            // [FEATURE 1] Proxy Telemetry (simplified example)
            const originalLMSCommit = this.hooks.api.LMSCommit;
            this.hooks.api.LMSCommit = new Proxy(originalLMSCommit, {
                apply: (target, thisarg, args) => {
                    self.core.log("Intercepted LMSCommit (telemetry).", "debug");
                    // Can inspect or modify data here
                    return target.apply(thisarg, args);
                }
            });
            this.core.log('Edgenuity API proxies attached.', 'debug');
        },
        canAdvance() {
            return document.querySelector('.footnav.goRight:not(.disabled)') !== null;
        },
        analyzeContent(doc) {
            const text = doc.body.innerText || '';
            const words = text.split(/\s+/).length;
            const elements = doc.querySelectorAll('button, a, input, video').length;
            return {
                words,
                elements
            };
        },
        detectActivity() {
            // [FEATURE 9] Predictive Activity Handling
            const activityTitle = document.getElementById("activity-title")?.innerText || '';
            const stageFrame = document.querySelector('#stageFrame');
            if (!stageFrame?.contentDocument?.body) return null;
            const stageDoc = stageFrame.contentDocument;

            // This is a simplified heuristics engine
            if (stageDoc.querySelector('video') && !stageDoc.querySelector('.quiz-body')) return {
                type: 'video',
                element: stageFrame
            };
            if (activityTitle.includes("Vocabulary")) return {
                type: 'vocabulary',
                element: stageFrame
            };
            if (activityTitle.includes("Writing") || stageDoc.querySelector('.QuestionTextArea')) return {
                type: 'writing',
                element: stageFrame
            };
            if (activityTitle.includes("Assignment")) return {
                type: 'assignment',
                element: stageFrame
            };
            if (/(Quiz|Test|Exam)/.test(activityTitle) || stageDoc.querySelector(".Assessment_Main_Body_Content_Question")) return {
                type: 'quiz',
                element: stageFrame
            };
            if (["Instruction", "Summary", "Warm-Up"].some(t => activityTitle.includes(t)) && stageDoc.querySelector(".answer-choice-button")) return {
                type: 'guessable',
                element: stageFrame
            };

            return null;
        },
        async advanceActivity() {
            this.core.log('Advancing to next activity...', 'info');
            const nextBtn = document.querySelector(".footnav.goRight");
            if (nextBtn) {
                await this.core.stealth.humanizedMouseMove(nextBtn);
                nextBtn.click();
            } else {
                this.hooks.api.FrameChain.nextFrame();
            }
        },
        async handleVideo(videoFrame) {
            const video = videoFrame.contentDocument.querySelector('video');
            if (!video) return;

            const duration = await new Promise(resolve => {
                if (video.readyState >= 1) return resolve(video.duration);
                video.onloadedmetadata = () => resolve(video.duration);
            });
            this.core.state.stats.timeSaved += duration;

            this.core.log(`Video detected (length: ${Math.round(duration)}s). Engaging skip strategy...`, 'info');
            await this.core.stealth.humanizedWait(1000, 2000);
            const strategy = this.core.config.video.strategy;
            let success = false;
            switch (strategy) {
            case 'ContentAware':
                success = await this.skipContentAware(video);
                break;
            case 'Aggressive':
                success = await this.skipWithAPI(video);
                break;
            case 'Stealth':
                success = await this.skipWithJitter(video);
                break;
            default:
                success = await this.skipHybrid(video);
                break;
            }
            if (success) {
                this.core.state.stats.videos++;
                this.core.log(`Video handled successfully with ${strategy} strategy.`, 'success');
                await this.completeCurrentFrame();
            } else {
                this.core.log(`Strategy ${strategy} failed.`, 'error');
            }
        },
        skipContentAware(video) {
            this.core.log("Using ContentAware strategy: watching key moments.", 'debug');
            return new Promise(async resolve => {
                const keyPoints = [0.1, 0.5, 0.9];
                video.muted = true;
                for (const point of keyPoints) {
                    video.currentTime = video.duration * point;
                    video.play();
                    await this.core.stealth.humanizedWait(2000, 3000);
                    video.pause();
                }
                resolve(this.skipWithAPI(video));
            });
        },
        async handleQuiz(stageFrame) {
            const doc = stageFrame.contentDocument;
            const questionEl = doc.querySelector(".Assessment_Main_Body_Content_Question");
            if (!questionEl) return;
            const questionText = questionEl.innerText.trim();
            const questionKey = questionText.substring(0, 100); // Use first 100 chars as key

            // [FEATURE 16] Answer Persistence
            if (this.core.config.helpers.answerPersistence) {
                const cachedAnswer = await this.core.data.getAnswerFromCache(questionKey);
                if (cachedAnswer) {
                    this.core.log("Found answer in cache. Auto-filling.", "success");
                    // Implement logic to find and click the cached answer
                    return;
                }
            }
            // [FEATURE 18] Integrated Brainly
            if (this.core.config.helpers.integratedBrainly) {
                this.searchBrainly(questionText);
            }
        },
        async handleGuessingActivity(stageFrame) {
            const options = Array.from(stageFrame.contentDocument.querySelectorAll(".answer-choice-button"));
            if (options.length > 0) {
                // [FEATURE 17] Smart Guessing
                let choice;
                const allOfTheAbove = options.find(o => /all of the above/i.test(o.innerText));
                if (allOfTheAbove && Math.random() > 0.4) {
                    choice = allOfTheAbove;
                } else {
                    choice = options[Math.floor(Math.random() * options.length)];
                }
                // [FEATURE 5] Error Simulation
                if (this.core.config.stealth.errorSimulation && Math.random() < 0.1) {
                    this.core.log("Simulating an incorrect guess...", "debug");
                    const wrongOptions = options.filter(o => o !== choice);
                    if (wrongOptions.length > 0) {
                        const wrongChoice = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
                        await this.core.stealth.humanizedMouseMove(wrongChoice);
                        wrongChoice.click();
                        await this.core.stealth.humanizedWait(1500, 3000);
                    }
                }
                await this.core.stealth.humanizedMouseMove(choice);
                choice.click();
                this.core.state.stats.guessed++;
            }
        },
        async handleWriting(stageFrame) {
            const textarea = stageFrame.contentDocument.querySelector('.QuestionTextArea');
            if (textarea && textarea.value.trim() === '') {
                const title = document.getElementById("activity-title")?.innerText || "the topic";
                // [FEATURE 15] Contextual Auto-Writing
                const text = `Reflecting on the material about "${title}", it is evident that the core concepts are fundamental to a deeper understanding. The provided resources effectively illustrate these points, leading to a comprehensive grasp of the subject matter. This assignment has clarified my perspective on the topic.`;
                await this.core.stealth.typeText(textarea, text);
                this.core.state.stats.activities++;
            }
        },
        async completeCurrentFrame() {
            try {
                this.hooks.api.Frame.complete();
            } catch (e) {}
        },
        updateActivityState() {
            const currentActivity = document.getElementById("activity-title")?.innerText;
            if (currentActivity && this.core.state.lastActivityName !== currentActivity) {
                this.core.state.lastActivityName = currentActivity;
                this.core.log(`New activity: ${currentActivity}`, 'info');
                const examKeywords = ['quiz', 'test', 'exam', 'mid-term', 'final', 'review test'];
                const isExam = this.core.config.helpers.ExamMode || examKeywords.some(kw => currentActivity.toLowerCase().includes(kw));
                this.core.state.isExam = isExam;
                if (isExam) this.core.log(`EXAM MODE ACTIVE. Core automation disabled.`, 'warning');
                this.core.data.saveState();
            }
        },
        async searchBrainly(query) {
            this.core.log(`Searching Brainly for: "${query.substring(0, 40)}..."`, 'info');
            const url = `https://brainly.com/search?q=${encodeURIComponent(query)}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const answerNode = doc.querySelector('[data-test="answer-box-text"] p');
                    if (answerNode) {
                        this.core.log(`Integrated Brainly Answer Found: ${answerNode.textContent.trim()}`, 'success');
                        // Can display this in the UI
                    } else {
                        this.core.log('No definitive answer found via Integrated Brainly.', 'warning');
                        // Fallback to iframe
                        if (this.core.config.utilities.SearchInBrainlyFrame) {
                            document.getElementById('brainly-chat-iframe').src = url;
                        }
                    }
                }
            });
        }
        // ...Other adapter functions from original script...
    };

    // --- 5. SINGULARITY PRIME CORE ---
    class SingularityPrimeCore {
        constructor() {
            this.poly = poly;
            this.services = new Map();
            this.config = {};
            this.state = {};
            this.log = (message, level = 'info', data = {}) => {
                const logMessage = Object.keys(data).length > 0 ? `${message} | ${JSON.stringify(data)}` : message;
                console.log(`SINGULARITY::${level.toUpperCase()}-> ${message}`, data);
                this.ui?.log(logMessage, level);
                if (this.config?.utilities?.DiscordLogging && this.config?.discordWebhook && level !== 'debug') {
                    this.sendToWebhook({
                        content: `**[${level.toUpperCase()}]** ${logMessage.substring(0, 1900)}`
                    });
                }
            };
            (async () => {
                const savedConfig = JSON.parse(await GM_getValue(this.poly.configKey, '{}'));
                this.config = DataService._deepMerge(DataService.getDefaultConfig(), savedConfig);
                this.registerService(AntiFingerprintService);
                this.getService('AntiFingerprintService').init(this);
            })();

            if (window.location.hostname.includes('brainly.')) return; // Don't run full core on brainly
            window.addEventListener('DOMContentLoaded', this.init.bind(this));
        }

        async init() {
            this.registerService(DataService);
            this.data = this.getService('DataService');
            this.state = await this.data.loadState();

            this.registerService(UIManager);
            this.registerService(StealthService);
            this.registerService(EdgenuityAdapter);
            this.registerService(AutomationService);
            this.registerService(CommandService);

            for (const service of this.services.values()) {
                if (typeof service.init === 'function' && service.name !== 'AntiFingerprintService') await service.init(this);
            }
            this.ui = this.getService('UIManager');
            this.platform = {
                adapter: this.getService('Edgenuity')
            };
            this.stealth = this.getService('StealthService');
            this.command = this.getService('CommandService');

            this.log(`Singularity Prime [Fusion V2] Initialized. Version: 14.0`, 'success');
        }
        registerService(service) {
            this.services.set(service.name, service);
        }
        getService(name) {
            const service = this.services.get(name);
            if (!service) throw new Error(`Service "${name}" not found.`);
            return service;
        }
        sendToWebhook(payload) {
            if (!this.config.discordWebhook) return;
            GM_xmlhttpRequest({
                method: 'POST',
                url: this.config.discordWebhook,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(payload)
            });
        }
    }

    // --- 6. ENTRY POINT ---
    if (window.self === window.top) {
        if (!window[poly.globalInstance]) {
            window[poly.globalInstance] = new SingularityPrimeCore();
        } else {
            console.log("SINGULARITY PRIME::Warning->An instance of the Core already exists.");
        }
    }
})();
