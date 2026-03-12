# Contributing to AI Appointment Setter

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

- **Be respectful** of differing opinions and experiences
- **Be collaborative** and work together effectively
- **Be professional** in all communications
- **Be patient** with new contributors
- **Give credit** where it's due

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- Supabase account (for database)
- OpenAI API key (for development)

### Setting Up Development Environment

1. **Fork the repository**

```bash
# Click "Fork" on GitHub
```

2. **Clone your fork**

```bash
git clone https://github.com/YOUR_USERNAME/ai-appointment-setter.git
cd ai-appointment-setter
```

3. **Add upstream remote**

```bash
git remote add upstream https://github.com/zamadgopang/ai-appointment-setter.git
```

4. **Install dependencies**

```bash
npm install
```

5. **Set up environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

6. **Run database migrations**

```bash
# Run migrations in your Supabase project
# See supabase/migrations/
```

7. **Start development server**

```bash
npm run dev
```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch (if applicable)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

### Creating a New Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Write code** following our coding standards
2. **Test your changes** thoroughly
3. **Update documentation** if needed
4. **Commit your changes** with clear messages

### Commit Message Format

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```bash
git commit -m "feat(chat): add conversation history persistence"
git commit -m "fix(auth): resolve session refresh issue"
git commit -m "docs(readme): update installation instructions"
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Provide types for all functions and variables
- Use interfaces for object shapes

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad
function getUser(id: any): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use meaningful prop names
- Add JSDoc comments for complex components

```typescript
/**
 * ChatMessage component displays a single message in the chat
 * @param message - The message object to display
 * @param isOwn - Whether this message is from the current user
 */
export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  // ...
}
```

### File Organization

- One component per file
- Group related files together
- Use index files for barrel exports
- Keep API routes RESTful

```
components/
  chat/
    ChatMessage.tsx
    ChatInput.tsx
    ChatHistory.tsx
    index.ts
```

### Naming Conventions

- **Components**: PascalCase (`ChatMessage.tsx`)
- **Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Files**: kebab-case for non-components (`rate-limit.ts`)
- **CSS classes**: kebab-case (`chat-message-container`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Use trailing commas
- Max line length: 100 characters
- No semicolons (follow project convention)

```typescript
// Good
const user = {
  name: 'John',
  email: 'john@example.com',
}

// Bad
const user = {
  name: "John",
  email: "john@example.com"
};
```

### Error Handling

- Always handle errors explicitly
- Use try-catch for async operations
- Provide meaningful error messages
- Log errors for debugging

```typescript
// Good
try {
  const data = await fetchData()
  return data
} catch (error) {
  console.error('Failed to fetch data:', error)
  throw new Error('Unable to load data. Please try again.')
}

// Bad
const data = await fetchData()
```

### Security

- Validate all user input
- Use parameterized queries
- Never expose sensitive data
- Encrypt sensitive data at rest
- Use HTTPS in production

```typescript
// Good
const validatedData = schema.parse(userInput)

// Bad
const data = userInput // No validation
```

## Submitting Changes

### Pull Request Process

1. **Update your branch**

```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests and linting**

```bash
npm run type-check
npm run lint
npm test
```

3. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

4. **Create Pull Request**

- Go to GitHub and create a PR
- Fill out the PR template
- Link related issues
- Request review

### Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what and why
- **Testing**: Describe how you tested
- **Screenshots**: Include for UI changes
- **Breaking Changes**: Note any breaking changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe your testing approach

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
```

## Reporting Bugs

### Before Submitting

1. Check existing issues
2. Search closed issues
3. Try latest version
4. Gather information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96]
- Node version: [e.g., 18.0.0]
- Version: [e.g., 0.1.0]

**Additional context**
Any other relevant information
```

## Feature Requests

### Before Submitting

1. Check existing feature requests
2. Consider if it fits project scope
3. Think about implementation

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
A clear description of what you want

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Any other context or screenshots
```

## Development Tips

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript check
npm run format          # Format code with Prettier

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database

# Docker
npm run docker:build    # Build Docker image
npm run docker:run      # Run Docker container
```

### Debugging

1. **Use browser DevTools** for frontend issues
2. **Check server logs** for API issues
3. **Use debugger** statements
4. **Enable verbose logging** in development

### Testing Guidelines

- Write tests for new features
- Update tests for changed features
- Aim for high coverage
- Test edge cases
- Mock external dependencies

```typescript
describe('getUserData', () => {
  it('should return user data for valid ID', async () => {
    const user = await getUserData('123')
    expect(user).toHaveProperty('id', '123')
  })

  it('should throw error for invalid ID', async () => {
    await expect(getUserData('invalid')).rejects.toThrow()
  })
})
```

## Getting Help

- **Discord**: Join our community (link TBD)
- **GitHub Discussions**: Ask questions
- **GitHub Issues**: Report bugs
- **Email**: support@example.com

## Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- GitHub contributors graph

Thank you for contributing! 🎉

---

**Last Updated**: March 2026
