# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Patrick Canfield built with Astro 5.7.5, featuring a single-page scrollable layout with sophisticated dual-interface navigation (desktop sidebar + mobile dropdown). The site showcases 2D/3D art, software projects, games, and blog posts.

## Common Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally

# Astro CLI
npm run astro <command>  # Run any Astro CLI command
```

## Architecture & Key Concepts

### Content-First Structure
Uses Astro Content Collections with Zod schemas for type-safe content management:

- **Portfolio items**: `src/content/portfolio/` - requires `title`, `image`, optional `sortOrder`
- **Blog posts**: `src/content/blog/` - requires `title`, `pubDate` (Date object)
- **Content validation**: `src/content/config.ts` defines Zod schemas

### Navigation System
Highly sophisticated dual-interface navigation with scroll-aware highlighting:

- **Desktop**: Fixed sidebar (`src/components/Sidebar.astro`) with thumbnail navigation
- **Mobile**: Dropdown select (`src/components/NavSelect.astro`) with auto-scroll updates
- **Controllers**: `src/controllers/navigation.ts` manages scroll detection and active section highlighting
- **Stimulus**: Uses Stimulus 3.2.2 for client-side interactivity

### Layout System
- **Main layout**: `src/layouts/Layout.astro` with responsive flex layout
- **Responsive breakpoint**: 800px - switches from sidebar to mobile dropdown
- **Single-page design**: All portfolio content on index page with smooth scroll navigation

### Component Architecture
- `PortfolioDetail.astro`: Renders portfolio content with proper image handling
- `ImageLink.astro`: Handles image-based links with hover states
- Components use Astro's island architecture for minimal client-side JavaScript

## Content Management

### Adding Portfolio Items
1. Create Markdown file in `src/content/portfolio/`
2. Add required frontmatter:
   ```yaml
   ---
   title: "Project Title"
   image: "./project-image.png"  # Relative to markdown file
   sortOrder: 1  # Optional, controls display order
   ---
   ```
3. Images should be placed in the same directory as the Markdown file
4. Content automatically appears on index page sorted by `sortOrder` then filename

### Adding Blog Posts
1. Create Markdown file in `src/content/blog/`
2. Add required frontmatter:
   ```yaml
   ---
   title: "Post Title"
   pubDate: 2024-01-01  # Date object
   ---
   ```
3. Posts automatically appear on blog page sorted by date (newest first)

## Styling & Assets

- **CSS**: Custom vanilla CSS with normalize.css, located in `src/styles/`
- **Typography**: Custom Peralta font with multiple format fallbacks
- **CSS variables**: Defined in `global.css` for consistent theming
- **Images**: Co-located with content Markdown files, optimized by Astro at build time

## Deployment

- **Platform**: GitHub Pages via automated CI/CD
- **Workflow**: `.github/workflows/astro.yml` - builds and deploys on push to main
- **Node version**: 20 (specified in workflow)
- **Domain**: Hosted at zzt64.com

## Development Notes

- **TypeScript**: Strict configuration enabled
- **Content Collections**: Use `getCollection()` to query content, type-safe by default
- **Stimulus controllers**: Located in `src/controllers/`, follow Stimulus patterns
- **Navigation logic**: Complex scroll detection algorithm considers viewport position
- **Performance**: Static generation with minimal client-side JavaScript