/* ──────────────────────────────────────────────────────────────
   뽑힌 장소를 사랑가게(Loveget) 할인 목록과 대조해서,
   해당되면 그 가게의 할인 쿠폰을 돌려준다.
   사용법: findStoreCoupons(place) → 쿠폰 배열 (없으면 [])
   매칭 순서: ① 이름 완전일치 → ② 이름 포함관계 → ③ 좌표 150m 이내
   ────────────────────────────────────────────────────────────── */
import couponRaw from '../../../dataset/LovegetStoreInfoList.json' // LovegetStoreInfoList.json 을 이 이름으로 저장

// 할인 1건을 화면용 모양으로 변환 (percent/amount/service 모두 처리)
function toCoupon(d) {
  const label = d.dcCondition || d.dcSub || d.couponNm || '할인 혜택'
  let badge = '서비스' // dcTy === 'service' 기본값
  if (d.dcTy === 'percent') badge = d.dcValue + '%'
  else if (d.dcTy === 'amount') badge = Number(d.dcValue).toLocaleString() + '원'
  // 부가 조건(제외 항목 등)
  const cond = [d.dcDe, d.dcSub]
    .filter((x) => x && x !== '-' && x !== d.dcCondition)
    .join(' · ')
  // 사랑가게 할인 = 전남 사랑애 서포터즈(도민증) 혜택 → 신청 링크 연결
  return { couponNm: label, badge, dcCondition: cond, link: 'https://love.jeonnam.go.kr/jns/main' }
}

// 사랑가게 목록을 매칭용으로 가공 (이름 + 좌표 + 쿠폰)
const stores = (couponRaw.body?.items || []).map((it) => ({
  name: it.storeNm || '',
  lat: parseFloat(it.lat),
  lng: parseFloat(it.lng),
  coupons: (it.discountList || []).map(toCoupon),
}))

const norm = (s = '') => s.replace(/\s+/g, '').toLowerCase()

// 두 좌표 사이 거리(m) — 하버사인
function distanceM(a, b) {
  const nums = [a.lat, a.lng, b.lat, b.lng]
  if (!nums.every(Number.isFinite)) return Infinity
  const R = 6371000
  const rad = (deg) => (deg * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function findStoreCoupons(place) {
  if (!place) return []
  const pName = norm(place.name)

  // ① 이름 완전 일치
  let match = pName && stores.find((s) => norm(s.name) === pName)

  // ② 이름 포함 관계 ("다봄" ↔ "다봄 본점")
  if (!match && pName) {
    match = stores.find((s) => {
      const n = norm(s.name)
      return n && (n.includes(pName) || pName.includes(n))
    })
  }

  // ③ 좌표 150m 이내 (이름이 조금 달라도 같은 위치면 동일 장소로 인정)
  if (!match) match = stores.find((s) => distanceM(place, s) < 150)

  return match ? match.coupons : []
}