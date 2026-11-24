# EquipRent Client

The frontend application for **EquipRent**, an equipment rental platform where customers can discover and rent equipment, owners can manage their listings and bookings, and administrators can manage the platform.

## Live Demo

**Live Application:** https://equiprent-client.vercel.app/

**Backend API:** https://equiprent-server.vercel.app/api

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Framer Motion
- Lucide React
- npm

## Features

- Responsive homepage and equipment discovery
- Equipment search, filtering, and sorting
- Equipment details and rental booking flow
- User registration and login
- Role-based dashboards
- Customer dashboard and booking history
- Favorites management
- Owner dashboard and equipment management
- Owner earnings and transaction history
- Admin dashboard and platform management
- Stripe Checkout payment flow
- Payment success and cancellation pages
- Responsive layouts and animated UI components

## Project Structure

```text
equiprent-client/
├── public/
├── src/
│   ├── app/
│   │   ├── (admin)/
│   │   ├── (auth)/
│   │   ├── (owners)/
│   │   ├── (public)/
│   │   └── (users)/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── ...
├── .env.local
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js
- npm
- EquipRent backend API running locally or deployed

## Installation

Clone the repository and navigate to the client directory:

```bash
cd equiprent-client
```

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

Example for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production:

```env
NEXT_PUBLIC_API_URL=https://equiprent-server.vercel.app/api
```

**Important:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put private API keys, database credentials, JWT secrets, or Stripe secret keys in client-side environment variables.

## Running the Client

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Backend Connection

The client communicates with the EquipRent backend API.

**Local API:**

```text
http://localhost:5000/api
```

**Production API:**

```text
https://equiprent-server.vercel.app/api
```

Make sure the backend is running and its CORS configuration allows the frontend origin.

## Payment Flow

EquipRent integrates Stripe Checkout for payment processing.

1. A customer selects equipment and submits a booking request.
2. The frontend requests a Checkout Session from the backend.
3. The customer is redirected to Stripe Checkout.
4. Stripe processes the test payment.
5. The backend verifies the payment through Stripe webhooks.
6. The customer is redirected to the payment success or cancellation page.

The backend is responsible for payment verification and booking creation. The frontend does not independently mark payments as successful.

## Production Build

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

Configure `NEXT_PUBLIC_API_URL` with the production backend URL before building the application.

## Deployment

The frontend is deployed on Vercel:

- **Client:** https://equiprent-client.vercel.app/
- **Server:** https://equiprent-server.vercel.app/

Before deployment:

- Configure the production API URL.
- Ensure the backend is deployed and accessible.
- Configure backend CORS for the frontend domain.
- Verify authentication cookies work over HTTPS.
- Configure Stripe production credentials and webhook endpoint on the backend when moving out of test mode.

## License

This project was developed as an equipment rental platform assignment.