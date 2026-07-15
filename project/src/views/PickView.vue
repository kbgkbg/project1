<template>
  <div class="h-screen w-screen relative overflow-hidden bg-[#070b13] text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
    <!-- 전체 화면 지도 (광주·전라권) -->
    <div ref="mapContainer" class="absolute inset-0 z-0"></div>

    <!-- 다트 조준 막대 (방향 표시) -->
    <div
      v-if="gameMode==='dart' && !selected && dartStage < 2"
      class="absolute left-1/2 top-1/2 z-30 pointer-events-none"
    >
      <!-- 중심 회전축 -->
      <div class="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.9)]"></div>
      <!-- 회전 막대 -->
      <div class="origin-left" :style="{ transform: `rotate(${-needleDeg}deg)` }">
        <div
          class="h-2 w-48 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-rose-500 shadow-[0_0_16px_rgba(251,146,60,0.85)]"
          :class="{ 'animate-pulse': dartStage === 0 }"
        ></div>
        <span class="absolute top-1/2 -translate-y-1/2 left-48 -ml-1 text-2xl drop-shadow-lg">🎯</span>
      </div>
    </div>

    <!-- 날아가는 다트 -->
    <div v-if="dartVisual.visible" :style="dartStyle" class="absolute z-30 pointer-events-none transition-transform">
      <span class="text-3xl drop-shadow-lg">🎯</span>
    </div>

    <!-- 상단 플로팅 컨트롤 바 -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center justify-center gap-2 bg-[#0b0f1d]/90 border border-slate-800 rounded-2xl px-3 py-2 backdrop-blur-md shadow-xl max-w-[92vw]">
      <div class="flex items-center gap-2 pr-2 border-r border-slate-800">
        <span class="text-xl">🎯</span>
        <span class="text-xs font-black bg-gradient-to-r from-teal-400 via-amber-400 to-rose-400 bg-clip-text text-transparent font-title tracking-wide">오가다 전라</span>
      </div>
      <div class="flex gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
        <button @click="setTour('food')" :class="btnClass(localTourType==='food')">🍕 먹거리</button>
        <button @click="setTour('attraction')" :class="btnClass(localTourType==='attraction')">🏛 관광지</button>
      </div>
      <div class="flex gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
        <button @click="setGameMode('dart')" :class="btnClass(gameMode==='dart')">🎯 다트</button>
        <button @click="setGameMode('slot')" :class="btnClass(gameMode==='slot')">🎰 슬롯</button>
      </div>
    </div>

    <!-- 다트 게이지 HUD -->
    <div
      v-if="gameMode==='dart' && !selected"
      class="absolute left-1/2 -translate-x-1/2 bottom-8 z-40 bg-[#071018]/90 border border-slate-800 rounded-2xl px-5 py-3 backdrop-blur text-center"
    >
      <div class="flex gap-4 items-center justify-center text-sm">
        <div>조준 {{ Math.round(needleDeg) }}°</div>
        <div>파워 {{ Math.floor(power) }}%</div>
      </div>
      <div class="w-40 h-2 bg-slate-800 rounded-full overflow-hidden mt-2 mx-auto">
        <div class="h-full bg-amber-400 transition-[width]" :style="{ width: power + '%' }"></div>
      </div>
      <div class="text-xs text-amber-300 font-bold mt-2">
        {{ dartStage === 0 ? '스페이스바로 조준 고정!' : dartStage === 1 ? '스페이스바를 한번 더 눌러 발사!' : '발사 중...' }}
      </div>
    </div>

    <!-- 슬롯 오버레이 -->
    <div v-if="gameMode==='slot' && !selected" class="absolute inset-0 z-40 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="relative z-10 w-72 bg-[#0b1220] rounded-3xl border border-slate-700 p-6 shadow-2xl">
        <button @click="setGameMode('dart')" class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700">✕</button>
        <div class="text-center text-amber-400 font-black text-lg mb-4 font-title">🎰 슬롯머신</div>

        <!-- 릴 창 (내부 내용물이 돌아감) -->
        <div class="flex gap-2 justify-center bg-slate-950 rounded-2xl p-3 border-2 border-amber-500/60">
          <div
            v-for="(reel, i) in reels"
            :key="i"
            class="w-16 h-20 bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-300"
          >
            <span class="text-3xl" :class="{ 'animate-bounce': rouletteActive }">{{ reel.emoji }}</span>
          </div>
        </div>

        <div class="h-6 mt-3 text-center text-xs text-slate-300 truncate">{{ reelLabel }}</div>

        <button
          @click="startRoulette"
          :disabled="rouletteActive"
          class="w-full mt-2 py-3 bg-rose-500 disabled:bg-slate-700 disabled:text-slate-400 rounded-xl font-bold"
        >
          {{ rouletteActive ? '돌리는 중...' : '🎰 SPIN' }}
        </button>
        <button @click="setGameMode('dart')" class="w-full mt-2 py-2 text-xs text-slate-400 hover:text-slate-200">← 지도로 돌아가기</button>
      </div>
    </div>

    <!-- 결과 모달 -->
    <div v-if="selected" class="absolute inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeResult"></div>
      <div class="relative z-10 w-full max-w-sm bg-white text-slate-900 rounded-3xl p-6 shadow-2xl">
        <button @click="closeResult" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">✕</button>
        <h2 class="text-2xl font-black pr-8">{{ selected.emoji }} {{ selected.name }}</h2>
        <span class="inline-block mt-3 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">#{{ selected.category }}</span>
        <p class="text-sm text-slate-500 mt-3">{{ selected.address }}</p>
        <div class="flex gap-2 mt-6">
          <button @click="closeResult" class="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-sm">다시 뽑기</button>
          <button @click="goToPlace" class="flex-1 py-3 bg-amber-400 rounded-xl font-bold text-sm">보러가기 →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePickedStore } from '../stores/picked'
import lovegetRaw from '../../../dataset/LovegetStoreInfoList.json'

const router = useRouter()
const pickedStore = usePickedStore()

const localTourType = ref('food')
const gameMode = ref('dart')
const selected = ref(null)
const mapContainer = ref(null)

const CATEGORY_FILE_MAP = {
  '관광지': '광주_전라권_관광지.json',
  '문화시설': '광주_전라권_문화시설.json',
  '축제공연행사': '광주_전라권_축제공연행사.json',
  '여행코스': '광주_전라권_여행코스.json',
  '레포츠': '광주_전라권_레포츠.json',
  '숙박': '광주_전라권_숙박.json',
  '쇼핑': '광주_전라권_쇼핑.json',
  '음식점': '광주_전라권_음식점.json',
}

const normalizeItem = (item, category = '') => {
  const name = item.name || item.명칭 || item.시설명 || item.title || item.NAME || item.name_ko
  const lat = item.lat || item.latitude || item.위도 || item.mapy || item.MAPY || item.Y || item.LAT
  const lng = item.lng || item.longitude || item.경도 || item.mapx || item.MAPX || item.X || item.LNG
  const address = item.addr1 || item.address || item.주소 || item.소재지도로명주소 || item.소재지지번주소 || ''
  const tel = item.tel || item.전화번호 || item.TELNO || ''
  const image = item.firstimage || item.imgUrl || item.image || ''
  return {
    id: item.contentid ?? item.id ?? (name ? name : Math.random().toString(36).slice(2, 9)),
    name,
    lat: Number(lat),
    lng: Number(lng),
    address,
    tel,
    image,
    category,
    emoji: item.emoji || '📍',
    coupons: [],
  }
}

const activeList = ref([])

const normalizeLoveget = (item) => ({
  id: `lv-${item.storeId}`,
  name: item.storeNm || '',
  lat: Number(item.lat),
  lng: Number(item.lng),
  address: item.addr || '',
  tel: item.phone || '',
  image: item.imgUrl || '',
  category: item.storeKind || '사랑가게',
  emoji: '🏪',
  coupons: [],
})

const loadDatasets = async () => {
  try {
    const cats = pickedStore.categories.length
      ? pickedStore.categories
      : Object.keys(CATEGORY_FILE_MAP)

    const results = await Promise.all(
      cats.map(cat => {
        const filename = CATEGORY_FILE_MAP[cat]
        if (!filename) return Promise.resolve([])
        return fetch(`/dataset/${encodeURIComponent(filename)}`)
          .then(r => r.json())
          .then(data => {
            const arr = Array.isArray(data) ? data : (data.items || [])
            return arr.map(item => normalizeItem(item, cat))
          })
          .catch(() => [])
      })
    )

    const lovegetItems = (lovegetRaw.body?.items || [])
      .map(normalizeLoveget)
      .filter(i => i.lat && i.lng && cats.includes(i.category))

    activeList.value = [...results.flat(), ...lovegetItems].filter(i => i.lat && i.lng)
  } catch (err) {
    console.error('dataset load failed', err)
  }
}

function goToPlace() {
  if (!selected.value) return
  pickedStore.place = { ...selected.value }
  router.push({ name: 'place', params: { id: selected.value.id } })
}

const btnClass = (on) => on ? 'px-3 py-1 bg-teal-500 text-slate-900 rounded-md text-xs font-bold' : 'px-3 py-1 bg-slate-800 rounded-md text-xs font-bold text-slate-300'

/* ---------- Leaflet 연동 (main.js에서 import한 경우를 전제로 함) ---------- */
const leafletMap = ref(null)
let resizeHandler = null

const initLeafletMap = async () => {
  if (typeof window.L === 'undefined') {
    console.warn('Leaflet not found — make sure you import it in main.js')
    return
  }
  if (!mapContainer.value) return

  const center = [35.1601, 126.8514]
  if (!leafletMap.value) {
    leafletMap.value = window.L.map(mapContainer.value).setView(center, 9)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap.value)

    resizeHandler = () => { if (leafletMap.value) leafletMap.value.invalidateSize() }
    window.addEventListener('resize', resizeHandler)

    await nextTick()
    if (leafletMap.value) leafletMap.value.invalidateSize()
    // extra invalidate to handle delayed layout/animations that can cause blank tiles
    setTimeout(() => { if (leafletMap.value) leafletMap.value.invalidateSize() }, 250)
  } else {
    leafletMap.value.setView(center, 9)
  }
}

watch(selected, (v) => {
  if (!v || !leafletMap.value) return
  leafletMap.value.panTo([v.lat, v.lng])
  window.L.popup()
    .setLatLng([v.lat, v.lng])
    .setContent(`<div style="padding:6px">${v.emoji || ''} ${v.name}</div>`)
    .openOn(leafletMap.value)
})

/* ---------- 다트 게임 로직 (스페이스바 2단 입력) ---------- */
const dartVisual = reactive({ visible: false, x: 0, y: 0 })
const needleDeg = ref(0)
const power = ref(0)
const dartStage = ref(0) // 0: 조준선 왕복 중, 1: 조준 고정, 2: 발사 중
let needleDir = 1
let needleRAF = null
let powerRAF = null

const startNeedle = () => {
  if (needleRAF) return
  const step = () => {
    needleDeg.value += 1.6 * needleDir
    if (needleDeg.value > 80) needleDir = -1
    if (needleDeg.value < -80) needleDir = 1
    needleRAF = requestAnimationFrame(step)
  }
  needleRAF = requestAnimationFrame(step)
}
const stopNeedle = () => { if (needleRAF) cancelAnimationFrame(needleRAF); needleRAF = null }

const resetDart = () => {
  dartStage.value = 0
  power.value = 0
  needleDeg.value = 0
  startNeedle()
}

const lockAim = () => {
  stopNeedle()
  dartStage.value = 1
}

const chargeAndThrow = () => {
  dartStage.value = 2
  power.value = 0
  const step = () => {
    power.value = Math.min(100, power.value + 8)
    if (power.value < 100) {
      powerRAF = requestAnimationFrame(step)
    } else {
      powerRAF = null
      throwDart()
    }
  }
  powerRAF = requestAnimationFrame(step)
}

const throwDart = () => {
  if (!mapContainer.value) return
  dartVisual.visible = true
  const rect = mapContainer.value.getBoundingClientRect()
  const cx = rect.width / 2
  const cy = rect.height / 2
  const len = 0.35 * Math.min(rect.width, rect.height) * (0.6 + power.value / 100)
  const rad = (needleDeg.value * Math.PI) / 180
  const tx = cx + Math.cos(rad) * len
  const ty = cy - Math.sin(rad) * len
  const frames = 20
  let f = 0
  const sx = cx
  const sy = cy

  const anim = () => {
    f++
    dartVisual.x = sx + (tx - sx) * (f / frames)
    dartVisual.y = sy + (ty - sy) * (f / frames)
    if (f < frames) {
      requestAnimationFrame(anim)
    } else {
      dartVisual.visible = false
      computeDartOutcome()
    }
  }
  requestAnimationFrame(anim)
}

const dartStyle = computed(() => ({
  left: dartVisual.x + 'px',
  top: dartVisual.y + 'px',
  transform: 'translate(-50%,-50%)'
}))

const computeDartOutcome = () => {
  if (!leafletMap.value || !activeList.value.length) return
  const center = leafletMap.value.getCenter()
  const cx = center.lat
  const cy = center.lng
  const needleRad = (needleDeg.value * Math.PI) / 180
  const scored = activeList.value
    .map((p) => {
      const y = p.lat - cx
      const x = p.lng - cy
      const b = Math.atan2(y, x)
      const delta = Math.abs(Math.atan2(Math.sin(b - needleRad), Math.cos(b - needleRad)))
      return { p, score: 1 - delta / Math.PI }
    })
    .sort((a, b) => b.score - a.score)

  selected.value = scored[0].p
  if (leafletMap.value) leafletMap.value.panTo([selected.value.lat, selected.value.lng])
}

const handleKeydown = (e) => {
  if (e.code !== 'Space' || gameMode.value !== 'dart' || selected.value) return
  e.preventDefault()
  if (dartStage.value === 0) lockAim()
  else if (dartStage.value === 1) chargeAndThrow()
}

/* ---------- 슬롯머신 (릴 회전) ---------- */
const rouletteActive = ref(false)
const reels = ref([{ emoji: '❔' }, { emoji: '❔' }, { emoji: '❔' }])
const reelLabel = ref('버튼을 눌러 뽑기!')
let rouletteTimer = null
let reelSpinTimer = null

const randomItem = () => activeList.value[Math.floor(Math.random() * activeList.value.length)]

const prepareRoulette = () => {
  rouletteActive.value = false
  if (reelSpinTimer) { clearInterval(reelSpinTimer); reelSpinTimer = null }
  reels.value = [{ emoji: '❔' }, { emoji: '❔' }, { emoji: '❔' }]
  reelLabel.value = '버튼을 눌러 뽑기!'
}

const startRoulette = () => {
  if (!activeList.value.length || rouletteActive.value) return
  rouletteActive.value = true
  const target = randomItem()

  // 릴 내부 내용물을 빠르게 교체 (기계 자체는 고정)
  reelSpinTimer = setInterval(() => {
    reels.value = reels.value.map(() => ({ emoji: randomItem()?.emoji || '📍' }))
    reelLabel.value = randomItem()?.name || ''
  }, 90)

  rouletteTimer = setTimeout(() => {
    clearInterval(reelSpinTimer); reelSpinTimer = null
    rouletteActive.value = false
    const e = target.emoji || '📍'
    reels.value = [{ emoji: e }, { emoji: e }, { emoji: e }]
    reelLabel.value = target.name
    selected.value = target
    if (leafletMap.value) leafletMap.value.panTo([target.lat, target.lng])
  }, 1600)
}

/* ---------- 헬퍼 & 라이프사이클 ---------- */
const setTour = (t) => {
  localTourType.value = t
  selected.value = null
  loadDatasets()
}

const setGameMode = (m) => {
  gameMode.value = m
  selected.value = null
  if (rouletteTimer) clearTimeout(rouletteTimer)
  prepareRoulette()
  if (m === 'slot') {
    stopNeedle()
    if (powerRAF) cancelAnimationFrame(powerRAF)
  } else {
    resetDart()
  }
}

const closeResult = () => {
  selected.value = null
  if (gameMode.value === 'dart') resetDart()
  else prepareRoulette()
}

onMounted(async () => {
  await loadDatasets()
  await initLeafletMap()
  window.addEventListener('keydown', handleKeydown)
  if (gameMode.value === 'dart') startNeedle()
})

onBeforeUnmount(() => {
  stopNeedle()
  if (powerRAF) cancelAnimationFrame(powerRAF)
  if (rouletteTimer) clearTimeout(rouletteTimer)
  if (reelSpinTimer) clearInterval(reelSpinTimer)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.font-title {
  font-family: 'Black Han Sans', sans-serif;
}
</style>
