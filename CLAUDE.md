# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Type-check with TypeScript and build for production
- `npm run lint` - Run ESLint on all TypeScript files
- `npm run preview` - Preview production build locally

## Technology Stack

- **React 19.2.0** with React Compiler enabled (via babel-plugin-react-compiler)
- **TypeScript** with strict mode enabled
- **Vite 8.0 (beta)** for build tooling and dev server
- **ESLint** with TypeScript, React Hooks, and React Refresh plugins

## Project Structure

This is a minimal React + TypeScript + Vite application with:

- `src/main.tsx` - Application entry point, renders `<App />` into `#root`
- `src/App.tsx` - Main application component
- `index.html` - HTML template with script reference to `/src/main.tsx`
- `public/` - Static assets served directly

## TypeScript Configuration

The project uses a composite TypeScript setup:

- `tsconfig.json` - References both app and node configs
- `tsconfig.app.json` - For application code in `src/` (target: ES2022, JSX: react-jsx)
- `tsconfig.node.json` - For build tooling like `vite.config.ts` (target: ES2023)

Both configs use:
- Strict mode enabled
- Bundler module resolution
- `noUnusedLocals` and `noUnusedParameters` enabled
- `erasableSyntaxOnly` for React Compiler compatibility

## React Compiler

The React Compiler is enabled in [vite.config.ts](vite.config.ts) via Babel plugin. This automatically optimizes React component rendering but may impact dev/build performance.

## ESLint Configuration

Uses flat config format ([eslint.config.js](eslint.config.js)) with:
- TypeScript ESLint recommended rules
- React Hooks plugin (flat config)
- React Refresh plugin for Vite
- Ignores `dist/` directory
