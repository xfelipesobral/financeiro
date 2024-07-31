import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import Inflow from '@/components/tabelas/inflow'
import Outflow from '@/components/tabelas/outflow'
import { Transaction } from '@/components/painel/transaction'

function dayShift() {
    const now = new Date().getHours()
    if (now >= 0 && now < 12) {
        return 'Bom dia'
    }

    if (now >= 12 && now < 18) {
        return 'Boa tarde'
    }

    return 'Boa noite'
}

export default function Painel() {
    const title = `${dayShift()}, Felipe`

    return (
        <div className='flex-1 flex flex-col gap-6'>
            <div className='flex gap-6 justify-between'>
                <div>
                    <p className='text-3xl font-bold tracking-tight'>{title}</p>
                    <p className='text-gray-500'>Resumo da sua saúde financeira</p>
                </div>
                <Transaction />

                {/* <Card>
                    <CardHeader className='pb-3'>
                        <CardTitle>Últimas movimentações</CardTitle>
                        <CardDescription className='text-balance leading-relaxed'>
                            Acompanhe suas últimas movimentações e tenha um controle mais eficiente.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardDescription>Em carteira</CardDescription>
                        <CardTitle className='text-4xl'>R$ 1.329,00</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardDescription>Investido</CardDescription>
                        <CardTitle className='text-4xl'>R$ 1.329,00</CardTitle>
                    </CardHeader>
                </Card> */}
            </div>
            <div>
                <div className='flex gap-6'>
                    <Card className='flex-1 h-fit'>
                        <CardHeader className='pb-3'>
                            <CardTitle>Entradas</CardTitle>
                            <CardDescription className='text-balance leading-relaxed'>
                                Todas entradas no período
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Inflow />
                        </CardContent>
                    </Card>
                    <Card className='flex-1 h-fit'>
                        <CardHeader className='pb-3'>
                            <CardTitle>Saídas</CardTitle>
                            <CardDescription className='text-balance leading-relaxed'>
                                Todas saídas no período
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Outflow />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}