"use client"

import Planet2D from '../components/Planet2D';

export default function Home() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>2D惑星描画</h1>
      <Planet2D size={80} ringCount={3} />
    </div>
  );
}
