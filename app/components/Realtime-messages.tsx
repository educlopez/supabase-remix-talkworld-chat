import { useEffect, useState } from 'react'
import type { SupabaseOutletContext } from '@/root'
import { useOutletContext } from '@remix-run/react'
import Avvvatars from 'avvvatars-react'
import type { Database } from 'db_types'

type Message = Database['public']['Tables']['messages']['Row']

export default function RealtimeMessages({
  serverMessages,
}: {
  serverMessages: Message[]
}) {
  const [messages, setMessages] = useState(serverMessages)
  const { supabase } = useOutletContext<SupabaseOutletContext>()

  useEffect(() => {
    setMessages(serverMessages)
  }, [serverMessages])

  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message

          if (!messages.find((message) => message.id === newMessage.id)) {
            setMessages([...messages, newMessage])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, messages, setMessages])
  return (
    <>
      <div className="px-4 mx-auto mt-10 max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {messages.map((message) => (
            <div
              className="relative flex items-center px-6 py-5 space-x-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
              key={message.id}
            >
              <div className="flex-shrink-0">
                <Avvvatars value={message.user_id} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {message.content}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {message.created_at_date} - {message.created_at_time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
