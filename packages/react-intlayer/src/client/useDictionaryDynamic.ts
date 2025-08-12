'use client';

import configuration from '@intlayer/config/built';
import type { LocalesValues } from '@intlayer/config/client';
import type {
  Dictionary,
  DictionaryKeys,
  LanguageContent,
} from '@intlayer/core';
import { useContext, useMemo } from 'react';
import { IntlayerClientContext } from './IntlayerProvider';
import { useDictionary } from './useDictionary';
import { useLoadDynamic } from './useLoadDynamic';

/**
 * On the server side, Hook that transform a dictionary and return the content
 *
 * If the locale is not provided, it will use the locale from the client context
 */
export const useDictionaryDynamic = <
  T extends Dictionary,
  K extends DictionaryKeys,
>(
  dictionaryPromise: LanguageContent<() => Promise<T>>,
  key: K,
  locale?: LocalesValues
) => {
  const { locale: currentLocale } = useContext(IntlayerClientContext);
  const localeTarget = useMemo(
    () =>
      locale ??
      currentLocale ??
      configuration?.internationalization.defaultLocale,
    [currentLocale, locale]
  );

  const dictionary = useLoadDynamic<T>(
    `${String(key)}.${localeTarget}`,
    dictionaryPromise[localeTarget]!()
  ) as T;

  return useMemo(() => {
    return useDictionary(dictionary, localeTarget);
  }, [dictionary, currentLocale, locale]);
};
