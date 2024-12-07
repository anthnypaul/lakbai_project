import './globals.css'
import { AuthWrapper } from '@/components/AuthWrapper'

export const metadata = {
  title: 'LakbAI - Travel Itinerary Planner',
  description: 'Plan your perfect trip with AI-powered itinerary suggestions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-montserrat">
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            <AuthWrapper>{children}</AuthWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}