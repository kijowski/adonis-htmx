# Adonis Edge HTMX

[![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

HTMX helpers for the Adonis web server and Edge template engine.

It introduces concept of template fragments described on [HTMX website](https://htmx.org/essays/template-fragments/)


## Instalation
Install it using `npm`, `yarn` or `pnpm`.

```bash
# npm
npm i adonis-edge-htmx

# yarn
yarn add adonis-edge-htmx

# pnpm
pnpm add adonis-edge-htmx
```

After install call `configure`:

```bash
node ace configure adonis-edge-htmx
```

## Usage
Make sure to register the provider inside `adonisrc.ts` file.

```ts
providers: [
  // ...
  () => import('adonis-edge-htmx/provider'),
]
```

Add `@fragment` tag to your edge template.
```html
<header>Some header</header>
@fragment("content")
My awesome content
@end
<footer>Some footer</footer>
```

Now you can render not only full template but also just template fragment

```ts
async function full({ view }: HttpContext) {
  return view.render('path/to/template', { data })
}

async function contentOnly({ view }: HttpContext) {
  return view.render('path/to/template#content', { data })
}
```

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"

[license-image]: https://img.shields.io/npm/l/adonis-edge-htmx?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'

[npm-image]: https://img.shields.io/npm/v/adonis-edge-htmx.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/adonis-edge-htmx 'npm'
