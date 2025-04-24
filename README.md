# Astro Portfolio

This is a personal portfolio website built with [Astro](https://astro.build/).

## Features
- Uses Astro Content Collections (native in Astro v3+)
- Portfolio content type: `title`, `image`, `discussion`
- Example entry in `src/content/portfolio/welcome.md`
- Displays all portfolio entries on the homepage

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **Add portfolio entries:**
   - Create new Markdown files in `src/content/portfolio/` with frontmatter:
     ```md
     ---
     title: "Project Title"
     image: "/assets/your-image.png"
     discussion: "Project discussion or description."
     ---
     
     More content here (optional).
     ```

## Project Structure
- `src/content/config.ts`: Defines the content collection schema
- `src/content/portfolio/`: Your portfolio entries
- `src/pages/index.astro`: Lists all portfolio entries
- `src/utils/portfolio.ts`: Helper to get portfolio entries

## Requirements
- Node.js 18+
- Astro v3+ (you have v5.7.5)

---

If you have questions or want to customize further, just ask!
