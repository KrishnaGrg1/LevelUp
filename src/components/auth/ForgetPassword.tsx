"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ForgetPasswordSchema from "@/app/[lang]/(auth)/forget-password/schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "@/lib/services/auth";
import { toast } from "sonner";
import { Language } from "@/stores/useLanguage";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { t } from "@/translations/index";
import { TranslatedFormMessage } from "@/components/ui/TranslatedFormMessage";
import Link from "next/link";

type ForgetFormData = z.infer<typeof ForgetPasswordSchema>;

interface ForgetPasswordProps {
    lang: Language;
    onSent?: (email: string) => void;
}

export default function ForgetPassword({ lang, onSent }: ForgetPasswordProps) {
    const form = useForm<ForgetFormData>({
        resolver: zodResolver(ForgetPasswordSchema),
        defaultValues: { email: "" },
    });

    const { mutateAsync, isPending: isLoading } = useMutation({
        mutationKey: ["auth", "forgot"],
        mutationFn: (data: ForgetFormData) => requestPasswordReset(data.email, lang),
        onSuccess: (res) => {
            toast.success(t("success:forgotPassword", res?.message || "Reset link sent"));
        },
        onError: (error: unknown) => {
            const err = error as { message?: string };
            toast.error(err.message || t("error:forgotPassword", "Failed to send reset email"));
        },
    });

    const onSubmit = async (data: ForgetFormData) => {
        const result = await mutateAsync(data);
        if (result && onSent) {
            onSent(data.email);
        }
    };

    return (
        <div className="w-full max-w-md">
            <Card className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl" />
                <CardHeader className="relative space-y-2 text-center pb-4 pt-8">
                    <CardTitle className="text-2xl font-black">
                        {t("auth.forgetPassword.title", "Forgot Password")}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        {t("auth.forgetPassword.subtitle", "Enter your email to receive a reset link")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6 px-8 pb-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-300">
                                            {t("auth.forgetPassword.email", "Email")}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                <Input
                                                    type="email"
                                                    placeholder={t("auth.forgetPassword.emailPlaceholder", "you@example.com")}
                                                    className="pl-10 h-12 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-xl"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <TranslatedFormMessage className="text-xs text-red-400 mt-1" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 rounded-xl"
                            >
                                {isLoading
                                    ? t("auth.forgetPassword.sending", "Sending...")
                                    : t("auth.forgetPassword.submit", "Send reset link")}
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center pt-6 border-t border-slate-700/50 relative z-10">
                        <p className="text-sm text-slate-400">
                            {t("auth.register.hasAccount", "Already have an account?")}{" "}
                            <Link
                                href={`/${lang}/login`}
                                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                {t("auth.register.loginLink", "Sign in here")}
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
