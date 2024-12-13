import { useState, useRef } from "react";
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
import { registerUser } from "@/lib/api";
import { Palmtree, Mail, Lock, User } from "lucide-react";

export function RegisterForm() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);

    async function onSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const userData = {
            email: formData.get("email"),
            username: formData.get("username"),
            password: formData.get("password"),
        };

        try {
            await registerUser(userData);
            setSuccess("Registration successful! You can now log in.");
            if (formRef.current) {
                formRef.current.reset();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border-2">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                    <Palmtree className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                <CardDescription className="text-center">
                    Start your journey with LakbAI
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert className="bg-emerald-50 border-emerald-200">
                            <AlertDescription className="text-emerald-600">
                                {success}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="pl-8"
                                required
                                autoComplete="email"
                            />
                            <Mail className="h-4 w-4 absolute left-2.5 top-3 text-gray-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Username"
                                className="pl-8"
                                required
                                autoComplete="username"
                            />
                            <User className="h-4 w-4 absolute left-2.5 top-3 text-gray-500" />
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
                                autoComplete="new-password"
                            />
                            <Lock className="h-4 w-4 absolute left-2.5 top-3 text-gray-500" />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-[#66B2AB] hover:bg-[#5AA39C]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                                Creating account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-gray-500 text-center">
                    Join our community of travel enthusiasts
                </div>
            </CardFooter>
        </Card>
    );
}