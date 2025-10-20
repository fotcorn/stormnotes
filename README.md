# Stormnotes

A web-based Wiki/Notes/To-Do list app written in Python/Django and TypeScript/Vue.js.

## Features

- Double-pane layout:
  - Left pane is rendered markdown
  - Right pane is the markdown editor
- Markdown features
  - Standard features like headings, text formatting, links
  - Tables
  - Latex formula support
  - Image upload and display (also to external images)
  - Linking to other pages in the wiki

## Development Setup

### Prerequisites

- Python 3.12+
- Node.js 20+
- [uv](https://docs.astral.sh/uv/) - Fast Python package installer

### Backend Setup

```bash
cd backend

# Install dependencies (creates a virtual environment automatically)
uv sync

# Copy environment file and configure
cp .env.dist .env

# Run migrations
uv run python manage.py migrate

# Create a superuser
uv run python manage.py createsuperuser

# Run development server
uv run python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Code Quality

```bash
cd backend

# Run linter and formatter
uv run ruff check .
uv run ruff format .
```

## Screenshot

![Screentshot](https://raw.githubusercontent.com/fotcorn/stormnotes/master/screenshot.png)
