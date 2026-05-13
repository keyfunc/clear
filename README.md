# Uno

> A front-end development toolkit monorepo.

Uno contains two CLI packages:

| Package | Description |
| --- | --- |
| [`create-uno`](./packages/create-uno) | Create projects from remote templates. |
| [`@keyfun/uno`](./packages/uno) | Generate front-end component, store, and service files. |

## Packages

### create-uno

Use `create-uno` to scaffold a project from templates listed in [`templates.json`](https://github.com/keyfunc/template/blob/master/templates.json).

```bash
pnpm create uno
```

Or:

```bash
npm create uno@latest
yarn create uno
```

### @keyfun/uno

Use `uno` to generate common front-end files.

```bash
npm install -g @keyfun/uno
```

Generate a React component:

```bash
uno generate component Button
uno g c Button
```

Generate a Zustand store:

```bash
uno generate store user
uno g st user
```

Generate a service:

```bash
uno generate service user
uno g s user
```

## Development

Install dependencies from the repository root:

```bash
pnpm install
```

Build a package:

```bash
cd packages/create-uno
npm run build
```

```bash
cd packages/uno
npm run build
```

## Repository

- [Issues](https://github.com/keyfunc/uno/issues)
- [Templates](https://github.com/keyfunc/template)

## License

See package-level licenses.
