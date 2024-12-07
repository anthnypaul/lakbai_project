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
import { loginUser } from "@/lib/api";

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
            onLogin(); // Call the callback after successful login
        } catch (err) {
            setError("Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
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
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}