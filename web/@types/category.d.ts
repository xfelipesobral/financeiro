interface Category {
    id: number
    description: string
    type: string
    createdAt: string
    updatedAt: string
}

type CategoryType = 'DEBIT' | 'CREDIT'