'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Loader2, Lock, Mail } from 'lucide-react'

import login from '@/api/user/login'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Form {
    email: string
    password: string
}

export default function EntrarPage() {
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Form>()

    const submit = async ({ email, password }: Form) => {
        if (!email || !password) {
            toast.error('E-mail e senha são obrigatórios')
            return
        }

        setLoading(true)
        const response = await login(email, password)
        setLoading(false)

        if (typeof response === 'string') {
            toast.error(response)
            return
        }

        toast.success('Login efetuado com sucesso')
        console.log(response)
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-120 from-stone-50 via-stone-100 to-stone-50 p-4">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Entre com seu email e senha para acessar sua conta</p>
                </div>

                <div className="border p-6 rounded-xl bg-white">
                    <div className="space-y-1 pb-4">
                        <h2 className="text-xl font-bold">Entrar</h2>
                        <p className="text-sm text-stone-600">Acesso seguro ao sistema</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-600" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    autoComplete="email"
                                    className="h-10 pl-9"
                                    {...register('email', {
                                        required: 'E-mail é obrigatório',
                                    })}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-600" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Sua senha"
                                    autoComplete="current-password"
                                    className="h-10 pl-9"
                                    {...register('password', {
                                        required: 'Senha é obrigatória',
                                    })}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" disabled={loading} className="h-10 w-full mt-2" onClick={handleSubmit(submit)}>
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}
