'use client';
import StudySummary from '../components/StudySummary';
import RadarChart from '../components/RadarChart';
import LineChart from '../components/LineChart';
import NavigationBar from '../components/NavigationBar';
import ProfileCard from '../components/ProfileCard';
import StarCanvas from '../components/StarCanvas';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] text-white pt-20 p-1 flex flex-col items-center">
      <NavigationBar />
      <StarCanvas />
        <h1 className="text-3xl font-bold text-center tracking-wide mt-8 mb-4">Mypage</h1>
        <div className="flex flex-col md:flex-row items-center gap-8">
        <ProfileCard />
        <LineChart />
        <RadarChart />
      </div>
    </div>
  );
}