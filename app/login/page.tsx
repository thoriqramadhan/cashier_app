import { LoginForm } from "@/components/login-form"
import { redisClient } from "@/lib/redis"

export default async function LoginPage() {
  const response = await redisClient.json.get('users:1')
  console.log(response);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
