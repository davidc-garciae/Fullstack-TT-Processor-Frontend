# Frontend - Fullstack TT

SPA en React + Vite + TypeScript con Redux Toolkit para el flujo de checkout de 5 pasos e integración local con backend.

## Stack

- React 19
- Vite 7
- TypeScript
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS
- shadcn/ui + Radix UI
- next-themes (light/dark adaptive)
- React Hook Form + Zod + @hookform/resolvers
- Vitest

## Arquitectura

Se aplican dos enfoques complementarios:

- **Screaming Architecture** para organizar por dominio/flujo:
  - `src/processes/checkout`
  - `src/features/*`
  - `src/entities/*`
  - `src/shared/*`
- **Atomic Design** para UI reusable:
  - `src/shared/ui/atoms`
  - `src/shared/ui/molecules`
  - `src/shared/ui/organisms`
  - `src/shared/ui/layouts`
- `ThemeProvider` global con toggle persistido en UI para experiencia adaptable.

## Flujo funcional

1. Producto (`/product`)
2. Boton **Pay with credit card** en producto
3. Modal/backdrop para datos de pago y entrega
4. Resumen y pago (`/summary`)
5. Estado final (`/status`) + retorno a producto con stock actualizado

Refinamientos UX aplicados:

- Validación por campo con feedback inline (errores por `touched`/submit).
- Sanitización robusta por tipo de dato (regex + normalización de entrada).
- Boton `Rellenar datos de prueba` para acelerar pruebas manuales.
- Imágenes placeholder locales por producto con fallback visual robusto.

## Integración local

Backend esperado en:

- `http://localhost:3000/api/v1`

Configura variables:

1. Copia `.env.example` a `.env`
2. Ajusta:
   - `VITE_API_BASE_URL=http://localhost:3000/api/v1`

## Seguridad y persistencia

- Se persiste en `localStorage` solo draft seguro del checkout:
  - `productId`, `quantity`, `customer`, `delivery`, `reference`, `idempotencyKey`
- **No** se persiste PAN/CVV.
- La información de tarjeta vive en estado volátil de aplicación.

## Checklist de cumplimiento (MD + Integraciones)

- `MD` - SPA en React + Redux Toolkit: cumplido.
- `MD` - Flujo de 5 pasos: cumplido.
- `MD` - Boton literal `Pay with credit card`: cumplido en `ProductPage`.
- `MD` - Modal/backdrop para tarjeta y entrega: cumplido en `PaymentDeliveryModal`.
- `MD` - UI moderna y profesional: cumplido con migración a Tailwind + shadcn y tema adaptativo.
- `MD` - Resiliencia ante refresh: cumplido con recuperación de `reference` y `idempotencyKey`.
- `MD` - Seguridad de datos sensibles: cumplido (sin persistencia de PAN/CVV).
- `FRONTEND_INTEGRATIONS` - `GET /products`: integrado.
- `FRONTEND_INTEGRATIONS` - `POST /checkout/preview`: integrado.
- `FRONTEND_INTEGRATIONS` - `POST /transactions`: integrado con idempotency.
- `FRONTEND_INTEGRATIONS` - `POST /transactions/:reference/pay`: integrado.
- `FRONTEND_INTEGRATIONS` - `GET /transactions/:reference`: integrado (resumen/estado/recuperación).
- `FRONTEND_INTEGRATIONS` - manejo de errores `400/404/429/5xx`: integrado con mapeo a mensajes UX.

## Scripts

- `pnpm dev`
- `pnpm lint`
- `pnpm build`
- `pnpm test`
- `pnpm test:cov`

## Cobertura de pruebas

Resultado actual:

- `pnpm test:cov` supera el **80%** global.
- Resultado vigente: `86.26%` statements, `76.02%` branches, `84.92%` functions, `87.39%` lines.
