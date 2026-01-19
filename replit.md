# Ledgerly - AI Receipt & Spending Assistant

## Overview

Ledgerly is an AI-powered receipt tracking and expense management web application. Users can upload receipt images, which are automatically processed using OpenAI's GPT-4o vision capabilities to extract merchant names, amounts, dates, categories, and line items. The app provides spending insights, behavioral nudges, and multi-currency support with automatic USD conversion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, with custom hooks for data fetching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style), Framer Motion for animations
- **Theming**: next-themes for dark/light mode support
- **Charts**: Recharts for spending visualizations

The frontend follows a mobile-first design with a bottom navigation pattern. Key pages include Home, Scan (receipt upload), Expenses (receipt list), Insights (spending analytics), and Profile.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy, session-based auth using express-session
- **Password Hashing**: Node.js crypto (scrypt) for secure password storage
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **File Upload**: Multer with memory storage for receipt image handling

API routes follow a RESTful pattern defined in `shared/routes.ts` with Zod schemas for validation. The server handles receipt upload, AI analysis, user authentication, and insights generation.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines tables for users, receipts, and nudges
- **Migrations**: Managed via drizzle-kit with output to `./migrations`

Key tables:
- `users`: Authentication with username/password
- `receipts`: Stores receipt data including image URLs (base64 for MVP), extracted data, multi-currency amounts
- `nudges`: AI-generated behavioral alerts and insights

### AI Integration
- **Primary AI**: OpenAI GPT-4o for receipt image analysis and spending insights
- **Image Analysis**: Vision API extracts merchant, amount, date, category, items, and currency
- **Insights Generation**: AI analyzes spending patterns and generates personalized recommendations
- **Batch Processing**: Utility module for rate-limited concurrent API calls with retries

### Multi-Currency Support
- Receipts store original currency and amount
- Automatic conversion to USD using Open Exchange Rates API
- Both original and USD amounts displayed in the UI

## External Dependencies

### Third-Party APIs
- **OpenAI API**: GPT-4o for receipt OCR and natural language insights (configured via `OPENAI_API_KEY` or Replit AI Integrations)
- **Open Exchange Rates API**: Currency conversion for non-USD receipts

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `passport` / `passport-local`: Authentication
- `multer`: File upload handling
- `openai`: OpenAI API client
- `recharts`: Chart visualizations
- `framer-motion`: Animations
- `@tanstack/react-query`: Data fetching and caching
- `zod`: Schema validation for API contracts

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY` or `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API access
- `SESSION_SECRET`: Session encryption key (defaults to placeholder in dev)