export function requireEnv(name: string): string {
    const value = process.env[name]

    if (!value) {
        throw new Error(`A variável de ambiente ${name} precisa estar definida.`)
    }

    return value
}
