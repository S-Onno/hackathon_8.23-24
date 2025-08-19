'use client';

type Friend = {
  name: string;
  today: number;
  week: number;
  month: number;
};

const friends: Friend[] = [
  {
    name: "やす",
    today: 3,
    week: 21,
    month: 85,
  },
  {
    name: "なかそね",
    today: 4,
    week: 18,
    month: 68,
  },
  {
    name: "たるたる",
    today: 3,
    week: 16,
    month: 62,
  },
  {
    name: "ぼくっち",
    today: 5,
    week: 19,
    month: 75,
  },
  {
    name: "test01",
    today: 1,
    week: 11,
    month: 51,
  },
  {
    name: "test02",
    today: 2,
    week: 12,
    month: 52,
  },
  {
    name: "test03",
    today: 3,
    week: 13,
    month: 53,
  },
  {
    name: "test04",
    today: 4,
    week: 14,
    month: 54,
  },
  {
    name: "test05",
    today: 5,
    week: 15,
    month: 55,
  },
];

export default function FriendCardList() {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      {friends.map((friend, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 w-72 text-center space-y-2"
        >
          <img

            src="../_images/earth.png" alt="Earth"
            className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-500"
          />
          <h2 className="text-xl font-bold text-indigo-700">{friend.name}</h2>
          <p className="text-sm text-gray-700">今日の学習: {friend.today}時間</p>
          <p className="text-sm text-gray-700">今週の学習: {friend.week}時間</p>
          <p className="text-sm text-gray-700">今月の学習: {friend.month}時間</p>
        </div>
      ))}
    </div>
  );
}