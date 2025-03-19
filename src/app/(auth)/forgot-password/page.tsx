'use client'
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const ForgotPassword = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            input: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/api/forgot-password`,data)

            toast.success("Success", { description: response.data.message });
            const username = response.data.username;
            router.replace(`/reset-password/${username}`);
        } catch (error) {
            console.log("Error sending reset password email", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("verification failed", {
                description: axiosError.response?.data.message ??
                    'There was a problem sending reset password email. Please try again.'
            });
        }
        finally{
            setIsSubmitting(false);
        }
    }



    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6 text-left">
                        Forgot Password
                    </h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="input"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter your email or username</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            isSubmitting ? (
                                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                  </>
                            ):(
                                <Button type="submit">send reset code</Button>
                            )
                        }
                        
                    </form>
                </Form>
            </div>
        </div>

    )
}

export default ForgotPassword