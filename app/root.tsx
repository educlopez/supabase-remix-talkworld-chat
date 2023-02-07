import { useEffect, useState } from 'react'
import {
  json,
  type LinksFunction,
  type LoaderArgs,
  type MetaFunction,
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from '@remix-run/react'
import { createBrowserClient } from '@supabase/auth-helpers-remix'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Analytics } from '@vercel/analytics/react'
import type { Database } from 'db_types'
import createServerSupabase from 'utils/supabase.server'

import styles from './tailwind.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

type TypedSupabaseClient = SupabaseClient<Database>

export type SupabaseOutletContext = {
  supabase: TypedSupabaseClient
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Talk to the world!',
  viewport: 'width=device-width,initial-scale=1',
})

export const loader = async ({ request }: LoaderArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  }

  const response = new Response()
  const supabase = createServerSupabase({ request, response })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return json({ env, session }, { headers: response.headers })
}

export default function App() {
  const { env, session } = useLoaderData<typeof loader>()
  const revalidator = useRevalidator()

  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  )

  const serverAccessToken = session?.access_token

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        // call loaders
        revalidator.revalidate()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, serverAccessToken, revalidator])

  return (
    <html className="h-full antialiased" lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col h-full antialiased bg-white ">
        <Outlet context={{ supabase }} />
        <Analytics />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
