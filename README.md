# Adonis Edge HTMX

[![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

HTMX wrapper for Edge renderer tailored for the Adonis web server.

It also introduces concept of template fragments described on [HTMX website](https://htmx.org/essays/template-fragments/).

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

### Request

You can check if given request has been made by htmx and act accordingly
```ts
async function handle({ request }: HtppContext) {
  if(request.htmx) {
    // Request has been made by HTMX - you can now use request.htmx to get access to HTMX related info e.g.
    request.htmx.boosted // true if boosted
  }
}
```
### Response

The provider adds `htmx` property to `HttpContext`. This property is a wrapper around `EdgeRenderer` that introduces fluent interface to create and render HTMX responses.

```ts
async function handle({ htmx }: HttpContext) {
...
  return htmx
    .location('/client-redirect')
    .trigger('some-event')
    .render('/path/to/template#fragment', { data })
}
```

### Template fragments

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
async function full({ htmx }: HttpContext) {
  return htmx.render('path/to/template', { data })
}

async function contentOnly({ htmx }: HttpContext) {
  return htmx.render('path/to/template#content', { data })
}
```

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"

[license-image]: https://img.shields.io/npm/l/adonis-edge-htmx?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'

[npm-image]: https://img.shields.io/npm/v/adonis-edge-htmx.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/adonis-edge-htmx 'npm'
