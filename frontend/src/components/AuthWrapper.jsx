"use client";

import { useEffect, useState } from "react";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { Sidebar } from "@/components/layout/Sidebar";

export function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on component mount and when localStorage changes
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    // Check auth immediately
    checkAuth();

    // Listen for storage changes (for logout)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          LakbAI Travel Planner
        </h1>
        <AuthTabs onLogin={() => setIsAuthenticated(true)} />
      </main>
    );
  }

  return <Sidebar setIsAuthenticated={setIsAuthenticated}>{children}</Sidebar>;
}