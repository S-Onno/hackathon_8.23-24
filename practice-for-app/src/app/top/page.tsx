// pages/home/page.tsx
import GalaxyMap from '../components/GalaxyMap';

const planets = [
  { id: 'mypage', name: 'mypage', x: 750, y: 300, route: '/mypage', avatar: '/avatars/me.png' },
  { id: 'yasu', name: 'やす', x: 300, y: 150, route: '/friend/yuki', avatar: '/avatars/yuki.png' },
  { id: 'nakasone', name: 'なかそね', x: 500, y: 250, route: '/friend/taro', avatar: '/avatars/taro.png' },
  { id: 'tarutaru', name: 'たるたる', x: 400, y: 450, route: '/friend/taro', avatar: '/avatars/taro.png' },
  { id: 'bokutti', name: 'ぼくっち', x: 650, y: 110, route: '/friend/taro', avatar: '/avatars/taro.png' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <GalaxyMap planets={planets} />
    </main>
  );
}