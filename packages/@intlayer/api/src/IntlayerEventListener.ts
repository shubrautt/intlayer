import { intlayerAPI } from '@intlayer/api';
import { DictionaryAPI } from '@intlayer/backend';
import { getConfiguration, IntlayerConfig } from '@intlayer/config';
// @ts-ignore @intlayer/backend is not built yet

export type DictionaryMessageEvent = {
  object: 'DICTIONARY';
  dictionary: DictionaryAPI;
  status: 'ADDED' | 'UPDATED' | 'DELETED' | 'CREATED';
};

export type IntlayerMessageEvent = MessageEvent<DictionaryMessageEvent[]>;

/**
 * IntlayerEventListener class to listen for dictionary changes via SSE (Server-Sent Events).
 *
 * Usage example:
 *
 *   import { buildIntlayerDictionary } from './transpiler/declaration_file_to_dictionary/intlayer_dictionary';
 *   import { IntlayerEventListener } from '@intlayer/api';
 *
 *   export const checkDictionaryChanges = async () => {
 *     // Instantiate the listener
 *     const eventListener = new IntlayerEventListener();
 *
 *     // Set up your callbacks
 *     eventListener.onDictionaryChange = async (dictionary) => {
 *       await buildIntlayerDictionary(dictionary);
 *     };
 *
 *     // Initialize the listener
 *     await eventListener.initialize();
 *
 *     // Optionally, clean up later when you’re done
 *     // eventListener.cleanup();
 *   };
 */
export class IntlayerEventListener {
  private eventSource: EventSource | null = null;

  /**
   * Callback triggered when a Dictionary is ADDED.
   */
  public onDictionaryAdded:
    | ((dictionary: DictionaryAPI) => Promise<void> | void)
    | null = null;

  /**
   * Callback triggered when a Dictionary is UPDATED.
   */
  public onDictionaryChange:
    | ((dictionary: DictionaryAPI) => Promise<void> | void)
    | null = null;

  /**
   * Callback triggered when a Dictionary is DELETED.
   */
  public onDictionaryDeleted:
    | ((dictionary: DictionaryAPI) => Promise<void> | void)
    | null = null;

  constructor(private intlayerConfig?: IntlayerConfig) {}

  /**
   * Initializes the EventSource connection using the given intlayerConfig
   * (or the default config if none was provided).
   */
  public async initialize(): Promise<void> {
    try {
      const config = this.intlayerConfig ?? getConfiguration();
      const { backendURL } = config.editor;

      // Retrieve the access token
      const oAuth2TokenResult = await intlayerAPI.auth.getOAuth2AccessToken();
      const accessToken = oAuth2TokenResult.data?.accessToken;

      if (!accessToken) {
        throw new Error('Failed to retrieve access token');
      }

      const API_ROUTE = `${backendURL}/api/event-listener`;
      const url = `${API_ROUTE}/${accessToken}`;

      this.eventSource = new EventSource(url);
      this.eventSource.onmessage = (event) => this.handleMessage(event);
      this.eventSource.onerror = (event) => this.handleError(event);

      console.log('IntlayerEventListener initialized.');
    } catch (error) {
      console.error('Error initializing IntlayerEventListener:', error);
    }
  }

  /**
   * Cleans up (closes) the EventSource connection.
   */
  public cleanup(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('IntlayerEventListener cleaned up.');
    }
  }

  /**
   * Handles incoming SSE messages, parses the event data,
   * and invokes the appropriate callback.
   */
  private async handleMessage(event: IntlayerMessageEvent): Promise<void> {
    try {
      const { data } = event;
      for (const dataEl of data) {
        switch (dataEl.object) {
          case 'DICTIONARY':
            switch (dataEl.status) {
              case 'ADDED':
                await this.onDictionaryAdded?.(dataEl.dictionary);
                break;
              case 'UPDATED':
                await this.onDictionaryChange?.(dataEl.dictionary);
                break;
              case 'DELETED':
                await this.onDictionaryDeleted?.(dataEl.dictionary);
                break;
              default:
                console.error('Unhandled dictionary status:', dataEl.status);
                break;
            }
            break;
          default:
            console.error('Unknown object type:', dataEl.object);
            break;
        }
      }
    } catch (error) {
      console.error('Error processing dictionary update:', error);
    }
  }

  /**
   * Handles any SSE errors and then performs cleanup.
   */
  private handleError(event: Event): void {
    console.error('EventSource error:', event);
    this.cleanup();
  }
}
