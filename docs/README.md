# LSM Tree Documentation

This directory contains the VitePress-powered documentation site for the LSM Tree Learning Project.

## Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Running Locally

```bash
# Install dependencies (run from project root)
npm install

# Start dev server
npm run docs:dev
```

The site will be available at `http://localhost:5173`

### Building

```bash
# Build static site
npm run docs:build

# Preview production build
npm run docs:preview
```

## Structure

```
docs/
├── .vitepress/
│   ├── config.js          # VitePress configuration
│   └── dist/              # Build output (gitignored)
├── guide/                 # Implementation guides
│   ├── introduction.md
│   ├── prerequisites.md
│   ├── setup.md
│   └── phase*.md
├── concepts/              # Theoretical deep-dives
│   ├── what-is-lsm.md
│   ├── why-lsm.md
│   ├── memtable.md
│   └── ...
├── implementation/        # Code documentation
│   ├── overview.md
│   ├── architecture.md
│   └── ...
└── index.md              # Home page
```

## Writing Documentation

### Adding a New Page

1. Create a new `.md` file in the appropriate directory
2. Add frontmatter if needed:
   ```md
   ---
   title: Page Title
   description: Page description for SEO
   ---
   ```
3. Update `.vitepress/config.js` sidebar configuration
4. Write content using markdown

### Code Blocks

Use syntax highlighting for C++:

\`\`\`cpp
class MemTable {
public:
    void put(const std::string& key, const std::string& value);
    std::optional<std::string> get(const std::string& key);
};
\`\`\`

### Callouts

VitePress supports special callouts:

```md
::: tip
This is a helpful tip!
:::

::: warning
This is a warning about potential issues.
:::

::: danger
This is a critical warning!
:::

::: info
Additional information.
:::
```

## Deployment

The site is automatically deployed to Netlify when you push to the repository.

### Manual Deployment

1. Build the site: `npm run docs:build`
2. Deploy the `docs/.vitepress/dist` directory

### Netlify Configuration

See `netlify.toml` in the project root for deployment configuration.

## Tips

1. **Document as you learn** - The best time to document is when you're learning
2. **Include diagrams** - Use ASCII art or mermaid diagrams
3. **Add code examples** - Show real code from the implementation
4. **Link between pages** - Help readers navigate related content
5. **Keep it updated** - Update docs when code changes

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Mermaid Diagrams](https://mermaid.js.org/) (supported in VitePress)
