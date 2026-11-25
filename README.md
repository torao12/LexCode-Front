This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Conexión con la API (LexCode-Back)

El frontend consume el backend por HTTP. Configura la URL en `.env.local`:

```bash
copy .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000/api   (backend local)
# NEXT_PUBLIC_API_URL=https://<backend>.vercel.app/api   (producción)
```

- `src/lib/api.ts`: cliente de la API. Guarda la sesión, manda `Authorization: Bearer …` y renueva el token solo cuando vence.
- `src/lib/session.tsx`: `SessionProvider` / `useSession()` con el perfil, `login`, `logout` y `reloadProfile`. El rol (alumno, docente, administrador) viene de la cuenta; ya no se cambia desde la interfaz.
- Pantallas conectadas: registro e inicio de sesión (con edad mínima y tutor para menores), recuperar contraseña, Glosario, Asistente Lexis y Perfil (datos, foto, contraseña, consentimientos, descarga de datos y eliminar cuenta).
- Páginas de los enlaces de correo: `/auth/restablecer`, `/auth/confirmado` y `/autorizar-tutor`.
- Dashboard, Dilemas, Actividades, Insignias y las vistas del docente siguen con `src/data/mockLexCode.ts` hasta que existan sus endpoints.

El backend debe permitir el origen del frontend en `CORS_ORIGINS` y usar su URL en `FRONTEND_URL`.
