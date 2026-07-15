export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { messages, placeName, placeAddress } = JSON.parse(event.body)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content: `당신은 광주·전라 지역 여행 도우미 챗봇입니다. 지금 사용자가 방문할 장소는 "${placeName}"(${placeAddress})입니다. 이 장소 근처의 맛집, 관광지, 교통, 주차 등 여행 관련 질문에 친절하고 간결하게 한국어로 답변해주세요.`,
        },
        ...messages,
      ],
      max_completion_tokens: 500,
    }),
  })

  const data = await response.json()
  console.log('status:', response.status, 'body:', JSON.stringify(data))

  if (!response.ok) {
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: data?.error?.message || 'OpenAI 요청 실패' }),
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply: data.choices[0].message.content }),
  }
}
