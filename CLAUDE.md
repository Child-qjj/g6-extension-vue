# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**g6-extension-vue** is an extension library that enables Vue components to be used as G6 graph visualization nodes. It supports both Vue 2 and Vue 3 via `vue-demi`.

## Commands

```bash
# Development (docs dev server via dumi)
pnpm run dev

# Build (parallel: CJS via tsc, ESM via tsc, UMD via rollup)
pnpm run build

# Type checking
pnpm run typecheck

# Tests
pnpm run test

# Lint
pnpm run lint

# Run lint fixes
pnpm run lint:fix
```

## Architecture

### Export Chain

`src/index.ts` → `src/vue-node/index.ts` → `src/vue-node/node.ts` + `src/vue-node/render.ts`

### Core Files

- **`src/vue-node/node.ts`** — `VueNode` class extending `HTML` from `@antv/g6`. Implements custom element lifecycle:

  - `connectedCallback()` — initial render via `render()`
  - `attributeChangedCallback()` — re-renders when `component` prop changes
  - `destroy()` — cleanup via `unmount()`
  - `getContext()` — traverses DOM to find Vue app context (Vue 3: `__vue_app__`, Vue 2: `__vue__`)

- **`src/vue-node/render.ts`** — Core rendering logic with dual Vue 2/3 support:
  - `vue_core_mark = '__vue_app__'` — marker for detecting Vue app instances
  - `render()` — async function that creates vnodes, merges `appContext` for Vue 3, mounts `new Vue2()` instances for Vue 2
  - `unmount()` — cleans up Vue 3 via `vRender(null, container)`, Vue 2 via `$destroy()`

### Key Patterns

- **Dual Vue 2/3 support**: Conditional checks via `vue-demi` (`isVue3`, `isVue2`). Vue 3 uses `Vue.render` API with vnode `appContext` merging; Vue 2 uses `new Vue2()` instance with `$mount`/`$destroy`.
- **Reactivity trigger**: The `component` prop is a function `(data) => VNode`. Callers must create new object references (spread or `Object.assign`) to trigger Vue reactivity.
- **Build output**: `lib/` (CJS via tsc), `esm/` (ESM via tsc), `dist/` (UMD min via rollup.config.mjs)
- **Docs**: dumi site in `docs/` directory

### Package Structure

- **Dependencies**: `@antv/g ^6.1.27`, `vue-demi ^0.14.10`
- **Peer dependencies**: `@antv/g6 >= 5.0.0`, `Vue ^2.0.0 || >=3.0.0`
- **Test runner**: vitest
- **Git hooks**: husky + lint-staged
