// src/app/api/cards/route.ts
//目的: DB スキーマ（Prisma）を定義。 要点



import { NextRequest, NextResponse } from 'next/server'; 
import prisma from '@/db/sqlite';


// GET: 一覧取得
export async function GET() {
  const cards = await prisma.word_cards.findMany({ orderBy: { createdAt: 'desc' }}); // word_cards テーブルの全件を作成日時降順に取得
  return NextResponse.json(cards);
}
/*何をしているか：
prisma.word_cards.findMany({ orderBy: { createdAt: 'desc' }}) で word_cards テーブルの全件を作成日時降順(desc)に取得し、
取得結果を NextResponse.json(cards) で JSON（HTTP 200 相当）として返しています。
*/

// POST: 新規作成
export async function POST(req: NextRequest) {
  const { question, answer } = await req.json();
  const card = await prisma.word_cards.create({ data: { question, answer } });
  return NextResponse.json(card);
}

// PUT: 編集
export async function PUT(req: NextRequest) {
  const { id, question, answer } = await req.json();
  const card = await prisma.word_cards.update({
    where: { id },
    data: { question, answer },
  });
  return NextResponse.json(card);
}

// DELETE: 削除
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.word_cards.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}