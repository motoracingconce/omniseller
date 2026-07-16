# Guía de Deploy — Radar de Mercado

## 1. Crear cuenta Supabase (gratis)

1. Ir a https://supabase.com y crear cuenta
2. Crear nuevo proyecto
3. Ir a Settings → API y copiar:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
4. Ir a SQL Editor y ejecutar el SQL en `lib/supabase.ts` (al final del archivo)

## 2. Subir código a GitHub

```bash
git init
git add .
git commit -m "feat: MVP Radar de Mercado"
git remote add origin https://github.com/TU_USUARIO/radar-de-mercado.git
git push -u origin main
```

## 3. Deploy en Vercel (gratis)

1. Ir a https://vercel.com y conectar con GitHub
2. Importar el repositorio `radar-de-mercado`
3. En Environment Variables agregar:
   - `APIFY_API_TOKEN` = apify_api_CH8sMbiwKgZHLXerYHrAA8uVC15F5F00GBwU
   - `APIFY_ACTOR_ID` = karamelo~mercadolibre-scraper-espanol-castellano
   - `NEXT_PUBLIC_SUPABASE_URL` = (del paso 1)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (del paso 1)
   - `SUPABASE_SERVICE_ROLE_KEY` = (del paso 1)
   - `NEXT_PUBLIC_SITE_URL` = https://TU-DOMINIO.vercel.app
4. Click Deploy

## 4. Dominio personalizado (opcional)

En Vercel → Settings → Domains → agregar tu dominio.

## 5. Correr localmente

```bash
npm install
npm run dev
# Abre http://localhost:3000
```

## Stack completo

| Servicio | Plan | Costo |
|----------|------|-------|
| Vercel | Hobby (gratis) | $0 |
| Supabase | Free tier | $0 |
| Apify | Free ($5/mes crédito) | $0 |
| **Total** | | **$0/mes** |

Cuando tengas suscriptores pagando, el Apify Starter ($49/mes) da $49 de crédito adicional.

## Integrar MercadoPago (pagos Chile)

1. Crear cuenta en https://www.mercadopago.cl/developers
2. Obtener Access Token
3. Agregar `MERCADOPAGO_ACCESS_TOKEN` en Vercel env vars
4. Instalar SDK: `npm install mercadopago`

## Activar autenticación Supabase

En `app/auth/login/page.tsx` y `app/auth/register/page.tsx` reemplazar el `TODO` con:

```typescript
import { supabase } from '@/lib/supabase'

// Register:
const { error } = await supabase.auth.signUp({ email, password })

// Login:
const { error } = await supabase.auth.signInWithPassword({ email, password })
```
