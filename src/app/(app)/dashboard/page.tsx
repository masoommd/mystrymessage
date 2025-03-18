"use client"
import MessageCards from '@/components/MessageCards';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message, User } from '@/models/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId:string) => {
    setMessages(messages.filter((message)=> message._id!==messageId))
  }

  const {data : session} = useSession();
  const form = useForm({
    resolver:zodResolver(acceptMessageSchema),
  })

  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async()=>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages',response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error", {description:axiosError.response?.data.message || "Failed to fetch message setting"})
    } finally{
      setIsSwitchLoading(false)
    }
  },[setValue,toast])

  const fetchMessages = useCallback(async(refresh:boolean = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || [])
      if(refresh){
        toast.success("Refreshed messages", {description:"Showing latest messages"})
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error", {description:axiosError.response?.data.message || "Failed to fetch messages settings"})
    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false);
    }
  },[setIsLoading,setMessages])

  useEffect(()=>{
    if(!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  },[fetchMessages,fetchAcceptMessage,session,setValue])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {acceptMessages: !acceptMessages});
      setValue('acceptMessages',!acceptMessages)
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error", {description:axiosError.response?.data.message || "Failed to fetch messages settings"})
    }
  }

  if(!session || !session.user){
    return <div>Please Login</div>
  }

  const {username} = session.user 

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Copied to clipboard", {description:profileUrl})
  }

  
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          /> 
          
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-1">
        <ScrollArea className='h-56 p-4 '>
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCards
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
        </ScrollArea>
      </div>
    </div>
  )
}

export default page