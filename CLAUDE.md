# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Architecture

This is a Next.js 15 voice transcription application built with React 19, TypeScript, and Tailwind CSS. The app allows users to upload audio files and view synchronized transcriptions.

### Core Components Structure

- **VoicePlayer** (`components/voice-player.tsx`) - Main component with audio upload, playback controls, and transcription display
- **VoiceTranscriptionApp** (`components/voice-transcription-app.tsx`) - Alternative/demo component with sample data
- **UI Components** (`components/ui/`) - shadcn/ui components (Button, Card, Progress, ScrollArea, Tabs)

### Key Features

- Audio file upload via drag-and-drop or file picker (supports mp3, m4a, wav, ogg)
- JSON transcription upload with start/end timestamps and text labels
- Audio playback with skip controls (-30s, -10s, -5s, +5s, +10s, +30s)
- Variable playback speed (0.5x to 8x)
- Timeline-based transcription navigation with current segment highlighting
- Responsive design with sticky header and grid layout

### Data Flow

1. Audio files are converted to Object URLs for playback
2. Transcription data accepts JSON format: `[{start: number, end: number, label: string}]`
3. Current playback time syncs with transcription highlighting
4. Click on transcription timestamps to seek audio position

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS 4 with CSS variables
- **Icons**: Lucide React
- **TypeScript**: Strict mode enabled with path aliases (`@/*`)

### Development Notes

- Uses Turbopack for fast development builds
- Path aliases configured: `@/*` maps to project root
- Audio file handling includes proper Object URL cleanup
- Debug information panel available in development mode