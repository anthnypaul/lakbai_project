"use client";

import { useEffect, useState } from "react";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { Sidebar } from "@/components/layout/Sidebar";
import { Plane, Map, Palmtree } from "lucide-react";

export function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center mb-12">
            <div className="flex gap-4 mb-4">
              <Plane className="h-8 w-8 text-blue-500" />
              <Map className="h-8 w-8 text-blue-500" />
              <Palmtree className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 text-center">
              LakbAI Travel Planner
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl">
              Your AI-powered travel companion for creating personalized adventures
            </p>
          </div>
          <AuthTabs onLogin={() => setIsAuthenticated(true)} />
        </div>
      </main>
    );
  }

  return <Sidebar setIsAuthenticated={setIsAuthenticated}>{children}</Sidebar>;
}