# Colabrix Web App Frontend

A powerful, open-source project management and issue tracking tool designed to streamline workflows, enhance team collaboration, and drive productivity. Its user-friendly interface and customizable features empower teams to stay organized and achieve their goals efficiently.

Built with **React + Vite** for optimal performance and developer experience.

## Branch Strategy

- **main** - Production branch (protected)
- **dev** - Development branch where all developers work
- **staging** - Pre-production/QA branch for testing before production

## Setup Process

### Prerequisites

- Node.js (version 18+)
- npm or yarn
- Git
- Docker (optional, for containerized development)

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Colabrix/colabrix-web-app-frontend.git
   cd colabrix-web-app-frontend
   ```

2. **Switch to development branch**

   ```bash
   git checkout dev
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Environment setup**
   - Copy `env.example` to `.env.local`
   - Configure environment variables as needed

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open application**
   Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Development Workflow

### Sprint-based Development

- All feature development happens on the `dev` branch
- Create feature branches from `dev` for individual tasks
- Submit pull requests to merge back into `dev`

### Branch Flow

1. **Feature Development**: `dev` → `feature/task-name` → `dev`
2. **QA Testing**: `dev` → `staging` (for pre-production testing)
3. **Production**: `staging` → `main` (after QA approval)

### Sprint Process

1. Start sprint by pulling latest `dev` branch
2. Create feature branches from `dev`
3. Develop and test features locally
4. Submit PR to `dev` branch
5. After sprint completion, merge `dev` to `staging` for QA
6. Once QA approved, merge `staging` to `main` for production

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run prepare` - Setup Husky git hooks

## Docker Support

### Production Build

```bash
# Build and run production container
docker-compose up --build

# Or build manually
docker build -t colabrix-frontend .
docker run -p 80:80 colabrix-frontend
```

### Development with Docker

```bash
# Run development environment
docker-compose --profile dev up --build
```

## Code Quality & Standards

### Pre-commit Hooks

- **Husky** automatically runs linting and formatting before commits
- **Commitlint** enforces conventional commit messages
- **Lint-staged** runs checks only on staged files

### Commit Message Format

```
type(scope): description

feat: add user authentication
fix: resolve navigation bug
docs: update installation guide
style: format code with prettier
refactor: restructure components
test: add unit tests for utils
chore: update dependencies
```

### Project Structure

```
src/
├── assets/           # Static assets (images, icons)
├── components/       # React components
│   ├── common/      # Reusable components
│   ├── forms/       # Form components
│   ├── layout/      # Layout components
│   └── ui/          # UI components
├── constants/        # Application constants
├── hooks/           # Custom React hooks
├── lib/             # Third-party library configurations
├── services/        # API services
├── store/           # State management
├── styles/          # Global styles and themes
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Technology Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS 4
- **Type Checking**: TypeScript
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + Commitlint
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Nginx

## Contributing

1. Always work from the `dev` branch
2. Create descriptive branch names (e.g., `feature/user-authentication`)
3. Write clear commit messages following conventional commits
4. Test your changes locally before submitting PR
5. Ensure all tests pass and linting is clean
6. Follow the established code style and project structure

## Deployment

### Production Deployment

The application is automatically deployed via GitHub Actions:

- **Development**: Pushes to `dev` branch
- **Staging**: Pushes to `staging` branch
- **Production**: Pushes to `main` branch

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy using Docker
docker-compose up -d
```

## License

© 2025 Colabrix. All Rights Reserved. Proprietary and Confidential.
