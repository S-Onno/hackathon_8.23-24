export default function ProfileCard() {
  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-md p-6 w-full max-w-md h-full flex flex-col justify-between">      <h2 className="text-xl font-bold mb-4">プロフィール</h2>

      <div className="flex items-start gap-4">
        {/* 地球画像 */}
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src="../_images/earth.png"
            alt="地球に戻る"
            className="w-full h-full object-cover rounded-full shadow-md"
          />
        </div>

        {/* プロフィールテキスト */}
        <div className="flex flex-col text-sm space-y-1">
          <p><span className="font-semibold">名前：</span> なさり</p>
          <p><span className="font-semibold">目標：</span> 成果物の完成を目指しています</p>
          <p><span className="font-semibold">好きな科目：</span> Web開発</p>
          <p><span className="font-semibold">最近の取り組み：</span> 単語帳の作成を頑張っています！</p>
        </div>
      </div>
    </div>
  );
}