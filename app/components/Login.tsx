import { useOutletContext } from '@remix-run/react'
import { Button } from '@/components/Button'
import type { SupabaseOutletContext } from '@/root'

export default function Login() {
  const { supabase } = useOutletContext<SupabaseOutletContext>()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    })

    if (error) {
      console.log(error)
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Button onClick={handleLogin}>Log in with Github</Button>

      <Button onClick={handleLogout} color="amber">
        Logout
      </Button>
    </>
  )
}
