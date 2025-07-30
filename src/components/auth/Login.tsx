// components/auth/Register.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import loginSchema from "@/app/[lang]/(auth)/login/schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/services/auth";
import authStore from "@/stores/useAuth";
import { toast } from "sonner";
import { Language } from "@/lib/generated";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock, Link } from "lucide-react";
import { useState } from "react";

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  lang: Language;
}

export function LoginForm({ lang }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setToken, setUser, setAuthenticated } = authStore();

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginFormData) => login(data, lang),
    onSuccess: (data) => {
      if (setToken) {
        setToken(data?.body.data.data);
      }
      setUser!({
        id: Number(data?.body.data.id),
        UserName: data?.body.data.UserName,
        email: data?.body.data.email,
      });
      setAuthenticated(true);
      toast.success(data?.body.message);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error("Registration failed:", error);
      toast.error(err.message || "Registration failed");
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await mutateAsync(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Join us and start your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600 mt-1 font-semibold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600 mt-1 font-semibold" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Create an Account?{" "}
              <Link
                href={`/${lang}/signup`}
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
