"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MapPin, Save, LogOut, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function Sidebar({ children, setIsAuthenticated }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        window.location.reload();
    } catch (error) {
        console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex h-screen w-64 bg-slate-800 text-white p-4 flex-col fixed">
        <div className="flex flex-col h-full">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-8">
              <MapPin className="h-6 w-6" />
              <h1 className="text-xl font-bold font-montserrat">LakbAI</h1>
            </div>

            <nav className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:text-white hover:bg-slate-700"
                onClick={() => router.push("/saved")}
              >
                <Save className="mr-2 h-4 w-4" />
                Saved Itineraries
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:text-white hover:bg-slate-700"
                onClick={() => router.push("/generate")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate Itinerary
              </Button>
            </nav>
          </div>

          <div className="mt-auto pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white hover:bg-slate-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 md:ml-64">
        {children}
      </div>
    </div>
  );
}