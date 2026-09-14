// ========================================
// 모바일 확대 방지 (Viewport 설정)
// ========================================
document.addEventListener('touchmove', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

// 더블 탭 줌 방지
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// ========================================
// 주소 복사 기능
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', function() {
      const address = '강원도 원주시 동부순환로 200 (반곡동 1809-1)';
      copyToClipboard(address, copyAddressBtn);
    });
  }
});

// ========================================
// 계좌번호 복사 기능
// ========================================
function copyAccount(button, accountInfo) {
  copyToClipboard(accountInfo, button);
}

// ========================================
// 클립보드 복사 공용 함수
// ========================================
function copyToClipboard(text, button) {
  if (navigator.clipboard && window.isSecureContext) {
    // 최신 Clipboard API 사용
    navigator.clipboard.writeText(text).then(function() {
      showCopyFeedback(button);
    }).catch(function() {
      fallbackCopy(text, button);
    });
  } else {
    // 폴백: 기존 방식
    fallbackCopy(text, button);
  }
}

function fallbackCopy(text, button) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showCopyFeedback(button);
  } catch (err) {
    console.error('복사 실패:', err);
    alert('주소: ' + text);
  }
  document.body.removeChild(textarea);
}

function showCopyFeedback(button) {
  // 기존 피드백 제거
  const existingFeedback = button.nextElementSibling;
  if (existingFeedback && existingFeedback.classList.contains('copy-feedback')) {
    existingFeedback.remove();
  }

  // 버튼 스타일 변경
  const originalText = button.textContent;
  const originalClass = button.className;
  
  button.textContent = '✓ 복사됨';
  button.classList.add('copied');

  setTimeout(function() {
    button.textContent = originalText;
    button.className = originalClass;
  }, 2000);
}

// ========================================
// 계정 토글 기능
// ========================================
function toggleAccount(groupId) {
  const group = document.getElementById(groupId);
  group.classList.toggle('is-open');
}

// ========================================
// 갤러리 라이트박스
// ========================================
let currentImageIndex = 0;
const galleryImages = [
  'images/gallery-1.jpg',
  'images/gallery-2.jpg',
  'images/gallery-3.jpg',
  'images/gallery-4.jpg',
  'images/gallery-5.jpg',
  'images/gallery-6.jpg'
];

function openLightbox(element) {
  const galleryItems = document.querySelectorAll('.gallery-item');
  currentImageIndex = Array.from(galleryItems).indexOf(element);
  
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  
  // 실제 이미지가 있으면 표시, 없으면 placeholder 표시
  if (element.querySelector('img')) {
    lightboxImage.src = element.querySelector('img').src;
  } else {
    lightboxImage.src = galleryImages[currentImageIndex];
  }
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function nextImage() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
  updateLightboxImage(galleryItems[currentImageIndex]);
}

function prevImage() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
  updateLightboxImage(galleryItems[currentImageIndex]);
}

function updateLightboxImage(element) {
  const lightboxImage = document.getElementById('lightboxImage');
  if (element.querySelector('img')) {
    lightboxImage.src = element.querySelector('img').src;
  } else {
    lightboxImage.src = galleryImages[currentImageIndex];
  }
}

// 라이트박스 키보드 네비게이션
document.addEventListener('keydown', function(event) {
  const lightbox = document.getElementById('lightbox');
  if (lightbox.classList.contains('active')) {
    if (event.key === 'ArrowRight') nextImage();
    if (event.key === 'ArrowLeft') prevImage();
    if (event.key === 'Escape') closeLightbox();
  }
});

// 라이트박스 외부 클릭 닫기
document.addEventListener('click', function(event) {
  const lightbox = document.getElementById('lightbox');
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// ========================================
// D-Day 카운트다운
// ========================================
function updateCountdown() {
  const weddingDate = new Date('2026-10-18T14:00:00').getTime();
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance > 0) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countDays').textContent = String(days).padStart(2, '0');
    document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countMins').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countSecs').textContent = String(seconds).padStart(2, '0');

    const ddayNumber = -days; // 음수로 표현
    document.getElementById('ddayNumber').textContent = 'D' + (days > 0 ? '-' + days : '+' + Math.abs(ddayNumber));
  } else {
    document.getElementById('countDays').textContent = '00';
    document.getElementById('countHours').textContent = '00';
    document.getElementById('countMins').textContent = '00';
    document.getElementById('countSecs').textContent = '00';
    document.getElementById('ddayNumber').textContent = 'D-Day!';
  }
}

// 카운트다운 업데이트
updateCountdown();
setInterval(updateCountdown, 1000);

// ========================================
// Google Calendar 링크
// ========================================
function setupCalendarLinks() {
  const googleCalBtn = document.getElementById('googleCalBtn');
  if (googleCalBtn) {
    const calendarUrl = generateGoogleCalendarUrl();
    googleCalBtn.href = calendarUrl;
  }

  const icsDownloadBtn = document.getElementById('icsDownloadBtn');
  if (icsDownloadBtn) {
    icsDownloadBtn.addEventListener('click', downloadICS);
  }
}

function generateGoogleCalendarUrl() {
  const title = '정계철 & 권양아 결혼식';
  const startTime = '20261018T140000';
  const endTime = '20261018T160000';
  const location = '호텔인터불고 원주, 1F 사피어홀, 강원도 원주시 동부순환로 200';
  const description = '정계철 & 권양아의 결혼식에 초대합니다. 호텔인터불고 원주 1F 사피어홀에서 오후 2시에 진행됩니다.';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startTime}/${endTime}`,
    location: location,
    details: description
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadICS() {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:wedding-2026-10-18@example.com
DTSTART:20261018T140000+0900
DTEND:20261018T160000+0900
SUMMARY:정계철 & 권양아 결혼식
LOCATION:호텔인터불고 원주\\, 1F 사피어홀\\, 강원도 원주시 동부순환로 200
DESCRIPTION:정계철 & 권양아의 결혼식에 초대합니다. 호텔인터불고 원주 1F 사피어홀에서 오후 2시에 진행됩니다.
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = '정계철_권양아_결혼식.ics';
  link.click();
  URL.revokeObjectURL(link.href);
}

setupCalendarLinks();

// ========================================
// 스크롤 애니메이션 (Intersection Observer)
// ========================================
function setupScrollAnimations() {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  const fadeInElements = document.querySelectorAll('.fade-in');
  fadeInElements.forEach(function(element) {
    observer.observe(element);
  });
}

setupScrollAnimations();

// ========================================
// 반응형 레이아웃 조정
// ========================================
function handleResize() {
  const windowWidth = window.innerWidth;
  const body = document.body;

  // 매우 작은 화면에서는 padding 추가 조정
  if (windowWidth < 320) {
    body.style.paddingLeft = '12px';
    body.style.paddingRight = '12px';
  }
}

handleResize();
window.addEventListener('resize', handleResize);

// ========================================
// 터치 친화적 인터페이스
// ========================================
// 버튼의 터치 영역 확대 (최소 44x44px Apple 권장)
const buttons = document.querySelectorAll('button, a.map-btn, a.cal-btn');
buttons.forEach(function(btn) {
  btn.style.minHeight = '44px';
  btn.style.minWidth = '44px';
});

// ========================================
// 성능 최적화: 이미지 지연 로딩
// ========================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ========================================
// 웹사이트 접근성: Focus 관리
// ========================================
document.addEventListener('keydown', function(e) {
  // Tab 키로 포커스 이동 시 보이는 포커스 스타일 추가
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-nav');
});

// ========================================
// 에러 처리: 이미지 로드 실패 시
// ========================================
window.addEventListener('error', function(event) {
  if (event.target.tagName === 'IMG') {
    console.warn('이미지 로드 실패:', event.target.src);
    event.target.style.display = 'none';
  }
}, true);

console.log('✨ 청첩장이 준비되었습니다! 안녕하세요 👋');
