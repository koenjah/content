# Content Generation Tool - Project Overview

## Project Purpose
This is a content generation tool built with React, TypeScript, and Supabase. It allows users to create and manage articles for clients, with automated content generation capabilities.

## Tech Stack
- Frontend: React + TypeScript
- Build Tool: Vite
- UI Framework: shadcn/ui + Tailwind CSS
- Database: Supabase
- State Management: React Query
- Routing: React Router
- Form Handling: React Hook Form + Zod

## Project Structure

### Core Directories
```
/src
├── components/     # UI components
├── hooks/         # Custom React hooks
├── integrations/  # External service integrations
├── lib/          # Utility functions and configurations
├── pages/        # Main application pages
└── services/     # API and business logic services
```

### Key Pages
- `/` - Main dashboard (Index)
- `/create` - Article creation page
- `/create-client` - Client creation page 
- `/client/:clientId` - Individual client page

## Database Schema

### Tables

#### articles
- `id` (UUID, PK)
- `created_at` (timestamp)
- `client_id` (UUID, FK)
- `content` (text)
- `title` (text)
- `word_count` (integer)

#### article_jobs
- `id` (UUID, PK)
- `created_at` (timestamp)
- `client_id` (UUID, FK)
- `job_id` (text)
- `settings` (jsonb)
- `completed` (boolean)
- `article_id` (UUID, FK)

#### clients (referenced but not shown in migrations)
- Contains client information
- Referenced by both articles and article_jobs

### Indexes
- `article_jobs_client_id_idx`
- `article_jobs_job_id_idx`
- `articles_client_id_idx`

## Key Features
1. Client Management
   - Create and manage clients
   - View client-specific content

2. Article Generation
   - Create new articles
   - Track article generation jobs
   - Store article content and metadata

3. Job Management
   - Track content generation jobs
   - Store job settings and status
   - Link completed jobs to articles

## Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Notes
- Uses Supabase for authentication and database
- Implements modern React patterns with TypeScript
- Follows a component-based architecture
- Utilizes shadcn/ui for consistent UI components
