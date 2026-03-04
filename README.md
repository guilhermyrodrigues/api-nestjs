# API NestJS (Auth + Users + Prisma)

Projeto backend em NestJS com autenticação via JWT e persistência em PostgreSQL com Prisma.

## Estrutura atual do projeto

```text
src/
  auth/         # login e geração de token JWT
  prisma/       # acesso ao PrismaClient
  users/        # CRUD de usuários
  app.module.ts # composição de módulos
prisma/
  schema.prisma # modelos e enums do banco
test/           # testes e2e
```

## Como executar

```bash
npm install
npm run start:dev
```

## Melhorias de boas práticas aplicadas

- Tratamento de erros com exceções HTTP do Nest (`BadRequestException`, `UnauthorizedException`, `NotFoundException`, `ConflictException`).
- Operações de senha com `bcrypt` assíncrono (`hash`/`compare`) para evitar bloqueio da event-loop.
- Sanitização de retorno de usuários: password não é retornada nos endpoints de users.
- Tratamento de erros do Prisma (`P2002` e `P2025`) com mensagens de domínio.
- Payload do JWT com `sub` (id do usuário), role e uso de `signAsync`.

## Próximos passos recomendados (roadmap)

1. **Validação declarativa de DTOs**
   - Adicionar `class-validator`/`class-transformer` e `ValidationPipe` global.
2. **Configuração por ambiente**
   - Usar `@nestjs/config` + schema (Joi/Zod) para validar env vars na inicialização.
3. **Camada de autenticação/autorização**
   - Implementar `JwtAuthGuard`, `RolesGuard` e decorators de role.
4. **Observabilidade**
   - Logging estruturado (pino/winston), correlation id e métricas (Prometheus/OpenTelemetry).
5. **Testes úteis**
   - Aumentar cobertura de serviços e e2e para fluxos de erro/sucesso.
6. **Hardening de API**
   - Adicionar rate limiting, CORS configurável e versionamento de API.

## Comandos úteis

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```
