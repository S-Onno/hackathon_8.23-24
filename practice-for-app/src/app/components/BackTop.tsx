'use client';
import { useRouter } from 'next/navigation';

export default function BackToTopButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/top')}
      className="bg-gray-900 hover:bg-black text-white rounded-full p-1 shadow-md transition-all duration-300">
        <img
        src="../_images/ginga.png"
        alt="地球に戻る"
        className="w-20 h-20 rounded-full shadow-md"
        />
      <span className="sr-only">惑星に戻る</span>
    </button>
  );
}