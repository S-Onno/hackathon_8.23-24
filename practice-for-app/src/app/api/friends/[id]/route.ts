import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { FriendDetails } from '@/types/friend';

const friendsById: Record<string, FriendDetails> = {
    nathalie: {
      id: 'nathalie',
      name: "なさり",
      today: 2,
      week: 10,
      month: 24,
      lastStudyDate: "2025-08-18",
      message: "Universeの改良を頑張っています！",
      studyLogs: [
        { date: "2025-08-18", hours: 3, topic: "SC+" },
        { date: "2025-08-17", hours: 2, topic: "SQlite" },
      ],
      profile: {
        name: "なさり",
        goal: "Universeの改良を頑張っています！",
        favoriteSubject: "web開発",
      },
    },
    tarutaru: {
      id: 'tarutaru',
      name: "たるたる",
      today: 3,
      week: 8,
      month: 22,
      lastStudyDate: "2025-08-18",
      message: "単語帳の作成を頑張っています！",
      studyLogs: [
        { date: "2025-08-18", hours: 1, topic: "SC+" },
        { date: "2025-08-17", hours: 2, topic: "SQlite" },
      ],
      profile: {
        name: "たるたる",
        goal: "単語帳の作成を頑張っています！",
        favoriteSubject: "web開発",
      },
    },
    yasu: {
      id: 'yasu',
      name: "やす",
      today: 4,
      week: 12,
      month: 27,
      lastStudyDate: "2025-08-18",
      message: "地動説を完成させました！",
      studyLogs: [
        { date: "2025-08-18", hours: 3, topic: "天文学" },
        { date: "2025-08-17", hours: 1, topic: "物理学" },
      ],
      profile: {
        name: "やす",
        goal: "地動説を完成させました！",
        favoriteSubject: "天文学",
      },
    },
    nakasone: {
      id: 'nakasone',
      name: "なかそね",
      today: 6,
      week: 15,
      month: 34,
      lastStudyDate: "2025-08-23",
      message: "認証機能の実装を頑張っています！",
      studyLogs: [
        { date: "2025-08-23", hours: 3, topic: "Next.js" },
        { date: "2025-08-22", hours: 2, topic: "Linuc102" },
      ],
      profile: {
        name: "なかそね",
        goal: "認証機能の実装を頑張っています！",
        favoriteSubject: "Next.js",
      },
    },
    bokutti: {
      id: 'bokutti',
      name: "ぼくっち",
      today: 0,
      week: 0,
      month: 0,
      lastStudyDate: "2025-08-17",
      message: "TOEICのスコアアップを目指しています",
      studyLogs: [],
      profile: {
        name: "ぼくっち",
        goal: "TOEICのスコアアップを目指しています",
        favoriteSubject: "英語",
      },
    },
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const friend = friendsById[id];

  if (!friend) {
    return NextResponse.json({ error: 'Friend not found' }, { status: 404 });
  }

  return NextResponse.json(friend);
}
