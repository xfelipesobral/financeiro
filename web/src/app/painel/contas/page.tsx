import { Button } from '@/components/ui/button'

export default function Contas() {

    return (
        <div>
            <div className='flex bg-white justify-between rounded-lg border items-center p-2'>
                <p className='font-semibold'>Contas</p>

                <Button>Nova conta</Button>
            </div>
            <p>teste</p>
        </div>
    )
}