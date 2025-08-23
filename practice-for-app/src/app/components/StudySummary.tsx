import Image from "next/image";

type Props = {
  today: number;
  week: number;
  month: number;
  username: string;
};

export default function StudySummary({ today, week, month, username }: Props) {
  return (
    <div className="flex items-center bg-white text-black rounded-lg p-8 shadow-md w-full max-w-md">
      {/* 地球の画像 */}
      <div className="w-28 h-28 relative mr-4">
        <img
        src="../_images/earth.png"
        alt="地球に戻る"
        className="w-30 h-30 shadow-md"
        />
      </div>

      {/* 学習時間の表示 */}
      <div>
        <h2 className="text-xl font-bold mb-4">{username}</h2>
        <p className="text-lg mb-2">今日の学習：<span className="font-semibold">{today}時間</span></p>
        <p className="text-lg mb-2">今週の学習：<span className="font-semibold">{week}時間</span></p>
        <p className="text-lg">今月の学習：<span className="font-semibold">{month}時間</span></p>
      </div>
    </div>
  );
}