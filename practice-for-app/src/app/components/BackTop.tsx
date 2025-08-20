import { useRouter } from 'next/navigation';

export default function BackToTopButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/top')}
      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-1 shadow-md transition-all duration-300">
        <img
        src="../_images/earth.png"
        alt="地球に戻る"
        className="w-20 h-20 rounded-full shadow-md"
        />
      <span className="sr-only">惑星に戻る</span>
    </button>
  );
}