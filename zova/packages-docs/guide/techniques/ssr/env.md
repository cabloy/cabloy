# env

Zova SSR provides some env environment variables, which is very convenient to configure the behaviors of certain functions and features.

## Configurable environment variables

| Name                         | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| SSR_COOKIE                   | Whether to enable cookie for ssr                    |
| SSR_COOKIE_THEMEDARK_DEFAULT | The default ThemeDark value when SSR_COOKIE is true |
| SSR_BODYREADYOBSERVER        | Whether to observe the body dom loading process     |
| SSR_API_BASE_URL             | The API BaseURL on ssr server                       |
| SSR_PROD_PORT                | The port of ssr production server                   |

## Dynamic environment variables

The following are the environment variables set according to the runtime environment:

| Name   | Description    |
| ------ | -------------- |
| SSR    | If SSR mode    |
| DEV    | If Development |
| PROD   | If Production  |
| CLIENT | If Client      |
| SERVER | If Server      |
