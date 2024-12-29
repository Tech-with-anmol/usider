/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/sign_in`; params?: Router.UnknownInputParams; } | { pathname: `/sign_up`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/settings` | `/settings`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/stats` | `/stats`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/timer` | `/timer`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/to_do` | `/to_do`; params?: Router.UnknownInputParams; } | { pathname: `/path/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/setting/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/sign_in`; params?: Router.UnknownOutputParams; } | { pathname: `/sign_up`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/settings` | `/settings`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/stats` | `/stats`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/timer` | `/timer`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/to_do` | `/to_do`; params?: Router.UnknownOutputParams; } | { pathname: `/path/[id]`, params: Router.UnknownOutputParams & { id: string; } } | { pathname: `/setting/[id]`, params: Router.UnknownOutputParams & { id: string; } };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/sign_in${`?${string}` | `#${string}` | ''}` | `/sign_up${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/settings${`?${string}` | `#${string}` | ''}` | `/settings${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/stats${`?${string}` | `#${string}` | ''}` | `/stats${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/timer${`?${string}` | `#${string}` | ''}` | `/timer${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/to_do${`?${string}` | `#${string}` | ''}` | `/to_do${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/sign_in`; params?: Router.UnknownInputParams; } | { pathname: `/sign_up`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/settings` | `/settings`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/stats` | `/stats`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/timer` | `/timer`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/to_do` | `/to_do`; params?: Router.UnknownInputParams; } | `/path/${Router.SingleRoutePart<T>}` | `/setting/${Router.SingleRoutePart<T>}` | { pathname: `/path/[id]`, params: Router.UnknownInputParams & { id: string | number; } } | { pathname: `/setting/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
    }
  }
}
