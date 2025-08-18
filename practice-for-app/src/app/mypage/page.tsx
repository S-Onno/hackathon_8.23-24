import NavigationBar from '../components/NavigationBar';
import RadarChart from '../components/RadarChart';
import FriendCardList from '../components/FriendCard';
// import SpaceMapChart from '@/components/SpaceMapChart';
// import GoalTracker from '@/components/GoalTracker';

export default function MyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 to-black text-white px-6 py-10 pt-20 space-y-16">
      <NavigationBar />
      <h1 className="text-4xl font-bold text-center mb-8">My Page</h1>

      {/* 🌌 自分のステータス */}
      <section className="space-y-4">
        <h2 className="text-2xl text-center font-semibold text-indigo-300">自分のステータス</h2>
        <div className="flex justify-center mt-8">
          <RadarChart />
        </div>
      </section>

      {/* 🧑‍🚀 フレンドの進捗 */}
      <section className="space-y-4">
        <h2 className="text-2xl text-center font-semibold text-indigo-300">フレンドの進捗</h2>
        <FriendCardList />
      </section>

      {/* 🪐 宇宙マップ */}
      {/* <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-300">🪐 宇宙マップ</h2>
        <SpaceMapChart />
      </section> */}

      {/* 🎯 次の目標 */}
      {/* <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-300">🎯 次の目標</h2>
        <GoalTracker />
      </section> */}
    </main>
  );
}