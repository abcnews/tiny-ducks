# Tiny Ducks

`tiny-ducks` is a small redux-style state management module for React.

## Usage

For usage examples see [the example](./example/index.tsx)/

## Development

This module uses [`tsdx`](https://github.com/palmerhq/tsdx/) for development and packaging.

Get started in the root folder. This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

```bash
npm i
npm start
```

Then run the example inside another terminal:

```bash
cd example
npm i
npm start
```

To do a one-off build, use `npm run build`.

To run tests, use `npm test`.

## Configuration

Code quality is [set up for you](https://github.com/palmerhq/tsdx/pull/45/files) with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test`. This runs the test watcher (Jest) in an interactive mode. By default, runs tests related to files changed since the last commit.

### Rollup

TSDX uses [Rollup v1.x](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.
