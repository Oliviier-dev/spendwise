# SpendWise - Personal Expense Tracker

SpendWise is a comprehensive financial management application that helps users take control of their personal finances through several key features:

## Key Features

- **Financial Insights** - Interactive charts and reports provide real-time visualization of your spending patterns and financial health
- **Monthly Budget Management** - Set and manage monthly budgets to control spending across different categories
- **Saving Goals** - Create and track progress towards financial goals like vacations, emergency funds, or major purchases
- **Expense Tracking** - Easily add, edit, and delete transactions with categorization to monitor where your money goes

## Overview

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Next, NONE, and more.

## Tech Stack

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Email & password authentication with Better Auth

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Environment Variables

Environment variable examples can be found in:
- `apps/server/.env.example` for the backend API
- `apps/web/.env.example` for the frontend application

Copy these to create your own `.env` files with the appropriate values.

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:
```bash
bun db:push
```


Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

The API is running at [http://localhost:3000](http://localhost:3000).



## Project Structure

```
spendwise/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Next, NONE)
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun dev:server`: Start only the server
- `bun check-types`: Check TypeScript types across all apps
- `bun db:push`: Push schema changes to database
- `bun db:studio`: Open database studio UI
