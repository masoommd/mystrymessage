"use client"
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
export const dynamic = 'force-dynamic'

const ResetPasswordPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paramsToken = searchParams.get('resetToken');
    const username = searchParams.get('username');
    const [resetToken, setResetToken] = useState("");
    const [isTokenVerify, setIsTokenVerify] = useState(false);
    const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);
    const [isPasswordSubmitting, setPasswordIsSubmitting] = useState(false);

    const tokenForm = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: { code: "" },
    });

    const passwordForm = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    // Wrapped verifyToken in useCallback
    const verifyToken = useCallback(async (token: z.infer<typeof verifySchema>) => {
        setIsCodeSubmitting(true);
        try {
            setResetToken(token.code);
            const response = await axios.post<ApiResponse>(`/api/reset-token-check`, {
                username: username,
                code: token.code,
            });

            toast.success("Success", { description: response.data.message });
            if (response.data.success) {
                setIsTokenVerify(true);
                passwordForm.reset({ password: "", confirmPassword: "" }, { keepDirty: false, keepTouched: false });
                tokenForm.reset({ code: "" });
            }
        } catch (error) {
            console.log("Error in verification of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Verification failed", {
                description: axiosError.response?.data.message ?? 'An error occurred.',
            });
            setIsTokenVerify(false);
        } finally {
            setIsCodeSubmitting(false);
        }
    }, [username, passwordForm, tokenForm]);

    useEffect(() => {
        const verifyParamsToken = async () => {
            if (paramsToken && !isTokenVerify) {
                try {
                    await verifyToken({ code: paramsToken });
                    setIsTokenVerify(true);
                } catch (error) {
                    console.error("Error verifying token from URL:", error);
                    setIsTokenVerify(false);
                }
            }
        };
        verifyParamsToken();
    }, [paramsToken, isTokenVerify, verifyToken]);

    const onSubmitCode = (data: z.infer<typeof verifySchema>) => {
        verifyToken(data);
    };

    const onSubmitPassword = async (data: z.infer<typeof resetPasswordSchema>) => {
        setPasswordIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>(`/api/reset-password`, {
                username: username,
                password: data.password,
                code: resetToken,
            });

            toast.success("Success", { description: response.data.message });
            router.replace('/sign-in');
        } catch (error) {
            console.log("Error in verification of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Verification failed", {
                description: axiosError.response?.data.message ?? 'An error occurred.',
            });
        } finally {
            setPasswordIsSubmitting(false)
        }
    };

    return (
        // Added Suspense fallback
        <Suspense fallback={<Loader2 className="animate-spin" />}>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-3xl mb-6 text-left">
                            {!isTokenVerify ? 'Verify Your Account' : 'Set New Password'}
                        </h1>
                        <p className="mb-4">
                            {!isTokenVerify ? 'Enter the reset token sent to your email' : 'The reset token is verified, set your new password'}
                        </p>
                    </div>
                    {!isTokenVerify ? (
                        <Form {...tokenForm} key="tokenForm">
                            <form onSubmit={tokenForm.handleSubmit(onSubmitCode)} className="space-y-6">
                                <FormField
                                    name="code"
                                    control={tokenForm.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Verification Code</FormLabel>
                                            <Input {...field} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {
                                    isCodeSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                                        </>
                                    ) : (
                                        <Button type="submit">Verify Token</Button>
                                    )
                                }
                            </form>
                        </Form>
                    ) : (
                        <Form {...passwordForm} key="passwordForm">
                            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                                <FormField
                                    name="password"
                                    control={passwordForm.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <Input {...field} type="password" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="confirmPassword"
                                    control={passwordForm.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <Input {...field} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {
                                    isPasswordSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                                        </>
                                    ) : (
                                        <Button type="submit">Set Password</Button>
                                    )
                                }
                            </form>
                        </Form>
                    )}
                </div>
            </div>
        </Suspense>
    );
};

export default ResetPasswordPage;