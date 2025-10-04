# Contributing to Asteroid Impact Simulator

Thank you for your interest in contributing! 🌍

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/asteroid-impact-simulator.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m "Add: your feature description"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

Follow the instructions in [README.md](README.md) to set up your development environment.

## Code Style

### TypeScript/React
- Use functional components with hooks
- Follow ESLint configuration
- Use TypeScript for type safety
- Prefer `const` over `let`
- Use meaningful variable names

### Python
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Keep functions focused and small

## Commit Messages

Format: `Type: Description`

Types:
- `Add:` New features
- `Fix:` Bug fixes
- `Update:` Changes to existing features
- `Remove:` Removing features/code
- `Docs:` Documentation changes
- `Style:` Code style changes
- `Refactor:` Code refactoring
- `Test:` Adding or updating tests

Examples:
```
Add: 3D orbit visualization with Three.js
Fix: Crater size calculation for water impacts
Update: NASA API integration with caching
Docs: Add deployment guide
```

## Testing

### Frontend
```bash
npm test
npm run lint
```

### Backend
```bash
cd backend
pytest
pylint *.py
```

## Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Update documentation if needed
- Add tests for new features
- Ensure all tests pass
- Update README if adding features

## Feature Requests

Open an issue with:
- Clear description
- Use case
- Expected behavior
- Screenshots/mockups if applicable

## Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/OS information

## Areas for Contribution

### High Priority
- [ ] Add more deflection strategies
- [ ] Implement PostgreSQL database
- [ ] Add user authentication
- [ ] Export results to PDF
- [ ] Mobile responsiveness improvements

### Medium Priority
- [ ] Add more asteroid data sources
- [ ] Implement real-time collaboration
- [ ] Add educational tooltips
- [ ] Improve 3D model detail
- [ ] Add sound effects

### Documentation
- [ ] Video tutorials
- [ ] API documentation
- [ ] Code examples
- [ ] Translations

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

Thank you for contributing! 🚀
