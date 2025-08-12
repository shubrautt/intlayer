import type { IInterpreterPluginReact } from './plugins';

declare module '@intlayer/core' {
  interface IInterpreterPlugin<T, S> extends IInterpreterPluginReact<T> {}
}

export {
  getBrowserLocale,
  IntlayerClientContext,
  IntlayerProvider,
  IntlayerProviderContent,
  localeCookie,
  setLocaleCookie,
  t,
  useDictionary,
  useDictionaryAsync,
  useDictionaryDynamic,
  useI18n,
  useIntlayer,
  useIntlayerContext,
  useLoadDynamic,
  useLocale,
  useLocaleBase,
  useLocaleCookie,
  type IntlayerProviderProps,
} from './client/index';
export { type IntlayerNode } from './IntlayerNode';
export { MarkdownProvider } from './markdown/index';
