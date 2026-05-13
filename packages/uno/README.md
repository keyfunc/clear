# @keyfunc/uno

> Front-end CLI for generating common development templates.

## Installation

```bash
npm install -g @keyfunc/uno
```

Or run it directly:

```bash
npx @keyfunc/uno --help
```

## Usage

```bash
uno --help
```

Generate a React component:

```bash
uno generate component Button
uno g c Button
```

This creates a `button` directory with:

- `index.tsx`
- `interface.ts`
- `store.ts`

Generate a Zustand store:

```bash
uno generate store user
uno g st user
```

This creates `user.store.ts`.

Generate a service:

```bash
uno generate service user
uno g s user
```

This creates `user.service.ts`.

## Commands

| Command | Alias | Description |
| --- | --- | --- |
| `uno generate component <name>` | `uno g c <name>` | Generate a React component template. |
| `uno generate store <name>` | `uno g st <name>` | Generate a Zustand store template. |
| `uno generate service <name>` | `uno g s <name>` | Generate a service template. |

## License

ISC
