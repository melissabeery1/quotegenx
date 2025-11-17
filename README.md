# QuoteGenX - Next.js Edition

This is a complete Next.js project for QuoteGenX, an application for generating stunning, shareable quote images with AI-powered design.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- A package manager like `npm`, `yarn`, or `pnpm`

### 2. Set Up Your Environment Variables

The application requires a Google Gemini API key to function.

1.  **Copy the example environment file:**
    ```bash
    cp .env.example .env.local
    ```

2.  **Add your API key:**
    Open the newly created `.env.local` file and replace the placeholder with your actual Google Gemini API key.
    ```
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```

    > **Security Note:** Your API key is used on the server side and is never exposed to the browser. Do not commit the `.env.local` file to version control.

### 3. Install Dependencies

Navigate to the project directory in your terminal and install the required packages:

```bash
npm install
```
or
```bash
yarn install
```
or
```bash
pnpm install
```

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```
or
```bash
yarn dev
```
or
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

This project uses the Next.js App Router.

-   `src/app/`: Contains all the routes for the application.
    -   `src/app/page.tsx`: The main landing page.
    -   `src/app/create/page.tsx`: The main application interface for creating quote graphics.
    -   `src/app/api/`: Contains all server-side API Route Handlers that securely communicate with the Gemini API.
-   `src/components/`: Contains all the React components used throughout the application.
-   `src/lib/`: Contains shared constants and TypeScript types.
-   `src/services/`: Contains client-side functions for calling the internal Next.js API routes.
-   `public/`: Contains static assets like images and favicons.
