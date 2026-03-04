# Estratégia de testes

Este projeto usa **Jest** para testes unitários e **Supertest** para testes e2e.

## O que está coberto

### Auth
- `AuthService`
  - Login com credenciais válidas retorna `access_token`.
  - E-mail inválido retorna `BadRequestException`.
  - Usuário inexistente retorna `UnauthorizedException`.
  - Senha inválida retorna `UnauthorizedException`.
- `AuthController`
  - Delega o `login` para o service.

### Users
- `UsersService`
  - Criação de usuário com hash de senha.
  - Tratamento de e-mail duplicado (`P2002` -> `ConflictException`).
  - Validação de e-mail inválido (`BadRequestException`).
  - Usuário inexistente em `findOne` (`NotFoundException`).
  - Usuário inexistente em `remove` (`P2025` -> `NotFoundException`).
- `UsersController`
  - Delega o `create` para o service.

### Prisma
- `PrismaService`
  - Instanciação do provider.
  - Execução de `onModuleInit` com chamada de `$connect`.

## Como executar

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Boas práticas adotadas nos testes

- Mocks explícitos de dependências externas (Prisma, JWT, bcrypt).
- Testes focados em comportamento de negócio e contrato de exceções.
- Isolamento dos controllers (sem dependências reais de banco).
