/* ════════════════════════════════════════════════
   PKA Study - courses-viewer.js  (v3 - fixed)
   Render topic list & word view inside #page-courses
   + Custom "Tài liệu của bạn" module
════════════════════════════════════════════════ */
'use strict';

(function () {

    /* ══════════════════════════════════════════════
       STORAGE
    ══════════════════════════════════════════════ */
    const STORAGE_KEY = 'pka_remembered';
    const CUSTOM_KEY = 'pka_custom_courses';

    function loadRemembered() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } }
    function saveRemembered(m) { localStorage.setItem(STORAGE_KEY, JSON.stringify(m)); if (typeof window.pkaSyncDashboard === 'function') window.pkaSyncDashboard(); }
    function loadCustomCourses() { try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || []; } catch { return []; } }
    function saveCustomCourses(c) { localStorage.setItem(CUSTOM_KEY, JSON.stringify(c)); }
    function genId(prefix) { return prefix + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6); }

    /* ══════════════════════════════════════════════
       STATE
    ══════════════════════════════════════════════ */
    let rememberedMap = loadRemembered();
    let currentCourse = null;
    let currentTopic = null;
    let isCustomMode = false;
    let currentCustomTopicId = null;

    const LANG_LABEL = {
        'en': 'Anh', 'ko': 'Hàn', 'ja': 'Nhật', 'zh': 'Trung', 'fr': 'Pháp'
    };

    /* ══════════════════════════════════════════════
       ROOT ELEMENT
    ══════════════════════════════════════════════ */
    const coursePage = document.getElementById('page-courses');
    if (!coursePage) return;

    /* ══════════════════════════════════════════════
       BUILD SUB-VIEWS
    ══════════════════════════════════════════════ */

    // ── Sub-view A: Topic list ──
    const topicsView = document.createElement('div');
    topicsView.id = 'cv-topics-view';
    topicsView.className = 'cv-subview cv-hidden';
    topicsView.innerHTML = `
    <div class="cv-subview-header">
      <button class="cv-breadcrumb-btn" id="cv-back-to-courses">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z"/>
        </svg>
        Tài liệu
      </button>
      <span class="cv-breadcrumb-sep">›</span>
      <span class="cv-breadcrumb-current" id="cv-course-title">Chọn chủ đề</span>
    </div>
    <div class="cv-topics-grid" id="cv-topics-grid"></div>
  `;

    // ── Sub-view B: Word view (shared for both regular & custom) ──
    const wordsView = document.createElement('div');
    wordsView.id = 'cv-words-view';
    wordsView.className = 'cv-subview cv-hidden';
    wordsView.innerHTML = `
    <div class="cv-subview-header">
      <button class="cv-breadcrumb-btn" id="cv-back-to-topics">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z"/>
        </svg>
        <span id="cv-back-course-label">Khóa học</span>
      </button>
      <span class="cv-breadcrumb-sep">›</span>
      <span class="cv-breadcrumb-current" id="cv-topic-title">Topic</span>
    </div>

    <!-- Custom toolbar (only visible in custom mode) -->
    <div id="cv-custom-toolbar" class="cv-custom-toolbar cv-hidden">
      <button class="btn btn-primary btn-small" id="cv-add-word-btn">+ Thêm từ vựng</button>
      <button class="cv-btn-ai" id="cv-ai-gen-btn">✨ AI tạo từ hàng loạt</button>
    </div>

    <!-- 5 Learning modes -->
    <section class="cv-modes-section">
      <h3 class="cv-section-title">🎯 Chọn cách học</h3>
      <div class="cv-modes-grid" id="cv-modes-grid">
        <button class="cv-mode-card" data-mode="flashcard">
          <div class="cv-mode-card-icon">🃏</div>
          <div class="cv-mode-card-name">Flashcard</div>
          <div class="cv-mode-card-desc">Lật thẻ, nhớ từ nhanh</div>
          <span class="cv-soon-badge">Sắp có</span>
        </button>
        <button class="cv-mode-card" data-mode="quiz">
          <div class="cv-mode-card-icon">❓</div>
          <div class="cv-mode-card-name">Trắc nghiệm</div>
          <div class="cv-mode-card-desc">4 đáp án, chọn đúng</div>
          <span class="cv-soon-badge">Sắp có</span>
        </button>
        <button class="cv-mode-card" data-mode="typing">
          <div class="cv-mode-card-icon">⌨️</div>
          <div class="cv-mode-card-name">Điền từ</div>
          <div class="cv-mode-card-desc">Gõ từ vựng chính xác</div>
          <span class="cv-soon-badge">Sắp có</span>
        </button>
        <button class="cv-mode-card" data-mode="match">
          <div class="cv-mode-card-icon">🔗</div>
          <div class="cv-mode-card-name">Ghép đôi</div>
          <div class="cv-mode-card-desc">Nối từ với nghĩa đúng</div>
          <span class="cv-soon-badge">Sắp có</span>
        </button>
        <button class="cv-mode-card" data-mode="listen">
          <div class="cv-mode-card-icon">🎧</div>
          <div class="cv-mode-card-name">Nghe & Chọn</div>
          <div class="cv-mode-card-desc">Luyện kỹ năng nghe</div>
          <span class="cv-soon-badge">Sắp có</span>
        </button>
      </div>
    </section>

    <div id="cv-mode-area" class="cv-hidden"></div>

    <!-- Stats bar -->
    <div class="cv-stats-bar">
      <span class="cv-stat"><span class="cv-stat-dot dot-total"></span>Tổng: <strong id="cv-total">0</strong> từ</span>
      <span class="cv-stat"><span class="cv-stat-dot dot-done"></span>Đã thuộc: <strong id="cv-done">0</strong></span>
      <span class="cv-stat"><span class="cv-stat-dot dot-left"></span>Chưa thuộc: <strong id="cv-left">0</strong></span>
    </div>

    <!-- Vocabulary table -->
    <section class="cv-vocab-section">
      <h3 class="cv-section-title" id="cv-vocab-title">📖 Danh sách từ vựng</h3>
      <div class="cv-word-table">
        <div class="cv-word-table-head">
          <span>Từ vựng</span>
          <span>Phiên âm</span>
          <span>Nghĩa</span>
          <span>Loại từ</span>
          <span>Ví dụ</span>
          <span>Đã thuộc</span>
          <span class="cv-col-actions">Hành động</span>
        </div>
        <div id="cv-word-rows"></div>
      </div>
      <div id="cv-empty-words" class="cv-words-empty cv-hidden">
        <div style="font-size:2.5rem;margin-bottom:12px">📝</div>
        <p>Chưa có từ vựng nào.<br>Hãy thêm từ thủ công hoặc dùng AI tạo từ hàng loạt!</p>
      </div>
    </section>
  `;

    coursePage.appendChild(topicsView);
    coursePage.appendChild(wordsView);

    /* ══════════════════════════════════════════════
       MODAL SYSTEM
    ══════════════════════════════════════════════ */
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'cv-modal-overlay';
    modalOverlay.className = 'cv-modal-overlay';
    modalOverlay.innerHTML = `<div class="cv-modal-box" id="cv-modal-box"></div>`;
    document.body.appendChild(modalOverlay);

    function openModal(html) {
        document.getElementById('cv-modal-box').innerHTML = html;
        modalOverlay.classList.add('cv-modal-active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => { modalOverlay.querySelector('input, textarea')?.focus(); }, 80);
    }

    function closeModal() {
        modalOverlay.classList.remove('cv-modal-active');
        document.body.style.overflow = '';
    }

    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    /* ══════════════════════════════════════════════
       HELPER: getElementById shorthand
    ══════════════════════════════════════════════ */
    const $ = (id) => document.getElementById(id);

    /* ══════════════════════════════════════════════
       SHOW / HIDE SUB-VIEWS
    ══════════════════════════════════════════════ */
    function showSubView(which) {
        Array.from(coursePage.children).forEach(el => {
            if (el === topicsView || el === wordsView) return;
            el.style.display = (which === 'home') ? '' : 'none';
        });
        topicsView.classList.toggle('cv-hidden', which !== 'topics');
        wordsView.classList.toggle('cv-hidden', which !== 'words');
    }

    /* ══════════════════════════════════════════════
       WEB SPEECH - Fixed multi-language voice
    ══════════════════════════════════════════════ */
    let _voicesReady = false;
    let _pendingSpeak = null;

    window.speechSynthesis.addEventListener('voiceschanged', () => {
        _voicesReady = true;
        if (_pendingSpeak) {
            window.speechSynthesis.speak(_pendingSpeak);
            _pendingSpeak = null;
        }
    });

    function speak(text, lang) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const LANG_MAP = {
            'en': 'en-US', 'Anh': 'en-US',
            'ko': 'ko-KR', 'Hàn': 'ko-KR',
            'ja': 'ja-JP', 'Nhật': 'ja-JP',
            'zh': 'zh-CN', 'Trung': 'zh-CN',
            'fr': 'fr-FR', 'Pháp': 'fr-FR',
        };

        const targetLang = LANG_MAP[lang] || 'en-US';
        const u = new SpeechSynthesisUtterance(text);
        u.lang = targetLang;
        u.rate = 0.85;

        // Chọn voice phù hợp nhất với ngôn ngữ
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            // Ưu tiên: exact match → prefix match → bất kỳ voice nào
            const exact = voices.find(v => v.lang === targetLang);
            const prefix = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
            if (exact || prefix) u.voice = exact || prefix;
        }

        // Nếu voices chưa sẵn sàng, đợi event voiceschanged
        if (!_voicesReady && window.speechSynthesis.getVoices().length === 0) {
            _pendingSpeak = u;
        } else {
            window.speechSynthesis.speak(u);
        }
    }

    /* ══════════════════════════════════════════════
       STATS
    ══════════════════════════════════════════════ */
    function updateStats(words) {
        const done = words.filter(w => rememberedMap[w.id]).length;
        $('cv-total').textContent = words.length;
        $('cv-done').textContent = done;
        $('cv-left').textContent = words.length - done;
    }

    /* ══════════════════════════════════════════════
       REGULAR COURSE - OPEN COURSE → TOPIC LIST
    ══════════════════════════════════════════════ */
    function openCourse(course) {
        currentCourse = course;
        $('cv-course-title').textContent = course.title;

        const grid = $('cv-topics-grid');
        grid.innerHTML = '';

        course.topics.forEach(topic => {
            const total = topic.words.length;
            const done = topic.words.filter(w => rememberedMap[w.id]).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            const card = document.createElement('div');
            card.className = 'cv-topic-card reveal';
            card.innerHTML = `
        <div class="cv-topic-left">
          <div class="cv-topic-emoji">${topic.title.split(' ')[0]}</div>
          <div class="cv-topic-info">
            <div class="cv-topic-name">${topic.title.replace(/^\S+\s/, '')}</div>
            <div class="cv-topic-desc">${topic.description}</div>
          </div>
        </div>
        <div class="cv-topic-right">
          <div class="cv-topic-progress-wrap">
            <div class="cv-topic-bar">
              <div class="cv-topic-bar-fill" style="width:${pct}%"></div>
            </div>
            <span class="cv-topic-pct">${done}/${total}</span>
          </div>
          <svg class="cv-topic-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/>
          </svg>
        </div>
      `;
            card.addEventListener('click', () => openTopic(course, topic));
            grid.appendChild(card);
        });

        showSubView('topics');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => { grid.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed')); }, 80);
    }

    /* ══════════════════════════════════════════════
       REGULAR TOPIC → WORD VIEW
    ══════════════════════════════════════════════ */
    function openTopic(course, topic) {
        currentTopic = topic;
        isCustomMode = false;
        currentCustomTopicId = null;

        $('cv-back-course-label').textContent = course.title;
        $('cv-topic-title').textContent = topic.title;

        wordsView.classList.remove('cv-custom-mode');
        $('cv-custom-toolbar').classList.add('cv-hidden');
        $('cv-col-actions') && ($('cv-col-actions').style.display = '');

        document.querySelectorAll('.cv-mode-card').forEach(c => c.classList.remove('active'));
        $('cv-mode-area').innerHTML = '';
        $('cv-mode-area').classList.add('cv-hidden');

        renderWordRows(course, topic);
        updateStats(topic.words);
        $('cv-empty-words').classList.toggle('cv-hidden', topic.words.length > 0);

        showSubView('words');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ══════════════════════════════════════════════
       RENDER REGULAR WORD ROWS
    ══════════════════════════════════════════════ */
    function renderWordRows(course, topic) {
        const container = $('cv-word-rows');
        container.innerHTML = '';

        topic.words.forEach(word => {
            const rem = !!rememberedMap[word.id];
            const row = document.createElement('div');
            row.className = `cv-word-row${rem ? ' cv-word-remembered' : ''}`;
            row.id = `cv-row-${word.id}`;
            row.innerHTML = buildWordRowHTML(word, rem, false);

            row.querySelectorAll('.cv-voice-btn').forEach(btn =>
                btn.addEventListener('click', (e) => { e.stopPropagation(); speak(word.word, course.lang); }));
            row.querySelector('.cv-switch-chk').addEventListener('change', (e) => {
                if (e.target.checked) rememberedMap[word.id] = true;
                else delete rememberedMap[word.id];
                saveRemembered(rememberedMap);
                row.classList.toggle('cv-word-remembered', e.target.checked);
                updateStats(topic.words);
            });

            /* Click row → toggle expand panel */
            row.addEventListener('click', (e) => {
                if (e.target.closest('button, label, input, a')) return;
                row.classList.toggle('cv-word-row--open');
            });

            container.appendChild(row);
        });
    }

    /* ══════════════════════════════════════════════
       MODE CARD CLICK
    ══════════════════════════════════════════════ */
    $('cv-modes-grid')?.addEventListener('click', (e) => {
        const card = e.target.closest('.cv-mode-card');
        if (!card) return;
        document.querySelectorAll('.cv-mode-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const modeArea = $('cv-mode-area');
        const modeName = card.querySelector('.cv-mode-card-name').textContent;
        modeArea.classList.remove('cv-hidden');
        modeArea.innerHTML = `
      <div class="cv-coming-soon">
        <div class="cv-cs-icon">🚀</div>
        <h3>Đang phát triển</h3>
        <p>Chế độ <strong>${modeName}</strong> sẽ sớm ra mắt!<br>Theo dõi các cập nhật của PKA Study nhé 😊</p>
      </div>`;
        setTimeout(() => modeArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    });

    /* ══════════════════════════════════════════════
       BACK BUTTONS
    ══════════════════════════════════════════════ */
    $('cv-back-to-courses')?.addEventListener('click', () => {
        showSubView('home');
        currentCourse = null;
        currentTopic = null;
    });

    $('cv-back-to-topics')?.addEventListener('click', () => {
        if (isCustomMode) {
            showSubView('home');
            activateLangTab('custom');
            renderCustomPanel();
            isCustomMode = false;
            currentCustomTopicId = null;
        } else {
            openCourse(currentCourse);
            currentTopic = null;
        }
    });

    /* ══════════════════════════════════════════════
       BIND "HỌC NGAY" BUTTONS (regular courses)
    ══════════════════════════════════════════════ */
    function bindLearnButtons() {
        coursePage.querySelectorAll('.doc-card .btn-primary').forEach(btn => {
            if (btn.dataset.cvBound) return;
            btn.dataset.cvBound = '1';
            btn.addEventListener('click', () => {
                const card = btn.closest('.doc-card');
                const courseId = card?.dataset.courseId;
                if (!courseId || !COURSES_DATA?.[courseId]) {
                    console.warn('[CoursesViewer] Không tìm thấy data cho courseId:', courseId);
                    return;
                }
                openCourse(COURSES_DATA[courseId]);
            });
        });
    }

    bindLearnButtons();
    new MutationObserver(bindLearnButtons)
        .observe(coursePage, { childList: true, subtree: true });


    /* ══════════════════════════════════════════════════════════════════
       ██████╗ ██╗   ██╗███████╗████████╗ ██████╗ ███╗   ███╗
       ██╔════╝██║   ██║██╔════╝╚══██╔══╝██╔═══██╗████╗ ████║
       ██║     ██║   ██║███████╗   ██║   ██║   ██║██╔████╔██║
       ██║     ██║   ██║╚════██║   ██║   ██║   ██║██║╚██╔╝██║
       ╚██████╗╚██████╔╝███████║   ██║   ╚██████╔╝██║ ╚═╝ ██║
        ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝
       TÀI LIỆU CỦA BẠN MODULE
    ══════════════════════════════════════════════════════════════════ */

    /* ── Activate a lang tab programmatically ── */
    function activateLangTab(lang) {
        document.querySelectorAll('.lang-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.lang-tab-btn[data-lang="${lang}"]`)?.classList.add('active');
        document.querySelectorAll('.lang-content').forEach(p => p.style.display = 'none');
        const panel = document.getElementById('lang-' + lang);
        if (panel) panel.style.display = 'block';
    }

    /* ── Update tab badge count ── */
    function updateCustomTabCount() {
        const courses = loadCustomCourses();
        const badge = $('cv-custom-tab-count');
        if (badge) badge.textContent = courses.length + ' chủ đề';
    }

    /* ── Emoji helper ── */
    function extractEmoji(title) {
        const match = title.trim().match(/^\p{Emoji}/u);
        return match ? match[0] : '📝';
    }

    /* ══════════════════════════════════════════════
       RENDER CUSTOM PANEL (#lang-custom)
    ══════════════════════════════════════════════ */
    function renderCustomPanel() {
        const panel = $('lang-custom');
        if (!panel) return;

        const courses = loadCustomCourses();
        updateCustomTabCount();

        if (courses.length === 0) {
            panel.innerHTML = `
        <div class="lang-content-header">
          <div>
            <div class="card-eyebrow">Của bạn</div>
            <h2 class="card-title-text">Tài liệu cá nhân</h2>
          </div>
          <button class="btn btn-primary btn-small" id="cv-create-topic-btn">+ Tạo chủ đề</button>
        </div>
        <div class="cv-custom-empty">
          <div class="cv-custom-empty-icon">📚</div>
          <h3>Chưa có chủ đề nào</h3>
          <p>Tạo chủ đề đầu tiên và bắt đầu xây dựng<br>bộ từ vựng cá nhân của bạn!</p>
          <button class="btn btn-primary" id="cv-create-topic-empty-btn">+ Tạo chủ đề đầu tiên</button>
        </div>`;
        } else {
            panel.innerHTML = `
        <div class="lang-content-header">
          <div>
            <div class="card-eyebrow">Của bạn</div>
            <h2 class="card-title-text">Tài liệu cá nhân</h2>
          </div>
          <button class="btn btn-primary btn-small" id="cv-create-topic-btn">+ Tạo chủ đề</button>
        </div>
        <div class="doc-list" id="cv-custom-list"></div>`;
        }

        $('cv-create-topic-btn')?.addEventListener('click', () => showTopicModal(null));
        $('cv-create-topic-empty-btn')?.addEventListener('click', () => showTopicModal(null));

        if (courses.length > 0) {
            const list = $('cv-custom-list');
            courses.forEach(topic => {
                const card = buildCustomTopicCard(topic);
                list.appendChild(card);
            });
        }
    }

    window.pkaRenderCustomPanel = renderCustomPanel;

    /* ── Build a custom topic card DOM element ── */
    function buildCustomTopicCard(topic) {
        const wordCount = topic.words.length;
        const doneCount = topic.words.filter(w => rememberedMap[w.id]).length;
        const pct = wordCount > 0 ? Math.round((doneCount / wordCount) * 100) : 0;
        const emoji = extractEmoji(topic.title);

        const card = document.createElement('div');
        card.className = 'doc-card cv-custom-card reveal revealed';
        card.innerHTML = `
      <div class="doc-icon-wrap cv-custom-icon-wrap">
        <span class="cv-custom-card-emoji">${emoji}</span>
      </div>
      <div class="doc-info">
        <div class="doc-meta-row">
          <span class="doc-type-badge cv-custom-badge">CÁ NHÂN</span>
          <span class="doc-level">${wordCount} từ vựng</span>
        </div>
        <h3 class="doc-name">${escHtml(topic.title)}</h3>
        <p class="doc-desc">${escHtml(topic.description || 'Chủ đề từ vựng cá nhân của bạn')}</p>
        <div class="cv-custom-card-progress">
          <div class="cv-custom-card-bar">
            <div class="cv-custom-card-bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="cv-custom-card-pct">${doneCount}/${wordCount}</span>
        </div>
      </div>
      <div class="cv-custom-card-actions">
        <button class="btn btn-primary btn-small cv-cc-learn">Học ngay</button>
        <div class="cv-icon-btns">
          <button class="cv-icon-btn cv-cc-edit" title="Sửa chủ đề">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M15.7279 9.57629L14.3137 8.16207L5 17.4758V18.89H6.41421L15.7279 9.57629ZM17.1421 8.16207L18.5563 6.74786L17.1421 5.33365L15.7279 6.74786L17.1421 8.16207ZM7.24264 20.89H3V16.6474L16.435 3.21233C16.8256 2.8218 17.4587 2.8218 17.8492 3.21233L20.6777 6.04075C21.0682 6.43128 21.0682 7.06444 20.6777 7.45497L7.24264 20.89Z"/>
            </svg>
          </button>
          <button class="cv-icon-btn cv-cc-delete" title="Xóa chủ đề" style="--icon-color:var(--red)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"/>
            </svg>
          </button>
        </div>
      </div>`;

        card.querySelector('.cv-cc-learn').addEventListener('click', (e) => { e.stopPropagation(); openCustomTopic(topic.id); });
        card.addEventListener('click', () => openCustomTopic(topic.id));
        card.querySelector('.cv-cc-edit').addEventListener('click', (e) => { e.stopPropagation(); showTopicModal(topic); });
        card.querySelector('.cv-cc-delete').addEventListener('click', (e) => { e.stopPropagation(); confirmDeleteTopic(topic); });
        return card;
    }

    /* ══════════════════════════════════════════════
       OPEN CUSTOM TOPIC → WORD VIEW (edit mode)
    ══════════════════════════════════════════════ */
    function openCustomTopic(topicId) {
        const courses = loadCustomCourses();
        const topic = courses.find(t => t.id === topicId);
        if (!topic) return;

        isCustomMode = true;
        currentCustomTopicId = topicId;
        currentTopic = null;

        $('cv-back-course-label').textContent = 'Tài liệu của bạn';
        $('cv-topic-title').textContent = topic.title;

        wordsView.classList.add('cv-custom-mode');
        $('cv-custom-toolbar').classList.remove('cv-hidden');

        document.querySelectorAll('.cv-mode-card').forEach(c => c.classList.remove('active'));
        $('cv-mode-area').innerHTML = '';
        $('cv-mode-area').classList.add('cv-hidden');

        refreshCustomWordRows(topic);
        updateStats(topic.words);

        showSubView('words');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ── Refresh custom word rows (re-render) ── */
    function refreshCustomWordRows(topic) {
        const container = $('cv-word-rows');
        container.innerHTML = '';
        updateStats(topic.words);
        $('cv-empty-words').classList.toggle('cv-hidden', topic.words.length > 0);

        topic.words.forEach(word => {
            const rem = !!rememberedMap[word.id];
            const row = document.createElement('div');
            row.className = `cv-word-row${rem ? ' cv-word-remembered' : ''}`;
            row.id = `cv-row-${word.id}`;
            row.innerHTML = buildWordRowHTML(word, rem, true);

            row.querySelectorAll('.cv-voice-btn').forEach(btn =>
                btn.addEventListener('click', (e) => { e.stopPropagation(); speak(word.word, topic.lang || 'en'); }));

            /* Sync cả hai switch: desktop (.cv-switch-chk) và mobile actions (.cv-switch-chk-extra) */
            const syncSwitches = (checked) => {
                row.querySelectorAll('.cv-switch-chk, .cv-switch-chk-extra').forEach(c => c.checked = checked);
                if (checked) rememberedMap[word.id] = true;
                else delete rememberedMap[word.id];
                saveRemembered(rememberedMap);
                row.classList.toggle('cv-word-remembered', checked);
                const c = loadCustomCourses();
                const t = c.find(t => t.id === currentCustomTopicId);
                if (t) updateStats(t.words);
            };
            row.querySelectorAll('.cv-switch-chk, .cv-switch-chk-extra').forEach(chk =>
                chk.addEventListener('change', (e) => syncSwitches(e.target.checked)));

            row.querySelector('.cv-action-edit')?.addEventListener('click', () => showWordModal(word));
            row.querySelector('.cv-action-delete')?.addEventListener('click', () => {
                if (confirm(`Xóa từ "${word.word}"?`)) {
                    deleteWord(currentCustomTopicId, word.id);
                    const c = loadCustomCourses();
                    const t = c.find(t => t.id === currentCustomTopicId);
                    if (t) refreshCustomWordRows(t);
                }
            });

            /* Click row → toggle expand panel */
            row.addEventListener('click', (e) => {
                if (e.target.closest('button, label, input, a')) return;
                row.classList.toggle('cv-word-row--open');
            });

            container.appendChild(row);
        });
    }

    /* ══════════════════════════════════════════════
       BUILD WORD ROW HTML (shared)
    ══════════════════════════════════════════════ */
    function buildWordRowHTML(word, rem, withActions) {
        const voiceIconSm = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M2 16.0001H5.88889L11.1834 20.3319C11.2727 20.405 11.3846 20.4449 11.5 20.4449C11.7761 20.4449 12 20.2211 12 19.9449V4.05519C12 3.93977 11.9601 3.8279 11.8871 3.73857C11.7129 3.52485 11.3991 3.49335 11.1854 3.66756L5.88889 8.00007H2C1.44772 8.00007 1 8.44778 1 9.00007V15.0001C1 15.5524 1.44772 16.0001 2 16.0001ZM23 12C23 15.292 21.5539 18.2463 19.2622 20.2622L17.8445 18.8444C19.7758 17.1937 21 14.7398 21 12C21 9.26016 19.7758 6.80629 17.8445 5.15557L19.2622 3.73779C21.5539 5.75368 23 8.70795 23 12ZM18 12C18 13.9004 17.2558 15.6248 16.0497 16.9003L14.6319 15.4826C15.4819 14.5699 16 13.3459 16 12C16 10.6541 15.4819 9.43013 14.6319 8.51742L16.0497 7.09966C17.2558 8.37516 18 10.0996 18 12Z"/></svg>`;
        const voiceIconMd = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M2 16.0001H5.88889L11.1834 20.3319C11.2727 20.405 11.3846 20.4449 11.5 20.4449C11.7761 20.4449 12 20.2211 12 19.9449V4.05519C12 3.93977 11.9601 3.8279 11.8871 3.73857C11.7129 3.52485 11.3991 3.49335 11.1854 3.66756L5.88889 8.00007H2C1.44772 8.00007 1 8.44778 1 9.00007V15.0001C1 15.5524 1.44772 16.0001 2 16.0001ZM23 12C23 15.292 21.5539 18.2463 19.2622 20.2622L17.8445 18.8444C19.7758 17.1937 21 14.7398 21 12C21 9.26016 19.7758 6.80629 17.8445 5.15557L19.2622 3.73779C21.5539 5.75368 23 8.70795 23 12ZM18 12C18 13.9004 17.2558 15.6248 16.0497 16.9003L14.6319 15.4826C15.4819 14.5699 16 13.3459 16 12C16 10.6541 15.4819 9.43013 14.6319 8.51742L16.0497 7.09966C17.2558 8.37516 18 10.0996 18 12Z"/></svg>`;

        /* Switch HTML — dùng lại cho cả desktop (.cv-switch-chk) và mobile custom actions */
        const switchHtml = (extraClass = '') => `
          <label class="cv-switch${extraClass ? ' ' + extraClass : ''}" title="${rem ? 'Đã thuộc' : 'Chưa thuộc'}">
            <input type="checkbox" class="cv-switch-chk${extraClass ? ' cv-switch-chk-extra' : ''}" ${rem ? 'checked' : ''}>
            <span class="cv-switch-track"><span class="cv-switch-thumb"></span></span>
          </label>`;

        return `
      <div class="cv-cell cv-cell-word">
        <div class="cv-word-main">
          <strong class="cv-word-text">${escHtml(word.word)}</strong>
          <span class="cv-row-chevron" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"/></svg>
          </span>
        </div>
        <div class="cv-mobile-sub">
          <button class="cv-voice-btn" title="Nghe phát âm">${voiceIconSm}</button>
          <span class="cv-trans">${escHtml(word.transcription || '')}</span>
        </div>
      </div>
      <div class="cv-cell cv-cell-trans cv-cell-trans-desktop">
        <span class="cv-trans">${escHtml(word.transcription || '')}</span>
        <button class="cv-voice-btn cv-voice-desktop" title="Nghe phát âm">${voiceIconMd}</button>
      </div>
      <div class="cv-cell cv-cell-mean">
        <span class="cv-mean">${escHtml(word.mean || '')}</span>
      </div>
      <div class="cv-cell cv-cell-type">
        <span class="cv-type-badge">${escHtml(word.wordtype || '')}</span>
      </div>
      <div class="cv-cell cv-cell-example">
        <span class="cv-example">${escHtml(word.example || '')}</span>
      </div>
      <div class="cv-cell cv-cell-remember">
        ${switchHtml()}
      </div>
      <div class="cv-cell cv-cell-actions">
        ${withActions ? `
          ${switchHtml('cv-actions-switch')}
          <button class="cv-action-btn cv-action-edit" title="Sửa từ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M15.7279 9.57629L14.3137 8.16207L5 17.4758V18.89H6.41421L15.7279 9.57629ZM17.1421 8.16207L18.5563 6.74786L17.1421 5.33365L15.7279 6.74786L17.1421 8.16207ZM7.24264 20.89H3V16.6474L16.435 3.21233C16.8256 2.8218 17.4587 2.8218 17.8492 3.21233L20.6777 6.04075C21.0682 6.43128 21.0682 7.06444 20.6777 7.45497L7.24264 20.89Z"/>
            </svg>
          </button>
          <button class="cv-action-btn cv-action-delete" title="Xóa từ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"/>
            </svg>
          </button>` : ''}
      </div>
      <!-- ── EXPAND PANEL: hiển thị toàn bộ thông tin khi click row ── -->
      <div class="cv-word-expand">
        <div class="cv-expand-grid">
          <div class="cv-expand-item">
            <span class="cv-expand-label">Từ vựng</span>
            <strong class="cv-expand-val cv-expand-word">${escHtml(word.word)}</strong>
          </div>
          <div class="cv-expand-item">
            <span class="cv-expand-label">Phiên âm</span>
            <span class="cv-expand-val cv-trans">${escHtml(word.transcription || '—')}</span>
          </div>
          <div class="cv-expand-item">
            <span class="cv-expand-label">Voice</span>
            <button class="cv-voice-btn cv-expand-voice" title="Nghe phát âm">
              ${voiceIconMd}&thinsp;Nghe
            </button>
          </div>
          <div class="cv-expand-item">
            <span class="cv-expand-label">Nghĩa</span>
            <span class="cv-expand-val cv-mean">${escHtml(word.mean || '—')}</span>
          </div>
          <div class="cv-expand-item">
            <span class="cv-expand-label">Loại từ</span>
            <span class="cv-expand-val"><span class="cv-type-badge">${escHtml(word.wordtype || '—')}</span></span>
          </div>
          <div class="cv-expand-item cv-expand-item-full">
            <span class="cv-expand-label">Ví dụ</span>
            <span class="cv-expand-val cv-example">${escHtml(word.example || '—')}</span>
          </div>
        </div>
      </div>`;
    }

    /* ══════════════════════════════════════════════
       CUSTOM TOOLBAR BUTTONS
    ══════════════════════════════════════════════ */
    $('cv-add-word-btn')?.addEventListener('click', () => showWordModal(null));
    $('cv-ai-gen-btn')?.addEventListener('click', () => showAIModal());

    /* ══════════════════════════════════════════════
       TOPIC CRUD
    ══════════════════════════════════════════════ */
    function createTopic(data) {
        const courses = loadCustomCourses();
        courses.push({ id: genId('ct'), title: data.title, description: data.description, lang: data.lang || 'en', words: [] });
        saveCustomCourses(courses);
    }

    function updateTopic(topicId, data) {
        const courses = loadCustomCourses();
        const idx = courses.findIndex(t => t.id === topicId);
        if (idx >= 0) {
            courses[idx].title = data.title;
            courses[idx].description = data.description;
            courses[idx].lang = data.lang || 'en';
        }
        saveCustomCourses(courses);
    }

    function deleteTopic(topicId) {
        const courses = loadCustomCourses().filter(t => t.id !== topicId);
        saveCustomCourses(courses);
    }

    /* ══════════════════════════════════════════════
       WORD CRUD
    ══════════════════════════════════════════════ */
    function addWord(topicId, wordData) {
        const courses = loadCustomCourses();
        const topic = courses.find(t => t.id === topicId);
        if (topic) topic.words.push({ id: genId('cw'), ...wordData });
        saveCustomCourses(courses);
    }

    function updateWord(topicId, wordId, wordData) {
        const courses = loadCustomCourses();
        const topic = courses.find(t => t.id === topicId);
        if (!topic) return;
        const idx = topic.words.findIndex(w => w.id === wordId);
        if (idx >= 0) topic.words[idx] = { id: wordId, ...wordData };
        saveCustomCourses(courses);
    }

    function deleteWord(topicId, wordId) {
        const courses = loadCustomCourses();
        const topic = courses.find(t => t.id === topicId);
        if (topic) topic.words = topic.words.filter(w => w.id !== wordId);
        saveCustomCourses(courses);
    }

    function addManyWords(topicId, wordsArray) {
        const courses = loadCustomCourses();
        const topic = courses.find(t => t.id === topicId);
        if (topic) wordsArray.forEach(w => topic.words.push({ id: genId('cw'), ...w }));
        saveCustomCourses(courses);
    }

    /* ══════════════════════════════════════════════
       HELPERS
    ══════════════════════════════════════════════ */
    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function showInputError(input, msg) {
        input.classList.add('cv-input-error');
        input.placeholder = msg;
        input.focus();
        input.addEventListener('input', () => input.classList.remove('cv-input-error'), { once: true });
    }

    /* ══════════════════════════════════════════════
       MODAL: CREATE / EDIT TOPIC
    ══════════════════════════════════════════════ */
    function showTopicModal(existing) {
        const isEdit = !!existing;
        openModal(`
      <div class="cv-modal-header">
        <h3>${isEdit ? '✏️ Sửa chủ đề' : '📁 Tạo chủ đề mới'}</h3>
        <button class="cv-modal-close" id="cv-modal-close-btn">&times;</button>
      </div>
      <div class="cv-modal-body">
        <div class="cv-form-group">
          <label class="cv-form-label">Tên chủ đề <span style="color:var(--red)">*</span></label>
          <input class="cv-form-input" id="cv-topic-title-input" maxlength="60"
            placeholder="Ví dụ: 🏢 Từ vựng văn phòng" value="${escHtml(existing?.title || '')}">
          <span class="cv-form-hint">Có thể thêm emoji ở đầu để nhận diện nhanh</span>
        </div>
        <div class="cv-form-row">
          <div class="cv-form-group" style="flex:2">
            <label class="cv-form-label">Mô tả</label>
            <textarea class="cv-form-input cv-form-textarea" id="cv-topic-desc-input"
              placeholder="Mô tả ngắn về chủ đề này..." rows="2">${escHtml(existing?.description || '')}</textarea>
          </div>
          <div class="cv-form-group" style="flex:1">
            <label class="cv-form-label">Ngôn ngữ</label>
            <select class="cv-form-input cv-form-select" id="cv-topic-lang-input">
              <option value="en" ${(existing?.lang || 'en') === 'en' ? 'selected' : ''}>🇺🇸 Tiếng Anh</option>
              <option value="ko" ${existing?.lang === 'ko' ? 'selected' : ''}>🇰🇷 Tiếng Hàn</option>
              <option value="ja" ${existing?.lang === 'ja' ? 'selected' : ''}>🇯🇵 Tiếng Nhật</option>
              <option value="zh" ${existing?.lang === 'zh' ? 'selected' : ''}>🇨🇳 Tiếng Trung</option>
              <option value="fr" ${existing?.lang === 'fr' ? 'selected' : ''}>🇫🇷 Tiếng Pháp</option>
            </select>
          </div>
        </div>
      </div>
      <div class="cv-modal-footer">
        <button class="btn btn-secondary" id="cv-topic-cancel">Hủy</button>
        <button class="btn btn-primary" id="cv-topic-save">${isEdit ? 'Lưu thay đổi' : 'Tạo chủ đề'}</button>
      </div>`);

        $('cv-modal-close-btn').addEventListener('click', closeModal);
        $('cv-topic-cancel').addEventListener('click', closeModal);
        $('cv-topic-save').addEventListener('click', () => {
            const title = $('cv-topic-title-input').value.trim();
            const desc = $('cv-topic-desc-input').value.trim();
            const lang = $('cv-topic-lang-input').value;
            // FIX: validate tên chủ đề (thay thế placeholder { ... })
            if (!title) {
                showInputError($('cv-topic-title-input'), 'Vui lòng nhập tên chủ đề');
                return;
            }
            if (isEdit) updateTopic(existing.id, { title, description: desc, lang });
            else createTopic({ title, description: desc, lang });
            closeModal();
            renderCustomPanel();
        });

        $('cv-topic-title-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') $('cv-topic-save').click();
        });
    }

    /* ══════════════════════════════════════════════
       MODAL: CREATE / EDIT WORD
    ══════════════════════════════════════════════ */
    const WORD_TYPES = ['danh từ', 'động từ', 'tính từ', 'trạng từ', 'cụm từ', 'thành ngữ', 'khác'];

    function showWordModal(existing) {
        const isEdit = !!existing;
        openModal(`
      <div class="cv-modal-header">
        <h3>${isEdit ? '✏️ Sửa từ vựng' : '➕ Thêm từ vựng mới'}</h3>
        <button class="cv-modal-close" id="cv-modal-close-btn">&times;</button>
      </div>
      <div class="cv-modal-body">
        <div class="cv-form-row">
          <div class="cv-form-group">
            <label class="cv-form-label">Từ vựng <span style="color:var(--red)">*</span></label>
            <input class="cv-form-input" id="cv-wf-word" placeholder="schedule" value="${escHtml(existing?.word || '')}">
          </div>
          <div class="cv-form-group">
            <label class="cv-form-label">Phiên âm</label>
            <input class="cv-form-input" id="cv-wf-trans" placeholder="/ˈʃɛdjuːl/" value="${escHtml(existing?.transcription || '')}">
          </div>
        </div>
        <div class="cv-form-row">
          <div class="cv-form-group">
            <label class="cv-form-label">Nghĩa tiếng Việt <span style="color:var(--red)">*</span></label>
            <input class="cv-form-input" id="cv-wf-mean" placeholder="lịch trình, thời gian biểu" value="${escHtml(existing?.mean || '')}">
          </div>
          <div class="cv-form-group">
            <label class="cv-form-label">Loại từ</label>
            <select class="cv-form-input cv-form-select" id="cv-wf-type">
              ${WORD_TYPES.map(t => `<option value="${t}" ${existing?.wordtype === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="cv-form-group">
          <label class="cv-form-label">Câu ví dụ</label>
          <input class="cv-form-input" id="cv-wf-example" placeholder="I have a busy schedule this week."
            value="${escHtml(existing?.example || '')}">
        </div>
      </div>
      <div class="cv-modal-footer">
        <button class="btn btn-secondary" id="cv-word-cancel">Hủy</button>
        <button class="btn btn-primary" id="cv-word-save">${isEdit ? 'Lưu thay đổi' : 'Thêm từ'}</button>
      </div>`);

        $('cv-modal-close-btn').addEventListener('click', closeModal);
        $('cv-word-cancel').addEventListener('click', closeModal);
        $('cv-word-save').addEventListener('click', () => {
            const word = $('cv-wf-word').value.trim();
            const mean = $('cv-wf-mean').value.trim();
            if (!word) { showInputError($('cv-wf-word'), 'Vui lòng nhập từ vựng'); return; }
            if (!mean) { showInputError($('cv-wf-mean'), 'Vui lòng nhập nghĩa'); return; }
            const data = {
                word,
                transcription: $('cv-wf-trans').value.trim(),
                mean,
                wordtype: $('cv-wf-type').value,
                example: $('cv-wf-example').value.trim()
            };
            if (isEdit) updateWord(currentCustomTopicId, existing.id, data);
            else addWord(currentCustomTopicId, data);
            closeModal();
            const courses = loadCustomCourses();
            const topic = courses.find(t => t.id === currentCustomTopicId);
            if (topic) refreshCustomWordRows(topic);
        });
    }

    /* ══════════════════════════════════════════════
       MODAL: CONFIRM DELETE TOPIC
    ══════════════════════════════════════════════ */
    function confirmDeleteTopic(topic) {
        openModal(`
      <div class="cv-modal-header">
        <h3>🗑️ Xóa chủ đề</h3>
        <button class="cv-modal-close" id="cv-modal-close-btn">&times;</button>
      </div>
      <div class="cv-modal-body" style="text-align:center;padding:28px 24px">
        <div style="font-size:3rem;margin-bottom:12px">⚠️</div>
        <p style="font-size:1rem;font-weight:700;color:var(--dark-blue);margin-bottom:8px">Xóa chủ đề "<strong>${escHtml(topic.title)}</strong>"?</p>
        <p style="color:var(--gray-light);font-size:.875rem">Hành động này sẽ xóa <strong>${topic.words.length} từ vựng</strong> trong chủ đề và không thể hoàn tác.</p>
      </div>
      <div class="cv-modal-footer">
        <button class="btn btn-secondary" id="cv-del-cancel">Hủy</button>
        <button class="btn cv-btn-danger" id="cv-del-confirm">Xóa chủ đề</button>
      </div>`);

        $('cv-modal-close-btn').addEventListener('click', closeModal);
        $('cv-del-cancel').addEventListener('click', closeModal);
        $('cv-del-confirm').addEventListener('click', () => {
            deleteTopic(topic.id);
            closeModal();
            renderCustomPanel();
        });
    }

    /* ══════════════════════════════════════════════
       MODAL: AI GENERATE WORDS
    ══════════════════════════════════════════════ */
    const AI_API_URL = 'https://platform.beeknoee.com/api/v1/chat/completions';
    const AI_BEARER = 'sk-bee-c3b440a14f7a434283c95709c96c5879';

    function showAIModal() {
        // Lấy lang từ topic hiện tại, không cho user chọn lại
        const courses = loadCustomCourses();
        const topic = courses.find(t => t.id === currentCustomTopicId);
        const topicLang = topic?.lang || 'en';
        const topicLangLabel = LANG_LABEL[topicLang] || 'Anh';

        const FLAG_MAP = { 'en': '🇺🇸', 'ko': '🇰🇷', 'ja': '🇯🇵', 'zh': '🇨🇳', 'fr': '🇫🇷' };
        const flag = FLAG_MAP[topicLang] || '🌐';

        openModal(`
      <div class="cv-modal-header">
        <h3>✨ AI tạo từ vựng hàng loạt</h3>
        <button class="cv-modal-close" id="cv-modal-close-btn">&times;</button>
      </div>
      <div class="cv-modal-body" id="cv-ai-modal-body">
        <div class="cv-ai-intro">
          <p>Mô tả chủ đề bạn muốn học - AI sẽ tự động tạo danh sách từ vựng kèm phiên âm, nghĩa và câu ví dụ!</p>
        </div>
        <div class="cv-form-row">
          <div class="cv-form-group" style="flex:2">
            <label class="cv-form-label">Chủ đề / Mô tả <span style="color:var(--red)">*</span></label>
            <input class="cv-form-input" id="cv-ai-theme" placeholder="Ví dụ: từ vựng văn phòng, du lịch...">
          </div>
          <div class="cv-form-group" style="flex:1">
            <label class="cv-form-label">Ngôn ngữ</label>
            <div class="cv-form-input" style="display:flex;align-items:center;gap:8px;background:var(--bg-page);cursor:default;color:var(--gray-text)">
              <span>${flag}</span>
              <span>Tiếng ${topicLangLabel}</span>
            </div>
          </div>
          <div class="cv-form-group" style="flex:1">
            <label class="cv-form-label">Số từ</label>
            <select class="cv-form-input cv-form-select" id="cv-ai-count">
              <option value="5">5 từ</option>
              <option value="10" selected>10 từ</option>
              <option value="15">15 từ</option>
              <option value="20">20 từ</option>
              <option value="30">30 từ</option>
            </select>
          </div>
        </div>
      </div>
      <div class="cv-modal-footer">
        <button class="btn btn-secondary" id="cv-ai-cancel">Hủy</button>
        <button class="cv-btn-ai cv-btn-ai-large" id="cv-ai-generate-btn">✨ Tạo từ vựng</button>
      </div>`);

        $('cv-modal-close-btn').addEventListener('click', closeModal);
        $('cv-ai-cancel').addEventListener('click', closeModal);
        $('cv-ai-generate-btn').addEventListener('click', () => runAIGeneration(topicLang, topicLangLabel));
        $('cv-ai-theme').addEventListener('keydown', (e) => { if (e.key === 'Enter') runAIGeneration(topicLang, topicLangLabel); });
    }

    async function runAIGeneration(topicLang, topicLangLabel) {
        const theme = $('cv-ai-theme').value.trim();
        const lang = topicLangLabel;   // lấy từ topic, không từ select
        const count = parseInt($('cv-ai-count').value);

        if (!theme) { showInputError($('cv-ai-theme'), 'Vui lòng nhập chủ đề'); return; }

        $('cv-ai-modal-body').innerHTML = `
      <div class="cv-ai-loading">
        <div class="cv-ai-spinner"></div>
        <p>AI đang tạo <strong>${count} từ vựng tiếng ${lang}</strong><br>về "<em>${escHtml(theme)}</em>"...</p>
      </div>`;
        $('cv-modal-box').querySelector('.cv-modal-footer').innerHTML = '';

        try {
            const words = await callAIForWords(theme, lang, count);
            showAIPreview(words, theme, lang);
        } catch (err) {
            $('cv-ai-modal-body').innerHTML = `
        <div class="cv-ai-error">
          <div style="font-size:2.5rem;margin-bottom:12px">😕</div>
          <p>Có lỗi xảy ra khi gọi AI.<br><small style="color:var(--gray-light)">${escHtml(err.message)}</small></p>
          <button class="btn btn-primary" id="cv-ai-retry">Thử lại</button>
        </div>`;
            $('cv-modal-box').querySelector('.cv-modal-footer').innerHTML = '';
            $('cv-ai-retry')?.addEventListener('click', () => showAIModal());
        }
    }

    async function callAIForWords(theme, lang, count) {
        const prompt = `Tạo ${count} từ vựng tiếng ${lang} về chủ đề: "${theme}".
Yêu cầu: Trả về CHỈ một JSON array hợp lệ, không có markdown, không có backtick, không có chú thích.
Mỗi phần tử trong array là một object với đúng 5 trường:
{"word":"từ vựng tiếng ${lang}","transcription":"phiên âm IPA","mean":"nghĩa tiếng Việt","wordtype":"danh từ/động từ/tính từ/...","example":"câu ví dụ ngắn bằng tiếng ${lang}"}`;

        const resp = await fetch(AI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AI_BEARER}` },
            body: JSON.stringify({
                model: 'llama3.1-8b',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 3000,
                temperature: 0.35,
                stream: false
            })
        });

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        let text = data.choices?.[0]?.message?.content || '';
        text = text.replace(/```json[\s\S]*?```/g, m => m.replace(/```json|```/g, '')).replace(/```/g, '').trim();
        const match = text.match(/\[[\s\S]*\]/);
        if (!match) throw new Error('AI không trả về JSON hợp lệ');
        return JSON.parse(match[0]);
    }

    function showAIPreview(words, theme, lang) {
        if (!words || !words.length) { throw new Error('Danh sách từ trống'); }

        const rows = words.map((w, i) => `
      <div class="cv-ai-preview-row" id="cv-ai-row-${i}">
        <label class="cv-ai-check-wrap">
          <input type="checkbox" class="cv-ai-chk" data-idx="${i}" checked>
          <span class="cv-ai-chk-box"></span>
        </label>
        <div class="cv-ai-preview-word">
          <strong>${escHtml(w.word || '')}</strong>
          <span class="cv-ai-preview-trans">${escHtml(w.transcription || '')}</span>
        </div>
        <div class="cv-ai-preview-mean">${escHtml(w.mean || '')}</div>
        <div class="cv-ai-preview-type"><span class="cv-type-badge">${escHtml(w.wordtype || '')}</span></div>
        <div class="cv-ai-preview-example">${escHtml(w.example || '')}</div>
      </div>`).join('');

        $('cv-ai-modal-body').innerHTML = `
      <div class="cv-ai-preview-header">
        <p>✅ AI tạo được <strong>${words.length} từ vựng tiếng ${lang}</strong> về "<em>${escHtml(theme)}</em>"</p>
        <label class="cv-ai-select-all-wrap">
          <input type="checkbox" id="cv-ai-select-all" checked>
          <span>Chọn tất cả</span>
        </label>
      </div>
      <div class="cv-ai-preview-table">
        <div class="cv-ai-preview-head">
          <span></span><span>Từ vựng</span><span>Nghĩa</span><span>Loại từ</span><span>Ví dụ</span>
        </div>
        <div class="cv-ai-preview-rows">${rows}</div>
      </div>`;

        $('cv-modal-box').querySelector('.cv-modal-footer').innerHTML = `
      <span class="cv-ai-selected-count" id="cv-ai-selected-count">${words.length} từ được chọn</span>
      <button class="btn btn-secondary" id="cv-ai-back-btn">← Tạo lại</button>
      <button class="btn btn-primary" id="cv-ai-add-btn">Thêm vào danh sách</button>`;

        $('cv-ai-select-all').addEventListener('change', (e) => {
            document.querySelectorAll('.cv-ai-chk').forEach(cb => cb.checked = e.target.checked);
            updateSelectedCount();
        });
        document.querySelectorAll('.cv-ai-chk').forEach(cb => cb.addEventListener('change', updateSelectedCount));

        $('cv-ai-back-btn').addEventListener('click', () => showAIModal());
        $('cv-ai-add-btn').addEventListener('click', () => {
            const selected = [...document.querySelectorAll('.cv-ai-chk:checked')]
                .map(cb => words[parseInt(cb.dataset.idx)])
                .filter(Boolean);
            if (!selected.length) { alert('Vui lòng chọn ít nhất 1 từ'); return; }
            addManyWords(currentCustomTopicId, selected);
            closeModal();
            const courses = loadCustomCourses();
            const topic = courses.find(t => t.id === currentCustomTopicId);
            if (topic) refreshCustomWordRows(topic);
        });
    }

    function updateSelectedCount() {
        const count = document.querySelectorAll('.cv-ai-chk:checked').length;
        const el = $('cv-ai-selected-count');
        if (el) el.textContent = count + ' từ được chọn';
        const all = $('cv-ai-select-all');
        if (all) all.checked = count === document.querySelectorAll('.cv-ai-chk').length;
    }

    /* ══════════════════════════════════════════════
       INIT
    ══════════════════════════════════════════════ */

    // Lắng nghe click tab "Tài liệu của bạn" (đã có trong dashboard.js nhưng giữ lại để dự phòng)
    document.querySelector('.lang-tab-btn[data-lang="custom"]')
        ?.addEventListener('click', renderCustomPanel);

    // Cập nhật badge số chủ đề ngay khi tải trang
    updateCustomTabCount();

    // ════════════════════════════════════════════════
    // FIX: Đóng IIFE - đây là dòng bị thiếu gây toàn bộ
    //      script không chạy (SyntaxError unclosed function)
    // ════════════════════════════════════════════════
})();