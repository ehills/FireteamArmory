# WarForge - Army Builder Application

## Overview

This application, "WarForge", is an army builder tool for tabletop wargaming that allows users to create, save, and manage army compositions. It features a user-friendly interface for browsing units, adding them to armies, customizing units with upgrades, and managing army points costs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture with a clear separation between the frontend and backend:

1. **Frontend**: React-based Single Page Application (SPA) with UI components from Radix UI and styling via Tailwind CSS
2. **Backend**: Express.js server handling API requests
3. **Database**: PostgreSQL with Drizzle ORM for data persistence
4. **State Management**: React Context API for frontend state management
5. **Data Storage**: Local storage for client-side persistence with server-side storage capabilities

The frontend and backend are built together but deployed as separate processes, with the frontend being served as static assets by the backend server. The backend implements a REST API structure for all data operations.

## Key Components

### Frontend Components

1. **App Structure**:
   - Main application routing using Wouter
   - Global state management with React Context
   - Responsive UI design supporting both desktop and mobile views

2. **UI Framework**:
   - Comprehensive UI component library using shadcn/ui (based on Radix UI)
   - Custom styling with Tailwind CSS
   - Dark-themed interface with accent colors

3. **Army Builder Features**:
   - Unit browser with filtering and sorting
   - Army management with unit addition/removal
   - Unit upgrades and modifications
   - Points cost calculation and validation
   - Army saving and loading functionality

### Backend Components

1. **Server Structure**:
   - Express.js API server
   - Route management
   - Request logging
   - Static file serving for frontend assets

2. **Data Management**:
   - Database schema for users
   - Storage interface abstraction
   - In-memory storage implementation (with planned PostgreSQL support)

3. **Database**:
   - Drizzle ORM for database operations
   - Schema definitions with data validation

## Data Flow

1. **Unit Management Flow**:
   - User browses available units in the UnitBrowser component
   - Units can be filtered by type and sorted by different properties
   - When added to an army, units become ArmyUnit objects with selected upgrades
   - Total point costs are calculated including unit base cost and all upgrades

2. **Army Management Flow**:
   - User creates a new army or loads an existing one
   - Units are added to the army with the option to customize with upgrades
   - The application tracks total points and validates against army point cap
   - Armies can be saved to local storage and loaded later

3. **State Management Flow**:
   - Global army state is managed by ArmyContext
   - UI components consume this context to display army data
   - Changes to army composition trigger recalculation of costs
   - Persistent storage is handled through localStorage

## External Dependencies

1. **UI Components**:
   - Radix UI: Accessible component primitives
   - shadcn/ui: Component library built on Radix UI
   - Tailwind CSS: Utility-first CSS framework
   - Lucide: Icon set

2. **Frontend Tools**:
   - React: UI library
   - React Query: Data fetching and caching
   - Wouter: Routing
   - date-fns: Date utility library

3. **Backend Tools**:
   - Express: Web server framework
   - Drizzle ORM: Database ORM
   - Drizzle-zod: Schema validation
   - Neon Database: PostgreSQL provider

4. **Build Tools**:
   - Vite: Frontend build tool
   - TypeScript: Type safety
   - ESBuild: Backend bundling

## Deployment Strategy

The application uses a unified deployment approach:

1. **Development Mode**:
   - `npm run dev` starts both frontend and backend
   - Frontend runs through Vite with hot module reloading
   - Backend automatically serves frontend changes

2. **Production Build**:
   - `npm run build` command creates optimized frontend build with Vite
   - Backend is bundled with ESBuild
   - Static frontend assets are served by the Express server

3. **Database Management**:
   - `npm run db:push` command updates database schema using Drizzle ORM
   - Application is configured to use PostgreSQL through the Neon database service

The application is set up to deploy on Replit with the following configuration:
- Node.js runtime
- PostgreSQL database
- Port 5000 mapped to external port 80
- Automatic deployment workflows