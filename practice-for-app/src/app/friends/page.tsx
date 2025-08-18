import FriendCardList from '../components/FriendCard';
import Link from "next/link";
import NavigationBar from '../components/NavigationBar';

export default function FriendPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white pt-20 px-4 py-8">
      <NavigationBar />
      <h1 className="text-3xl font-bold text-center mb-8">フレンドの学習状況</h1>
      <FriendCardList />
    </main>
  );
}