<template>
  <div class="h-screen w-screen relative overflow-hidden bg-[#070b13] text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
    <!-- 전체 화면 지도 (광주·전라권) -->
    <div ref="mapContainer" class="absolute inset-0 z-0"></div>

    <!-- 다트 조준 막대 (방향 표시) -->
    <div
      v-if="gameMode==='dart' && !selected && dartStage < 3"
      class="absolute left-1/2 top-1/2 z-30 pointer-events-none"
    >
      <!-- 중심 회전축 -->
      <div class="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_14px_rgba(250,204,21,0.9)]"></div>
      <!-- 회전 막대 (360° 회전) -->
      <div class="origin-left" :style="{ transform: `rotate(${-needleDeg}deg)` }">
        <div
          class="h-2 w-48 rounded-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 shadow-[0_0_16px_rgba(250,204,21,0.85)]"
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
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center justify-center gap-2 bg-[#11141b]/95 border border-gray-800/80 rounded-2xl px-3 py-2 backdrop-blur-md shadow-2xl max-w-[92vw]">
      <button @click="goHome" class="flex items-center gap-2 pr-3 border-r border-gray-800 group">
        <span class="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center text-black font-black text-xs group-hover:scale-110 transition-transform">🎯</span>
        <span class="text-sm font-black tracking-tight uppercase text-white">Namdo<span class="text-yellow-400">rang</span></span>
      </button>
      <div class="flex gap-1 bg-[#090b0e] border border-gray-800/80 p-1 rounded-xl">
        <button @click="setGameMode('dart')" :class="btnClass(gameMode==='dart')">🎯 다트</button>
        <button @click="setGameMode('slot')" :class="btnClass(gameMode==='slot')">🎰 슬롯</button>
      </div>
    </div>

    <!-- 다트 게이지 HUD -->
    <div
      v-if="gameMode==='dart' && !selected"
      class="absolute left-1/2 -translate-x-1/2 bottom-8 z-40 bg-[#11141b]/95 border border-gray-800/80 rounded-2xl px-5 py-3 backdrop-blur text-center shadow-2xl"
    >
      <div class="flex gap-4 items-center justify-center text-sm font-black">
        <div>조준 <span class="text-yellow-400">{{ Math.round(needleDeg) }}°</span></div>
        <div>파워 <span class="text-yellow-400">{{ Math.floor(power) }}%</span></div>
      </div>
      <div class="w-40 h-2 bg-[#090b0e] rounded-full overflow-hidden mt-2 mx-auto border border-gray-800">
        <div class="h-full bg-yellow-400 transition-[width]" :style="{ width: power + '%' }"></div>
      </div>
      <div class="text-[11px] text-yellow-400 font-black uppercase tracking-wide mt-2">
        {{ dartStage === 0 ? '스페이스바로 방향 고정!' : dartStage === 1 ? '스페이스바를 꾹 눌러 파워 충전!' : dartStage === 2 ? '떼는 순간 발사! (파워 조절)' : '발사 중...' }}
      </div>
    </div>

    <!-- 슬롯 오버레이 -->
    <div v-if="gameMode==='slot' && !selected" class="absolute inset-0 z-40 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="relative z-10 w-72 bg-[#11141b] rounded-3xl border border-gray-800/80 p-6 shadow-2xl">
        <div class="absolute top-0 left-0 w-1.5 h-full bg-yellow-400 rounded-l-3xl"></div>
        <button @click="setGameMode('dart')" class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800">✕</button>
        <div class="text-center text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-black mb-1">SPIN CONTROLLER</div>
        <div class="text-center text-white font-black text-lg mb-4">🎰 슬롯머신</div>

        <!-- 릴 창 (내부 내용물이 돌아감) -->
        <div class="flex gap-2 justify-center bg-[#090b0e] rounded-2xl p-3 border-2 border-yellow-400/60">
          <div
            v-for="(reel, i) in reels"
            :key="i"
            class="w-16 h-20 bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-300"
          >
            <span class="text-3xl" :class="{ 'animate-bounce': rouletteActive }">{{ reel.emoji }}</span>
          </div>
        </div>

        <div class="h-6 mt-3 text-center text-xs text-gray-400 font-semibold truncate">{{ reelLabel }}</div>

        <button
          @click="startRoulette"
          :disabled="rouletteActive"
          class="w-full mt-2 py-3 bg-yellow-400 hover:bg-yellow-500 text-black disabled:bg-gray-800 disabled:text-gray-500 rounded-2xl font-black text-xs uppercase tracking-wide transition-all"
        >
          {{ rouletteActive ? '돌리는 중...' : '🎰 SPIN' }}
        </button>
        <button @click="setGameMode('dart')" class="w-full mt-2 py-2 text-xs text-gray-500 hover:text-yellow-400 transition">← 지도로 돌아가기</button>
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
          <button @click="goToPlace" class="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-black text-sm transition-all">보러가기 →</button>
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

const goHome = () => router.push('/')

const btnClass = (on) => on
  ? 'px-3 py-1 bg-yellow-400 text-black rounded-md text-xs font-black uppercase tracking-wide'
  : 'px-3 py-1 bg-gray-900 rounded-md text-xs font-bold text-gray-400 hover:text-gray-200'

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
const dartStage = ref(0) // 0: 조준선 회전 중, 1: 조준 고정, 2: 발사 중
let needleRAF = null
let powerRAF = null

const startNeedle = () => {
  if (needleRAF) return
  const step = () => {
    needleDeg.value = (needleDeg.value + 2.4) % 360
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

// 스페이스바를 누르고 있는 동안 게이지가 0↔100 사이를 왕복(kick)
let powerDir = 1
const startCharge = () => {
  dartStage.value = 2
  power.value = 0
  powerDir = 1
  const step = () => {
    power.value += 2.2 * powerDir
    if (power.value >= 100) { power.value = 100; powerDir = -1 }
    if (power.value <= 0) { power.value = 0; powerDir = 1 }
    powerRAF = requestAnimationFrame(step)
  }
  powerRAF = requestAnimationFrame(step)
}

// 스페이스바를 떼는 순간 현재 파워로 발사
const releaseThrow = () => {
  if (powerRAF) { cancelAnimationFrame(powerRAF); powerRAF = null }
  dartStage.value = 3
  throwDart()
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
  if (e.repeat) return
  if (dartStage.value === 0) lockAim()        // 1) 방향 고정
  else if (dartStage.value === 1) startCharge() // 2) 누르고 있으면 파워 충전
}

const handleKeyup = (e) => {
  if (e.code !== 'Space' || gameMode.value !== 'dart' || selected.value) return
  e.preventDefault()
  if (dartStage.value === 2) releaseThrow()   // 3) 떼면 발사
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
  window.addEventListener('keyup', handleKeyup)
  if (gameMode.value === 'dart') startNeedle()
})

onBeforeUnmount(() => {
  stopNeedle()
  if (powerRAF) cancelAnimationFrame(powerRAF)
  if (rouletteTimer) clearTimeout(rouletteTimer)
  if (reelSpinTimer) clearInterval(reelSpinTimer)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('keyup', handleKeyup)
})
</script>

<style scoped>
.font-title {
  font-family: 'Black Han Sans', sans-serif;
}
</style>
