'use client';
import StudySummary from '../components/StudySummary';
import RadarChart from '../components/RadarChart';
import LineChart from '../components/LineChart';
import NavigationBar from '../components/NavigationBar';


export default function StudyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white pt-20 p-10 flex flex-col items-center">
      <NavigationBar />
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
    </div>
  );
}