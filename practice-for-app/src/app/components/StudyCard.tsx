type Props = {
  name: string;
  today: number;
  week: number;
  month: number;
};

export default function StudyCard({ name, today, week, month }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 flex items-center gap-8 mb-4 ">
      <img src="../_images/earth.png" alt="Earth" className="w-24 h-24" />
      <div className="flex flex-col gap-1">
        <p className="font-bold text-lg text-black">{name}</p>
        <p className="text-black">今日の学習：{today}時間</p>
        <p className="text-black">今週の学習：{week}時間</p>
        <p className="text-black">今月の学習：{month}時間</p>
      </div>
    </div>
  );
}

