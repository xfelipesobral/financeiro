/**
 * Cria uma classe de erro customizada para ser usada em requisicoes HTTP
 */
export class HttpError extends Error {
    public statusCode: number // Codigo HTTP de erro

    // Construtor da classe
    constructor(message: string, statusCode: number = 400) {
        super(message) // Define a mensagem de erro
        this.statusCode = statusCode // Define o codigo HTTP de erro
        Object.setPrototypeOf(this, new.target.prototype) // Define o prototipo da classe (para garantir que a classe seja instanciada corretamente)
    }
}
