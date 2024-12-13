import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { LogIn, UserPlus } from "lucide-react";

export function AuthTabs({ onLogin }) {
    return (
        <Tabs defaultValue="login" className="w-full max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                </TabsTrigger>
            </TabsList>
            
            <TabsContent 
                value="login" 
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
                <LoginForm onLogin={onLogin} />
            </TabsContent>
            
            <TabsContent 
                value="register" 
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
                <RegisterForm />
            </TabsContent>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </Tabs>
    );
}