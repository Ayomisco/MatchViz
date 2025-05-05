import MatchDashboard from "@/components/match-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Football Match Visualization
        </h1>
        <MatchDashboard />
      </div>
    </main>
  )
}
