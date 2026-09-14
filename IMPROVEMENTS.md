# 🎯 청첩장 개선사항 상세 설명

## 1️⃣ 모바일 반응형 문제 해결

### 문제점
```css
/* 기존 코드 (문제) */
body {
  max-width: 430px;  /* ❌ 고정 폭 - 다양한 화면 미대응 */
  margin: 0 auto;
}

.polaroid-frame {
  width: 400px;      /* ❌ 400px 고정 - 작은 폰에서 잘림 */
}

.hero {
  padding: 60px 32px 40px;  /* ❌ 고정값 - 작은 화면에서 콘텐츠 압박 */
}
```

### 해결방법
```css
/* 개선된 코드 */
body {
  /* max-width 제거 - 100% 너비 사용 */
  width: 100%;
}

section {
  /* clamp() 함수: 동적 패딩 */
  padding-left: clamp(16px, 5%, 32px);   /* 최소 16px, 최대 32px */
  padding-right: clamp(16px, 5%, 32px);
}

.polaroid-frame {
  /* min() 함수: 화면 폭의 90% 또는 400px 중 작은 값 */
  width: min(90vw, 400px);
  max-width: 100%;
}

.hero {
  /* clamp() 함수: 반응형 padding */
  padding: clamp(40px, 10vw, 60px) clamp(16px, 5%, 32px);
}
```

### CSS 단위 설명
| 단위 | 의미 | 예시 |
|------|------|------|
| `clamp(min, preferred, max)` | 유연한 범위 설정 | `clamp(16px, 5%, 32px)` = 화면폭 5% (최소 16px, 최대 32px) |
| `min(a, b)` | a와 b 중 작은 값 | `min(90vw, 400px)` = 화면 90% 또는 400px 중 작은 것 |
| `vw` | 뷰포트 너비의 백분율 | `10vw` = 화면 너비의 10% |
| `aspect-ratio` | 가로세로 비율 | `aspect-ratio: 4/5` = 4:5 비율 유지 |

### 결과
```
320px (iPhone SE)  → padding 16px, font-size 자동 축소
375px (iPhone 12)  → padding 18.75px, font-size 적절히 조정
414px (iPhone 12 Pro) → padding 20.7px
768px (iPad)       → padding 32px, 더 큰 폰트 사용
```

---

## 2️⃣ 모바일 확대 비활성화

### 문제점
사용자가 실수로 화면을 확대하면 레이아웃이 깨짐

### 해결방법

#### A. Viewport 메타 태그
```html
<!-- 기존 (불완전) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 개선 (완벽) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```

**각 속성의 역할:**
- `maximum-scale=1.0` : 최대 확대 비율 1배 (확대 불가)
- `user-scalable=no` : 사용자 확대 비활성화
- `viewport-fit=cover` : iPhone X 노치 안전 영역 고려

#### B. JavaScript 이벤트 차단
```javascript
// 1. 핀치 줌 방지 (두 손가락으로 확대)
document.addEventListener('touchmove', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault();  // 기본 동작 차단
  }
}, { passive: false });  // passive: false = preventDefault() 가능

// 2. 더블탭 줌 방지 (빠르게 두 번 탭)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {  // 300ms 이내
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// 3. 터치 액션 CSS로도 차단
body {
  touch-action: manipulation;  /* 더블탭 줌만 비활성화 */
}
```

---

## 3️⃣ 사진 갤러리 & 라이트박스

### 구현 원리

#### HTML 구조
```html
<section class="gallery-section">
  <div class="gallery-grid" id="galleryGrid">
    <!-- 각 이미지 -->
    <div class="gallery-item" onclick="openLightbox(this)">
      <img src="images/gallery-1.jpg" alt="사진 1">
    </div>
    <!-- ... -->
  </div>
</section>

<!-- 라이트박스 (초기 숨김) -->
<div class="lightbox" id="lightbox">
  <div class="lightbox-content">
    <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
    <button class="lightbox-nav lightbox-prev">&#10094;</button>
    <img class="lightbox-image" id="lightboxImage">
    <button class="lightbox-nav lightbox-next">&#10095;</button>
  </div>
</div>
```

#### CSS 반응형 그리드
```css
.gallery-grid {
  display: grid;
  /* 자동으로 칼럼 개수 조정 */
  grid-template-columns: repeat(auto-fill, minmax(clamp(100px, 25vw, 150px), 1fr));
  gap: clamp(8px, 2vw, 12px);
}

/* 모바일 (작음) */
/* 100px 정사각형 × 3열 */

/* 태블릿 (중간) */
/* 125px 정사각형 × 4열 */

/* 데스크톱 (크음) */
/* 150px 정사각형 × 5열 */
```

#### JavaScript 라이트박스 기능
```javascript
// 1. 라이트박스 열기
function openLightbox(element) {
  const galleryItems = document.querySelectorAll('.gallery-item');
  // 클릭한 이미지의 인덱스 찾기
  currentImageIndex = Array.from(galleryItems).indexOf(element);
  
  // 라이트박스 활성화
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';  // 배경 스크롤 방지
}

// 2. 다음/이전 이미지 네비게이션
function nextImage() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  // 마지막 이미지 다음은 첫 번째 (순환)
  currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
  updateLightboxImage(galleryItems[currentImageIndex]);
}

// 3. 키보드 네비게이션
document.addEventListener('keydown', function(event) {
  const lightbox = document.getElementById('lightbox');
  if (lightbox.classList.contains('active')) {
    if (event.key === 'ArrowRight') nextImage();
    if (event.key === 'ArrowLeft') prevImage();
    if (event.key === 'Escape') closeLightbox();
  }
});

// 4. 배경 클릭으로 닫기
document.addEventListener('click', function(event) {
  const lightbox = document.getElementById('lightbox');
  if (event.target === lightbox) {  // 라이트박스 배경을 클릭했을 때만
    closeLightbox();
  }
});
```

---

## 4️⃣ 주소 & 계좌번호 복사 기능

### 클립보드 API 호환성 문제
```javascript
// 방법 1: 최신 Clipboard API (HTTPS 필수)
navigator.clipboard.writeText(text).then(() => {
  console.log('복사됨!');
}).catch(() => {
  console.error('복사 실패');
});

// 방법 2: 폴백 (HTTP/localhost에서도 작동)
const textarea = document.createElement('textarea');
textarea.value = text;
document.body.appendChild(textarea);
textarea.select();
document.execCommand('copy');
document.body.removeChild(textarea);
```

### 완전한 구현
```javascript
function copyToClipboard(text, button) {
  // 1단계: 최신 API 시도 (HTTPS)
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showCopyFeedback(button))
      .catch(() => fallbackCopy(text, button));  // 실패 시 폴백
  } else {
    // 2단계: 폴백 방식 (HTTP/localhost)
    fallbackCopy(text, button);
  }
}

function showCopyFeedback(button) {
  // UI 피드백: "복사됨" 표시
  const originalText = button.textContent;
  const originalClass = button.className;
  
  button.textContent = '✓ 복사됨';
  button.classList.add('copied');

  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalClass;
  }, 2000);  // 2초 후 원래대로
}
```

---

## 5️⃣ D-Day 카운트다운

### 실시간 카운트다운 구현
```javascript
function updateCountdown() {
  // 1. 결혼식 날짜/시간을 밀리초로 변환
  const weddingDate = new Date('2026-10-18T14:00:00').getTime();
  
  // 2. 현재 시간 밀리초로 가져오기
  const now = new Date().getTime();
  
  // 3. 남은 시간 계산
  const distance = weddingDate - now;

  if (distance > 0) {
    // 시간 → 일, 시간, 분, 초로 변환
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // DOM 업데이트
    document.getElementById('countDays').textContent = String(days).padStart(2, '0');
    document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
    // ...
  }
}

// 매 초마다 실행
setInterval(updateCountdown, 1000);
```

### 시간 단위 변환
```
1초 = 1000 밀리초
1분 = 60초 = 60,000 밀리초
1시간 = 60분 = 3,600,000 밀리초
1일 = 24시간 = 86,400,000 밀리초

예: 총 86,400,000ms (1일) 계산
- 일: 86,400,000 / 86,400,000 = 1
- 남은 시간: (86,400,000 % 86,400,000) / 3,600,000 = 0
```

---

## 6️⃣ Google Calendar & ICS 다운로드

### Google Calendar URL 생성
```javascript
function generateGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: '정계철 & 권양아 결혼식',
    dates: '20261018T140000/20261018T160000',  // YYYYMMDDTHHMMSS 형식
    location: '호텔인터불고 원주, 1F 사피어홀',
    details: '결혼식 설명...'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
```

### ICS 파일 포맷
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
BEGIN:VEVENT
UID:wedding-2026-10-18@example.com
DTSTART:20261018T140000+0900          ← 결혼식 시작 시간 (UTC+9 한국)
DTEND:20261018T160000+0900            ← 결혼식 종료 시간
SUMMARY:정계철 & 권양아 결혼식        ← 제목
LOCATION:호텔인터불고 원주, 1F 사피어홀  ← 장소
DESCRIPTION:축하해주세요...           ← 설명
END:VEVENT
END:VCALENDAR
```

---

## 7️⃣ 성능 최적화

### A. Intersection Observer (스크롤 애니메이션)
```javascript
// 요소가 화면에 보일 때만 애니메이션 실행
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {  // 요소가 보일 때
      entry.target.classList.add('visible');  // CSS 클래스 추가
      observer.unobserve(entry.target);  // 관찰 중단 (메모리 절약)
    }
  });
}, {
  threshold: 0.1,  // 요소의 10%가 보일 때 감지
  rootMargin: '0px 0px -50px 0px'  // 아래쪽 50px 여유
});

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});
```

**이점:**
- ✅ 불필요한 애니메이션 실행 방지
- ✅ 배터리 소비 감소
- ✅ 프레임 드롭 방지

### B. 이미지 지연 로딩
```html
<!-- 초기 로드 X -->
<img data-src="images/gallery-1.jpg" alt="사진">
```

```javascript
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;  // 보일 때만 로드
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

---

## 8️⃣ 터치 친화성 (Accessibility)

### Apple 권장사항 준수
```javascript
// 터치 버튼 최소 크기: 44×44 포인트
const buttons = document.querySelectorAll('button, a.btn');
buttons.forEach(btn => {
  btn.style.minHeight = '44px';
  btn.style.minWidth = '44px';
});

/* CSS로도 지정 */
button {
  min-height: 44px;  /* iOS 권장 터치 영역 */
  min-width: 44px;
}
```

### 포커스 관리
```javascript
// 키보드 사용자를 위한 포커스 스타일
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-nav');
});
```

```css
.keyboard-nav button:focus {
  outline: 2px solid var(--red);  /* 명확한 포커스 표시 */
  outline-offset: 2px;
}
```

---

## 9️⃣ 미디어 쿼리 반응형 조정

```css
/* 초소형 화면 (320px 이하) */
@media (max-width: 320px) {
  section {
    padding-left: 12px;  /* 더 작은 padding */
    padding-right: 12px;
  }
  
  .dday-units {
    grid-template-columns: repeat(2, 1fr);  /* 2×2 그리드 */
  }
}

/* 태블릿 (768px 이상) */
@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);  /* 4열 */
  }
  
  .dday-units {
    grid-template-columns: repeat(4, 1fr);  /* 4열 */
  }
  
  .cal-buttons {
    flex-direction: row;  /* 가로 배치 */
  }
}
```

---

## 🔟 에러 처리

```javascript
// 이미지 로드 실패 시 처리
window.addEventListener('error', function(event) {
  if (event.target.tagName === 'IMG') {
    console.warn('이미지 로드 실패:', event.target.src);
    event.target.style.display = 'none';  // 깨진 이미지 숨김
    // 또는
    event.target.src = 'images/placeholder.jpg';  // 대체 이미지
  }
}, true);  // true = capture phase에서 감지
```

---

## 🎉 결론

### Before (문제점)
```
❌ 고정 폭 → 화면 잘림
❌ 확대 비활성화 X → 레이아웃 깨짐
❌ 갤러리 없음 → 사진 하나만 표시
❌ 주소 복사 불편 → 수동으로 입력해야 함
❌ 성능 최적화 없음 → 배터리 빠름
```

### After (개선됨)
```
✅ 반응형 디자인 → 모든 화면 대응
✅ 완벽한 확대 차단 → 안전한 UX
✅ 라이트박스 갤러리 → 사진 확대 가능
✅ 한 번에 복사 → 편리한 UX
✅ 성능 최적화 → 빠르고 부드러운 화면
✅ 접근성 개선 → 키보드, 터치 친화적
```

모든 코드는 **모바일-퍼스트(Mobile-First)** 접근법으로 작성되었습니다! 📱✨
