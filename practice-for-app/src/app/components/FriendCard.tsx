'use client';

import Link from "next/link";

type Friend = {
  id: string;
  name: string;
  today: number;
  week: number;
  month: number;
};

const friends: Friend[] = [
  { id: 'yasu', name: "やす", today: 3, week: 21, month: 31 },
  { id: 'nakasone', name: "なかそね", today: 4, week: 18, month: 32 },
  { id: 'tarutaru', name: "たるたる", today: 3, week: 16, month: 33 },
  { id: 'bokutti', name: "ぼくっち", today: 5, week: 19, month: 34 },
];

export default function FriendCardList() {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      {friends.map((friend, index) => (
        <Link key={index} href={`/friend/${encodeURIComponent(friend.id)}`}>
          <div className="bg-white rounded-xl shadow-md p-6 w-72 text-center space-y-2 cursor-pointer transition-transform hover:scale-105">
            <img
              src="../_images/earth.png"
              alt="Earth"
              className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-500"
            />
            <h2 className="text-xl font-bold text-indigo-700 whitespace-nowrap">{friend.name}</h2>
            <p className="text-sm text-gray-700">今日の学習: {friend.today}時間</p>
            <p className="text-sm text-gray-700">今週の学習: {friend.week}時間</p>
            <p className="text-sm text-gray-700">今月の学習: {friend.month}時間</p>
          </div>
        </Link>
      ))}
    </div>
  );
}