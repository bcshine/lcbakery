document.addEventListener('DOMContentLoaded', function() {
    // 현재 페이지 확인 (로그인 또는 대시보드)
    const isLoginPage = document.querySelector('.admin-login-page');
    const isDashboardPage = document.querySelector('.admin-dashboard-page');
    
    // 로그인 페이지 로직
    if (isLoginPage) {
        const loginForm = document.getElementById('loginForm');
        const loginError = document.getElementById('login-error');
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // 간단한 인증 로직 (실제로는 서버 인증 필요)
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminName', username);
                window.location.href = 'admin-dashboard.html';
            } else {
                loginError.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
            }
        });
    }
    
    // 대시보드 페이지 로직
    if (isDashboardPage) {
        // 로그인 여부 확인
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        if (!isLoggedIn) {
            window.location.href = 'admin.html';
            return;
        }
        
        // 사용자 이름 표시
        const adminName = localStorage.getItem('adminName') || '관리자';
        document.getElementById('admin-name').textContent = adminName;
        
        // 로그아웃 버튼
        document.getElementById('logout-btn').addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminName');
            window.location.href = 'admin.html';
        });
        
        // 탭 전환 기능
        const menuItems = document.querySelectorAll('.admin-menu li');
        const tabs = document.querySelectorAll('.admin-tab');
        
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // 활성 탭 변경
                menuItems.forEach(mi => mi.classList.remove('active'));
                this.classList.add('active');
                
                // 탭 내용 표시/숨김
                tabs.forEach(tab => {
                    if (tab.id === tabId) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
            });
        });
        
        // 빠른 작업 버튼
        document.getElementById('add-product-btn').addEventListener('click', function() {
            activateTab('products');
            document.getElementById('product-modal').style.display = 'block';
        });
        
        document.getElementById('add-review-btn').addEventListener('click', function() {
            activateTab('reviews');
            document.getElementById('review-modal').style.display = 'block';
        });
        
        document.getElementById('upload-image-btn').addEventListener('click', function() {
            activateTab('images');
            document.getElementById('image-upload-modal').style.display = 'block';
        });
        
        // 각 탭의 모달 기능
        initModals();
        
        // 제품 관리 기능
        initCrudActions('#products', 'product');
        
        // 리뷰 관리 기능
        initCrudActions('#reviews', 'review');
        
        // 웹사이트 설정 기능
        document.getElementById('settings-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('웹사이트 설정이 저장되었습니다.');
        });
    }
    
    // 탭 활성화 함수
    function activateTab(tabId) {
        const menuItems = document.querySelectorAll('.admin-menu li');
        const tabs = document.querySelectorAll('.admin-tab');
        
        menuItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        tabs.forEach(tab => {
            if (tab.id === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    // 모달 기능 초기화
    function initModals() {
        // 모든 모달 닫기 버튼
        document.querySelectorAll('.close-modal, .btn-cancel').forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        });
        
        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // 모달 열기 버튼
        document.querySelectorAll('#add-product, #add-review, #upload-images').forEach(btn => {
            btn.addEventListener('click', function() {
                const modalId = this.id.replace('add-', '').replace('upload-', '') + '-modal';
                document.getElementById(modalId).style.display = 'block';
            });
        });
        
        // 폼 제출 이벤트
        document.querySelectorAll('#product-form, #review-form, #image-upload-form').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formType = this.id.split('-')[0];
                alert(`${formType === 'product' ? '제품' : formType === 'review' ? '후기' : '이미지'}이(가) 추가되었습니다.`);
                this.closest('.modal').style.display = 'none';
            });
        });
        
        // 이미지 미리보기
        document.getElementById('image-files')?.addEventListener('change', function(e) {
            const files = e.target.files;
            const previewContainer = document.getElementById('image-previews');
            
            previewContainer.innerHTML = '';
            
            for (let i = 0; i < files.length; i++) {
                if (files[i].type.match('image.*')) {
                    const reader = new FileReader();
                    reader.onload = function(fe) {
                        const previewDiv = document.createElement('div');
                        previewDiv.className = 'image-preview';
                        const img = document.createElement('img');
                        img.src = fe.target.result;
                        previewDiv.appendChild(img);
                        previewContainer.appendChild(previewDiv);
                    };
                    reader.readAsDataURL(files[i]);
                }
            }
        });
    }
    
    // CRUD 작업 초기화 (수정/삭제 버튼)
    function initCrudActions(sectionSelector, itemType) {
        // 수정 버튼
        document.querySelectorAll(`${sectionSelector} .btn-edit`).forEach(btn => {
            btn.addEventListener('click', function() {
                const modalId = `${itemType}-modal`;
                document.getElementById(modalId).style.display = 'block';
            });
        });
        
        // 삭제 버튼
        document.querySelectorAll(`${sectionSelector} .btn-delete`).forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm(`정말 이 ${itemType === 'product' ? '제품' : '후기'}을(를) 삭제하시겠습니까?`)) {
                    this.closest('tr').remove();
                    alert(`${itemType === 'product' ? '제품' : '후기'}이(가) 삭제되었습니다.`);
                }
            });
        });
    }
}); 