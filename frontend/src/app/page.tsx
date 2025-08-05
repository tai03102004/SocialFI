import { GameDashboard } from '../components/GameDashboard'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          Welcome to GameFi DeFAI Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Revolutionary GameFi platform built on ZetaChain with AI-powered assistance
        </p>
      </div>
      
      {/* Add GameDashboard component */}
      <GameDashboard />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Cross-Chain Gaming</h3>
          <p className="text-muted-foreground">
            Experience seamless gaming across multiple blockchains with ZetaChain
          </p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">AI-Powered DeFi</h3>
          <p className="text-muted-foreground">
            Leverage Gemini AI for intelligent DeFi strategies and insights
          </p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Earn Rewards</h3>
          <p className="text-muted-foreground">
            Play, stake, and earn rewards in our innovative GameFi ecosystem
          </p>
        </div>
      </div>
    </div>
  )
}