import FriendCardList from '../components/FriendCard';
import NavigationBar from '../components/NavigationBar';
import StarCanvas from '../components/StarCanvas';
import BackToTopButton from '../components/BackTop';

export default function FriendPage() {
  return (
<<<<<<< HEAD

    
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 text-white pt-20 px-4 py-8">

=======
    
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white pt-20 px-4 py-8">
>>>>>>> 441a100c2f9ed02ef790a8e81ca56f23010d7548
      <NavigationBar />
      <StarCanvas />
      <h1 className="text-3xl font-bold text-center mb-12">フレンドの学習状況</h1>

      <div className="mt-12" />

      <FriendCardList />
      <div className="mb-2 w-full flex justify-start">
        <BackToTopButton />
      </div>
    </main>
  );
}