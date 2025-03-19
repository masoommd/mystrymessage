"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Input } from '@/components/ui/input'

const specialChar = "||";
const parseStringMessage = (messageString: string) => {
    return messageString.split(specialChar);
}

const msg =
    "What's your favorite movie?||What's your dream job?||What’s a small act of kindness you were once shown that you’ll never forget?What’s a small act of kindness you were once shown that you’ll never forget?";

const SendMessages = () => {
    const params = useParams<{ username: string }>()
    const { username } = params;
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [initialMessageString, setInitialMessageString] = useState(msg);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    })

    const messageContent = form.watch('content');
    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    
    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>("/api/send-message", {
                ...data,
                username,
            })
                toast.success(response.data.message);
                form.reset({ content: '' });
        } catch (error) {
            console.log("Sending message failed!", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Failed", {
                description: axiosError.response?.data.message ?? "Failed to send message. Please try again later."
            })
            
        } finally {
            setIsLoading(false);
        }
    }

    const fetchSuggestedMessages = async () => {
        setIsSuggestLoading(true);
        try {
            const response = await axios.post<ApiResponse & { messages: string }>(`/api/suggest-messages?nocache=' + ${Date.now()}`, {}); 

            if (response.data.messages) {
                setInitialMessageString(response.data.messages); 
            } else {
                toast.error("Failed to fetch suggested messages");
            }

        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error("Failed to fetch suggested messages");
        } finally {
            setIsSuggestLoading(false);
        }
    };
    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField
                        name='content'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black">Send Anonymous Message to @{username}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Write your anonymous message here'
                                        className='resize-none'
                                        {...field}></Textarea>
                                </FormControl>
                            </FormItem>
                        )}
                    ></FormField>
                    {
                        isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait...
                            </Button>
                        ) : (
                            <Button disabled={isLoading || !messageContent} type="submit">Send It</Button>
                        )
                    }
                </form>
            </Form>

            <div className="space-y-4 my-8">
                <div className="space-y-2">
                <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
                    <p>
                        Click on any messages below to select it.
                    </p>
                    <Card>
                        <CardHeader><h3 className="text-xl font-semibold">Messages</h3></CardHeader>
                        <CardContent className="flex flex-col space-y-4">
                                
                            {
                                isSuggestLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Please wait...</span>
                                    </div>
                                ) : (
              parseStringMessage(initialMessageString).map((message, index) => (
                <Input 
                  key={index}
                value={message}
                  className="mb-2 break-words cursor-pointer truncate hover:shadow-lg"
                  readOnly
                  onClick={() => handleMessageClick(message)}
                />
              )
            ))}
                        </CardContent>
                    </Card>
                </div>
                <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
            </div>
        </div>
    )
}

export default SendMessages