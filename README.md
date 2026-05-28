# AI Resume Intelligence Dashboard

A full-stack SaaS-style web application that helps users analyze resumes using an intelligent rule-based engine. Users can create an account, paste resume text or upload a text-based PDF, and receive ATS-style scores, detected skills, missing skills, strengths, weaknesses, recommendations, charts, and analysis history.

## Features

- User signup and login with Auth.js credentials authentication
- Password hashing with bcrypt
- Paste resume text or upload a selectable-text PDF
- Rule-based resume analysis without paid AI APIs
- ATS score, frontend score, backend score, and industry readiness score
- Detected skills and missing priority skills
- Strengths, weaknesses, and recommendations
- Recharts-based dashboard analytics
- Saved resume and report history using PostgreSQL and Prisma
- Profile page with account and resume submission history
- Modern dark SaaS-style responsive UI

## Tech Stack

- **Frontend:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
- **UI:** shadcn-style reusable components, Radix Slot, Lucide icons
- **Backend:** Next.js API routes
- **Authentication:** Auth.js / NextAuth credentials provider
- **Database:** PostgreSQL, suitable for local Docker or Neon
- **ORM:** Prisma
- **Charts:** Recharts
- **Validation:** Zod
- **Security:** bcryptjs password hashing
- **PDF Parsing:** pdf-parse for text-based PDF resumes

## Screenshots

Add screenshots here before submission:

- Landing page
- Signup/login page
- Dashboard before analysis
- Dashboard after analysis
- Profile page

## Project Structure

```text
app/
  api/                 Backend API routes
  dashboard/           Protected dashboard page
  login/               Login page
  signup/              Signup page
  profile/             Protected profile page
components/
  cards/               Score card component
  charts/              Recharts visualizations
  dashboard/           Resume analyzer dashboard UI
  forms/               Authentication form
  profile/             Profile UI
  ui/                  Reusable shadcn-style UI primitives
lib/
  analyzer/            Resume analysis engine and skill taxonomy
  auth.ts              Auth.js configuration
  prisma.ts            Prisma client singleton
prisma/
  schema.prisma        Database schema
types/
  analysis.ts          Shared analysis TypeScript types
```

## Environment Variables

Create a `.env` file from `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/resume_dashboard?schema=public"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

For Neon, replace `DATABASE_URL` with the Neon PostgreSQL connection string.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Start PostgreSQL locally:

```bash
docker compose up -d
```

Run Prisma migration:

```bash
pnpm prisma:migrate
```

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Workflow

1. User signs up or logs in.
2. User opens the dashboard.
3. User uploads a text-based PDF or pastes resume text.
4. The frontend sends the resume to `/api/analyze`.
5. The backend extracts text if needed and validates the input.
6. The rule-based analyzer detects skills, calculates scores, and creates recommendations.
7. Prisma stores the resume and report in PostgreSQL.
8. The dashboard displays score cards, charts, insights, and history.

## Important Note About AI

This MVP does not train machine learning models and does not call paid AI APIs. The analysis is an **intelligent rule-based resume analysis engine** using keyword detection, skill taxonomy, project signals, impact signals, and weighted scoring formulas.

## Limitations

- PDF parsing works best with selectable-text PDFs, not scanned image PDFs.
- Scores are heuristic-based, not real ATS vendor scores.
- The analyzer does not compare against a specific job description yet.
- No admin dashboard or downloadable PDF report is currently implemented.

## Future Scope

- Gemini/OpenAI summary generation
- Job description matching
- Resume improvement rewriting
- PDF report export
- Email report sharing
- GitHub and LinkedIn profile analysis
- Admin dashboard
- More advanced analytics and benchmarking
