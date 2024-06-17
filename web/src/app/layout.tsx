import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'

import './globals.css'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
})

export const metadata: Metadata = {
	title: 'Financeiro',
	description: 'Controle financeiro pessoal',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {

	return (
		<html lang='pt'>
			<body className={cn(
				'min-h-screen bg-background font-sans antialiased',
				inter.variable
			)}>
				<main>{children}</main>
				<Toaster position='top-center' />
			</body>
		</html>
	)
}
