// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useLogin } from "../../hooks/use-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Language } from "../../lib/generated";

interface LoginFormProps {
  lang: string;
}

export function LoginForm({ lang }: LoginFormProps) {
  console.log("LoginForm received language:", lang);
  const { mutate, isPending, error } = useLogin(lang as Language);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full">
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </Button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}
