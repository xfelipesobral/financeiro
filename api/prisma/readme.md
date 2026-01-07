### Criar e aplicar migrações em desenvolvimento

```sh
npx prisma migrate dev --name nome-da-migration
npx prisma generate
```

### Aplicar a migração em produção

```sh
npx prisma migrate deploy
```