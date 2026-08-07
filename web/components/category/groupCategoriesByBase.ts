export interface CategoryOption {
    value: string
    label: string
}

export interface CategoryOptionGroup {
    value: string // título do grupo = descrição da categoria base
    items: CategoryOption[]
}

// includeBase: true inclui a própria categoria base como um item selecionável dentro do seu
// próprio grupo (usado no filtro de listagem, onde selecionar só a base ainda faz sentido pra
// achar lançamentos antigos categorizados assim). false (padrão, usado no formulário de
// lançamento) só lista as subcategorias — categoria base vira cabeçalho puramente visual.
export function groupCategoriesByBase(categories: Category[], options: { includeBase?: boolean } = {}): CategoryOptionGroup[] {
    const bases = categories.filter((current) => !current.parentId)

    return bases
        .map((base) => {
            const children = categories.filter((current) => current.parentId === base.id).map((current) => toOption(current))

            return {
                value: base.description,
                items: options.includeBase ? [toOption(base), ...children] : children,
            }
        })
        .filter((group) => group.items.length > 0)
}

function toOption(category: Category): CategoryOption {
    return { value: String(category.id), label: `${category.description} · ${category.type === 'CREDIT' ? 'Crédito' : 'Débito'}` }
}
