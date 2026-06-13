# ArmyForge - Project Context

ArmyForge is a full-stack army building application designed for tabletop wargaming. It allows users to browse units, add them to an army, apply upgrades, manage veterancy levels, and track total points against a set cap.

## Project Overview

- **Purpose:** A tool for tabletop gamers to build and manage army lists.
- **Main Technologies:**
    - **Frontend:** React (TypeScript), Vite, Tailwind CSS, Radix UI, Wouter (Routing), TanStack Query.
    - **Backend:** Express (TypeScript), Node.js.
    - **Database/ORM:** Drizzle ORM with PostgreSQL (targeting Neon/Postgres).
    - **Validation:** Zod (via `drizzle-zod`).
- **Key Features:**
    - Unit browser with faction filtering.
    - Real-time point calculation for units and total army.
    - Upgrade management with stat modifiers.
    - Veterancy selection affecting unit capabilities.
    - Persistence via `localStorage` (client-side) and a skeletal Express/Drizzle backend.

## Building and Running

### Development
To start the development server (which runs both the Express backend and the Vite frontend):
```bash
npm run dev
```
The application will be served on `http://localhost:5000`.

### Production
To build the project:
```bash
npm run build
```
To run the production build:
```bash
npm run start
```

### Database
To push schema changes to the database:
```bash
npm run db:push
```

## Project Structure

- `client/`: React frontend application.
    - `src/components/`: React components, including a `ui/` folder for shadcn/ui-like Radix components.
    - `src/contexts/`: React Contexts (e.g., `ArmyContext.tsx` handles the core army building logic).
    - `src/data/`: Static data, including the main unit list (`units.ts`).
    - `src/lib/`: Utility functions like `armyUtils.ts` for cost and stat calculations.
    - `src/pages/`: Main application views (`ArmyBuilder.tsx`, `AdminUnits.tsx`).
- `server/`: Express backend.
    - `index.ts`: Server entry point and Vite integration.
    - `routes.ts`: API route definitions (prefixed with `/api`).
    - `storage.ts`: Data persistence layer (currently implements `MemStorage`).
- `shared/`: Shared code between client and server.
    - `schema.ts`: Drizzle ORM table definitions and Zod schemas.

## Development Conventions

- **Component Library:** Use Radix UI primitives. Pre-built UI components are located in `client/src/components/ui`.
- **Styling:** Tailwind CSS is used for all styling. Follow the existing utility-first patterns.
- **State Management:** Core army state is managed in `ArmyContext.tsx`. Use the `useArmy` hook to access it.
- **Data Fetching:** Use TanStack Query for any server-side data fetching.
- **Type Safety:** Ensure all data structures match the interfaces defined in `shared/schema.ts` and `client/src/data/units.ts`.
- **API Design:** All backend routes should be defined in `server/routes.ts` and prefixed with `/api`.
- **Persistence:** Currently, armies are saved to `localStorage`. Server-side persistence is scaffolded but not fully implemented for army storage.
