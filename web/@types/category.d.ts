interface Category {
    id: number
    description: string
    type: string
    parentId: number | null
    userId: number | null
    createdAt: string
    updatedAt: string
}

type CategoryType = 'DEBIT' | 'CREDIT'