<template>
  <div class="h-screen w-screen text-slate-100 flex flex-col selection:bg-teal-500 selection:text-slate-950 font-sans bg-[#070b13] overflow-hidden">
    <header class="border-b border-slate-900 bg-[#0b0f1d]/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
        <div class="flex items-center space-x-3">
          <span class="text-3xl animate-bounce">🎯</span>
          <div>
            <h1 class="text-xl md:text-2xl font-black bg-gradient-to-r from-teal-400 via-amber-400 to-rose-400 bg-clip-text text-transparent font-title tracking-wider">
              오가다 전라 : 아케이드 게임존
            </h1>
            <p class="text-[10px] text-slate-500 tracking-wide font-mono">JEOLLA RANDOM TRAVEL CHALLENGE</p>
          </div>
        </div>

        <div class="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl">
          <button @click="setTour('food')" :class="btnClass(localTourType==='food')">🍕 먹거리</button>
          <button @click="setTour('attraction')" :class="btnClass(localTourType==='attraction')">🏛 관광지</button>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full mx-auto flex flex-col gap-6 pt-[84px] overflow-auto px-4 min-h-0">
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button @click="setGameMode('dart')" :class="gameMode==='dart' ? activeModeClass : inactiveModeClass" class="border-2 p-4 rounded-2xl">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎯</span>
            <div>
              <h4 class="font-bold text-sm">매직 다트 던지기</h4>
              <p class="text-[11px] text-slate-400">조준선과 게이지 타이밍</p>
            </div>
          </div>
        </button>

        <button @click="setGameMode('slot')" :class="gameMode==='slot' ? activeModeClass : inactiveModeClass" class="border-2 p-4 rounded-2xl">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎰</span>
            <div>
              <h4 class="font-bold text-sm">럭키 777 슬롯머신</h4>
              <p class="text-[11px] text-slate-400">레버로 랜덤 선택</p>
            </div>
          </div>
        </button>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div class="lg:col-span-2 bg-[#101626] rounded-3xl p-6 flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-300">Mode: <strong class="text-white">{{ gameModeLabel }}</strong></div>
            <div class="flex gap-2">
              <button @click="renderLeafletMarkers()" class="px-3 py-1 bg-slate-800 rounded">Show markers</button>
              <button @click="clearSelection()" class="px-3 py-1 bg-slate-800 rounded">Clear</button>
            </div>
          </div>

          <div class="relative w-full flex-1 rounded-xl overflow-hidden border border-slate-800 bg-[#070b13] min-h-0">
            <div ref="mapContainer" class="w-full h-96 min-h-0"></div>

            <div v-if="dartVisual.visible" :style="dartStyle" class="absolute z-30 transition-transform">
              <span class="text-3xl drop-shadow-lg">🎯</span>
            </div>

            <div v-if="gameMode==='dart'" class="absolute left-4 bottom-4 bg-[#071018]/80 p-3 rounded-lg border border-slate-800 backdrop-blur">
              <div class="flex gap-2 items-center mb-2">
                <div>Aim: {{ Math.round(needleDeg) }}°</div>
                <div>Power: {{ Math.floor(power) }}%</div>
              </div>
              <div class="flex gap-2">
                <button @click="toggleAim" :class="smallBtn(aiming)">Aim</button>
                <button @click="toggleCharge" :class="smallBtn(charging)" :disabled="!aiming">Charge</button>
                <button @click="throwDart" class="bg-amber-400 px-3 rounded" :disabled="!canThrow">Throw</button>
              </div>
            </div>

            <div v-if="gameMode==='slot' && rouletteActive" class="absolute inset-0 flex items-center justify-center">
              <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
              <div class="z-20 w-64 h-64 bg-[#0b1220] rounded-full flex items-center justify-center border border-slate-700">
                <div v-if="!rouletteResult">
                  <button @click="startRoulette" class="px-5 py-3 bg-rose-500 rounded-lg">SPIN</button>
                </div>
                <div v-else class="text-center text-amber-300 font-bold">{{ rouletteResult.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <aside class="bg-[#0f1720] rounded-3xl p-4 flex flex-col gap-4">
          <div>
            <h3 class="text-sm text-slate-300 font-bold mb-2">Result</h3>
            <div v-if="selected" class="bg-[#071018] p-3 rounded-lg border border-slate-800">
              <div class="text-white font-bold">{{ selected.emoji }} {{ selected.name }}</div>
              <div class="text-xs text-slate-400 mt-1">{{ selected.category }}</div>
              <div class="text-[11px] text-slate-400 mt-1">{{ selected.address }}</div>
              <button @click="goToPlace" class="mt-3 w-full py-2 bg-amber-400 text-slate-900 font-bold rounded-lg text-xs">
                이 장소 보러가기 →
              </button>
            </div>
            <div v-else class="text-xs text-slate-400">아직 선택된 장소가 없습니다.</div>
          </div>

          <div>
            <h4 class="text-xs text-slate-300 font-bold mb-2">Candidates ({{ activeList.length }})</h4>
            <ul class="max-h-56 overflow-auto text-sm space-y-1">
              <li v-for="p in activeList" :key="p.id">
                <button @click="selectAndCenter(p)" class="w-full text-left hover:text-amber-300">{{ p.emoji }} {{ p.name }}</button>
              </li>
            </ul>
          </div>

          <div class="mt-auto text-xs text-slate-500">• OpenStreetMap + Leaflet (no API key)</div>
        </aside>
      </section>
    </main>
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

const btnClass = (on) => on ? 'px-3 py-1 bg-teal-500 text-slate-900 rounded-md' : 'px-3 py-1 bg-slate-800 rounded-md'
const activeModeClass = 'border-amber-500 bg-amber-500/10 text-amber-300'
const inactiveModeClass = 'border-slate-800 bg-[#101626]/60 text-slate-400'
const smallBtn = (on) => on ? 'px-3 py-1 bg-teal-500 rounded' : 'px-3 py-1 bg-slate-800 rounded'

/* ---------- Leaflet 연동 (main.js에서 import한 경우를 전제로 함) ---------- */
const leafletMap = ref(null)
const leafletMarkers = ref([])
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
  renderLeafletMarkers()
}

const renderLeafletMarkers = () => {
  leafletMarkers.value.forEach((m) => m.remove())
  leafletMarkers.value = []
  if (!leafletMap.value) return
  activeList.value.forEach((p) => {
    const m = window.L.marker([p.lat, p.lng]).addTo(leafletMap.value)
    m.on('click', () => { selected.value = p; leafletMap.value.panTo([p.lat, p.lng]) })
    leafletMarkers.value.push(m)
  })
}

const selectAndCenter = (p) => {
  selected.value = p
  if (leafletMap.value) leafletMap.value.panTo([p.lat, p.lng])
}

watch(selected, (v) => {
  if (!v || !leafletMap.value) return
  leafletMap.value.panTo([v.lat, v.lng])
  window.L.popup()
    .setLatLng([v.lat, v.lng])
    .setContent(`<div style="padding:6px">${v.emoji || ''} ${v.name}</div>`)
    .openOn(leafletMap.value)
})

/* ---------- 다트 게임 로직 ---------- */
const dartVisual = reactive({ visible: false, x: 0, y: 0 })
const aiming = ref(false)
const charging = ref(false)
const needleDeg = ref(0)
const power = ref(50)
const canThrow = ref(false)
let needleDir = 1
let needleRAF = null
let chargeInterval = null

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

const toggleAim = () => {
  aiming.value = !aiming.value
  if (aiming.value) startNeedle()
  else stopNeedle()
  charging.value = false
  power.value = 50
  canThrow.value = false
}

const toggleCharge = () => {
  if (!aiming.value) return
  charging.value = !charging.value
  if (charging.value) {
    chargeInterval = setInterval(() => {
      power.value = Math.min(100, power.value + 6)
      if (!charging.value || power.value >= 100) {
        clearInterval(chargeInterval)
        chargeInterval = null
        charging.value = false
        canThrow.value = true
      }
    }, 120)
  } else {
    canThrow.value = true
  }
}

const throwDart = () => {
  if (!canThrow.value || !mapContainer.value) return
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
      aiming.value = false
      stopNeedle()
      power.value = 50
      canThrow.value = false
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

/* ---------- 룰렛 ---------- */
const rouletteActive = ref(false)
const rouletteResult = ref(null)
let rouletteTimer = null

const prepareRoulette = () => { rouletteActive.value = false; rouletteResult.value = null }

const startRoulette = () => {
  if (!activeList.value.length) return
  rouletteActive.value = true
  rouletteResult.value = null
  const idx = Math.floor(Math.random() * activeList.value.length)
  rouletteTimer = setTimeout(() => {
    rouletteResult.value = activeList.value[idx]
    selected.value = rouletteResult.value
    if (leafletMap.value) leafletMap.value.panTo([selected.value.lat, selected.value.lng])
    rouletteActive.value = false
  }, 1400)
}

/* ---------- 헬퍼 & 라이프사이클 ---------- */
const setTour = (t) => {
  localTourType.value = t
  loadActive()
  if (leafletMap.value) renderLeafletMarkers()
}

const setGameMode = (m) => {
  gameMode.value = m
  if (m === 'slot') prepareRoulette()
  else { rouletteActive.value = false; rouletteResult.value = null }
}

const clearSelection = () => { selected.value = null; renderLeafletMarkers() }

onMounted(async () => {
  await loadDatasets()
  await initLeafletMap()
})

onBeforeUnmount(() => {
  stopNeedle()
  if (chargeInterval) clearInterval(chargeInterval)
  if (rouletteTimer) clearTimeout(rouletteTimer)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})

const gameModeLabel = computed(() => (gameMode.value === 'dart' ? 'Dart' : 'Roulette'))
</script>

<style scoped>
.font-title {
  font-family: 'Black Han Sans', sans-serif;
}
</style>