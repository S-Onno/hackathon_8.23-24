import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  const mockData = {
    yasu: { name: 'やす', today: 3, week: 15, month: 30 },
    nakasone: { name: 'なかそね', today: 4, week: 14, month: 31 },
    tarutaru: { name: 'たるたる', today: 3, week: 13, month: 32 },
    bokutti: { name: 'ぼくっち', today: 5, week: 15, month: 33 },
  };

  const result = mockData[id] || { name: '不明', today: 0, week: 0, month: 0 };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}