document.addEventListener('DOMContentLoaded', function() {
    // 햄버거 메뉴 토글
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // 모바일 메뉴 링크 클릭 시 메뉴 닫기
    const mobileLinks = document.querySelectorAll('.nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // 스크롤 시 네비게이션 바 스타일 변경
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = '#ffffff';
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // 제품 카드 애니메이션
    const productCards = document.querySelectorAll('.product-card');
    
    function checkProductCards() {
        productCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const triggerBottom = window.innerHeight * 0.8;
            
            if (cardTop < triggerBottom) {
                card.classList.add('visible');
            }
        });
    }
    
    // 첫 로드 시 체크
    checkProductCards();
    
    // 스크롤 시 체크
    window.addEventListener('scroll', checkProductCards);
    
    // 리뷰 카드 애니메이션
    const reviewsSection = document.getElementById('reviews');
    const observerOptions = {
        threshold: 0.1
    };
    
    // 스크롤 애니메이션 관찰자
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 리뷰 섹션일 경우 특별한 처리 없음 (CSS에서 처리됨)
                if (entry.target.id === 'reviews') {
                    // 리뷰 카드는 이미 CSS에서 애니메이션 적용됨
                }
                
                // 브랜드 스토리 섹션
                if (entry.target.id === 'brand-story') {
                    const valueItems = entry.target.querySelectorAll('.value-item');
                    valueItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                    
                    const historyContents = entry.target.querySelectorAll('.history-content');
                    historyContents.forEach((content, index) => {
                        setTimeout(() => {
                            content.style.opacity = '1';
                            content.style.transform = 'translateY(0)';
                        }, 300 + index * 300);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 모든 섹션 관찰
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
        
        // 브랜드 스토리 섹션의 초기 상태
        if (section.id === 'brand-story') {
            const valueItems = section.querySelectorAll('.value-item');
            valueItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });
            
            const historyContents = section.querySelectorAll('.history-content');
            historyContents.forEach(content => {
                content.style.opacity = '0';
                content.style.transform = 'translateY(30px)';
                content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
        }
    });
    
    // 부드러운 스크롤 기능
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 모바일 고정 구매 버튼 표시 제어
    const mobilePurchase = document.querySelector('.mobile-purchase');
    const heroSection = document.querySelector('#hero');
    
    function checkMobilePurchaseVisibility() {
        if (window.innerWidth <= 768) {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            if (heroBottom < 0) {
                mobilePurchase.style.display = 'block';
            } else {
                mobilePurchase.style.display = 'none';
            }
        } else {
            mobilePurchase.style.display = 'none';
        }
    }
    
    // 첫 로드 시 체크
    checkMobilePurchaseVisibility();
    
    // 스크롤 시 체크
    window.addEventListener('scroll', checkMobilePurchaseVisibility);
    window.addEventListener('resize', checkMobilePurchaseVisibility);
}); 