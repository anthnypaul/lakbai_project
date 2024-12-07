import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registerUser } from "@/lib/api";

export function RegisterForm() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
            event.currentTarget.reset();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                    Create a new account to get started
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert className="bg-green-50">
                            <AlertDescription className="text-green-600">
                                {success}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating account..." : "Register"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}