'use client';

import type { LocalesValues } from '@intlayer/config/client';
import type { Dictionary } from '@intlayer/core';
import { useContext, useMemo } from 'preact/hooks';
import { getDictionary } from '../getDictionary';
import { IntlayerClientContext } from './IntlayerProvider';

/**
 * On the server side, Hook that transform a dictionary and return the content
 *
 * If the locale is not provided, it will use the locale from the client context
 */
export const useDictionary = <T extends Dictionary>(
  dictionary: T,
  locale?: LocalesValues
) => {
  const { locale: currentLocale } = useContext(IntlayerClientContext);
  const localeTarget = locale ?? currentLocale;

  return useMemo(
    () => getDictionary<T, LocalesValues>(dictionary, localeTarget),
    [dictionary, localeTarget]
  );
};
