import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginUser } from "@/lib/api";
import { Plane, Lock } from "lucide-react";

export function LoginForm({ onLogin }) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username");
        const password = formData.get("password");

        try {
            const response = await loginUser({ username, password });
            localStorage.setItem("token", response.access_token);
            onLogin();
        } catch (err) {
            setError("Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border-2">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                    <Plane className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
                <CardDescription className="text-center">
                    Ready to plan your next adventure?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Username"
                                className="pl-8"
                                required
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 absolute left-2.5 top-3 text-gray-500"
                            >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                className="pl-8"
                                required
                            />
                            <Lock className="h-4 w-4 absolute left-2.5 top-3 text-gray-500" />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                                Logging in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-gray-500 text-center">
                    Your gateway to personalized travel experiences
                </div>
            </CardFooter>
        </Card>
    );
}