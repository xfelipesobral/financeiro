'use client'

import { useEffect, useRef, useState } from 'react'
import { endOfDay, startOfDay } from 'date-fns'
import { toast } from 'sonner'
import { ArrowLeftRight, Plus } from 'lucide-react'

import apiGetBankAccounts from '@/api/bankAccount/list'
import apiGetCards from '@/api/card/list'
import apiGetCategories from '@/api/category/list'
import apiGetPaymentMethods from '@/api/paymentMethod/list'
import apiGetTransactions from '@/api/transaction/list'
import { DeleteTransaction } from '@/components/transaction/deleteTransaction'
import { DeleteTransfer } from '@/components/transaction/deleteTransfer'
import { TransactionsList } from '@/components/transaction/list'
import { TransactionPaymentsDialog } from '@/components/transaction/paymentsDialog'
import { TransactionFormDialog } from '@/components/transaction/transactionFormDialog'
import { TransferFormDialog } from '@/components/transaction/transferFormDialog'
import { emptyTransactionFilters, TransactionFilters, TransactionFiltersValue } from '@/components/transaction/transactionFilters'
import { SubTitle, Title } from '@/components/title'
import { Button } from '@/components/ui/button'

const PAGE_SIZE = 10
const FILTER_DEBOUNCE_MS = 400

export default function TransacoesPage() {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [cards, setCards] = useState<Card[]>([])
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
    const [formOpen, setFormOpen] = useState(false)
    const [transferFormOpen, setTransferFormOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
    const [deletingTransfer, setDeletingTransfer] = useState<Transaction | null>(null)
    const [viewingPaymentsTransaction, setViewingPaymentsTransaction] = useState<Transaction | null>(null)

    const [filters, setFilters] = useState<TransactionFiltersValue>(emptyTransactionFilters)
    const [page, setPage] = useState(1)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        fetchOptions()
    }, [])

    // Sempre que os filtros mudam, volta pra primeira página.
    useEffect(() => {
        setPage(1)
    }, [filters])

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        debounceRef.current = setTimeout(() => {
            fetchTransactions()
        }, FILTER_DEBOUNCE_MS)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, page])

    const fetchOptions = async () => {
        const [bankAccountsResponse, categoriesResponse, cardsResponse, paymentMethodsResponse] = await Promise.all([
            apiGetBankAccounts(),
            apiGetCategories(),
            apiGetCards(),
            apiGetPaymentMethods(),
        ])

        if (!bankAccountsResponse.success) {
            toast.error(bankAccountsResponse.message || 'Erro ao buscar contas bancárias')
        } else {
            setBankAccounts(bankAccountsResponse.data || [])
        }

        if (!categoriesResponse.success) {
            toast.error(categoriesResponse.message || 'Erro ao buscar categorias')
        } else {
            setCategories(categoriesResponse.data || [])
        }

        if (!cardsResponse.success) {
            toast.error(cardsResponse.message || 'Erro ao buscar cartões')
        } else {
            setCards(cardsResponse.data || [])
        }

        if (!paymentMethodsResponse.success) {
            toast.error(paymentMethodsResponse.message || 'Erro ao buscar formas de pagamento')
        } else {
            setPaymentMethods(paymentMethodsResponse.data || [])
        }
    }

    const fetchTransactions = async () => {
        setLoading(true)

        const response = await apiGetTransactions({
            page,
            pageSize: PAGE_SIZE,
            categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
            type: filters.type === 'ALL' ? undefined : filters.type,
            startDate: filters.dateRange?.from ? startOfDay(filters.dateRange.from).toISOString() : undefined,
            endDate: filters.dateRange?.to ? endOfDay(filters.dateRange.to).toISOString() : undefined,
        })

        if (!response.success) {
            toast.error(response.message || 'Erro ao buscar lançamentos')
            setLoading(false)
            return
        }

        setTransactions(response.data?.data || [])
        setTotal(response.data?.total || 0)
        setLoading(false)
    }

    return (
        <div className="p-4">
            <TransactionFormDialog
                open={formOpen || !!editingTransaction}
                bankAccounts={bankAccounts}
                categories={categories}
                cards={cards}
                paymentMethods={paymentMethods}
                transaction={editingTransaction}
                closed={(reload = false) => {
                    setFormOpen(false)
                    setEditingTransaction(null)

                    if (reload) {
                        fetchTransactions()
                    }
                }}
            />

            <DeleteTransaction
                transaction={deletingTransaction}
                closed={(reload = false) => {
                    setDeletingTransaction(null)

                    if (reload) {
                        fetchTransactions()
                    }
                }}
            />

            <TransferFormDialog
                open={transferFormOpen}
                bankAccounts={bankAccounts}
                closed={(reload = false) => {
                    setTransferFormOpen(false)

                    if (reload) {
                        fetchTransactions()
                    }
                }}
            />

            <DeleteTransfer
                transaction={deletingTransfer}
                closed={(reload = false) => {
                    setDeletingTransfer(null)

                    if (reload) {
                        fetchTransactions()
                    }
                }}
            />

            <TransactionPaymentsDialog transaction={viewingPaymentsTransaction} closed={() => setViewingPaymentsTransaction(null)} />

            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <Title>Lançamentos</Title>
                    <SubTitle>Registre débitos e créditos das suas contas</SubTitle>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (bankAccounts.length < 2) {
                                toast.error('Cadastre pelo menos 2 contas bancárias antes de fazer uma transferência.')
                                return
                            }

                            setTransferFormOpen(true)
                        }}>
                        <ArrowLeftRight /> Nova transferência
                    </Button>

                    <Button
                        onClick={() => {
                            if (!bankAccounts.length) {
                                toast.error('Cadastre uma conta bancária antes de lançar uma transação.')
                                return
                            }

                            setFormOpen(true)
                        }}>
                        <Plus /> Novo lançamento
                    </Button>
                </div>
            </div>

            <div className="mt-4">
                <TransactionFilters categories={categories} value={filters} onChange={setFilters} />
            </div>

            <div className="mt-4">
                <TransactionsList
                    transactions={transactions}
                    loading={loading}
                    page={page}
                    pageSize={PAGE_SIZE}
                    total={total}
                    onPageChange={setPage}
                    onEdit={setEditingTransaction}
                    onDelete={setDeletingTransaction}
                    onDeleteTransfer={setDeletingTransfer}
                    onViewPayments={setViewingPaymentsTransaction}
                />
            </div>
        </div>
    )
}
