'use client'

import { useForm } from 'react-hook-form'

import login from '@/api/user/login'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface Form {
	email: string
	password: string
}

export default function Entrar() {
	const [loading, setLoading] = useState(false)

	const { register, getValues } = useForm<Form>()

	const submit = async () => {
		const { email, password } = getValues()

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
		<div className='w-full h-screen flex items-center justify-center px-4'>
			<div className='rounded-xl border bg-card text-card-foreground shadow w-full max-w-sm'>
				<div className='flex flex-col space-y-1.5 p-6'>
					<p className='font-semibold tracking-tight text-2xl'>Entrar</p>
					<p className='text-sm text-muted-foreground'>Entre com seu email e senha para acessar o painel</p>
				</div>
				<div className='p-6 pt-0 grid gap-4'>
					<div className='grid gap-2'>
						<Label htmlFor='email'>Email</Label>
						<Input id='email' type='email' required {...register('email')} />
					</div>
					<div className='grid gap-2'>
						<Label htmlFor='password'>Senha</Label>
						<Input id='password' type='password' required {...register('password')} />
					</div>
				</div>
				<div className='flex items-center p-6 pt-0'>
					<Button
						disabled={loading}
						onClick={submit}
						className='w-full flex gap-2'
					>
						{ loading && <Loader2 className='w-4 h-4 animate-spin' /> }
						Entrar
					</Button>
				</div>
			</div>
		</div>
	)
}
