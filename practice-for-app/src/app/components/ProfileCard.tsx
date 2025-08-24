'use client';
import { useState, useEffect } from 'react';

export default function ProfileCard() {
  const defaultProfile = {
    name: 'なさり',
    goal: '成果物の完成を目指しています',
    favoriteSubject: 'Web開発',
    recentEffort: '単語帳の作成を頑張っています！',
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-md p-6 w-full max-w-md h-full flex flex-col justify-between">
      <h2 className="text-xl font-bold mb-4">プロフィール</h2>

      <div className="flex items-start gap-4">
        {/* 地球画像 */}
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src="../_images/earth.png"
            alt="地球に戻る"
            className="w-full h-full object-cover rounded-full shadow-md"
          />
        </div>

        {/* プロフィール表示 or 編集フォーム */}
        <div className="flex flex-col text-sm space-y-2 flex-1">
          {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-2">
                <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="border p-1 rounded w-full"
              />
              <input
                type="text"
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                className="border p-1 rounded w-full"
              />
              <input
                type="text"
                value={profile.favoriteSubject}
                onChange={(e) => setProfile({ ...profile, favoriteSubject: e.target.value })}
                className="border p-1 rounded w-full"
              />
              <input
                type="text"
                maxLength={300}
                value={profile.recentEffort}
                onChange={(e) => setProfile({ ...profile, recentEffort: e.target.value })}
                className="border p-1 rounded w-full"
              />
              <button
                type="submit"
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                保存する
              </button>
            </form>
          ) : (
            <>
              <p><span className="font-semibold">名前：</span>{profile.name}</p>
              <p><span className="font-semibold">目標：</span>{profile.goal}</p>
              <p><span className="font-semibold">好きな科目：</span>{profile.favoriteSubject}</p>
              <p><span className="font-semibold">最近の取り組み：</span>{profile.recentEffort}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                編集する
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}