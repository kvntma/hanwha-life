# Standalone Scripts

This directory contains standalone scripts that are independent of the Next.js application. These scripts are typically used for:

- Database migrations
- Data seeding
- One-time data transformations
- Utility scripts
- Development tools

## Structure

```
scripts/
├── db/              # Database-related scripts
├── utils/           # Utility scripts
└── README.md        # This file
```

## Usage

To run a script:

```bash
# Using ts-node (recommended for TypeScript scripts)
npx ts-node scripts/path/to/script.ts

# Using node (for JavaScript scripts)
node scripts/path/to/script.js
```

## Adding New Scripts

1. Create your script in the appropriate subdirectory
2. Add any necessary dependencies to the root `package.json`
3. Document the script's purpose and usage in its own README if needed
4. Add any environment variables to `.env.local` if required

## Best Practices

- Keep scripts focused and single-purpose
- Include error handling
- Add logging for important operations
- Document dependencies and requirements
- Use TypeScript for better type safety
- Add appropriate comments and documentation
