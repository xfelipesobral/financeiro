export function Error({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Ocorreu um erro</h1>
            <p className="text-gray-600">{message}</p>
        </div>
    )
}
