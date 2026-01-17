'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import login from '@/api/user/login'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Form {
    email: string
    password: string
}

export default function Entrar() {
    const [loading, setLoading] = useState(false)
    const {
        register,
        getValues,
        formState: { errors },
    } = useForm<Form>()

    const submit = async () => {
        const { email, password } = getValues()

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
        <div className="w-full min-h-screen bg-stone-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-stone-900">Financeiro</h1>
                    <p className="text-stone-600 text-sm mt-1">Acesse sua conta</p>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-stone-700 text-sm font-medium">
                                Email
                            </Label>
                            <Input id="email" type="email" placeholder="seu@email.com" required className="mt-1.5" {...register('email')} />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-stone-700 text-sm font-medium">
                                Senha
                            </Label>
                            <Input id="password" type="password" placeholder="Sua senha" required className="mt-1.5" {...register('password')} />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <Button disabled={loading} onClick={submit} className="w-full mt-6">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
