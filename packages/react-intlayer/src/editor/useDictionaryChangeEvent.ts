import { IntlayerEventListener } from '@intlayer/api';
import { getConfiguration } from '@intlayer/config/client';
import { useEffect } from 'react';

export const useDictionaryChangeEvent = () => {
  const { editor } = getConfiguration();
  const eventSource = new IntlayerEventListener();

  useEffect(() => {
    if (!editor.enabled) return;
    if (!editor.clientId) return;
    if (!editor.clientSecret) return;

    eventSource.initialize();

    eventSource.onDictionaryAdded = (dictionary) =>
      console.log('dictionary added', dictionary);
    eventSource.onDictionaryChange = (dictionary) =>
      console.log('dictionary changed', dictionary);
    eventSource.onDictionaryDeleted = (dictionary) =>
      console.log('dictionary deleted', dictionary);

    return () => eventSource.cleanup();
  }, []);
};
