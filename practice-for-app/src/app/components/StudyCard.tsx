type Props = {
  name: string;
  today: number;
  week: number;
  month: number;
};

export default function StudyCard({ name, today, week, month }: Props) {
  return (
    <div className="w-full bg-indigo-900 text-white py-4 px-6 rounded-lg shadow-md flex justify-around items-center mt-4">
      <div className="text-center">
        <p className="text-sm text-gray-300">今日</p>
        <p className="text-xl font-bold">{today}時間</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-300">今週</p>
        <p className="text-xl font-bold">{week}時間</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-300">今月</p>
        <p className="text-xl font-bold">{month}時間</p>
      </div>
    </div>
  );
}