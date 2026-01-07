## Autenticação

Para a autenticação, é necessário passar **email** e **senha**.

1. O sistema verifica se o email existe e se a senha corresponde.
2. Se as credenciais forem válidas:
    - Um **AccessToken** é gerado.
    - Um **ID do Refresh Token** é criado para armazenar a sessão no banco de dados.
3. No final da autenticação, a resposta retorna:
    - `accessToken`
    - `refreshToken`
