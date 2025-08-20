import { NextRequest } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const mockData = {
    tarutaru: {
      name: "たるたる",
      today: 3,
      week: 13,
      month: 32,
      lastStudyDate: "2025-08-18",
      message: "単語帳の作成を頑張っています！",
      studyLogs: [
        { date: "2025-08-18", hours: 3, topic: "英単語" },
        { date: "2025-08-17", hours: 2, topic: "文法" },
      ],
      profile: {
        name: "たるたる",
        goal: "成果物の完成を目指しています",
        favoriteSubject: "web開発",
      },
    },
    yasu: {
      name: "やす",
      today: 2,
      week: 10,
      month: 25,
      lastStudyDate: "2025-08-17",
      message: "mypageの作成に進めています",
      studyLogs: [
        { date: "2025-08-17", hours: 2, topic: "Next.jS" },
        { date: "2025-08-16", hours: 1, topic: "Linuc" },
      ],
      profile: {
        name: "やす",
        goal: "成果物の完成を目指しています",
        { date: "2025-08-17", hours: 2, topic: "Next.js" },
        { date: "2025-08-16", hours: 1, topic: "Linuc" },
      ],
      profile: {
        name: "やす",
        goal: "成果物の完成を目指しています",
        favoriteSubject: "Next.js",
      },
    },
    nakasone: {
      name: "なかそね",
      today: 1,
      week: 5,
      month: 15,
      lastStudyDate: "2025-08-16",
      message: "歴史の勉強をしています！",
      studyLogs: [
        { date: "2025-08-16", hours: 1, topic: "Next.js" },
        { date: "2025-08-15", hours: 2, topic: "Linuc" },
      ],
      profile: {
        name: "なかそね",
        goal: "成果物の完成を目指しています",
        favoriteSubject: "Next.js",
      },
    },
    bokutti: {
      name: "ぼくっち",
      today: 0,
      week: 0,
      month: 0,
      lastStudyDate: "",
      message: "最近は忙しくて勉強できていません。",
      studyLogs: [],
      profile: {
        name: "ぼくっち",
        goal: "TOEIC 800点以上",
        favoriteSubject: "英語",
      },
    },
  };

  const result = mockData[params.id] || {
    name: '不明',
    today: 0,
    week: 0,
    month: 0,
    lastStudyDate: '',
    message: '',
    studyLogs: [],
    profile: {
      name: '不明',
      goal: '',
      favoriteSubject: '',
    },
  };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}