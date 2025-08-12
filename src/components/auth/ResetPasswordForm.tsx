"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ResetPasswordSchema from "@/app/[lang]/(auth)/reset-password/schema";
import { z } from "zod";
import { useState, useEffect } from "react";
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
import { resetPasswordWithOtp } from "@/lib/services/auth";
import { toast } from "sonner";
import { Language } from "@/stores/useLanguage";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import authStore from "@/stores/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { t } from "@/translations/index";
import LanguageStore from "@/stores/useLanguage";

type ResetFormData = z.infer<typeof ResetPasswordSchema>;
interface ResetPasswordFormProps {
    lang: Language;
}

export default function ResetPasswordForm({ lang }: ResetPasswordFormProps) {
    const { user } = authStore();
    const { language } = LanguageStore();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<ResetFormData>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: user?.email || "",
            otp_code: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // Re-validate form when language changes to update error messages
    useEffect(() => {
        if (Object.keys(form.formState.errors).length > 0) {
            // Re-trigger validation to get translated error messages
            form.trigger();
        }
    }, [language, form]);

    const { mutateAsync, isPending: isLoading } = useMutation({
        mutationKey: ["reset-password"],
        mutationFn: (data: ResetFormData) => resetPasswordWithOtp(data, lang),
        onSuccess: (res) => {
            toast.success(res?.message || "Password reset successful");
        },
        onError: (error: unknown) => {
            const err = error as { message?: string };
            toast.error(err.message || "Password reset failed");
        },
    });

    const onSubmit = async (data: ResetFormData) => {

        await mutateAsync(data);
    };

    return (
        <div className="w-full max-w-md">
            <Card className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
                <CardHeader className="relative space-y-2 text-center pb-4 pt-8">
                    <CardTitle className="text-2xl font-black">{t("reset.title", "Reset Password")}</CardTitle>
                    <CardDescription className="text-slate-400">
                        {t("reset.subtitle", "Enter the code and your new password")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6 px-8 pb-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            {/* OTP */}
                            <FormField
                                control={form.control}
                                name="otp_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-300">
                                            {t("reset.otp", "Reset Code")}
                                        </FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                maxLength={6}
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="w-full"
                                            >
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

                            {/* New Password */}
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-300">
                                            {t("reset.newPassword", "New Password")}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showNewPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    autoComplete="new-password"
                                                    className="h-12 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-xl"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword((s) => !s)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-400 mt-1" />
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-300">
                                            {t("reset.confirmPassword", "Confirm Password")}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    autoComplete="new-password"
                                                    className="h-12 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-xl"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword((s) => !s)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
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
                                {isLoading ? "Resetting..." : t("reset.submit", "Reset Password")}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
