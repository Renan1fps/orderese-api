# OrderEase API

SaaS white-label de gestão de pedidos para restaurantes, padarias e quiosques.  
Arquitetura hexagonal · NestJS · Node 22 · PostgreSQL · Socket.io · Stripe

## Estrutura

```
src/
├── shared/
│   ├── domain/               # Entity, ValueObject, IRepository base classes
│   ├── exceptions/           # DomainException, EntityNotFoundException, ...
│   └── infrastructure/
│       ├── database/         # DataSource (TypeORM)
│       ├── filters/          # DomainExceptionFilter
│       └── guards/           # JwtAuthGuard, TenantGuard
│
└── modules/
    ├── auth/                 # Registro, login, JWT, bcrypt
    ├── tenants/              # Multi-tenancy, slug, orderMode, subscription
    ├── tables/               # Mesas, QR token, status
    ├── menu/                 # Categorias e itens do cardápio
    ├── sessions/             # Sessões de mesa + participantes (table / per_client)
    ├── orders/               # Pedidos, máquina de estados, WebSocket gateway
    └── payments/             # Stripe adapter, webhook handler (agnostic port)
```

## Setup rápido

```bash
cp .env.example .env
# preencha STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_MONTHLY_PRICE_ID

docker-compose up
# API: http://localhost:3000
# Swagger: http://localhost:3000/docs
```

## Fluxo do cliente (PWA)

1. `GET  /tenants/slug/:slug`              → carrega configurações do tenant
2. `GET  /tenants/:tenantId/tables/qr/:qrToken` → resolve a mesa
3. `POST /sessions/join/:qrToken`          → abre/retoma sessão, cria participante
4. `GET  /tenants/:tenantId/menu`          → cardápio disponível
5. `POST /tenants/:tenantId/sessions/:sessionId/orders` → realiza pedido
6. WebSocket `join:session` + evento `order:updated`    → acompanha status

## Fluxo do dashboard

1. `POST /auth/login`                      → JWT
2. `GET  /tenants/:tenantId/orders`        → pedidos ativos (pending/preparing/ready)
3. `PATCH /tenants/:tenantId/orders/:id/status` → atualiza status
4. `POST /tenants/:tenantId/sessions/:sessionId/close` → libera mesa
5. WebSocket `join:dashboard` + evento `order:new`     → recebe pedidos em tempo real

## Modos de pedido

| `order_mode`  | Comportamento                                                      |
|---------------|--------------------------------------------------------------------|
| `table`       | Um participant padrão por sessão. Cliente vai direto ao cardápio.  |
| `per_client`  | Cada device cria seu participant. `displayName` obrigatório.       |

Configurado por tenant em `PATCH /tenants/:id` → campo `orderMode`.

## Adicionando um novo gateway de pagamento

1. Crie `src/modules/payments/infrastructure/adapters/mercadopago.adapter.ts`
2. Implemente a interface `IPaymentService` (mesmos 3 métodos)
3. Troque o provider em `PaymentModule`: `{ provide: PAYMENT_SERVICE, useClass: MercadoPagoAdapter }`

Nenhum outro arquivo precisa mudar.

## Testes

```bash
npm test           # todos os testes
npm run test:cov   # com cobertura
```
