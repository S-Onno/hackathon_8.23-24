import FriendCardList from '../components/FriendCard';
import NavigationBar from '../components/NavigationBar';
import StarCanvas from '../components/StarCanvas';

export default function FriendPage() {
  return (

    
    <main className="min-h-screen bg-gradient-to-b to-black text-white pt-20 px-4 py-8">
      <NavigationBar />
      <StarCanvas />
      <h1 className="text-3xl font-bold text-center tracking-wide mt-8 mb-4">フレンドの学習状況</h1>

      <div className="mt-12" />

      <FriendCardList />
    </main>
  );
}
