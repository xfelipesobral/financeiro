import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldDescription, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

interface Params {
    id: number | null
}

export function SteamInventoryItem({ id }: Params) {
    const dialogVisible = id !== null

    return (
        <Dialog open={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{(id || 0) > 0 ? 'Editando Item' : 'Adicionando Item'}</DialogTitle>
                    <DialogDescription>
                        Adicione ou edite um item do seu inventário Steam. Preencha os detalhes do item e salve para atualizar seu inventário.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Field>
                        <FieldLabel htmlFor="input-demo-api-key">URL de inspeção</FieldLabel>
                        <Input id="input-demo-api-key" type="text" placeholder="sk-..." />
                    </Field>
                </div>
            </DialogContent>
        </Dialog>
    )
}
