import ItinerarySection from '@/components/ItinerarySection';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        LakbAI Travel Planner
      </h1>
      <ItinerarySection />
    </main>
  );
}