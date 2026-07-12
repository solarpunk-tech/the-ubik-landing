import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const styles = {
  // Simple fade‑in animation
  fadeIn: "animate-fadeIn 0.4s ease-out forwards",
};

// Add keyframes to the global stylesheet when the component mounts
const injectKeyframes = () => {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
};

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: replace with real auth logic
    if (userId && password) {
      alert(`Welcome, ${userId}`);
    } else {
      setError("Please enter both user ID and password");
    }
  };

  // Inject keyframes once
  import { useEffect } from "react";

  useEffect(() => {
    injectKeyframes();
  }, []);

  return (
    <Card className={cn("max-w-sm w-full rounded-lg bg-card p-6 shadow-sm", styles.fadeIn)}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-destructive text-sm"> {error} </p>}
          <div>
            <Label htmlFor="user-id">User ID</Label>
            <Input
              id="user-id"
              type="text"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;
