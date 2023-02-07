import { json, type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { motion } from 'framer-motion'
import bg from 'public/bg-ray-light-talk-world.png'
import createServerSupabase from 'utils/supabase.server'

import { FADE_DOWN_ANIMATION_VARIANTS } from '@/lib/constants'
import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import RealtimeMessages from '@/components/Realtime-messages'

export const action = async ({ request }: ActionArgs) => {
  const response = new Response()
  const supabase = createServerSupabase({ request, response })

  const { message } = Object.fromEntries(await request.formData())
  const { error } = await supabase
    .from('messages')
    .insert({ content: String(message) })

  if (error) {
    console.log(error)
  }

  return json(null, { headers: response.headers })
}

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response()
  const supabase = createServerSupabase({ request, response })

  const { data } = await supabase.from('messages').select()

  return json({ messages: data ?? [] }, { headers: response.headers })
}

export function Bg() {
  return (
    <img
      src={bg}
      alt="gradient decoration background"
      className="absolute top-0 left-1/2 -ml-[39rem] w-[113.125rem] max-w-none"
      width="3620"
      height="1004"
    />
  )
}
export default function Index() {
  const { messages } = useLoaderData<typeof loader>()

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <div className="relative">
          <div className="relative overflow-hidden">
            <Bg />
            <motion.header variants={FADE_DOWN_ANIMATION_VARIANTS} layoutScroll>
              <Header />
            </motion.header>
            <div className="relative max-w-2xl px-4 pb-16 mx-auto space-y-10 pt-14 sm:px-6 lg:max-w-5xl lg:px-8">
              <main className="py-16">
                <div className="flex flex-col items-center justify-center flex-1 w-full px-4 mt-12 text-center sm:mt-20">
                  <motion.h1
                    className="max-w-2xl text-4xl font-bold text-slate-900 sm:text-6xl"
                    variants={FADE_DOWN_ANIMATION_VARIANTS}
                  >
                    Talk to the world!
                  </motion.h1>
                  <motion.p
                    className="mt-5 text-slate-500"
                    variants={FADE_DOWN_ANIMATION_VARIANTS}
                  >
                    Made with Supabase, Remix and Tailwindcss
                  </motion.p>
                  <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                    <RealtimeMessages serverMessages={messages} />
                  </motion.div>
                  <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                    <Form method="post" className="flex items-center h-10 my-5">
                      <input
                        className="w-full h-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
                        type="text"
                        name="message"
                      />
                      <button
                        type="submit"
                        className="h-full px-3 py-2 ml-1 text-sm font-medium leading-4 text-white bg-black border border-gray-300 rounded-md shadow-sm hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                      >
                        Send
                      </button>
                    </Form>
                  </motion.div>
                </div>
              </main>
              <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                <Footer />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
