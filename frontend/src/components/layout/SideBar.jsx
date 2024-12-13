"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MapPin, Save, LogOut, PlusCircle, User } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Sidebar({ children, setIsAuthenticated, userProfile }) {
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

  const menuItems = [
    {
      icon: <Save className="h-4 w-4" />,
      label: "Saved Itineraries",
      path: "/saved",
    },
    {
      icon: <PlusCircle className="h-4 w-4" />,
      label: "Generate Itinerary",
      path: "/generate",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex h-screen w-72 bg-slate-900 text-white p-6 flex-col fixed">
        <div className="flex flex-col h-full">
          {/* Logo and Brand */}
          <div 
            className="flex items-center space-x-3 mb-8 cursor-pointer group transition-all duration-300" 
            onClick={() => router.push("/")}
          >
            <div className="bg-primary rounded-lg p-2 group-hover:bg-primary/90">
              <MapPin className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold font-montserrat bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              LakbAI
            </h1>
          </div>

          {/* User Profile Card */}
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Welcome back!</p>
                  <p className="text-xs text-slate-400">Plan your next adventure</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <nav className="space-y-2">
            <TooltipProvider>
              {menuItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-slate-200 hover:text-white hover:bg-slate-800 transition-all duration-200"
                      onClick={() => router.push(item.path)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>

          {/* Logout Section */}
          <div className="mt-auto">
            <Separator className="my-4 bg-slate-700" />
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-200 hover:text-white hover:bg-slate-800 transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 md:ml-72">
        {children}
      </div>
    </div>
  );
}

export default Sidebar;