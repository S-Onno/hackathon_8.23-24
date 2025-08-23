// pages/home/page.tsx
import GalaxyMap from '../components/GalaxyMap';
import StarCanvas from '../components/StarCanvas';
import NavigationBar from '../components/NavigationBar';



const planets = [
  { id: 'mypage', name: '太陽', route: '/mypage', avatar: '/_images/sun.png', isSun: true, orbitRadius: 0, animationDuration: 0 },
  { id: '学習', name: '学習', route: '/study', avatar: '/_images/kasei.png', isSun: false, orbitRadius: 150, animationDuration: 20 },
  { id: 'フレンド', name: 'フレンド', route: '/friends', avatar: '/_images/saturn.png', isSun: false, orbitRadius: 300, animationDuration: 40 },
  { id: '単語帳', name: '単語帳', route: '/word-list', avatar: '/_images/moon.png', isSun: false, orbitRadius: 100, animationDuration: 15 },
  
  { id: 'yasu', name: 'やす', route: '/friend/yasu', avatar: '/_images/earth.png', isSun: false, orbitRadius: 200, animationDuration: 25 },
  { id: 'nakasone', name: 'なかそね', route: '/friend/nakasone', avatar: '/_images/earth.png', isSun: false, orbitRadius: 250, animationDuration: 35 },
  { id: 'tarutaru', name: 'たるたる', route: '/friend/tarutaru', avatar: '/_images/earth.png', isSun: false, orbitRadius: 350, animationDuration: 50 },
  { id: 'bokutti', name: 'ぼくっち', route: '/friend/bokutti', avatar: '/_images/earth.png', isSun: false, orbitRadius: 400, animationDuration: 60 },
];

export default function HomePage() {
  return (

    <main className="min-h-screen">
      {/* <NavigationBar /> */}
      <StarCanvas />
      <GalaxyMap planets={planets} />
    </main>
  );
}