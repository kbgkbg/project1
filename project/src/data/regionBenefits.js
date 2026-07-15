/* ──────────────────────────────────────────────────────────────
   지역(시군구)별 여행 혜택 데이터 + 조회 함수
   사용법: getRegionBenefits(place.address) → 적용 가능한 혜택 배열
   주소 문자열에 시군구 이름이 들어있는지로 매칭한다.
   (예: "전남 완도군 완도읍 …" → "완도군" 포함 → 완도군 혜택 적용)
   ────────────────────────────────────────────────────────────── */

// 여행비용 50% 환급 (1인 10만원 / 2인 이상 20만원)
const TRAVEL_REFUND_REGIONS = [
  '고창군', // 전북
  '강진군', '영광군', '해남군', '고흥군', '완도군', '영암군', // 전남
]

// 숙박 금액대별 할인 (2·3·5·7만원, 여기어때 등 플랫폼에서 쿠폰 발급)
const LODGING_DISCOUNT_REGIONS = [
  // 전남
  '강진군', '고흥군', '곡성군', '구례군', '담양군', '보성군', '신안군', '영광군',
  '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군',
  // 전북
  '고창군', '김제시', '남원시', '무주군', '부안군', '순창군', '임실군', '장수군', '정읍시', '진안군',
]

// 지역별 개별 특전
const LOCAL_BENEFITS = {
  곡성군: [{ title: '곡성섬진강기차마을 20% 할인', detail: '입장권 할인' }],
  익산시: [
    {
      title: '익산 시티투어 탑승권 2천원 할인',
      detail: '토·일·공휴일 / 탑승권 수령: 익산역 관광안내소. 소지 시 보석박물관 무료입장, 계화림 20%·상상노리터 10% 할인',
    },
  ],
  임실군: [{ title: '임실N치즈 제품 지급', detail: '관내 소비 영수증 5만원 이상 인증 시' }],
  남원시: [{ title: '관광택시 1만원 추가 지원', detail: '4시간 4만원 / 6시간 6만원 / 8시간 7만원' }],
  해남군: [
    { title: '산이정원 입장권 50% 할인', detail: '' },
    { title: '명량해상케이블카 2천원 할인', detail: '입장권' },
  ],
  고흥군: [
    {
      title: '고흥사랑상품권 1인 최대 10만원 지급',
      detail: '음식점 2개소 식사 + 1박 숙박 + 증빙사진 제출 / 최대 4인 40만원',
    },
  ],
  함평군: [{ title: '함평 천지몰 2만원 쿠폰', detail: '관내 소비 3만원 이상 인증 시' }],
}

export function getRegionBenefits(address = '') {
  const benefits = []

  // 전 지역 공통 (지역사랑상품권) — 별도 신청 링크 없음
  benefits.push({ tag: '상품권', title: '지역사랑상품권 6% 할인', detail: '전 지역 공통' })

  // 코레일 지역사랑 철도여행 (관광지 방문 인증 시 열차 운임 50% 할인쿠폰)
  benefits.push({
    tag: '철도',
    title: '코레일 지역사랑 철도여행',
    detail: '관광지 방문 인증 시 이용 열차 운임의 50% 상당 할인쿠폰 증정',
    link: 'https://www.korail.com/tour/touristIntor/tourRegIntor/regionFreeTour',
  })

  // 반값 여행 (지역사랑 휴가지원) = 여행비용 50% 환급
  if (TRAVEL_REFUND_REGIONS.some((r) => address.includes(r))) {
    benefits.push({
      tag: '반값여행',
      title: '반값 여행 (지역사랑 휴가지원)',
      detail: '여행비용 50% 환급 · 1인 10만원 / 2인 이상 20만원까지',
      link: 'https://korean.visitkorea.or.kr/travelmonth/benefits/vacation-benefit.do',
    })
  }

  // 2026 여름맞이 숙박세일 페스타 = 숙박 금액대별 할인
  if (LODGING_DISCOUNT_REGIONS.some((r) => address.includes(r))) {
    benefits.push({
      tag: '숙박',
      title: '2026 여름맞이 숙박세일 페스타',
      detail: '숙박 금액대별 할인(2·3·5·7만원) · 여기어때 등 플랫폼 발급',
      link: 'https://ktostay.visitkorea.or.kr/',
    })
  }

  // 지역 특전 (개별 신청 링크 없음)
  for (const region in LOCAL_BENEFITS) {
    if (address.includes(region)) {
      const label = region.replace(/(시|군)$/, '') // '곡성군' → '곡성'
      LOCAL_BENEFITS[region].forEach((b) => benefits.push({ tag: label, ...b }))
    }
  }

  return benefits
}