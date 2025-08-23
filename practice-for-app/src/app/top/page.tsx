// pages/home/page.tsx
import GalaxyMap from '../components/GalaxyMap';
import StarCanvas from '../components/StarCanvas';
import NavigationBar from '../components/NavigationBar';



const planets = [
  { id: 'mypage', name: 'mypage', x: 800, y: 300, route: '/mypage', avatar: '/_images/sun.png' },
  { id: '学習', name: '学習', x: 1000, y: 350, route: '/study', avatar: '/_images/kasei.png' },
  { id: 'フレンド', name: 'フレンド', x: 1290, y: 400, route: '/friends', avatar: '/_images/saturn.png' },
  { id: '単語帳', name: '単語帳', x: 1100, y: 230, route: '/word-list', avatar: '/_images/moon.png' },

  { id: 'yasu', name: 'やす', x: 300, y: 150, route: '/friend/yasu', avatar: '/_images/earth.png' },
  { id: 'nakasone', name: 'なかそね', x: 500, y: 250, route: '/friend/nakasone', avatar: '/_images/earth.png' },
  { id: 'tarutaru', name: 'たるたる', x: 400, y: 450, route: '/friend/tarutaru', avatar: '/_images/earth.png' },
  { id: 'bokutti', name: 'ぼくっち', x: 650, y: 110, route: '/friend/bokutti', avatar: '/_images/earth.png' },
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