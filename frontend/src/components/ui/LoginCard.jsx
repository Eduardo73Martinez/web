import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const LoginCard = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Card ref={ref} className={cn("w-full max-w-md mx-auto", className)} {...props}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Iniciar Sesión
        </CardTitle>
        <CardDescription className="text-center">
          Ingresa tu correo y contraseña para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" type="email" placeholder="nombre@ejemplo.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <a href="#" className="text-sm text-primary underline underline-offset-4 hover:text-primary/80">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Iniciar Sesión
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button">
            Google
          </Button>
          <Button variant="outline" type="button">
            GitHub
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
})
LoginCard.displayName = "LoginCard"

export { LoginCard }
