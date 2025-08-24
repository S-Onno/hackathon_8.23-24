// pages/top/page.tsx
import GalaxyMap from '../components/GalaxyMap';
import StarCanvas from '../components/StarCanvas';
import NavigationBar from '../components/NavigationBar';

const planets = [
  { id: 'mypage', name: '太陽', route: '/mypage', avatar: '/_images/sun.png', orbitRadius: 0, animationDuration: 0 , isSun: true },
  { id: '学習', name: '学習', route: '/study', avatar: '/_images/kasei.png', orbitRadius: 250, animationDuration: 40 ,isSun: false },
  { id: 'フレンド', name: 'フレンド', route: '/friends', avatar: '/_images/saturn.png', orbitRadius: 400, animationDuration: 80 ,isSun: false},
  { id: '単語帳', name: '単語帳', route: '/word-list', avatar: '/_images/moon.png', orbitRadius: 150, animationDuration: 20 ,isSun: false},
  { id: '暗記クイズ', name: '暗記クイズ', route: '/memorize', avatar: '/_images/mikamoon.png', orbitRadius: 120, animationDuration: 10 ,isSun: false},

  
  { id: 'yasu', name: 'やす', route: '/friend/yasu', avatar: '/_images/earth.png', orbitRadius: 300, animationDuration: 50 ,isSun: false},
  { id: 'nakasone', name: 'なかそね', route: '/friend/nakasone', avatar: '/_images/earth.png', orbitRadius: 500, animationDuration: 90 ,isSun: false},
  { id: 'tarutaru', name: 'たるたる', route: '/friend/tarutaru', avatar: '/_images/earth.png', orbitRadius: 200, animationDuration: 30 ,isSun: false},
  { id: 'bokutti', name: 'ぼくっち', route: '/friend/bokutti', avatar: '/_images/EarthLv0png.png', orbitRadius: 350, animationDuration: 60 ,isSun: false},
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