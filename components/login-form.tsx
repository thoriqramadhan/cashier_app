'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useState } from "react"

import { cn } from "@/lib/utils"
import { login } from "@/lib/action/login"
import { z } from "zod"
import { ErrorText } from "./text"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const messageInitialState = {
    error: {
      email: '',
      password: ''
    }
  }
  const [message, setMessage] = useState(messageInitialState)
  const [isLoading, setIsLoading] = useState(false)
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const form = event.target
    const formData = new FormData(form)
    const { email, password } = { email: formData.get('email'), password: formData.get('password') };
    const validationResult = checkIsDataValid({ email, password })
    setIsLoading(true)
    const result = await login({ email, password });
  }
  async function checkIsDataValid({ email, password }) {
    const emailResponse = z.string().email().safeParse(email)
    const passwordResponse = z.string().safeParse(email)

    if (!emailResponse.success) {
      setMessage(prev => {
        return {
          ...prev,
          error: {
            ...prev.error,
            email: emailResponse.error.errors[0].message
          }
        }
      })
    }
    if (!passwordResponse.success) {
      console.log(passwordResponse.error);

    }

  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 md:py-32" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your CashierApp account
                </p>
              </div>
              {/* email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@gmail.com"
                  required
                />
                {
                  message.error.email && <ErrorText>{message.error.email}</ErrorText>
                }
              </div>
              {/* password */}
              <div className="grid *:gap-2">
                <div className="flex items-center flex-col ">
                  <Label htmlFor="password" className="self-start">Password</Label>
                  <Input id="password" type="password" name="password" required />
                  {
                    message.error.email && <ErrorText className="self-start">{message.error.email}</ErrorText>
                  }
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
