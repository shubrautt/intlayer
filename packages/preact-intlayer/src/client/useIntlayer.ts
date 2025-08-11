'use client';

import type { LocalesValues } from '@intlayer/config/client';
import type { DictionaryKeys } from '@intlayer/core';
// @ts-ignore intlayer declared for module augmentation
import type { IntlayerDictionaryTypesConnector } from 'intlayer';
import { useContext, useMemo } from 'preact/hooks';
import { getIntlayer } from '../getIntlayer';
import type { DeepTransformContent } from '../plugins';
import { IntlayerClientContext } from './IntlayerProvider';

/**
 * On the client side, Hook that picking one dictionary by its key and return the content
 *
 * If the locale is not provided, it will use the locale from the client context
 */
export const useIntlayer = <T extends DictionaryKeys>(
  key: T,
  locale?: LocalesValues
): DeepTransformContent<IntlayerDictionaryTypesConnector[T]['content']> => {
  const { locale: currentLocale } = useContext(IntlayerClientContext);
  const localeTarget = locale ?? currentLocale;

  return useMemo(
    () => getIntlayer(key, localeTarget) as any,
    [key, localeTarget]
  );
};
