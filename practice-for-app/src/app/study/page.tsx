'use client';
import Link from 'next/link';
import StudyCard from '../components/StudyCard';
import RadarChart from '../components/RadarChart';
import LineChart from '../components/LineChart';
import NavigationBar from '../components/NavigationBar';

const me = {
  name: 'なさり',
  today: 4,
  week: 34,
  month: 120,
};

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white pt-20 p-10 flex flex-col items-center">
      <NavigationBar />
      <div className="flex flex-col md:flex-row items-center gap-8">
        <StudyCard
          name={me.name}
          today={me.today}
          week={me.week}
          month={me.month}
        />
          <RadarChart />
      </div>
      
      <div className="mt-8">
        <LineChart />
      </div>
    </div>
  );
}