<template>
  <div class="min-h-screen text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-slate-950 font-sans p-2">
    
    <!-- 상단 헤더 (메인 페이지 연동 전 데모용) -->
    <header class="border-b border-slate-900 bg-[#0b0f1d]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 rounded-2xl mb-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <span class="text-3xl animate-bounce">🎯</span>
          <div>
            <h1 class="text-xl md:text-2xl font-black bg-gradient-to-r from-teal-400 via-amber-400 to-rose-400 bg-clip-text text-transparent font-title tracking-wider">
              오가다 전라 : 아케이드 게임존
            </h1>
            <p class="text-[10px] text-slate-500 tracking-wide font-mono">JEOLLA RANDOM TRAVEL CHALLENGE v7.0</p>
          </div>
        </div>
        
        <!-- 테스트용 테마 스위처 (메인 페이지 연동 전까지 유용하게 사용 가능) -->
        <div class="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl">
          <span class="text-[10px] text-slate-400 px-2 font-bold hidden sm:inline">테스트 테마:</span>
          <button 
            @click="testToggleTheme('food')"
            :class="localTourType === 'food' ? 'bg-teal-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'"
            class="text-[10px] px-2.5 py-1 rounded-lg transition-all"
          >
            🍕 먹거리
          </button>
          <button 
            @click="testToggleTheme('attraction')"
            :class="localTourType === 'attraction' ? 'bg-indigo-500 text-white font-black' : 'text-slate-400 hover:text-white'"
            class="text-[10px] px-2.5 py-1 rounded-lg transition-all"
          >
            🏛️ 관광지
          </button>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 영역 -->
    <main class="flex-grow max-w-7xl w-full mx-auto flex flex-col gap-6">
      
      <!-- 게임 모드 셀렉터 -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          @click="setGameMode('dart')"
          :class="gameMode === 'dart' ? 'border-amber-500 bg-amber-500/10 text-amber-300' : 'border-slate-800 bg-[#101626]/60 text-slate-400'"
          class="border-2 p-4 rounded-2xl flex items-center justify-between transition-all duration-300 transform active:scale-[0.98]"
        >
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎯</span>
            <div class="text-left">
              <h4 class="font-bold text-sm text-white font-sans">매직 다트 던지기</h4>
              <p class="text-[11px] text-slate-500">조준선과 게이지 타이밍을 노려 던지는 피지컬 게임</p>
            </div>
          </div>
          <i class="fas fa-chevron-right text-xs opacity-50"></i>
        </button>

        <button 
          @click="setGameMode('slot')"
          :class="gameMode === 'slot' ? 'border-rose-500 bg-rose-500/10 text-rose-300' : 'border-slate-800 bg-[#101626]/60 text-slate-400'"
          class="border-2 p-4 rounded-2xl flex items-center justify-between transition-all duration-300 transform active:scale-[0.98]"
        >
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎰</span>
            <div class="text-left">
              <h4 class="font-bold text-sm text-white font-sans">럭키 777 슬롯머신</h4>
              <p class="text-[11px] text-slate-500">레버를 당겨 잭팟 코스를 정하는 스핀 게임</p>
            </div>
          </div>
          <i class="fas fa-chevron-right text-xs opacity-50"></i>
        </button>
      </section>

      <!-- 플레이 맵 & 결과 보드 -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        <!-- 왼쪽/중앙: 미니게임 존 -->
        <div class="lg:col-span-2 bg-[#101626] border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[500px]">
          
          <div class="text-center mb-6 relative z-10">
            <span class="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Mode: {{ gameMode === 'dart' ? 'Timing Dart Target' : 'Las Vegas Slot Lever' }}
            </span>
            <h2 class="text-lg font-black text-white mt-2 font-title">
              <span v-if="gameMode === 'dart'">🎯 미지의 조준 다트 슈터</span>
              <span v-else>🎰 전라 럭키 잭팟 슬롯머신</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              <span v-if="gameMode === 'dart'">스포일러가 없는 지도 위에 다트를 날리세요! 꽂힌 자리에서 가장 가까운 최적의 장소가 선정됩니다.</span>
              <span v-else>우측의 빨간 손잡이를 마우스나 터치로 쓸어내려 잭팟을 돌려보세요!</span>
            </p>
          </div>

          <!-- [게임 1]: 다트 게임 엔진 -->
          <div v-show="gameMode === 'dart'" class="relative flex-grow flex flex-col items-center justify-center">
            <div class="relative w-full max-w-[380px] h-[340px] bg-[#070b13] rounded-2xl border border-slate-800 p-4 overflow-hidden flex items-center justify-center shadow-inner">
              
              <!-- SFX 백그라운드 디자인 -->
              <div class="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div class="absolute w-[300px] h-[300px] border border-dashed border-teal-500/10 rounded-full animate-spin-slow"></div>
              <div class="absolute w-[200px] h-[200px] border border-dashed border-teal-500/20 rounded-full"></div>
              <div class="absolute w-[100px] h-[100px] border border-dashed border-teal-500/30 rounded-full"></div>
              
              <div class="absolute text-center opacity-20 pointer-events-none select-none">
                <i class="fas fa-earth-asia text-[140px] text-teal-500"></i>
                <div class="text-[9px] text-teal-400 tracking-widest mt-2 uppercase font-mono">JEOLLABUKDO / JEOLLANAMDO DETECTOR</div>
              </div>

              <!-- 안착 핀 -->
              <div v-if="dartStatus.landed" class="absolute z-20 transition-all duration-75 animate-bounce"
                   :style="{ left: dartStatus.targetX + 'px', top: dartStatus.targetY + 'px' }">
                <span class="text-3xl -translate-x-1/2 -translate-y-full inline-block drop-shadow-2xl">🎯</span>
              </div>

              <!-- 공중 비행 핀 -->
              <div v-if="dartStatus.flying" class="absolute z-20 animate-ping"
                   :style="{ left: dartStatus.currentX + 'px', top: dartStatus.currentY + 'px' }">
                <div class="w-4 h-4 bg-amber-400 rounded-full shadow-lg border border-white"></div>
              </div>

              <!-- 바늘 조준선 -->
              <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 380 340">
                <circle cx="190" cy="320" r="10" fill="#14b8a6" class="animate-pulse" />
                <line x1="190" y1="320" 
                      :x2="getNeedleEndX()" 
                      :y2="getNeedleEndY()" 
                      stroke="#f59e0b" 
                      stroke-width="2.5" 
                      stroke-dasharray="4,4" />
              </svg>
            </div>

            <!-- 다트 파워 게이지 바 및 버튼 -->
            <div class="w-full max-w-[380px] mt-6 space-y-4 relative z-10">
              <div class="space-y-1">
                <div class="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>🚀 SHOOTING POWER</span>
                  <span class="text-amber-400 font-bold">{{ Math.floor(dartStatus.power) }}%</span>
                </div>
                <div class="w-full h-4 bg-[#05080e] border border-slate-800 rounded-full overflow-hidden p-0.5">
                  <div class="h-full rounded-full transition-all duration-75 bg-gradient-to-r from-teal-500 via-amber-500 to-rose-500"
                       :style="{ width: dartStatus.power + '%' }"></div>
                </div>
              </div>

              <button 
                @click="handleDartTrigger"
                :disabled="dartStatus.flying"
                class="w-full py-4 rounded-xl font-black text-sm tracking-wide text-slate-950 transition-all duration-300 flex items-center justify-center gap-2"
                :class="getDartBtnClass()"
              >
                <i class="fas" :class="getDartBtnIcon()"></i>
                {{ getDartBtnText() }}
              </button>
            </div>
          </div>

          <!-- [게임 2]: 777 슬롯머신 엔진 -->
          <div v-show="gameMode === 'slot'" class="relative flex-grow flex flex-col items-center justify-center">
            <div class="flex items-center justify-center gap-6 w-full max-w-lg">
              
              <!-- 슬롯 머신 프레임 -->
              <div class="flex-grow bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-slate-800 rounded-3xl p-4 shadow-2xl relative">
                <div class="text-center bg-[#1c0c0c] border border-red-500/30 rounded-xl py-2 mb-4 jackpot-neon">
                  <span class="text-xs text-amber-500 font-bold tracking-[0.2em] uppercase font-mono">★ JEOLLA LUCKY JACKPOT ★</span>
                </div>

                <div class="grid grid-cols-3 gap-3 bg-[#05080e] border-2 border-slate-800 p-3 rounded-2xl overflow-hidden h-36 relative">
                  <div class="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40 pointer-events-none z-10"></div>
                  <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-red-500/60 z-10 pointer-events-none"></div>

                  <!-- 릴 1 (지역) -->
                  <div class="bg-[#0b0f19] border border-slate-800/80 rounded-xl relative overflow-hidden flex items-center justify-center">
                    <div class="text-center transition-transform duration-75" :class="{'slot-spinning': slotStatus.spinning}">
                      <div class="h-12 flex items-center justify-center text-base text-teal-400 font-title">
                        {{ slotStatus.reel1 }}
                      </div>
                    </div>
                  </div>

                  <!-- 릴 2 (카테고리 이모지) -->
                  <div class="bg-[#0b0f19] border border-slate-800/80 rounded-xl relative overflow-hidden flex items-center justify-center">
                    <div class="text-center transition-transform duration-75" :class="{'slot-spinning': slotStatus.spinning}">
                      <div class="h-12 flex items-center justify-center text-xl">
                        {{ slotStatus.reel2 }}
                      </div>
                    </div>
                  </div>

                  <!-- 릴 3 (명소명) -->
                  <div class="bg-[#0b0f19] border border-slate-800/80 rounded-xl relative overflow-hidden flex items-center justify-center">
                    <div class="text-center transition-transform duration-75" :class="{'slot-spinning': slotStatus.spinning}">
                      <div class="h-12 flex items-center justify-center font-bold text-[11px] text-amber-400 px-1 leading-snug">
                        {{ slotStatus.reel3 }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex justify-between items-center mt-3 px-2 text-[10px] text-slate-500">
                  <span><i class="fas fa-circle text-red-500 animate-pulse"></i> ACTIVE</span>
                  <span class="font-mono">PAYOUT RATE 99.9%</span>
                  <span><i class="fas fa-circle text-green-500 animate-pulse"></i> READY</span>
                </div>
              </div>

              <!-- 강원랜드 스타일 물리적 레버 인터랙션 -->
              <div class="w-16 flex flex-col items-center justify-center h-48 select-none relative">
                <div class="w-6 h-28 bg-slate-950 border border-slate-800 rounded-full flex flex-col justify-between items-center p-1 relative shadow-inner">
                  <div 
                    @mousedown="pullLeverStart"
                    @touchstart="pullLeverStart"
                    :class="{'lever-pulled': slotStatus.leverActive}"
                    class="lever-handle w-2.5 h-20 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full cursor-grab active:cursor-grabbing relative origin-bottom"
                  >
                    <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-r from-red-500 to-rose-600 border border-red-400/50 shadow-lg flex items-center justify-center text-[10px] text-white font-bold font-mono">
                      $
                    </div>
                  </div>
                </div>
                <span class="text-[9px] text-slate-500 mt-2 font-mono uppercase">PULL</span>
              </div>

            </div>

            <div class="w-full max-w-lg mt-6">
              <button 
                @click="triggerSlotSpin"
                :disabled="slotStatus.spinning"
                class="w-full py-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-sm rounded-xl shadow-lg shadow-rose-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <i class="fas fa-rotate mr-1 animate-spin-slow"></i> SPIN 슬롯 머신 구동하기
              </button>
            </div>
          </div>

        </div>

        <!-- 오른쪽: 여행 정밀 지도 정보 -->
        <div class="bg-[#101626] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
          
          <!-- 미진행 대기 상태 -->
          <div v-if="!selectedSpot" class="h-full flex flex-col items-center justify-center text-center p-4">
            <span class="text-5xl mb-4 animate-bounce">🗺️</span>
            <h4 class="text-lg font-bold text-slate-200">랜덤 여행 코스 대기 중</h4>
            <p class="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
              왼쪽 아케이드 게임기에서 조준 다트를 쏘거나 잭팟 레버를 작동시키세요! 최종 결정된 장소의 정밀 지도가 이곳에 마킹됩니다.
            </p>
          </div>

          <!-- 여행지 잭팟 매치 완료 상태 -->
          <div v-else class="h-full flex flex-col justify-between space-y-4">
            <div class="relative overflow-hidden bg-[#070b13] border border-slate-800 p-4 rounded-2xl">
              <span class="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded"
                    :class="localTourType === 'food' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'">
                {{ localTourType === 'food' ? '🍕 맛집 당첨' : '🏛️ 명소 당첨' }}
              </span>

              <span class="text-xs font-bold text-amber-400 tracking-wide font-mono">MATCHED TRIP DESTINATION</span>
              <h3 class="text-xl font-black text-white mt-1.5 flex items-center gap-1.5 font-title">
                <span>{{ selectedSpot.emoji }}</span>
                <span>{{ selectedSpot.name }}</span>
              </h3>
              <p class="text-slate-400 text-xs mt-2 leading-relaxed">
                {{ selectedSpot.desc }}
              </p>
              
              <div class="mt-3 flex flex-wrap gap-1.5">
                <span class="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
                  #{{ selectedSpot.tag }}
                </span>
                <span class="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
                  #{{ selectedSpot.subText }}
                </span>
              </div>
            </div>

            <!-- 카카오 정밀 지도 로딩 공간 -->
            <div class="space-y-1.5 flex-grow">
              <span class="text-[11px] text-slate-400 font-bold block"><i class="fas fa-map-location-dot text-indigo-400"></i> KAKAO MAP 정밀 뷰</span>
              
              <div class="relative w-full h-48 rounded-xl overflow-hidden border border-slate-800 bg-[#070b13]">
                <!-- Vue ref 기반 바인딩 지원 -->
                <div ref="mapContainer" class="w-full h-full">
                  
                  <!-- 카카오 지도 API 키 미동작 시의 우주 레이더 백업 뷰 -->
                  <div v-if="mapDemoMode" class="absolute inset-0 bg-[#070b13] p-3 flex flex-col justify-between text-center z-10 select-none">
                    <div class="text-[9px] text-amber-400 bg-amber-500/10 border border-amber-500/20 py-1 rounded-lg font-sans">
                      ⚠️ 사이트 도메인이 맞지 않거나 로컬 빌드 중일 땐 안전 가상 레이더가 작동합니다.
                    </div>
                    <div class="my-auto flex flex-col items-center justify-center">
                      <span class="text-2xl animate-pulse">🛰️</span>
                      <p class="text-xs font-bold text-slate-300 mt-1.5">위성 데이터 락온</p>
                      <p class="text-[10px] text-slate-500 font-mono">Lat {{ selectedSpot.lat }} / Lng {{ selectedSpot.lng }}</p>
                    </div>
                    <div class="text-[10px] text-teal-400 font-mono">{{ selectedSpot.name }}</div>
                  </div>

                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <button 
                @click="resetGame"
                class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition"
              >
                <i class="fas fa-undo mr-1"></i> 다시 도전
              </button>
              <button 
                @click="triggerConfetti"
                class="px-4 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition font-black text-xs"
              >
                축하 효과 🎉
              </button>
            </div>

          </div>

        </div>

      </section>

      <!-- 협업 연동 및 API 가이드라인 -->
      <section class="bg-[#101625] border border-dashed border-slate-800 p-6 rounded-3xl mt-4">
        <h4 class="text-sm font-black text-teal-400 tracking-wider flex items-center gap-1.5 uppercase mb-2">
          <i class="fas fa-code-branch"></i> Developer Vue Integration Manual (팀원 협업용 API 연동 가이드)
        </h4>
        <p class="text-xs text-slate-400 leading-relaxed mb-4">
          본 게임 컴포넌트를 조원들의 메인/커뮤니티 화면과 원활하게 합칠 때 필요한 세부 개발 지점입니다.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div class="bg-[#070b13] p-4 rounded-xl border border-slate-800/60">
            <h5 class="text-slate-200 font-bold mb-2 text-xs"><i class="fab fa-js-square text-amber-400"></i> [1] 메인 페이지 선택 테마 감지 (`Props`)</h5>
            <p class="text-[11px] text-slate-400 leading-normal font-sans">
              부모 컴포넌트(메인)에서 <code class="text-teal-400">tourType</code>을 prop으로 전달받습니다. 부모 컴포넌트에서 <code class="text-amber-400">&lt;PickView :tourType="theme" /&gt;</code> 형태로 바인딩하면, 실시간으로 해당 테마의 데이터가 세팅됩니다.
            </p>
          </div>
          <div class="bg-[#070b13] p-4 rounded-xl border border-slate-800/60">
            <h5 class="text-slate-200 font-bold mb-2 text-xs"><i class="fas fa-cloud-arrow-down text-indigo-400"></i> [2] 데이터베이스(DB) 실시간 API 주입</h5>
            <p class="text-[11px] text-slate-400 leading-normal font-sans">
              컴포넌트 스크립트 내부의 <code class="text-teal-400">foodSpots</code>와 <code class="text-indigo-400">attractionSpots</code>에 <code class="text-rose-400">onMounted</code> 생명주기 훅을 사용해 실제 서버 API에서 받은 데이터를 대입하시면 다트 및 슬롯머신이 자동 동기화됩니다.
            </p>
          </div>
        </div>
      </section>

    </main>

    <!-- 푸터 -->
    <footer class="border-t border-slate-900 bg-[#04060d] py-6 px-4 text-center text-xs text-slate-500 mt-6 rounded-2xl">
      <div class="max-w-7xl mx-auto">
        <p>&copy; 2026 오가다 전라 랜덤 여행 프로젝트 - 아케이드 게임 개발.</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import confetti from 'canvas-confetti';

// --- 1. Props 정의 ---
const props = defineProps({
  tourType: {
    type: String,
    default: 'food' // 'food' (먹거리) | 'attraction' (관광지)
  }
});

// 내부 연동을 위한 로컬 반응형 테마 데이터
const localTourType = ref(props.tourType);

// 외부 Props 추적 동기화
watch(() => props.tourType, (newVal) => {
  localTourType.value = newVal;
  resetGame();
});

const gameMode = ref('dart'); // 'dart' (다트) | 'slot' (슬롯머신)
const selectedSpot = ref(null);
const mapContainer = ref(null); // Vue 전용 DOM 레퍼런스 선언

// --- 2. [API 연동 포인트] 먹거리 / 관광지 원본 데이터셋 ---
const foodSpots = ref([
  { id: 101, name: '광주 송정 떡갈비', emoji: '🍖', region: '광주', lat: 35.1328, lng: 126.7932, gameX: 18, gameY: 25, tag: '송정리역근처', subText: '야들한식감', desc: '육즙 가득하고 부드러운 떡갈비와 뜨끈한 무제한 뼈국 국물을 무상 제공해주는 광주 송정의 전설적인 떡갈비 명소입니다.' },
  { id: 102, name: '여수 낭만 삼합', emoji: '🦑', region: '전남 여수', lat: 34.7365, lng: 127.7495, gameX: 82, gameY: 75, tag: '낭만포차거리', subText: '돌문어삼합', desc: '빨간 양념에 돌문어, 키조개 관자, 대패삼겹살, 갓김치가 어우러져 버무려진 여수 밤바다의 정취를 대변하는 낭만 음식입니다.' },
  { id: 103, name: '순천 짱뚱어탕', emoji: '🐟', region: '전남 순천', lat: 34.9301, lng: 127.5015, gameX: 65, gameY: 65, tag: '보양식탕', subText: '순천만갈대숲인근', desc: '고소하게 갈아 넣은 짱뚱어를 듬뿍 끓여내어 시원하고 걸쭉한 국물이 기가 막힌 순천만의 대표 사계절 보양 밥상입니다.' },
  { id: 104, name: '전주 한옥막걸리', emoji: '🍶', region: '전북 전주', lat: 35.8092, lng: 127.1218, gameX: 45, gameY: 15, tag: '주전자안주', subText: '끝없는안주상', desc: '주전자를 추가할 때마다 육해공 다채로운 전라도식 고퀄리티 한식 안주들이 한 상 가득 쏟아져 나오는 풍요로운 주점가입니다.' },
  { id: 105, name: '목포 낙지호롱', emoji: '🐙', region: '전남 목포', lat: 34.7992, lng: 126.4312, gameX: 22, gameY: 78, tag: '짚불향낙지', subText: '돌돌말린호롱', desc: '세발낙지를 나무 젓가락에 감고 매콤한 비법 고추장 양념을 덧발라 연탄구이로 구워 쫄깃하고 훈연 향 가득한 일품 요리입니다.' },
  { id: 106, name: '담양 대통밥', emoji: '🍜', region: '전남 담양', lat: 35.3281, lng: 126.9875, gameX: 48, gameY: 42, tag: '관방제림그늘', subText: '대나무밥상', desc: '관방제림 푸른 대나무 숲길 옆 평상에 앉아 맛보는 죽순 비빔국수와 대나무 향이 그대로 밴 대나무 밥상입니다.' },
  { id: 107, name: '나주 곰탕', emoji: '🥣', region: '전남 나주', lat: 35.0312, lng: 126.7164, gameX: 30, gameY: 52, tag: '백년가게', subText: '맑은고기국물', desc: '탁하지 않고 투명한 육수에 부드러운 양지, 사태 머리고기가 산더미처럼 썰려 나오는 담백하면서 깊은 역사와 내공의 전라 곰탕입니다.' },
  { id: 108, name: '벌교 꼬막정식', emoji: '🐚', region: '전남 보성', lat: 34.8456, lng: 127.3456, gameX: 62, gameY: 82, tag: '꼬막의고장', subText: '바다의맛', desc: '입을 딱 벌린 제철 참꼬막 숙회부터 매콤새콤 미나리를 무친 회무침, 꼬막전, 꼬막탕수까지 다채로운 벌교 바다를 한 번에 체험하는 풀코스입니다.' }
]);

const attractionSpots = ref([
  { id: 201, name: '무등산 주상절리대', emoji: '⛰️', region: '광주', lat: 35.1341, lng: 126.9890, gameX: 44, gameY: 48, tag: '서석대입석대', subText: '세계지질유산', desc: '천혜의 신비, 무등산 꼭대기에 병풍처럼 우뚝 솟은 주상절리대입니다. 도심과 멀지 않은 곳에서 웅장한 대자연의 호흡을 만끽하세요.' },
  { id: 202, name: '여수 오동도 동백섬', emoji: '🌺', region: '전남 여수', lat: 34.7441, lng: 127.7661, gameX: 85, gameY: 72, tag: '동백꽃바다길', subText: '해상데크산책', desc: '섬 전체를 수많은 동백나무가 감싸 안고 있어, 이른 봄이 되면 온 섬이 붉은 꽃망울과 푸른 남해 바다빛으로 물드는 낭만 여행지입니다.' },
  { id: 203, name: '순천만 국가정원', emoji: '🌳', region: '전남 순천', lat: 34.9300, lng: 127.5017, gameX: 66, gameY: 62, tag: '일호국가정원', subText: '꿈의다리갈대숲', desc: '대한민국 제1호 정원으로 거대한 람사르 습지와 수십만 평의 테마별 이색 조경 정원들이 평온과 힐링을 주는 세계적 생태 정원입니다.' },
  { id: 204, name: '전주 한옥 경기전', emoji: '⛩️', region: '전북 전주', lat: 35.8146, lng: 127.1526, gameX: 45, gameY: 15, tag: '태조어진안치', subText: '대나무숲포토존', desc: '조선 태조 이성계의 초상화를 모신 역사적 전당으로 고풍스러운 전통 기와 한옥들과 곧게 뻗은 대나무숲 사이 인스타 샷 명소로 유명합니다.' },
  { id: 205, name: '담양 죽녹원', emoji: '🎋', region: '전남 담양', lat: 35.3284, lng: 126.9879, gameX: 48, gameY: 42, tag: '청정대나무산소', subText: '팬더포토존', desc: '사계절 내내 울창하고 푸른 대나무 산책길을 걸으며 일상에 지쳤던 머리와 눈을 정화시키는 전라권 최고의 에코 테라피 명소입니다.' },
  { id: 206, name: '보성 녹차밭', emoji: '🍵', region: '전남 보성', lat: 34.7225, lng: 127.0817, gameX: 62, gameY: 82, tag: '초록물결다원', subText: '녹차아이스크림', desc: '산허리를 따라 기하학적으로 가꾸어진 초록색 녹차 밭 고랑들이 가슴을 탁 트이게 해주는 눈부신 영상미 속 다원 촬영지입니다.' },
  { id: 207, name: '군산 철길마을', emoji: '🛤️', region: '전북 군산', lat: 35.9806, lng: 126.7362, gameX: 20, gameY: 30, tag: '교복입고추억', subText: '달고나만들기', desc: '과거 판자촌 집들 사이로 기차가 달리던 실제 철길을 레트로한 추억의 상점가로 복원하여 부모님 세대의 향수를 즐기는 골목마을입니다.' },
  { id: 208, name: '내장산 국립공원', emoji: '🍁', region: '전북 정읍', lat: 35.5034, lng: 126.8831, gameX: 30, gameY: 40, tag: '아기단풍성지', subText: '케이블카호수', desc: '전국 8경 중 하나로 꼽히며, 특히 가을이 오면 붉디 붉은 불꽃 같은 아기 단풍잎이 우화정 호수를 에워싸 절정의 오색 빛깔 산수를 보여줍니다.' }
]);

const getActiveList = () => {
  return localTourType.value === 'food' ? foodSpots.value : attractionSpots.value;
};

const testToggleTheme = (type) => {
  localTourType.value = type;
  resetGame();
};

const setGameMode = (mode) => {
  gameMode.value = mode;
  resetGame();
};

// --- 3. [게임 1] 다트 게임 물리 로직 ---
const dartStatus = ref({
  angle: 0,
  angleDirection: 1,
  power: 0,
  powerDirection: 1,
  phase: 'aiming',
  flying: false,
  landed: false,
  currentX: 190,
  currentY: 320,
  targetX: 190,
  targetY: 150
});

let dartLoopId = null;

const getNeedleEndX = () => {
  const rad = (dartStatus.value.angle * Math.PI) / 180;
  return 190 + Math.sin(rad) * 160;
};

const getNeedleEndY = () => {
  const rad = (dartStatus.value.angle * Math.PI) / 180;
  return 320 - Math.cos(rad) * 160;
};

// 다트 등락 루프 가속화
const runDartLoop = () => {
  if (dartStatus.value.phase === 'aiming') {
    dartStatus.value.angle += dartStatus.value.angleDirection * 2.5;
    if (dartStatus.value.angle >= 60) {
      dartStatus.value.angle = 60;
      dartStatus.value.angleDirection = -1;
    } else if (dartStatus.value.angle <= -60) {
      dartStatus.value.angle = -60;
      dartStatus.value.angleDirection = 1;
    }
  } else if (dartStatus.value.phase === 'charging') {
    dartStatus.value.power += dartStatus.value.powerDirection * 3.5;
    if (dartStatus.value.power >= 100) {
      dartStatus.value.power = 100;
      dartStatus.value.powerDirection = -1;
    } else if (dartStatus.value.power <= 0) {
      dartStatus.value.power = 0;
      dartStatus.value.powerDirection = 1;
    }
  }
  dartLoopId = requestAnimationFrame(runDartLoop);
};

const getDartBtnText = () => {
  if (dartStatus.value.phase === 'aiming') return '조준 록온 (각도 고정)';
  if (dartStatus.value.phase === 'charging') return '게이지 맞춰 다트 던지기!';
  if (dartStatus.value.phase === 'flying') return '다트 날아가는 중...';
  return '다시 던지기';
};

const getDartBtnIcon = () => {
  if (dartStatus.value.phase === 'aiming') return 'fa-location-arrow';
  if (dartStatus.value.phase === 'charging') return 'fa-bolt-lightning';
  return 'fa-circle-notch fa-spin';
};

const getDartBtnClass = () => {
  if (dartStatus.value.phase === 'aiming') return 'bg-amber-400 hover:bg-amber-300';
  if (dartStatus.value.phase === 'charging') return 'bg-rose-500 hover:bg-rose-400 text-white animate-pulse';
  return 'bg-slate-800 text-slate-500 cursor-not-allowed';
};

const handleDartTrigger = () => {
  if (dartStatus.value.phase === 'aiming') {
    dartStatus.value.phase = 'charging';
  } else if (dartStatus.value.phase === 'charging') {
    dartStatus.value.phase = 'flying';
    dartStatus.value.flying = true;
    
    const rad = (dartStatus.value.angle * Math.PI) / 180;
    const distance = 50 + (dartStatus.value.power / 100) * 230; 
    
    const targetX = 190 + Math.sin(rad) * distance;
    const targetY = 320 - Math.cos(rad) * distance;
    
    dartStatus.value.targetX = Math.max(20, Math.min(360, targetX));
    dartStatus.value.targetY = Math.max(20, Math.min(320, targetY));

    let frame = 0;
    const totalFrames = 25;
    const animateDart = () => {
      frame++;
      const t = frame / totalFrames;
      dartStatus.value.currentX = 190 + (dartStatus.value.targetX - 190) * t;
      dartStatus.value.currentY = 320 + (dartStatus.value.targetY - 320) * t;

      if (frame < totalFrames) {
        requestAnimationFrame(animateDart);
      } else {
        dartStatus.value.flying = false;
        dartStatus.value.landed = true;
        dartStatus.value.phase = 'landed';
        if (dartLoopId) cancelAnimationFrame(dartLoopId);
        
        resolveGameOutcome(dartStatus.value.targetX, dartStatus.value.targetY);
      }
    };
    requestAnimationFrame(animateDart);
  }
};

// --- 4. [게임 2] 슬롯머신 로직 ---
const slotStatus = ref({
  spinning: false,
  leverActive: false,
  reel1: '🎰',
  reel2: '⭐',
  reel3: 'JACKPOT'
});

const pullLeverStart = () => {
  if (slotStatus.value.spinning) return;
  slotStatus.value.leverActive = true;
  
  setTimeout(() => {
    slotStatus.value.leverActive = false;
    triggerSlotSpin();
  }, 250);
};

const triggerSlotSpin = () => {
  if (slotStatus.value.spinning) return;
  slotStatus.value.spinning = true;
  selectedSpot.value = null;

  const list = getActiveList();
  const winningSpot = list[Math.floor(Math.random() * list.length)];

  const dummyRegions = ['광주', '전남 여수', '전남 순천', '전북 전주', '전남 목포', '전남 담양', '전남 나주', '전남 보성'];
  const dummyEmojis = ['🍕', '🏛️', '☕', '🍗', '🏔️', '🌳', '🌺', '🍜'];
  const dummyNames = ['떡갈비 골목', '순천 국가정원', '한옥 경기전', '대통 가마솥', '꼬막 웰빙', '경암 철길', '내장 단풍'];

  let tickCount = 0;
  const spinInterval = setInterval(() => {
    tickCount++;
    
    slotStatus.value.reel1 = dummyRegions[Math.floor(Math.random() * dummyRegions.length)];
    slotStatus.value.reel2 = dummyEmojis[Math.floor(Math.random() * dummyEmojis.length)];
    slotStatus.value.reel3 = dummyNames[Math.floor(Math.random() * dummyNames.length)];

    if (tickCount > 25) {
      clearInterval(spinInterval);
      
      slotStatus.value.reel1 = winningSpot.region;
      slotStatus.value.reel2 = winningSpot.emoji;
      slotStatus.value.reel3 = winningSpot.name.split(' ').slice(-2).join(' '); 
      
      slotStatus.value.spinning = false;
      selectedSpot.value = winningSpot;
      triggerSuccessResult();
    }
  }, 80);
};

// --- 5. 카카오 맵 API 실시간 연동 및 가상 레이더 바인딩 ---
const mapDemoMode = ref(true);
const kakaoMapInstance = ref(null);
const mapMarker = ref(null);

const initKakaoMapInstance = () => {
  if (!mapContainer.value || !selectedSpot.value) return;

  // index.html에 추가된 kakao global SDK가 마운트 상태인지 확인
  if (typeof window.kakao !== 'undefined' && window.kakao.maps) {
    mapDemoMode.value = false;
    
    const spotCoords = new window.kakao.maps.LatLng(selectedSpot.value.lat, selectedSpot.value.lng);
    
    if (!kakaoMapInstance.value) {
      const options = {
        center: spotCoords,
        level: 5
      };
      kakaoMapInstance.value = new window.kakao.maps.Map(mapContainer.value, options);
    } else {
      kakaoMapInstance.value.setCenter(spotCoords);
      kakaoMapInstance.value.setLevel(5);
    }

    // 마커 스포일러 방지 클리어 작업 및 재생성
    if (mapMarker.value) {
      mapMarker.value.setMap(null);
    }

    mapMarker.value = new window.kakao.maps.Marker({
      position: spotCoords,
      map: kakaoMapInstance.value
    });

    const iwContent = `<div style="padding:6px; color:#1e293b; font-size:11px; font-weight:bold; text-align:center; min-width:140px;">🎯 ${selectedSpot.value.name}</div>`;
    const infowindow = new window.kakao.maps.InfoWindow({
      content: iwContent
    });
    infowindow.open(kakaoMapInstance.value, mapMarker.value);

  } else {
    mapDemoMode.value = true;
  }
};

const resolveGameOutcome = (screenX, screenY) => {
  const relativeX = (screenX / 380) * 100;
  const relativeY = (screenY / 340) * 100;

  let minDistance = Infinity;
  let closestSpot = null;

  getActiveList().forEach((spot) => {
    const dx = spot.gameX - relativeX;
    const dy = spot.gameY - relativeY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < minDistance) {
      minDistance = distance;
      closestSpot = spot;
    }
  });

  selectedSpot.value = closestSpot;
  triggerSuccessResult();
};

const triggerSuccessResult = () => {
  triggerConfetti();
  nextTick(() => {
    initKakaoMapInstance();
  });
};

const triggerConfetti = () => {
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.65 },
    colors: ['#2dd4bf', '#fb7185', '#fbbf24', '#38bdf8']
  });
};

const resetGame = () => {
  selectedSpot.value = null;
  dartStatus.value = {
    angle: 0,
    angleDirection: 1,
    power: 0,
    powerDirection: 1,
    phase: 'aiming',
    flying: false,
    landed: false,
    currentX: 190,
    currentY: 320,
    targetX: 190,
    targetY: 150
  };
  if (gameMode.value === 'dart') {
    if (dartLoopId) cancelAnimationFrame(dartLoopId);
    runDartLoop();
  } else {
    slotStatus.value = {
      spinning: false,
      leverActive: false,
      reel1: '🎰',
      reel2: '⭐',
      reel3: 'JACKPOT'
    };
  }
};

onMounted(() => {
  runDartLoop();
});
</script>

<style scoped>
@keyframes slot-scroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
.slot-spinning {
  animation: slot-scroll 0.12s infinite linear;
}

.lever-handle {
  transform-origin: bottom center;
  transition: transform 0.15s ease-out;
}
.lever-pulled {
  transform: rotateX(60deg) scaleY(0.4) translateY(10px);
}

@keyframes neon-glow {
  0%, 100% { filter: drop-shadow(0 0 2px #ef4444) drop-shadow(0 0 8px #ef4444); }
  50% { filter: drop-shadow(0 0 5px #f59e0b) drop-shadow(0 0 15px #f59e0b); }
}
.jackpot-neon {
  animation: neon-glow 1.5s infinite alternate;
}

@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 20s infinite linear;
}

.font-title {
  font-family: 'Black Han Sans', sans-serif;
}
</style>