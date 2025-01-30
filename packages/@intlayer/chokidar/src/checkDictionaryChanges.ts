import { IntlayerEventListener } from '@intlayer/api';
import { buildIntlayerDictionary } from './transpiler/declaration_file_to_dictionary/intlayer_dictionary';

export const checkDictionaryChanges = async () => {
  const eventSource = new IntlayerEventListener();

  eventSource.initialize();

  eventSource.onDictionaryAdded = buildIntlayerDictionary;
  eventSource.onDictionaryChange = buildIntlayerDictionary;
  eventSource.onDictionaryDeleted = buildIntlayerDictionary;

  eventSource.cleanup();
};
