# Adonis HTMX

[![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

Better HTMX development with AdonisJS framework.

## Instalation
Install and configure it in two steps.

```bash
# npm
npm i adonis-htmx
node ace configure adonis-htmx
```

Or use `ace add` command that combines those two steps:
```bash
node ace add adonis-htmx
```

## Api

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
The provider adds set of `htmxX` properties to `Response`. This introduces fluent interface for setting correct htmx headers.

```ts
async function handle({ response, view }: HttpContext) {

  response
    .htmxLocation('/client-redirect')
    .htmxTrigger('some-event')

  return view('page/test', { data });
}
```

Properties that expect urls (`htmxLocation`, `htmxRedirect`, `htmxPushUrl`, `htmxReplaceUrl`) can be provided with route definitions in a form of `[string, params, options]` - these are passed to `router.makeUrl` function to resolve the final path e.g:

```ts
async function handle({ response, view }: HttpContext) {

  response
    .htmxLocation(['profile.show', { userId: 4 }])

  return response.status(200)
}
```

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"

[license-image]: https://img.shields.io/npm/l/adonis-htmx?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'

[npm-image]: https://img.shields.io/npm/v/adonis-htmx.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/adonis-htmx 'npm'
