/**
 * File JavaScript cho trang Login
 * Xử lý mobile menu và chức năng đăng nhập với Google
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // MOBILE MENU FUNCTIONALITY
    // ==========================================

    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    // Hàm mở menu
    function openMobileMenu() {
        if (mobileMenu && mobileMenuOverlay && mobileMenuToggle) {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            mobileMenuToggle.classList.add('active');
            document.body.classList.add('mobile-menu-open');
        }
    }

    // Hàm đóng menu
    function closeMobileMenu() {
        if (mobileMenu && mobileMenuOverlay && mobileMenuToggle) {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }
    }

    // Event listeners cho mobile menu
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
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Đóng menu khi click vào link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // ==========================================
    // GOOGLE LOGIN FUNCTIONALITY
    // ==========================================

    const googleLoginBtn = document.getElementById('googleLoginBtn');

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function () {
            // Hiển thị thông báo đăng nhập
            console.log('Đăng nhập với Google được kích hoạt');

            // Trong thực tế, đây là nơi bạn sẽ kết nối với Google OAuth
            // Ví dụ: window.location.href = 'your-google-oauth-url';

            // Demo: Hiển thị thông báo
            alert('Chức năng đăng nhập với Google sẽ được tích hợp sau.\n\nBạn sẽ được chuyển hướng đến trang xác thực Google.');

            // Sau khi đăng nhập thành công, chuyển hướng đến dashboard
            // window.location.href = 'dashboard.html';
        });
    }

    // ==========================================
    // LOADING ANIMATION (OPTIONAL)
    // ==========================================

    // Thêm hiệu ứng loading khi click vào nút Google
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function () {
            const originalContent = this.innerHTML;

            // Thêm spinner loading
            this.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a10 10 0 0 1 0 20"></path>
                </svg>
                <span>Đang xử lý...</span>
            `;

            // Disable nút
            this.disabled = true;
            this.style.opacity = '0.6';
            this.style.cursor = 'not-allowed';

            // Sau 2 giây, khôi phục lại nút (demo)
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.disabled = false;
                this.style.opacity = '1';
                this.style.cursor = 'pointer';
            }, 2000);
        });
    }

});

// CSS cho animation spinner (thêm vào style inline)
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);