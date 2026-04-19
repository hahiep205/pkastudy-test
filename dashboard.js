/* ═══════════════════════════════════════════════════
   Luyện Từ – dashboard.js
   Handles: sidebar, topbar, chart, progress bars,
   tabs, scroll reveal, nav active states
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {


    /* ── STREAK BUTTON ── */
    // const streakBtn = document.getElementById('streakBtn');
    // const streakCountEl = document.getElementById('streakCount');
    // let streakVal = 14;

    // if (streakBtn && streakCountEl) {
    //     streakBtn.addEventListener('click', () => {
    //         streakVal++;
    //         streakCountEl.textContent = streakVal;
    //         // Reset animation
    //         streakCountEl.classList.remove('streak-pop');
    //         void streakCountEl.offsetWidth;
    //         streakCountEl.classList.add('streak-pop');
    //     });
    //     // Xóa class animation sau khi chạy xong
    //     streakCountEl.addEventListener('animationend', () => {
    //         streakCountEl.classList.remove('streak-pop');
    //     });
    // }

    /* ── 2. NAV LINK ACTIVE STATE ── */
    function setActiveNav(page) {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
    }

    document.querySelectorAll('.sidebar-link, .mobile-nav-item').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) setActiveNav(page);
            // Close sidebar on mobile after link click
            if (window.innerWidth <= 900) closeSidebar();
        });
    });


    /* ── 3. SCROLL REVEAL ── */
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    revealEls.forEach(el => revealObserver.observe(el));


    /* ── 4. PROGRESS BARS – animate on visible ── */
    const progressFills = document.querySelectorAll('.progress-fill');

    const barObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                // For course cards: use data-width
                const targetW = fill.dataset.width ? fill.dataset.width + '%' : fill.style.width;
                fill.style.width = '0%';
                requestAnimationFrame(() => {
                    setTimeout(() => { fill.style.width = targetW; }, 100);
                });
                barObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.4 });

    progressFills.forEach(f => barObserver.observe(f));


    /* ── 5. CHART TABS (Week / Month) ── */
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            chartTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            drawChart(tab.dataset.period);
        });
    });


    /* ── 6. ACTIVITY CHART (Canvas) ── */
    const canvas = document.getElementById('activityChart');

    const weekData = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        learn: [8, 15, 12, 20, 10, 24, 5],
        review: [18, 22, 16, 28, 14, 30, 12],
    };
    const monthData = {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        learn: [56, 88, 72, 100],
        review: [120, 145, 110, 160],
    };

    function drawChart(period = 'week') {
        const data = period === 'week' ? weekData : monthData;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const W = canvas.parentElement.clientWidth;
        const H = 160;

        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, W, H);

        const count = data.labels.length;
        const padL = 36;
        const padR = 12;
        const padT = 12;
        const padB = 28;
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;
        const maxVal = Math.max(...data.review) * 1.15;
        const groupW = plotW / count;
        const barW = Math.min(groupW * 0.32, 16);
        const gap = 4;

        // Grid lines
        const gridCount = 4;
        ctx.strokeStyle = 'rgba(0,0,0,.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= gridCount; i++) {
            const y = padT + (plotH / gridCount) * i;
            ctx.beginPath();
            ctx.moveTo(padL, y);
            ctx.lineTo(W - padR, y);
            ctx.stroke();
            // Y labels
            const val = Math.round(maxVal - (maxVal / gridCount) * i);
            ctx.fillStyle = 'rgba(119,119,119,.7)';
            ctx.font = `600 10px "Nunito", sans-serif`;
            ctx.textAlign = 'right';
            ctx.fillText(val, padL - 6, y + 4);
        }

        // Bars + X labels
        data.labels.forEach((label, i) => {
            const cx = padL + groupW * i + groupW / 2;

            // Review bar (back, blue)
            const reviewH = (data.review[i] / maxVal) * plotH;
            const reviewY = padT + plotH - reviewH;
            ctx.fillStyle = 'rgba(28,176,246,.75)';
            roundRect(ctx, cx - barW - gap / 2, reviewY, barW, reviewH, 4);
            ctx.fill();

            // Learn bar (front, green)
            const learnH = (data.learn[i] / maxVal) * plotH;
            const learnY = padT + plotH - learnH;
            ctx.fillStyle = 'rgba(88,204,2,.85)';
            roundRect(ctx, cx + gap / 2, learnY, barW, learnH, 4);
            ctx.fill();

            // X label
            ctx.fillStyle = 'rgba(119,119,119,.9)';
            ctx.font = `700 11px "Nunito", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(label, cx, H - 6);
        });

        // Animate bars (redraw with growing height)
        animateBars(ctx, data, W, H, padL, padR, padT, padB, plotW, plotH, maxVal, groupW, barW, gap, gridCount);
    }

    function animateBars(ctx, data, W, H, padL, padR, padT, padB, plotW, plotH, maxVal, groupW, barW, gap, gridCount) {
        let progress = 0;
        const duration = 800;
        const start = performance.now();

        function frame(now) {
            progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out

            ctx.clearRect(0, 0, W, H);

            // Redraw grid
            ctx.strokeStyle = 'rgba(0,0,0,.06)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= gridCount; i++) {
                const y = padT + (plotH / gridCount) * i;
                ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
                const val = Math.round(maxVal - (maxVal / gridCount) * i);
                ctx.fillStyle = 'rgba(119,119,119,.7)';
                ctx.font = `600 10px "Nunito", sans-serif`;
                ctx.textAlign = 'right';
                ctx.fillText(val, padL - 6, y + 4);
            }

            // Redraw bars with eased height
            data.labels.forEach((label, i) => {
                const cx = padL + groupW * i + groupW / 2;

                const reviewH = (data.review[i] / maxVal) * plotH * ease;
                const reviewY = padT + plotH - reviewH;
                ctx.fillStyle = 'rgba(28,176,246,.75)';
                roundRect(ctx, cx - barW - gap / 2, reviewY, barW, reviewH, 4);
                ctx.fill();

                const learnH = (data.learn[i] / maxVal) * plotH * ease;
                const learnY = padT + plotH - learnH;
                ctx.fillStyle = 'rgba(88,204,2,.85)';
                roundRect(ctx, cx + gap / 2, learnY, barW, learnH, 4);
                ctx.fill();

                ctx.fillStyle = 'rgba(119,119,119,.9)';
                ctx.font = `700 11px "Nunito", sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(label, cx, H - 6);
            });

            if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    function roundRect(ctx, x, y, w, h, r) {
        if (h <= 0) return;
        r = Math.min(r, h / 2, w / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // Initial draw
    if (canvas) {
        // Draw after a short delay to let layout settle
        setTimeout(() => drawChart('week'), 200);

        // Redraw on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const activeTab = document.querySelector('.chart-tab.active');
                drawChart(activeTab ? activeTab.dataset.period : 'week');
            }, 150);
        });
    }


    /* ── 7. COUNTER ANIMATION ── */
    function animateCounter(el, target, suffix = '') {
        const start = 0;
        const duration = 1200;
        const startTime = performance.now();

        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const val = Math.round(start + (target - start) * ease);
            // Format with comma for large numbers
            el.textContent = val.toLocaleString('vi-VN') + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // Animate stat cards when visible
    const statObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const id = el.id;
                if (id === 'sc-streak') animateCounter(el, 1);
                if (id === 'sc-words') animateCounter(el, 0);
                if (id === 'sc-xp') animateCounter(el, 0);
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    ['sc-streak', 'sc-words', 'sc-xp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) statObserver.observe(el);
    });


    /* ── 8. STREAK COUNTER TOPBAR ── */
    const streakCountEl = document.getElementById('streakCount');
    let streakVal = 1;

    // Optional: bump streak display when study button is clicked
    const startStudyBtn = document.getElementById('startStudyBtn');
    if (startStudyBtn && streakCountEl) {
        startStudyBtn.addEventListener('click', () => {
            streakVal += 1;
            streakCountEl.textContent = streakVal;
            streakCountEl.style.animation = 'none';
            requestAnimationFrame(() => {
                streakCountEl.style.animation = 'streakPop .4s ease';
            });
        });
    }


    /* ── 9. TASK ITEM – mark done on click ── */
    document.querySelectorAll('.task-item.active .btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.task-item');
            if (!item) return;

            item.classList.remove('active');
            item.classList.add('done');
            const check = item.querySelector('.task-check');
            if (check) {
                check.classList.remove('pending');
                check.textContent = '✓';
            }

            const badgeEl = item.querySelector('.badge');
            if (badgeEl) {
                badgeEl.className = 'badge badge-completed';
                badgeEl.textContent = 'Xong';
            } else {
                const newBadge = document.createElement('span');
                newBadge.className = 'badge badge-completed';
                newBadge.textContent = 'Xong';
                btn.replaceWith(newBadge);
            }
            btn.remove();
        });
    });


    /* ── 10. NOTIF BUTTON ── */
    const notifBtn = document.getElementById('notifBtn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            const dot = notifBtn.querySelector('.notif-dot');
            if (dot) dot.style.display = 'none';
        });
    }


    /* ── 11. COURSE CARD HOVER EFFECT (progress bar on hover) ── */
    document.querySelectorAll('.course-dash-card').forEach(card => {
        const fill = card.querySelector('.course-fill');
        const label = card.querySelector('.course-progress-header span:last-child strong');
        if (!fill) return;
        const originalW = fill.dataset.width + '%';

        card.addEventListener('mouseenter', () => {
            // Small pulse: briefly go slightly higher then settle
            const currentW = parseInt(fill.dataset.width);
            fill.style.width = Math.min(currentW + 5, 100) + '%';
        });
        card.addEventListener('mouseleave', () => {
            fill.style.width = originalW;
        });
    });


    /* ── 12. SEARCH INPUT – keyboard shortcut ── */
    const searchInput = document.querySelector('.search-input');
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }
    });


    /* ── 13. SIDEBAR XP BAR ANIMATION ── */
    const xpFill = document.querySelector('.sidebar-xp-fill');
    if (xpFill) {
        const targetW = xpFill.style.width;
        xpFill.style.width = '0%';
        setTimeout(() => { xpFill.style.width = targetW; }, 400);
    }

    /* ── CSS keyframe injection for streakPop ── */
    const styleTag = document.createElement('style');
    styleTag.textContent = `
    @keyframes streakPop {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.35); color: var(--orange); }
      100% { transform: scale(1); }
    }
  `;
    document.head.appendChild(styleTag);

});

/* ═══════════════════════════════════════════════════════════════
   PAGE SWITCHER — Thêm vào cuối file dashboard.js
   (hoặc tạo file mới page-switcher.js rồi nhúng vào HTML
    trước thẻ đóng </body>)
═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── 1. Danh sách tất cả các trang ──────────────────────── */
    const PAGES = ['dashboard', 'courses', 'games', 'stats', 'chatbot', 'settings'];

    /* ── 2. Hàm chuyển trang ────────────────────────────────── */
    function switchPage(targetPage) {
        // Ẩn tất cả các trang
        PAGES.forEach(function (page) {
            var el = document.getElementById('page-' + page);
            if (el) el.style.display = 'none';
        });

        // Hiện trang được chọn
        var target = document.getElementById('page-' + targetPage);
        if (target) {
            target.style.display = 'flex'; // dash-main dùng flex

            // Cập nhật dữ liệu tiến độ khi vào trang dashboard
            if (targetPage === 'dashboard') {
                // Đợi COURSES_DATA load xong (script load sau)
                if (window.COURSES_DATA) {
                    syncDashboardCourses();
                } else {
                    var waitForData = setInterval(function () {
                        if (window.COURSES_DATA) {
                            clearInterval(waitForData);
                            syncDashboardCourses();
                        }
                    }, 100);
                }
            }

            // Trigger reveal animation cho phần tử mới hiện ra
            setTimeout(function () {
                var reveals = target.querySelectorAll('.reveal:not(.revealed)');
                reveals.forEach(function (el) {
                    el.classList.add('revealed');
                });
            }, 50);
        }

        // Cập nhật active state cho sidebar links
        document.querySelectorAll('.sidebar-link[data-page]').forEach(function (link) {
            link.classList.toggle('active', link.dataset.page === targetPage);
        });

        // Cập nhật active state cho mobile nav
        document.querySelectorAll('.mobile-nav-item[data-page]').forEach(function (item) {
            item.classList.toggle('active', item.dataset.page === targetPage);
        });

        // Lưu trang hiện tại để F5 không reset
        try { sessionStorage.setItem('pkastudy_page', targetPage); } catch (e) { }
    }

    /* ── 3. Gắn sự kiện click vào tất cả nav links ──────────── */
    function bindNavLinks() {
        var allLinks = document.querySelectorAll('[data-page]');
        allLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var page = link.dataset.page;
                switchPage(page);

                // Đóng sidebar mobile nếu đang mở
                var sidebar = document.getElementById('sidebar');
                var overlay = document.getElementById('sidebarOverlay');
                if (sidebar && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    if (overlay) overlay.classList.remove('visible');
                }
            });
        });
    }

    /* ── 4. Language tab switching (bên trong trang Courses) ── */
    function bindLangTabs() {
        document.querySelectorAll('.lang-tab-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var lang = btn.dataset.lang;

                // Active state cho tab button
                document.querySelectorAll('.lang-tab-btn').forEach(function (b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');

                // Ẩn tất cả lang-content, hiện cái được chọn
                document.querySelectorAll('.lang-content').forEach(function (panel) {
                    panel.style.display = 'none';
                });
                var panel = document.getElementById('lang-' + lang);
                if (panel) {
                    panel.style.display = 'block';
                    // Nếu là tab custom → render nội dung
                    if (lang === 'custom' && typeof window.pkaRenderCustomPanel === 'function') {
                        window.pkaRenderCustomPanel();
                    }
                    // Trigger reveal
                    setTimeout(function () {
                        panel.querySelectorAll('.reveal:not(.revealed)').forEach(function (el) {
                            el.classList.add('revealed');
                        });
                    }, 50);
                }
            });
        });
    }

    /* ── 5. Khởi động ──────────────────────────────────────── */

    /* ════════════════════════════════════════════════════
       SYNC DASHBOARD ← COURSES DATA + localStorage
       Đọc COURSES_DATA và pka_remembered để cập nhật:
         • Tiến độ từng course card
         • Banner "đã thuộc / tổng"
         • Ngày hôm nay
    ════════════════════════════════════════════════════ */
    function syncDashboardCourses() {
        // Chỉ chạy khi COURSES_DATA đã load
        if (!window.COURSES_DATA) return;

        // Đọc remembered map từ localStorage
        var remembered = {};
        try { remembered = JSON.parse(localStorage.getItem('pka_remembered')) || {}; } catch (e) { }

        // Đọc custom courses
        var customCourses = [];
        try { customCourses = JSON.parse(localStorage.getItem('pka_custom_courses')) || []; } catch (e) { }

        var grandTotal = 0;
        var grandDone = 0;

        /* ── Cập nhật từng course card có data-course-id ── */
        document.querySelectorAll('.course-dash-card[data-course-id]').forEach(function (card) {
            var courseId = card.dataset.courseId;
            var course = window.COURSES_DATA[courseId];
            if (!course) return;

            // Tính tổng từ và từ đã thuộc
            var total = 0, done = 0;
            course.topics.forEach(function (topic) {
                total += topic.words.length;
                topic.words.forEach(function (w) {
                    if (remembered[w.id]) done++;
                });
            });
            var pct = total > 0 ? Math.round((done / total) * 100) : 0;

            grandTotal += total;
            grandDone += done;

            // Cập nhật meta: số từ, số chủ đề
            var metaWords = card.querySelector('.cd-meta-words');
            if (metaWords) metaWords.textContent = total + ' từ';

            var metaTopics = card.querySelector('.cd-meta-topics');
            if (metaTopics) metaTopics.textContent = course.topics.length + ' chủ đề';

            // Cập nhật progress header
            var elDone = card.querySelector('.cd-done');
            var elTotal = card.querySelector('.cd-total');
            var elPct = card.querySelector('.cd-pct');
            if (elDone) elDone.textContent = done;
            if (elTotal) elTotal.textContent = total;
            if (elPct) elPct.textContent = pct + '%';

            // Cập nhật progress bar
            var fill = card.querySelector('.course-fill');
            if (fill) {
                fill.dataset.width = pct;
                fill.style.transition = 'width 0.6s ease';
                fill.style.width = pct + '%';
            }
        });

        // Cộng thêm custom courses vào grand total
        customCourses.forEach(function (topic) {
            grandTotal += topic.words.length;
            topic.words.forEach(function (w) {
                if (remembered[w.id]) grandDone++;
            });
        });

        /* ── Cập nhật banner tổng quan ── */
        var elBannerDone = document.getElementById('dash-total-remembered');
        var elBannerTotal = document.getElementById('dash-total-words');
        if (elBannerDone) elBannerDone.textContent = grandDone;
        if (elBannerTotal) elBannerTotal.textContent = grandTotal;

        /* ── Cập nhật label ngày hôm nay ── */
        var todayLabel = document.getElementById('dash-today-label');
        if (todayLabel) {
            var now = new Date();
            var days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            var d = now.getDate();
            var m = now.getMonth() + 1;
            var y = now.getFullYear();
            todayLabel.textContent = days[now.getDay()] + ', ' + d + '/' + (m < 10 ? '0' + m : m) + '/' + y;
        }
    }

    /* Expose để courses-viewer có thể gọi sau khi user toggle switch */
    window.pkaSyncDashboard = syncDashboardCourses;

    function init() {
        // Đảm bảo trang dashboard có id="page-dashboard"
        // (xem hướng dẫn bên dưới nếu chưa có)

        bindNavLinks();
        bindLangTabs();

        // Khôi phục trang cuối cùng hoặc mặc định là dashboard
        var savedPage = 'dashboard';
        try { savedPage = sessionStorage.getItem('pkastudy_page') || 'dashboard'; } catch (e) { }
        switchPage(savedPage);

        // Trigger reveal cho trang mặc định ngay lập tức
        setTimeout(function () {
            var activePage = document.getElementById('page-' + savedPage);
            if (activePage) {
                activePage.querySelectorAll('.reveal').forEach(function (el) {
                    el.classList.add('revealed');
                });
            }
        }, 100);

        // Sync dashboard ngay khi load (đợi COURSES_DATA nếu chưa có)
        if (window.COURSES_DATA) {
            syncDashboardCourses();
        } else {
            var initWait = setInterval(function () {
                if (window.COURSES_DATA) {
                    clearInterval(initWait);
                    syncDashboardCourses();
                }
            }, 100);
        }

        // Nút "Xem ngay" trên course card → chuyển sang page Courses
        document.querySelectorAll('.course-dash-card .cd-view-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchPage('courses');
            });
        });

        // Nút "Khóa học" trên welcome banner → chuyển sang page Courses
        var startStudyBtn = document.getElementById('startStudyBtn');
        if (startStudyBtn) {
            startStudyBtn.addEventListener('click', function () {
                switchPage('courses');
            });
        }
    }

    // Chạy sau khi DOM load xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();