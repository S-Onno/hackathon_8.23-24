// components/GalaxyMap.tsx
import Link from "next/link";
type Planet = {
  id: string;
  name: string;
  x: number;
  y: number;
  route: string;
  avatar: string; 
};


type GalaxyMapProps = {
  planets: Planet[];
};

export default function GalaxyMap({ planets }: GalaxyMapProps) {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black overflow-hidden">
      {planets.map((planet) => (
        <Link key={planet.id} href={planet.route}>
          <div
            className="absolute group cursor-pointer transition-transform hover:scale-110"
            style={{ left: planet.x, top: planet.y }}
          >

            <img
              src={planet.avatar}
              alt={planet.name}
              className={`rounded-full border-4 ${
                planet.id === 'mypage' ? 'w-24 h-24 border-yellow-400' : 'w-16 h-16 border-indigo-500'
              }`}
            />          
              
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-white text-sm whitespace-nowrap">
              {planet.name}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}