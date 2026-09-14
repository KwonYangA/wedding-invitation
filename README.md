# 모바일 청첩장 설정 가이드 🎊

## 📋 개선 사항 요약

### ✅ 반응형 디자인 완벽 수정
- **이전**: body의 max-width 430px 고정 → **이후**: clamp() 함수로 동적 반응형
- 초소형(320px) ~ 태블릿(768px+)까지 모든 화면 대응
- `clamp(min, preferred, max)` CSS 사용으로 자연스러운 스케일링

### ✅ 모바일 기능 추가
1. **사진 갤러리** - 라이트박스로 확대 보기 가능
2. **지도 embed** - Google Maps 및 카카오맵, 네이버지도 링크
3. **주소 복사** 버튼 - 한 번에 주소 클립보드에 복사
4. **계좌번호 복사** - 각 계좌 옆에 복사 버튼
5. **D-day 카운트다운** - 실시간으로 남은 시간 표시

### ✅ 모바일 보안 & 편의성
- **확대 비활성화** - 더블탭 줌, 핀치 줌 완전 차단
- **터치 친화적** - 버튼 최소 44x44px (Apple 권장사항)
- **키보드 네비게이션** - 화살표 키로 갤러리 이동 가능

### ✅ 성능 최적화
- 스크롤 애니메이션 (Intersection Observer)
- 이미지 지연 로딩 지원
- 메모리 효율적인 이벤트 처리

---

## 🎬 시작하기

### 1. 파일 구조
```
wedding-invitation/
├── index.html          # 메인 페이지
├── style.css           # 반응형 스타일
├── script.js           # 기능 스크립트
├── images/             # 이미지 폴더
│   ├── married_03.png
│   ├── heart.png
│   ├── IMG_5921.JPG    # 메인 사진
│   ├── gallery-1.jpg   # 갤러리 사진들
│   ├── gallery-2.jpg
│   ├── gallery-3.jpg
│   ├── gallery-4.jpg
│   ├── gallery-5.jpg
│   └── gallery-6.jpg
└── README.md
```

### 2. 핵심 수정 사항 (해야 할 일)

#### 🖼 사진 준비하기
1. **갤러리 이미지** - 6개의 사진을 `images/gallery-1.jpg` ~ `gallery-6.jpg`로 저장
2. **메인 사진** - `images/IMG_5921.JPG` (폴라로이드 프레임에 표시)
3. **로고 이미지** - `images/married_03.png`, `images/heart.png`

#### 📝 정보 수정하기

**index.html에서 다음을 수정:**

```html
<!-- 1. 신랑/신부 이름 -->
<span class="couple-name">정계철</span>  <!-- 신랑 이름 수정 -->
<span class="couple-name">권양아</span>   <!-- 신부 이름 수정 -->

<!-- 2. 부모님 성함 -->
<span class="parents-names">정호방 · 김영옥</span>  <!-- 신랑 부모님 -->
<span class="parents-names">권윤근 · 황혜옥</span>  <!-- 신부 부모님 -->

<!-- 3. 결혼식 일시 -->
<div class="dday-number">10</div>  <!-- 월 -->
<div class="dday-number">18</div>  <!-- 일 -->
<p class="letter-date fade-in">일요일 오후 2시 00분</p>

<!-- 4. 결혼식 장소 -->
<p class="venue-name">호텔인터불고 원주</p>
<p class="venue-name">1F 사피어홀</p>
<p class="venue-address">강원도 원주시 동부순환로 200 (반곡동 1809-1)</p>

<!-- 5. 계좌번호 -->
<div class="account-name">정계철</div>
<div class="account-bank">KB국민은행 123-456-789123</div>
```

#### 💰 계좌 정보 수정하기

신랑측 계좌 (index.html 약 200줄):
```html
<div class="account-item">
  <div style="flex: 1;">
    <div class="account-role">신랑</div>
    <div class="account-name">정계철</div>
    <div class="account-bank">KB국민은행 123-456-789123</div>  <!-- 수정 -->
  </div>
```

신부측 계좌 (index.html 약 220줄):
```html
<div class="account-item">
  <div style="flex: 1;">
    <div class="account-role">신부</div>
    <div class="account-name">권양아</div>
    <div class="account-bank">우리은행 456-789-123456</div>  <!-- 수정 -->
  </div>
```

#### 🗺 지도 좌표 수정하기

Google Maps embed 코드 수정 (script.js 또는 index.html):
```html
<iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3154.2234567890!2d127.99!3d37.33!..."
    ...
></iframe>
```

> 💡 **쉬운 방법**: Google Maps에서 장소 검색 → "공유" → "임베드 지도" → 코드 복사

---

## 🎨 스타일 커스터마이징

### 색상 변경 (style.css 상단)
```css
:root {
  --red: #7B1C1C;           /* 주 색상 */
  --red-dark: #5C1212;      /* 어두운 색상 */
  --cream: #F0EBE1;         /* 배경색 */
  --text-dark: #2A1A1A;     /* 텍스트 색상 */
}
```

### 폰트 변경 (style.css 1-10줄)
```css
body {
  font-family: 'Jost', sans-serif;  /* 기본 폰트 */
}
```

### 반응형 값 조정
모든 `padding`, `margin`, `font-size`는 `clamp()` 함수 사용:
```css
padding: clamp(16px, 5%, 32px);  /* 최소 16px ~ 최대 32px, 화면폭의 5% */
```

---

## 🚀 배포하기

### 로컬에서 테스트
1. 폴더를 로컬 서버에서 열기 (VS Code Live Server 추천)
2. 모바일 기기에서 QR 코드 또는 URL 접속
3. 각 화면에서 잘림이 없는지 확인

### 온라인 배포 옵션
- **GitHub Pages**: 무료, 간단
- **Netlify**: 무료, 드래그 드롭 배포
- **Vercel**: 무료, 빌드 자동화
- **클라우드 호스팅**: AWS, Google Cloud (유료)

#### GitHub Pages 배포 (가장 쉬움)
```bash
# 1. GitHub에서 새 저장소 생성 (예: my-wedding)
# 2. 파일 업로드
# 3. Settings → Pages → Main 브랜치 선택
# 4. https://username.github.io/my-wedding 에서 접속 가능
```

---

## 📱 모바일 테스트 체크리스트

### 다양한 화면 크기에서 테스트
- ✅ 320px (iPhone SE, 가장 작은 폰)
- ✅ 375px (iPhone)
- ✅ 414px (iPhone Plus)
- ✅ 768px (iPad)
- ✅ 1024px (데스크톱)

### 기능 테스트
- ✅ 주소 복사 버튼 동작
- ✅ 계좌번호 복사 버튼 동작
- ✅ 갤러리 라이트박스 열기/닫기
- ✅ 다음/이전 버튼 동작
- ✅ 지도 링크 열기
- ✅ Google Calendar 링크 동작
- ✅ 카운트다운 실시간 업데이트
- ✅ 확대 비활성화 (더블탭 안 됨)

### 브라우저 테스트
- ✅ Chrome/Edge (Android)
- ✅ Safari (iOS)
- ✅ Samsung Internet (Galaxy)

---

## 🔧 문제 해결

### 이미지가 안 보여요
```
images/ 폴더가 index.html과 같은 위치에 있는지 확인
파일명이 정확한지 확인 (대문자/소문자 구분)
```

### 지도가 안 나타나요
```
iframe src의 좌표가 정확한지 확인
인터넷 연결 확인
기기의 쿠키/캐시 삭제 후 새로고침
```

### 복사 버튼이 동작 안 해요
```
HTTPS 프로토콜에서만 Clipboard API 동작
HTTP나 localhost는 폴백 방식 사용
```

### 갤러리가 안 보여요
```javascript
// script.js의 galleryImages 배열 확인
const galleryImages = [
  'images/gallery-1.jpg',  // 이 경로들이 실제로 존재해야 함
  'images/gallery-2.jpg',
  // ...
];
```

---

## 📲 QR 코드 만들기

배포 후 URL을 QR 코드로 변환:
1. [QR Code Generator](https://www.qr-code-generator.com/) 접속
2. URL 입력
3. PNG 다운로드
4. 청첩장에 인쇄

---

## 💡 추가 팁

### 1. PWA (앱처럼 설치 가능)
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="계철 & 양아 결혼식">
```

### 2. SNS 공유 최적화
```html
<meta property="og:title" content="계철 & 양아 결혼식">
<meta property="og:description" content="2026년 10월 18일 호텔인터불고 원주에서 뵙겠습니다.">
<meta property="og:image" content="images/married_03.png">
```

### 3. 다크모드 지원 (선택사항)
```css
@media (prefers-color-scheme: dark) {
  :root {
    --cream: #1a1a1a;
    --text-dark: #f0f0f0;
  }
}
```

---

## 📞 도움말

문제가 생기면:
1. 브라우저 개발자 도구 열기 (F12)
2. 콘솔(Console) 탭에서 에러 메시지 확인
3. 네트워크(Network) 탭에서 이미지 로드 확인

---

**Happy Wedding! 💕**

마지막으로 확인하세요:
- [ ] 모든 이미지 추가됨
- [ ] 신랑/신부 정보 수정됨
- [ ] 계좌정보 정확함
- [ ] 장소 정보 정확함
- [ ] 지도 좌표 수정됨
- [ ] 다양한 화면에서 테스트 완료
