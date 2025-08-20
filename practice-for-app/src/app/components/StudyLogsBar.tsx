type Log = {
  date: string;
  hours: number;
  topic: string;
};

type Props = {
  logs: Log[];
};

export default function StudyLogsBar({ logs }: Props) {
  return (
    <div className="w-full bg-indigo-700 text-white py-4 px-6 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-semibold mb-4 text-center">学習記録</h2>
      <div className="flex flex-wrap justify-start gap-6">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex-1 min-w-[140px] bg-indigo-900 rounded-md p-4 text-sm text-center shadow-sm"
          >
            <p className="text-gray-300">{log.date}</p>
            <p className="font-bold">{log.hours}時間</p>
            <p className="text-indigo-200">{log.topic}</p>
          </div>
        ))}
      </div>
    </div>
  );
}