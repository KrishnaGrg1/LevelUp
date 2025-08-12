// components/auth/Register.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "../../app/[lang]/(auth)/signup/schema";
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
import { registerUser } from "@/lib/services/auth";
import authStore from "@/stores/useAuth";
import { toast } from "sonner";
import { Language } from "@/stores/useLanguage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/translations/index";

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  lang: Language;
}

export function RegisterForm({ lang }: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      UserName: "",
      email: "",
      password: "",
    },
  });

  const { setUser } = authStore();

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: RegisterFormData) => registerUser(data, lang),
    onSuccess: (data) => {
      setUser!({
        id: Number(data.body.data.id),
        UserName: data.body.data.UserName,
        email: data.body.data.email,
      });
      toast.success(data.body.message);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error("Registration failed:", error);
      toast.error(err.message || "Registration failed");
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    await mutateAsync(data);
  };

  return (
    <div className="w-full max-w-md">
      <Card className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>

        <CardHeader className="relative space-y-4 text-center pb-6 pt-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to Level Up
            </span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            Register to continue your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="UserName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Enter your username"
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
                className="w-full cursor-pointer h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center pt-6 border-t border-slate-700/50 relative z-10">
            <p className="text-sm text-slate-400">
              {t("auth.register.hasAccount", "Already have an account?")} {" "}
              <span
                onClick={() => {
                  console.log("Navigating to login...");
                  router.push(`/${lang}/login`);
                }}
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer hover:underline inline-block relative z-20"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(`/${lang}/login`);
                  }
                }}
              >
                {t("auth.register.loginLink", "Sign in here")}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}