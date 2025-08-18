// pages/home/page.tsx
import GalaxyMap from '../components/GalaxyMap';
import NavigationBar from '../components/NavigationBar';

const planets = [
  { id: 'mypage', name: 'mypage', x: 750, y: 300, route: '/mypage', avatar: '/avatars/me.png' },
  { id: 'yasu', name: 'yasu', x: 300, y: 150, route: '/friend/yasu', avatar: '/avatars/yuki.png' },
  { id: 'nakasone', name: 'nakasone', x: 500, y: 250, route: '/friend/nakasone', avatar: '/avatars/taro.png' },
  { id: 'tarutaru', name: 'tarutaru', x: 400, y: 450, route: '/friend/tarutaru', avatar: '/avatars/taro.png' },
  { id: 'bokutti', name: 'bokutti', x: 650, y: 110, route: '/friend/bokutti', avatar: '/avatars/taro.png' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <NavigationBar />
      <GalaxyMap planets={planets} />
    </main>
  );
}