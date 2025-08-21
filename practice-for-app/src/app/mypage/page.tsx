'use client';
import StudySummary from '../components/StudySummary';
import RadarChart from '../components/RadarChart';
import LineChart from '../components/LineChart';
import NavigationBar from '../components/NavigationBar';
import StarCanvas from '../components/StarCanvas';
import BackToTopButton from '../components/BackTop';


export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] text-white pt-20 p-1 flex flex-col items-center">
      <NavigationBar />
      <StarCanvas />
        <h1 className="text-3xl font-bold mb-4">Mypage</h1>
        <div className="flex flex-col md:flex-row items-center gap-8">
        <StudySummary
          username="なさり"
          today={4}
          week={34}
          month={120}
        />          
        <RadarChart />
      </div>
      
      <div className="mt-8">
        <LineChart />
      </div>
      <div className="mb-2 w-full flex justify-start">
        <BackToTopButton />
      </div>
    </div>
  );
}