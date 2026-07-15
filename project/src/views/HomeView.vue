<template>
  <div class="min-h-screen text-white flex flex-col justify-between p-3 sm:p-5 md:p-8">

    <div class="max-w-7xl w-full mx-auto bg-[#090b0e] border border-gray-800/60 rounded-[36px] p-5 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[85vh]">
        
        <!-- Subtle Grid Pattern in background -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>
        
        <header class="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-800/50 mb-6 z-10">
            <div class="flex items-center space-x-3 cursor-pointer" onclick="resetFilters()">
                <div class="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-black font-black shadow-lg shadow-yellow-400/20">
                    <i class="fa-solid fa-compass-drafting text-lg"></i>
                </div>
                <span class="text-xl font-black tracking-tight uppercase text-white">Namdo<span class="text-yellow-400">rang</span></span>
            </div>
            
            <nav class="flex items-center gap-6 text-xs font-semibold text-gray-400 tracking-wider">
                <span class="text-yellow-400 font-extrabold uppercase bg-yellow-400/10 px-3 py-1.5 rounded-md border border-yellow-400/20">광주·전라 여행지 랜덤 룰렛</span>
                <span class="text-gray-800 hidden sm:inline">|</span>
                <button onclick="showInstructions()" class="hover:text-white transition uppercase flex items-center gap-1.5">
                    <i class="fa-regular fa-lightbulb text-yellow-400 animate-pulse"></i> 사용 가이드
                </button>
            </nav>
        </header>

        <!-- SCREEN 1: Home View containing beautiful Bento filters and direct launcher -->
        <div id="home-screen" class="screen-fade grid grid-cols-1 md:grid-cols-12 gap-5 z-10">
            
            <!-- CARD 1 (Top Hero: Bright Golden Yellow Card containing Big chunky filters) -->
            <div class="md:col-span-12 lg:col-span-12 bg-yellow-400 rounded-[32px] p-6 md:p-8 text-[#090b0e] relative overflow-hidden flex flex-col justify-between min-h-[460px] md:min-h-[480px] shadow-lg">
                
                <!-- TOP ROW: Headings (left) + Direct Lucky Launcher (right), matched heights -->
                <div class="flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-8">

                    <!-- Text Headings (Instagram-style cozy tone) -->
                    <div class="space-y-3 flex-1 min-w-0">
                        <span class="text-[10px] font-black tracking-widest uppercase bg-[#090b0e] text-yellow-400 px-3.5 py-1.5 rounded-lg inline-block">
                            PUBLIC DATA x BENEFIT AUTOMAPPING
                        </span>
                        <h1 class="text-3xl md:text-5xl font-black tracking-tighter leading-[1.05] mt-1 text-[#090b0e]">
                            예상 밖의 여행,<br>기대 이상의 혜택.
                        </h1>
                        <p class="text-xs md:text-sm font-semibold opacity-90 leading-relaxed max-w-md">
                             여행 계획 세우려 몇 시간째 블로그, 인스타만 보고 계신가요? 광고와 바이럴에 지친 검색은 이제 그만! 오늘은 고민 대신, 오늘은 한 번 뽑아보세요!  카테고리만 선택하면 광주·전라의 숨겨진 찐 가성비 스팟과 지자체 꿀할인 혜택을 운명처럼 매핑해 드릴게요! 🗺️💛
                        </p>
                    </div>

                    <!-- Direct Lucky Launcher filling the top-right space -->
                    <div class="w-full lg:w-[340px] lg:flex-shrink-0 flex flex-col justify-between bg-[#11141b] border border-gray-800/80 rounded-[28px] p-6 shadow-xl relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-1.5 h-full bg-yellow-400"></div>

                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-black">SPIN CONTROLLER</span>
                            <span id="spot-counter-badge" class="px-2.5 py-1 bg-yellow-400/10 text-yellow-400 text-[10px] font-black rounded-md border border-yellow-400/20">
                                00 THEMES ACTIVE
                            </span>
                        </div>

                        <div class="my-5">
                            <h3 class="text-lg font-extrabold text-white leading-snug">
                                필터링 조건 선택 완료!
                            </h3>
                            <p class="text-xs text-gray-400 mt-1.5 leading-relaxed">
                                설정된 필터 조건에 부합하는 공간을 공공데이터셋에서 무작위 추출하고 <b class="text-gray-200">지자체별 할인 혜택을 즉시 자동 매핑</b>합니다.
                            </p>
                        </div>

                        <button onclick="goToPickView()" class="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl shadow-yellow-400/10">
                            <span>오늘의 여행 뽑기</span>
                            <i class="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    </div>
                </div>

                <!-- OVERSIZED CHUNKY THEME FILTERS -->
                <div class="mt-8 space-y-3.5 z-10">
                    <div class="text-[11px] font-black uppercase tracking-widest text-[#090b0e] flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-[#090b0e]"></span> 원하는 여행 카테고리를 눌러 필터를 세팅해 보세요 (중복 가능)
                    </div>
                    
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button id="btn-cat-관광지" onclick="toggleCategory('관광지')" class="group relative py-4 px-4 rounded-2xl border-2 border-[#090b0e]/15 bg-white text-left transition-all duration-300 shadow-md flex flex-col justify-between min-h-[115px]">
                            <div class="flex items-center justify-between w-full">
                                <span class="w-8 h-8 rounded-xl bg-[#090b0e] text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-map-location-dot"></i>
                                </span>
                                <i id="dot-관광지" class="fa-solid fa-circle-check text-xs text-transparent transition-colors"></i>
                            </div>
                            <div class="mt-3">
                                <div class="cat-title text-sm font-black text-[#090b0e] tracking-tight transition-colors">관광지</div>
                                <div class="cat-desc text-[10px] text-gray-700 font-medium mt-0.5 opacity-80 transition-colors">경치·공원·자연 명소</div>
                            </div>
                        </button>

                        <button id="btn-cat-문화시설" onclick="toggleCategory('문화시설')" class="group relative py-4 px-4 rounded-2xl border-2 border-[#090b0e]/15 bg-white text-left transition-all duration-300 shadow-md flex flex-col justify-between min-h-[115px]">
                            <div class="flex items-center justify-between w-full">
                                <span class="w-8 h-8 rounded-xl bg-[#090b0e] text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-building-columns"></i>
                                </span>
                                <i id="dot-문화시설" class="fa-solid fa-circle-check text-xs text-transparent transition-colors"></i>
                            </div>
                            <div class="mt-3">
                                <div class="cat-title text-sm font-black text-[#090b0e] tracking-tight transition-colors">문화시설</div>
                                <div class="cat-desc text-[10px] text-gray-700 font-medium mt-0.5 opacity-80 transition-colors">미술관·박물관·체험관</div>
                            </div>
                        </button>

                        <button id="btn-cat-축제공연행사" onclick="toggleCategory('축제공연행사')" class="group relative py-4 px-4 rounded-2xl border-2 border-[#090b0e]/15 bg-white text-left transition-all duration-300 shadow-md flex flex-col justify-between min-h-[115px]">
                            <div class="flex items-center justify-between w-full">
                                <span class="w-8 h-8 rounded-xl bg-[#090b0e] text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-masks-theater"></i>
                                </span>
                                <i id="dot-축제공연행사" class="fa-solid fa-circle-check text-xs text-transparent transition-colors"></i>
                            </div>
                            <div class="mt-3">
                                <div class="cat-title text-sm font-black text-[#090b0e] tracking-tight transition-colors">축제공연행사</div>
                                <div class="cat-desc text-[10px] text-gray-700 font-medium mt-0.5 opacity-80 transition-colors">축제·야시장·박람회</div>
                            </div>
                        </button>

                        <button id="btn-cat-여행코스" onclick="toggleCategory('여행코스')" class="group relative py-4 px-4 rounded-2xl border-2 border-[#090b0e]/15 bg-white text-left transition-all duration-300 shadow-md flex flex-col justify-between min-h-[115px]">
                            <div class="flex items-center justify-between w-full">
                                <span class="w-8 h-8 rounded-xl bg-[#090b0e] text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-route"></i>
                                </span>
                                <i id="dot-여행코스" class="fa-solid fa-circle-check text-xs text-transparent transition-colors"></i>
                            </div>
                            <div class="mt-3">
                                <div class="cat-title text-sm font-black text-[#090b0e] tracking-tight transition-colors">여행코스</div>
                                <div class="cat-desc text-[10px] text-gray-700 font-medium mt-0.5 opacity-80 transition-colors">역사순례·1박2일코스</div>
                            </div>
                        </button>

                        <button id="btn-cat-레포츠" onclick="toggleCategory('레포츠')" class="group relative py-4 px-4 rounded-2xl border-2 border-[#090b0e]/15 bg-white text-left transition-all duration-300 shadow-md flex flex-col justify-between min-h-[115px]">
                            <div class="flex items-center justify-between w-full">
                                <span class="w-8 h-8 rounded-xl bg-[#090b0e] text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-person-snowboarding"></i>
                                </span>
                                <i id="dot-레포츠" class="fa-solid fa-circle-check text-xs text-transparent transition-colors"></i>
                            </div>
                            <div class="mt-3">
                                <div class="cat-title text-sm font-black text-[#090b0e] tracking-tight transition-colors">레포츠</div>
                                <div class="cat-desc text-[10px] text-gray-700 font-medium mt-0.5 opacity-80 transition-colors">레저·야영장·짚트랙</div>
                            </div>
                        </button>

                        <button id="btn-cat-숙박" onclick="toggleCategory('숙박')" class="group relative py-4 px-4 rounded-2xl border-2 border-[#090b0e]/15 bg-white text-left transition-all duration-300 shadow-md flex flex-col justify-between min-h-[115px]">
                            <div class="flex items-center justify-between w-full">
                                <span class="w-8 h-8 rounded-xl bg-[#090b0e] text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-hotel"></i>
                                </span>
                                <i id="dot-숙박" class="fa-solid fa-circle-check text-xs text-transparent transition-colors"></i>
                            </div>
                            <div class="mt-3">
                                <div class="cat-title text-sm font-black text-[#090b0e] tracking-tight transition-colors">숙박</div>
                                <div class="cat-desc text-[10px] text-gray-700 font-medium mt-0.5 opacity-80 transition-colors">게하·한옥체험·호텔</div>
                            </div>
                        </button>

                        <button id="btn-cat-쇼핑" onclick="toggleCategory('쇼핑')" class="group relative py-4 px-4 rounded-2xl border-2 border-[#090b0e]/15 bg-white text-left transition-all duration-300 shadow-md flex flex-col justify-between min-h-[115px]">
                            <div class="flex items-center justify-between w-full">
                                <span class="w-8 h-8 rounded-xl bg-[#090b0e] text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-bag-shopping"></i>
                                </span>
                                <i id="dot-쇼핑" class="fa-solid fa-circle-check text-xs text-transparent transition-colors"></i>
                            </div>
                            <div class="mt-3">
                                <div class="cat-title text-sm font-black text-[#090b0e] tracking-tight transition-colors">쇼핑</div>
                                <div class="cat-desc text-[10px] text-gray-700 font-medium mt-0.5 opacity-80 transition-colors">전통오일장·특산품점</div>
                            </div>
                        </button>

                        <button id="btn-cat-음식점" onclick="toggleCategory('음식점')" class="group relative py-4 px-4 rounded-2xl border-2 border-[#090b0e]/15 bg-white text-left transition-all duration-300 shadow-md flex flex-col justify-between min-h-[115px]">
                            <div class="flex items-center justify-between w-full">
                                <span class="w-8 h-8 rounded-xl bg-[#090b0e] text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                                    <i class="fa-solid fa-utensils"></i>
                                </span>
                                <i id="dot-음식점" class="fa-solid fa-circle-check text-xs text-transparent transition-colors"></i>
                            </div>
                            <div class="mt-3">
                                <div class="cat-title text-sm font-black text-[#090b0e] tracking-tight transition-colors">음식점</div>
                                <div class="cat-desc text-[10px] text-gray-700 font-medium mt-0.5 opacity-80 transition-colors">로컬맛집·한정식·카페</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- CARD 2 (Left Lower: Sand Beige Bento Card - Inspired by METLY aesthetics) -->
            <div class="md:col-span-12 lg:col-span-12 bg-[#eddccb] rounded-[32px] p-6 md:p-8 text-[#090b0e] shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
                
                <div class="space-y-4 z-10">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-black tracking-widest uppercase bg-[#090b0e] text-[#eddccb] px-3.5 py-1.5 rounded-lg">
                            WHY NAMDORANG?
                        </span>
                        <!-- Overlapping avatar bubbles like METLY beige card -->
                        <div class="flex items-center -space-x-2.5">
                            <div class="w-7 h-7 rounded-full border border-[#eddccb] bg-[#090b0e] text-[9px] text-white flex items-center justify-center font-black">
                                <i class="fa-solid fa-user-astronaut"></i>
                            </div>
                            <div class="w-7 h-7 rounded-full border border-[#eddccb] bg-[#090b0e] text-[9px] text-white flex items-center justify-center font-black">
                                <i class="fa-solid fa-user-ninja"></i>
                            </div>
                            <div class="w-7 h-7 rounded-full border border-[#eddccb] bg-[#090b0e] text-[9px] text-white flex items-center justify-center font-black">
                                <i class="fa-solid fa-plus text-[7px]"></i>
                            </div>
                        </div>
                    </div>

                    <h3 class="text-xl md:text-2xl font-black text-[#090b0e] tracking-tight">혹시 다음 중 한 분이신가요? 🙋‍♀️</h3>

                    <!-- Target user grids with elegant icons -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <!-- Point 1 -->
                        <div class="bg-white/45 p-4 rounded-2xl border border-[#090b0e]/5 space-y-2 hover:bg-white/70 transition-all duration-300">
                            <div class="w-8 h-8 rounded-xl bg-[#090b0e] text-[#eddccb] flex items-center justify-center text-xs">
                                <i class="fa-solid fa-rectangle-ad text-yellow-400"></i>
                            </div>
                            <h4 class="text-xs font-extrabold text-[#090b0e] tracking-tight">광고성 글 그만 보고싶어 🙅‍♀️</h4>
                            <p class="text-[11px] text-[#090b0e]/80 leading-relaxed font-semibold">
                                협찬과 광고로 가득 찬 거짓 상업용 맛집 후기에 지치셨나요? 100% 정제된 찐 로컬 데이터를 기반으로, 커뮤니티에 남긴 실제 방문자의 솔직한 후기까지!
                            </p>
                        </div>
                        <!-- Point 2 -->
                        <div class="bg-white/45 p-4 rounded-2xl border border-[#090b0e]/5 space-y-2 hover:bg-white/70 transition-all duration-300">
                            <div class="w-8 h-8 rounded-xl bg-[#090b0e] text-[#eddccb] flex items-center justify-center text-xs">
                                <i class="fa-solid fa-umbrella-beach"></i>
                            </div>
                            <h4 class="text-xs font-extrabold text-[#090b0e] tracking-tight"> 결정장애 타파, 무계획 즉흥 로망러 🎒</h4>
                            <p class="text-[11px] text-[#090b0e]/80 leading-relaxed font-semibold">
                                "계획은 귀찮아, 하지만 이번 주말엔 당장 떠날래!" 결정 장애를 날리는 설레는 우연을 선택받고 싶을 때!
                            </p>
                        </div>
                        <!-- Point 3 -->
                        <div class="bg-white/45 p-4 rounded-2xl border border-[#090b0e]/5 space-y-2 hover:bg-white/70 transition-all duration-300">
                            <div class="w-8 h-8 rounded-xl bg-[#090b0e] text-[#eddccb] flex items-center justify-center text-xs">
                                <i class="fa-solid fa-map-pin"></i>
                            </div>
                            <h4 class="text-xs font-extrabold text-[#090b0e] tracking-tight">가성비 사냥꾼 💸</h4>
                            <p class="text-[11px] text-[#090b0e]/80 leading-relaxed font-semibold">
                                디지털 관광주민증, 전남 사랑애 서포터즈, 코레일 50% 할인까지! 묻혀 있던 할인 꿀팁을 따로 찾아보지 않아도 자동으로 연결해드려요!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>


        <!-- Instructions Modal -->
        <div id="instructions-modal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
            <div class="bg-[#11141b] border border-gray-800 rounded-[32px] max-w-lg w-full p-6 md:p-8 space-y-5 relative">
                <button onclick="closeInstructions()" class="absolute right-6 top-6 w-8 h-8 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-800/80 flex items-center justify-center text-gray-400 transition">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
                <div class="space-y-2">
                    <span class="text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-black">namdorang system guide</span>
                    <h2 class="text-xl font-black text-white">남도랑을 알차게 100% 즐기는 법! 🗺️</h2>
                </div>
                <div class="text-xs text-gray-300 space-y-3 leading-relaxed font-light">
                    <p><b>1. 카테고리 필터 세팅</b><br>홈 화면 옐로우 카드 안에 큼직하게 준비된 8가지 테마를 클릭해보세요! 중복 선택도 당연히 가능하답니다.</p>
                    <p><b>2. 여행 룰렛 가동 ☄️</b><br>'오늘의 여행 뽑기' 버튼을 누르면 광고 제로의 명소 중 하나를 랜덤으로 1초 만에 여러분의 고민을 해결해 드려요.</p>
                    <p><b>3. 정책 바우처 원스톱 연동</b><br>선택된 행선지의 주소 코드를 실시간 식별해서 2.4%밖에 사용되지 않던 아까운 정부 꿀할인 쿠폰(디지털 관광주민증, 전남 사랑애 서포터즈 가맹점, 코레일 50%)을 똑똑하게 화면에 자동 연동해 드립니다.</p>
                    <p><b>4. AI 동선 탐색 & 한줄평 공유</b><br>AI 챗봇 비서에게 이 장소의 여러 정보를 물어보고, 회원가입 없이 익명으로 찐 방문평도 남겨보세요!</p>
                </div>
                <button onclick="closeInstructions()" class="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3.5 rounded-xl font-black text-xs transition duration-300">
                    꿀혜택 탐정단 시작하기!
                </button>
            </div>
        </div>

        <!-- Custom Toast Notifications replacement for Alert -->
        <div id="custom-toast" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#151922] border border-yellow-400/30 text-yellow-400 px-5 py-3 rounded-full text-xs font-semibold shadow-2xl pointer-events-none opacity-0 transition-opacity duration-300 flex items-center gap-2">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span id="toast-text">카테고리 필터가 정상 조율되었습니다!</span>
        </div>

        <!-- Footer containing copyrights -->
        <footer class="mt-8 pt-6 border-t border-gray-800/40 text-center text-[10px] text-gray-500 tracking-wide z-10 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>© 2026 NAMDORANG PLATFORM. PUBLIC TOUR DATA & BENEFITS AUTOMAPPER.</span>
            <span class="flex gap-4">
                <a href="#" onclick="showInstructions()" class="hover:text-yellow-400 transition">시스템 안내서</a>
                <span>·</span>
                <a href="https://blog.opensurvey.co.kr/article/xm-travel-industry/" target="_blank" rel="noopener noreferrer" class="hover:text-yellow-400 transition">오픈서베이 통계자료</a>
            </span>
        </footer>

    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { usePickedStore } from '../stores/picked';

export default {
    name: 'NamdorangHome',
    data() {
        return {
            // 💡 복잡한 장소 데이터는 지우고, 내가 선택한 카테고리들을 담을 배열만 남깁니다.
            activeCategories: [],
            router: null
        }
    },
    methods: {
        // 카테고리 카드 클릭 시 선택/해제 토글 로직
        toggleCategory(cat) {
            const btn = document.getElementById(`btn-cat-${cat}`);
            const dot = document.getElementById(`dot-${cat}`);

            // 💡 텍스트 색상 제어를 위해 버튼 내부의 타이틀과 설명 엘리먼트를 가져옵니다.
            const title = btn ? btn.querySelector('.cat-title') : null;
            const desc = btn ? btn.querySelector('.cat-desc') : null;

            if (this.activeCategories.includes(cat)) {
                this.activeCategories = this.activeCategories.filter(item => item !== cat);
                // 비활성화 상태: 배경 흰색 / 글자 검은색 회귀
                if (btn) btn.classList.remove('bg-gray-900', 'text-white', 'border-yellow-400');
                if (btn) btn.classList.add('bg-white', 'text-[#090b0e]', 'border-[#090b0e]/15');
                if (title) title.classList.replace('text-white', 'text-[#090b0e]');
                if (desc) desc.classList.replace('text-gray-300', 'text-gray-700');
                if (dot) dot.classList.remove('text-[#38bdf8]');
                if (dot) dot.classList.add('text-transparent');
            } else {
                this.activeCategories.push(cat);
                // 활성화 상태: 배경 검은색 / 글자 흰색 반전 🌟
                if (btn) btn.classList.remove('bg-white', 'text-[#090b0e]', 'border-[#090b0e]/15');
                if (btn) btn.classList.add('bg-gray-900', 'text-white', 'border-yellow-400');
                if (title) title.classList.replace('text-[#090b0e]', 'text-white');
                if (desc) desc.classList.replace('text-gray-700', 'text-gray-300');
                if (dot) dot.classList.remove('text-transparent');
                if (dot) dot.classList.add('text-[#38bdf8]');
            }
            this.updateActiveCounts();
            this.showToast(`"${cat}" 조건 조율 완료! ✨`);
        },

        // 필터 초기화 버튼 클릭 시 실행
        resetFilters() {
            this.activeCategories = [];
            const allCategories = ["관광지", "문화시설", "축제공연행사", "여행코스", "레포츠", "숙박", "쇼핑", "음식점"];
            allCategories.forEach(cat => {
                const btn = document.getElementById(`btn-cat-${cat}`);
                const title = btn ? btn.querySelector('.cat-title') : null;
                const desc = btn ? btn.querySelector('.cat-desc') : null;

                if (btn) {
                    btn.classList.remove('bg-gray-900', 'text-white', 'border-yellow-400');
                    btn.classList.add('bg-white', 'text-[#090b0e]', 'border-[#090b0e]/15');
                }
                // 초기화 시 글자색도 원상복구 🔄
                if (title) {
                    title.classList.remove('text-white');
                    title.classList.add('text-[#090b0e]');
                }
                if (desc) {
                    desc.classList.remove('text-gray-300');
                    desc.classList.add('text-gray-700');
                }
                const dot = document.getElementById(`dot-${cat}`);
                if (dot) {
                    dot.classList.remove('text-[#38bdf8]');
                    dot.classList.add('text-transparent');
                }
            });
            this.updateActiveCounts();
            this.showToast("모든 테마가 말끔하게 초기화되었어요! 🔄");
        },

        // 💡 [수정 완료] 선택된 카테고리(테마)의 개수를 실시간으로 배지에 보여줍니다.
        updateActiveCounts() {
            const count = this.activeCategories.length;
            const badge = document.getElementById('spot-counter-badge');
            if (badge) {
                // 이제 SPOTS 대신 THEMES ACTIVE 가 직관적으로 나타납니다!
                badge.innerText = `${count} THEMES ACTIVE`;
            }
        },

        // 💡 [추가 완료] "오늘의 여행 뽑기" 버튼 클릭 시 PickView로 깔끔하게 화면 이동
        goToPickView() {
            if (!this.router) return;
            const store = usePickedStore();
            store.categories = [...this.activeCategories];
            this.router.push('/pick');
        },

        showToast(text) { 
            const toast = document.getElementById('custom-toast'); 
            if (!toast) return; 
            const toastText = document.getElementById('toast-text'); 
            if (toastText) toastText.innerText = text; 
            toast.style.opacity = '1'; 
            setTimeout(() => { toast.style.opacity = '0'; }, 2500); 
        },
        showInstructions() { const modal = document.getElementById('instructions-modal'); if (modal) modal.classList.remove('hidden'); },
        closeInstructions() { const modal = document.getElementById('instructions-modal'); if (modal) modal.classList.add('hidden'); }
    },
    mounted() {
        this.router = useRouter(); // 라우터 초기화
        this.updateActiveCounts(); // 초기 배지 개수 0 THEMES ACTIVE로 세팅
        
        setTimeout(() => {
            this.showToast('남도랑에 오신 것을 환영해요! 아래 테마를 자유롭게 터치해 보세요 ✨');
        }, 600);

        // 인라인 태그나 외부 클릭 연결을 유지하기 위해 전역 바인딩 유지
        window.toggleCategory = this.toggleCategory.bind(this);
        window.resetFilters = this.resetFilters.bind(this);
        window.goToPickView = this.goToPickView.bind(this);
        window.showInstructions = this.showInstructions.bind(this);
        window.closeInstructions = this.closeInstructions.bind(this);
    }
}
</script>

<style scoped>
body { font-family: 'Inter', 'Noto Sans KR', sans-serif; background-color: #0d0f14; }
.glow-line { filter: drop-shadow(0px 4px 8px rgba(250, 204, 21, 0.4)); }
.glow-neon-yellow { text-shadow: 0 0 10px rgba(250, 204, 21, 0.6); }
@keyframes orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.orbiting-track { animation: orbit 25s linear infinite; }
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(250, 204, 21, 0.3); border-radius: 99px; }
.screen-fade { transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.screen-hidden { opacity: 0; transform: scale(0.97); pointer-events: none; position: absolute; width: 100%; }

</style>
