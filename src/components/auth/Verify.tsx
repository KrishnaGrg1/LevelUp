// components/auth/Verify.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import VerifySchema from "@/app/[lang]/(auth)/verify/schema";
import { z } from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
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
import { VerifyUser } from "@/lib/services/auth";
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
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type VerifyFormData = z.infer<typeof VerifySchema>;
interface VerifyFormProps {
  lang: Language;
}

export function VerifyForm({ lang }: VerifyFormProps) {
  const [isClient, setIsClient] = useState(false);
  const { setToken, setUser, user, setAuthenticated } = authStore();
  const { t } = useI18n(["auth"]);

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      otp_code: "",
      email: user?.email || "",
    },
  });

  // Add hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationKey: ["verify"],
    mutationFn: (data: VerifyFormData) => VerifyUser(data, lang),
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
      toast.success(data?.body.message || "Verification Successful");
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error("Verification failed:", error);
      toast.error(err.message || "Verification failed");
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    await mutateAsync(data);
  };

  // Prevent hydration mismatch by not rendering form until client-side
  if (!isClient) {
    return (
      <div className="w-full max-w-md">
        <Card className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
          <CardHeader className="relative space-y-4 text-center pb-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-black">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Loading...
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6 px-8 pb-8">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-slate-700/30 rounded-xl"></div>
              <div className="h-12 bg-slate-700/30 rounded-xl"></div>
              <div className="h-12 bg-slate-700/30 rounded-xl"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {t("verify.title", "Verify Email")}
            </span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            {t("verify.subtitle", "Enter the code we sent")}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6 px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="otp_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      {t("verify.otp", "Verification Code")}
                    </FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} value={field.value} onChange={field.onChange} className="w-full">
                        <InputOTPGroup className="gap-2">
                          {Array.from({ length: 6 }).map((_, idx) => (
                            <InputOTPSlot key={idx} index={idx} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="text-xs text-red-400 mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 rounded-xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  t("verify.submit", "Verify")
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center pt-6 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">
              {t("register.hasAccount", "Already have an account?")}{" "}
              <Link
                href={`/${lang}/signup`}
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {t("register.loginLink", "Sign in here")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
