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
      today: 4,
      week: 14,
      month: 33,
      lastStudyDate: "2025-08-18",
      message: "単語帳の作成を頑張っています！",
      studyLogs: [
        { date: "2025-08-18", hours: 3, topic: "英単語" },
        { date: "2025-08-17", hours: 2, topic: "文法" },
      ],
      profile: {
        name: "やす",
        goal: "成果物の完成を目指しています",
        favoriteSubject: "web開発",
      },
    },
    nakasone: {
      name: "なかそね",
      today: 5,
      week: 15,
      month: 34,
      lastStudyDate: "2025-08-18",
      message: "単語帳の作成を頑張っています！",
      studyLogs: [
        { date: "2025-08-18", hours: 3, topic: "英単語" },
        { date: "2025-08-17", hours: 2, topic: "文法" },
      ],
      profile: {
        name: "なかそね",
        goal: "成果物の完成を目指しています",
        favoriteSubject: "web開発",
      },
    },
    bokutti: {
      name: "ぼくっち",
      today: 0,
      week: 0,
      month: 0,
      lastStudyDate: "2025-08-18",
      message: "単語帳の作成を頑張っています！",
      profile: {
        name: "ぼくっち",
        goal: "TOEICのスコアアップを目指しています",
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
