'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Plus, Trash2 } from 'lucide-react'

import apiGetCategories from '@/api/category/list'
import { CategoryFormDialog } from '@/components/category/categoryFormDialog'
import { DeleteCategoryDialog } from '@/components/category/deleteCategoryDialog'
import { SubTitle, Title } from '@/components/title'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const CATEGORY_TYPE_LABELS: Record<string, string> = {
    DEBIT: 'Débito',
    CREDIT: 'Crédito',
}

export default function CategoriasPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    const [formOpen, setFormOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [newCategoryParentId, setNewCategoryParentId] = useState<number | null>(null)
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        setLoading(true)

        const response = await apiGetCategories()

        if (!response.success) {
            toast.error(response.message || 'Erro ao buscar categorias')
            setLoading(false)
            return
        }

        setCategories(response.data || [])
        setLoading(false)
    }

    const closeForm = (reload = false) => {
        setFormOpen(false)
        setEditingCategory(null)
        setNewCategoryParentId(null)

        if (reload) {
            fetchCategories()
        }
    }

    const baseCategories = categories.filter((current) => !current.parentId)

    return (
        <div className="p-4 grid gap-4">
            <CategoryFormDialog
                open={formOpen || !!editingCategory}
                categories={categories}
                category={editingCategory}
                initialParentId={newCategoryParentId}
                closed={closeForm}
            />

            <DeleteCategoryDialog
                category={deletingCategory}
                closed={(reload = false) => {
                    setDeletingCategory(null)

                    if (reload) {
                        fetchCategories()
                    }
                }}
            />

            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <Title>Categorias</Title>
                    <SubTitle>Categorias base agrupam o relatório geral; crie subcategorias específicas dentro delas</SubTitle>
                </div>

                <Button onClick={() => setFormOpen(true)}>
                    <Plus /> Nova categoria base
                </Button>
            </div>

            {!loading && !baseCategories.length && <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada ainda.</p>}

            <div className="grid gap-4">
                {baseCategories.map((base) => {
                    const isSystem = base.userId === null
                    const children = categories.filter((current) => current.parentId === base.id)

                    return (
                        <Card key={base.id}>
                            <CardHeader className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CardTitle>{base.description}</CardTitle>
                                    <Badge variant={base.type === 'CREDIT' ? 'default' : 'destructive'}>{CATEGORY_TYPE_LABELS[base.type]}</Badge>
                                    {isSystem && <Badge variant="secondary">Sistema</Badge>}
                                </div>

                                <div className="flex gap-1">
                                    {!isSystem && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setNewCategoryParentId(base.id)
                                                setFormOpen(true)
                                            }}>
                                            <Plus /> Subcategoria
                                        </Button>
                                    )}
                                    {!isSystem && (
                                        <>
                                            <Button variant="ghost" size="icon" onClick={() => setEditingCategory(base)}>
                                                <Pencil />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeletingCategory(base)}>
                                                <Trash2 />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardHeader>

                            {!!children.length && (
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Descrição</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {children.map((child) => {
                                                const isChildSystem = child.userId === null

                                                return (
                                                    <TableRow key={child.id}>
                                                        <TableCell>{child.description}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={child.type === 'CREDIT' ? 'default' : 'destructive'}>
                                                                {CATEGORY_TYPE_LABELS[child.type]}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {!isChildSystem && (
                                                                <>
                                                                    <Button variant="ghost" size="icon" onClick={() => setEditingCategory(child)}>
                                                                        <Pencil />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => setDeletingCategory(child)}>
                                                                        <Trash2 />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
