/**
 * File này chứa các script tương tác cơ bản cho Style Guide.
 * Được thực thi sau khi HTML đã load hoàn toàn (nhờ thuộc tính 'defer' ở thẻ script).
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Thêm sự kiện Click cho nút "GET STARTED" ở Hero Section
    // const getStartedBtn = document.getElementById('btn-get-started');
    // if (getStartedBtn) {
    //     getStartedBtn.addEventListener('click', () => {
    //         alert('Bạn đã nhấp vào nút Get Started! Giao diện này chỉ là bản demo.');
    //     });
    // }

    // 2. Chức năng đổi ngôn ngữ ở Panel cuối cùng (Language Pills)
    // Lấy tất cả các thẻ có class là 'js-lang-pill'
    const langPills = document.querySelectorAll('.js-lang-pill');

    langPills.forEach(pill => {
        pill.addEventListener('click', function () {
            // Xóa class 'active' khỏi tất cả các pill
            langPills.forEach(p => p.classList.remove('active'));
            // Thêm class 'active' vào pill vừa được click
            this.classList.add('active');
        });
    });

    // 3. Log ra console khi người dùng thao tác với Toggle (nút gạt)
    const toggles = document.querySelectorAll('.js-toggle-switch');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function () {
            // Lấy tên của toggle (từ thẻ span cạnh nó) để log ra thông báo
            const labelText = this.parentElement.querySelector('.toggle-label').innerText;
            const status = this.checked ? 'BẬT' : 'TẮT';
            console.log(`Tính năng "${labelText}" đã được ${status}.`);
        });
    });

});

// ==========================================
// MOBILE MENU FUNCTIONALITY
// ==========================================

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

// Hàm mở menu
function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    mobileMenuToggle.classList.add('active');
    document.body.classList.add('mobile-menu-open');
}

// Hàm đóng menu
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    document.body.classList.remove('mobile-menu-open');
}

// Event listeners
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileMenu);
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Đóng menu khi nhấn phím ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Đóng menu khi click vào link (optional)
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});