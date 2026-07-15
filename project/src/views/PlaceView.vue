<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRegionBenefits } from '../data/regionBenefits'
import { findStoreCoupons } from '../data/storeCoupons'

const router = useRouter()

/* ────────────────────────────────────────────────────────────
   ① 장소 데이터 (지금은 더미. 나중에 이 부분만 스토어로 교체)
   통합 시:
     import { usePickedStore } from '../stores/picked'
     const place = usePickedStore().place
   더미는 우리가 정한 "데이터 약속" 모양 그대로라 화면 코드는 안 바뀜.
   ──────────────────────────────────────────────────────────── */
const place = reactive({
  id: 'lv-6652',
  name: '다봄',
  category: '음식점',
  address: '전남 완도군 완도읍 중앙길 15-1',
  tel: '061-555-6363',
  // 데이터셋의 firstimage(관광공사) / imgUrl(쿠폰)이 여기 들어옴. 없으면 빈 문자열.
  image: 'http://tong.visitkorea.or.kr/cms/resource/80/3029180_image2_1.jpg',
  lat: 34.3140839828631,
  lng: 126.757399325968,
  // 뽑힌 장소엔 쿠폰이 없을 수 있음 → 아래에서 사랑가게 목록과 대조해 자동 매칭
  coupons: [],
})

// 이미지가 없을 때 이름 첫 글자로 플레이스홀더
const initial = computed(() => place.name?.trim()?.[0] ?? '?')
const imgError = ref(false) // 이미지 로딩 실패 시 글자 플레이스홀더로 전환

// 주소에서 시군구를 읽어 해당 지역 여행 혜택을 자동 매칭
const regionBenefits = computed(() => getRegionBenefits(place.address))

// 뽑힌 장소가 사랑가게 목록에 있으면 그 가게 할인을 가져옴 (장소에 이미 쿠폰이 있으면 그걸 우선)
const storeCoupons = computed(() =>
  place.coupons?.length ? place.coupons : findStoreCoupons(place),
)

function goBack() {
  router.back()
}

/* ────────────────────────────────────────────────────────────
   ② 챗봇 (자동 오픈). 지금은 UI + 가짜 응답.
   통합 시: sendMessage 안의 TODO 자리에서 useOpenAI() 호출로 교체.
   ──────────────────────────────────────────────────────────── */
const chatOpen = ref(true) // 페이지 들어오면 자동으로 열림
const chatInput = ref('')
const messages = ref([
  { role: 'bot', text: `안녕하세요! "${place.name}" 근처의 맛집이나 가볼 만한 곳을 추천해드릴게요. 무엇이 궁금하세요?` },
])
const chatBody = ref(null)

function scrollChatToBottom() {
  // DOM 갱신 후 맨 아래로
  requestAnimationFrame(() => {
    if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
  })
}

async function sendMessage() {
  const text = chatInput.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', text })
  chatInput.value = ''
  scrollChatToBottom()

  // ─── TODO: 여기를 실제 OpenAI 호출로 교체 ───
  // const reply = await useOpenAI().ask(text, { place })  // place 정보를 컨텍스트로 넘김
  // messages.value.push({ role: 'bot', text: reply })
  // ────────────────────────────────────────────
  // (지금은 가짜 응답)
  setTimeout(() => {
    messages.value.push({
      role: 'bot',
      text: `"${place.name}" 주변 추천은 곧 챗봇 API와 연결하면 자동으로 답해드려요. (지금은 예시 응답)`,
    })
    scrollChatToBottom()
  }, 500)
}

const chatSuggestions = ['근처 맛집 추천', '가볼 만한 관광지', '주차 가능한 곳']
function askSuggestion(s) {
  chatInput.value = s
  sendMessage()
}

/* ────────────────────────────────────────────────────────────
   ③ 후기 게시판 (CRUD + 비밀번호). localStorage에 저장.
   장소별로 분리 저장: key = reviews:{place.id}
   ──────────────────────────────────────────────────────────── */
const storageKey = computed(() => `reviews:${place.id}`)
const reviews = ref([])

function loadReviews() {
  const saved = localStorage.getItem(storageKey.value)
  if (saved) {
    reviews.value = JSON.parse(saved)
  } else {
    // 데모용 샘플 후기 (비어 보이지 않게). 실제 배포 땐 지워도 됨.
    reviews.value = [
      { id: 1, title: '분위기 좋아요', content: '완도 여행 왔다가 들렀는데 사장님이 친절하셨어요!', password: '1234', createdAt: '2026-07-10' },
      { id: 2, title: '재방문 의사 100%', content: '쿠폰 할인까지 받아서 만족스러운 식사였습니다.', password: '1234', createdAt: '2026-07-12' },
    ]
    saveReviews()
  }
}

function saveReviews() {
  localStorage.setItem(storageKey.value, JSON.stringify(reviews.value))
}

// 작성/수정 폼
const form = reactive({ title: '', content: '', password: '' })
const editingId = ref(null) // null이면 새 글, 값 있으면 수정 중
const formError = ref('')

const isEditing = computed(() => editingId.value !== null)

function submitReview() {
  formError.value = ''
  if (!form.title.trim() || !form.content.trim()) {
    formError.value = '제목과 내용을 모두 입력해 주세요.'
    return
  }
  if (form.password.trim().length < 4) {
    formError.value = '비밀번호는 4자리 이상 입력해 주세요.'
    return
  }

  if (isEditing.value) {
    // 수정
    const r = reviews.value.find((x) => x.id === editingId.value)
    if (r) {
      r.title = form.title
      r.content = form.content
      r.password = form.password
    }
  } else {
    // 새 글
    reviews.value.unshift({
      id: Date.now(),
      title: form.title,
      content: form.content,
      password: form.password,
      createdAt: new Date().toISOString().slice(0, 10),
    })
  }
  saveReviews()
  resetForm()
}

function resetForm() {
  form.title = ''
  form.content = ''
  form.password = ''
  editingId.value = null
  formError.value = ''
}

/* 비밀번호 확인 모달 (수정/삭제 공용) */
const modal = reactive({ open: false, action: null, targetId: null, input: '', error: '' })

function openPasswordModal(action, id) {
  modal.open = true
  modal.action = action // 'edit' | 'delete'
  modal.targetId = id
  modal.input = ''
  modal.error = ''
}
function closeModal() {
  modal.open = false
}

function confirmPassword() {
  const r = reviews.value.find((x) => x.id === modal.targetId)
  if (!r) return closeModal()
  if (modal.input !== r.password) {
    modal.error = '비밀번호가 일치하지 않습니다.'
    return
  }
  if (modal.action === 'edit') {
    // 폼에 내용 불러와서 수정 모드로
    form.title = r.title
    form.content = r.content
    form.password = r.password
    editingId.value = r.id
    // 폼으로 스크롤
    requestAnimationFrame(() => {
      document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })
    })
  } else if (modal.action === 'delete') {
    reviews.value = reviews.value.filter((x) => x.id !== modal.targetId)
    saveReviews()
    if (editingId.value === modal.targetId) resetForm()
  }
  closeModal()
}

onMounted(() => {
  loadReviews()
  scrollChatToBottom()
})
</script>

<template>
  <div class="place-view">
    <!-- 상단 바 -->
    <div class="topbar">
      <button class="back-btn" @click="goBack">← 뒤로</button>
      <span class="badge">{{ place.category }}</span>
    </div>

    <!-- HERO: 이미지 배너 → 그 아래 라벨/이름 -->
    <section class="hero">
      <div class="hero-banner">
        <img
          v-if="place.image && !imgError"
          :src="place.image"
          :alt="place.name"
          @error="imgError = true"
        />
        <span v-else class="banner-initial">{{ initial }}</span>
      </div>
      <div class="hero-text">
        <p class="eyebrow">오늘의 랜덤 추천</p>
        <h1 class="hero-title">{{ place.name }}</h1>
        <p class="hero-meta">📍 {{ place.address }}</p>
        <p class="hero-meta" v-if="place.tel">📞 {{ place.tel }}</p>
      </div>
    </section>

    <!-- 혜택 카드 (지역 여행 혜택 + 가게 쿠폰) -->
    <section class="card benefit-card">
      <h2 class="card-title">사용 가능한 혜택</h2>

      <!-- 이 지역 여행 혜택 (주소 기반 자동 매칭) -->
      <div v-if="regionBenefits.length" class="benefit-grid">
        <component
          :is="b.link ? 'a' : 'div'"
          v-for="(b, i) in regionBenefits"
          :key="'b' + i"
          class="benefit"
          :class="{ linked: b.link }"
          :href="b.link"
          :target="b.link ? '_blank' : undefined"
          :rel="b.link ? 'noopener noreferrer' : undefined"
        >
          <span class="benefit-tag">{{ b.tag }}</span>
          <div class="benefit-body">
            <span class="benefit-title">{{ b.title }}</span>
            <span v-if="b.detail" class="benefit-detail">{{ b.detail }}</span>
            <span v-if="b.link" class="apply">신청하기 ↗</span>
          </div>
        </component>
      </div>

      <!-- 전남 사랑애 서포터즈 혜택 (사랑가게 목록에 있으면 자동 표시) -->
      <template v-if="storeCoupons.length">
        <h3 class="sub-title">전남 사랑애 서포터즈 혜택</h3>
        <p class="sub-note">전남 사랑 도민증 발급 시 할인 적용</p>
        <div class="coupon-list">
          <div v-for="(c, i) in storeCoupons" :key="'c' + i" class="coupon">
            <div class="coupon-left">
              <span class="coupon-name">{{ c.couponNm }}</span>
              <span v-if="c.dcCondition" class="coupon-cond">{{ c.dcCondition }}</span>
            </div>
            <span class="coupon-value">{{ c.badge }}</span>
          </div>
        </div>
      </template>

      <p v-if="!regionBenefits.length && !storeCoupons.length" class="empty">
        등록된 혜택이 없어요.
      </p>
    </section>

    <!-- 챗봇 카드 (자동 오픈) -->
    <div class="chat-wrap">
      <section class="card chat-card">
        <div class="chat-head">
          <h2 class="card-title">주변 추천 챗봇</h2>
          <button class="chat-toggle" @click="chatOpen = !chatOpen">
            {{ chatOpen ? '접기' : '펼치기' }}
          </button>
        </div>

        <div v-show="chatOpen" class="chat-panel">
          <div ref="chatBody" class="chat-body">
            <div
              v-for="(m, i) in messages"
              :key="i"
              class="msg"
              :class="m.role"
            >
              {{ m.text }}
            </div>
          </div>

          <div class="chat-suggest">
            <button
              v-for="s in chatSuggestions"
              :key="s"
              @click="askSuggestion(s)"
            >
              {{ s }}
            </button>
          </div>

          <div class="chat-input">
            <input
              v-model="chatInput"
              type="text"
              placeholder="메시지를 입력하세요"
              @keyup.enter="sendMessage"
            />
            <button class="send-btn" @click="sendMessage">전송</button>
          </div>
        </div>
      </section>
    </div>

    <!-- 후기 게시판 -->
    <section class="card board">
      <h2 class="card-title">방문 후기</h2>

      <!-- 작성/수정 폼 -->
      <div id="review-form" class="review-form">
        <p class="form-mode" v-if="isEditing">✏️ 후기 수정 중</p>
        <input v-model="form.title" class="input" type="text" placeholder="제목" />
        <textarea v-model="form.content" class="input textarea" placeholder="이 곳 어땠나요? 후기를 남겨주세요"></textarea>
        <div class="form-row">
          <input v-model="form.password" class="input pw" type="password" placeholder="수정용 비밀번호 (4자리 이상)" />
          <button class="submit-btn" @click="submitReview">
            {{ isEditing ? '수정 완료' : '후기 등록' }}
          </button>
          <button v-if="isEditing" class="cancel-btn" @click="resetForm">취소</button>
        </div>
        <p v-if="formError" class="error">{{ formError }}</p>
      </div>

      <!-- 후기 목록 -->
      <div class="review-list">
        <p v-if="!reviews.length" class="empty">아직 후기가 없어요. 첫 후기를 남겨보세요!</p>
        <article v-for="r in reviews" :key="r.id" class="review">
          <div class="review-head">
            <h3>{{ r.title }}</h3>
            <span class="date">{{ r.createdAt }}</span>
          </div>
          <p class="review-content">{{ r.content }}</p>
          <div class="review-actions">
            <button @click="openPasswordModal('edit', r.id)">수정</button>
            <button class="danger" @click="openPasswordModal('delete', r.id)">삭제</button>
          </div>
        </article>
      </div>
    </section>

    <!-- 비밀번호 확인 모달 -->
    <div v-if="modal.open" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>비밀번호 확인</h3>
        <p class="modal-sub">{{ modal.action === 'edit' ? '수정' : '삭제' }}하려면 비밀번호를 입력하세요.</p>
        <input
          v-model="modal.input"
          type="password"
          placeholder="비밀번호"
          @keyup.enter="confirmPassword"
          autofocus
        />
        <p v-if="modal.error" class="error">{{ modal.error }}</p>
        <div class="modal-actions">
          <button class="submit-btn" @click="confirmPassword">확인</button>
          <button class="cancel-btn" @click="closeModal">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 폰트: index.html <head>에 아래 한 줄 추가하면 더 METLY스러워짐 (선택)
   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"> */
.place-view {
  --bg: #131318;
  --surface: #1c1c24;
  --surface-2: #23232e;
  --accent: #ffd400;
  --accent-ink: #14141a;
  --pearl: #e7d8c9;
  --lilac: #cfcdf5;
  --text: #f5f5f7;
  --muted: #9a9aa6;
  --line: rgba(255, 255, 255, 0.08);
  --r: 28px;

  font-family: 'Space Grotesk', 'Pretendard', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 20px 80px;
  box-sizing: border-box;
}

/* 상단 바 */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.back-btn {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 15px;
  cursor: pointer;
  padding: 8px 0;
}
.back-btn:hover { color: var(--text); }
.badge {
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 700;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 999px;
}

/* HERO */
.hero {
  background: var(--accent);
  color: var(--accent-ink);
  border-radius: var(--r);
  overflow: hidden; /* 배너 모서리를 카드 라운드에 맞춰 잘라줌 */
  margin-bottom: 20px;
}
.hero-banner {
  width: 100%;
  height: 260px;
  background: var(--accent-ink);
  display: grid;
  place-items: center;
  overflow: hidden;
}
.hero-banner img { width: 100%; height: 100%; object-fit: cover; display: block; }
.banner-initial { font-size: 88px; font-weight: 800; color: var(--accent); }
.hero-text { padding: 32px 40px 40px; }
.eyebrow {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.7;
  margin: 0 0 8px;
}
.hero-title {
  font-size: clamp(38px, 8vw, 68px);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.03em;
  margin: 0 0 18px;
}
.hero-meta { margin: 4px 0; font-size: 15px; font-weight: 500; }

/* 카드 공통 */
.card {
  background: var(--surface);
  border-radius: var(--r);
  padding: 28px;
  margin-bottom: 20px;
}
.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 18px;
}
.empty { color: var(--muted); font-size: 14px; }

/* 혜택 카드 */
.benefit-card { background: var(--pearl); color: var(--accent-ink); }
.benefit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.benefit {
  background: rgba(20, 20, 26, 0.06);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.benefit-tag {
  background: var(--accent-ink);
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}
.benefit-body { display: flex; flex-direction: column; gap: 4px; }
.benefit-title { font-weight: 700; font-size: 14px; line-height: 1.3; }
.benefit-detail { font-size: 12px; opacity: 0.65; line-height: 1.45; }
.sub-title { font-size: 14px; font-weight: 700; margin: 24px 0 4px; opacity: 0.8; }
.sub-note { font-size: 12.5px; font-weight: 500; margin: 0 0 14px; opacity: 0.55; }

/* 가게 전용 쿠폰 */
.coupon-list { display: flex; flex-direction: column; gap: 12px; }
.coupon {
  background: rgba(20, 20, 26, 0.06);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.coupon-left { display: flex; flex-direction: column; gap: 2px; }
.coupon-name { font-weight: 700; font-size: 15px; }
.coupon-cond { font-size: 12px; opacity: 0.6; }
.coupon-value {
  background: var(--accent-ink);
  color: var(--accent);
  font-weight: 800;
  font-size: 18px;
  padding: 8px 14px;
  border-radius: 12px;
}

/* 챗봇 */
.chat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chat-head .card-title { margin-bottom: 0; }
.chat-toggle {
  background: var(--surface-2);
  border: none;
  color: var(--muted);
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
}
.chat-panel { margin-top: 16px; }
.chat-body {
  height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
}
.msg {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.4;
}
.msg.bot { background: var(--surface-2); align-self: flex-start; border-bottom-left-radius: 4px; }
.msg.user { background: var(--accent); color: var(--accent-ink); align-self: flex-end; border-bottom-right-radius: 4px; font-weight: 500; }
.chat-suggest { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
.chat-suggest button {
  background: none;
  border: 1px solid var(--line);
  color: var(--text);
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
}
.chat-suggest button:hover { border-color: var(--accent); color: var(--accent); }
.chat-input { display: flex; gap: 8px; }
.chat-input input {
  flex: 1;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
  color: var(--text);
  font-size: 14px;
}
.chat-input input:focus { outline: none; border-color: var(--accent); }
.send-btn {
  background: var(--accent);
  color: var(--accent-ink);
  border: none;
  font-weight: 700;
  padding: 0 18px;
  border-radius: 12px;
  cursor: pointer;
}

/* 게시판 */
.review-form { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
.form-mode { color: var(--accent); font-size: 13px; font-weight: 700; margin: 0; }
.input {
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 13px 15px;
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
}
.input:focus { outline: none; border-color: var(--accent); }
.textarea { min-height: 90px; resize: vertical; }
.form-row { display: flex; gap: 10px; align-items: stretch; flex-wrap: wrap; }
.pw { flex: 1; min-width: 180px; }
.submit-btn {
  background: var(--accent);
  color: var(--accent-ink);
  border: none;
  font-weight: 700;
  padding: 12px 22px;
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
}
.cancel-btn {
  background: var(--surface-2);
  color: var(--muted);
  border: none;
  padding: 12px 18px;
  border-radius: 12px;
  cursor: pointer;
}
.error { color: #ff6b6b; font-size: 13px; margin: 4px 0 0; }

.review-list { display: flex; flex-direction: column; gap: 14px; }
.review {
  background: var(--surface-2);
  border-radius: 18px;
  padding: 20px;
}
.review-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.review-head h3 { margin: 0; font-size: 16px; font-weight: 700; }
.date { color: var(--muted); font-size: 12px; flex-shrink: 0; }
.review-content { margin: 10px 0 14px; font-size: 14px; line-height: 1.55; color: #d6d6dd; }
.review-actions { display: flex; gap: 8px; }
.review-actions button {
  background: none;
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
}
.review-actions button:hover { color: var(--text); border-color: var(--text); }
.review-actions .danger:hover { color: #ff6b6b; border-color: #ff6b6b; }

/* 모달 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
  z-index: 100;
  padding: 20px;
}
.modal {
  background: var(--surface);
  border-radius: 24px;
  padding: 28px;
  width: 100%;
  max-width: 360px;
}
.modal h3 { margin: 0 0 6px; font-size: 18px; }
.modal-sub { color: var(--muted); font-size: 13px; margin: 0 0 16px; }
.modal input {
  width: 100%;
  box-sizing: border-box;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 13px 15px;
  color: var(--text);
  font-size: 14px;
}
.modal input:focus { outline: none; border-color: var(--accent); }
.modal-actions { display: flex; gap: 10px; margin-top: 18px; }
.modal-actions .submit-btn { flex: 1; }

/* 모바일 대응 */
@media (max-width: 680px) {
  .hero-text { padding: 24px 24px 28px; }
  .hero-banner { height: 200px; }
  .benefit-grid { grid-template-columns: 1fr; }
}
</style>