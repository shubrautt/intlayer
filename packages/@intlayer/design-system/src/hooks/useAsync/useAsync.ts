'use client';

import { useEffect, useRef } from 'react';
import { useAsyncState } from './useAsyncStateStore';

// Pending promises cache to prevent parallel requests when multiple components use the hook
const pendingPromises = new Map();

// Defines the base structure for the result of the custom hook.
type UseAsyncResultBase<T extends (...args: any[]) => Promise<any>> = {
  isFetched: boolean;
  isLoading: boolean;
  isInvalidated: boolean;
  isSuccess: boolean;
  isDisabled: boolean;
  isWaitingData: boolean;
  isRevalidating: boolean;
  error: string | null;
  data: Awaited<ReturnType<T>> | null;
  errorCount: number;
  revalidate: T;
  setData: (data: Awaited<ReturnType<T> | null>) => void;
  abort: () => void;
};

// Options type for the hook, allowing customization of behavior.
export type UseAsyncOptions<T extends (...args: any[]) => Promise<any>> = {
  retryLimit?: number; // The number of times the hook should retry the function on failure before giving up
  retryTime?: number; // Time in milliseconds for retrying the data
  cache?: boolean; // Cache the result of the function
  store?: boolean; // Store the result of the function in local storage
  enable?: boolean; // Enable the hook
  autoFetch?: boolean; // Automatically fetch the data when the hook is mounted
  revalidation?: boolean; // Enable revalidation
  revalidateTime?: number; // Time in milliseconds for revalidating the data
  invalidateQueries?: string[]; // Invalidate other queries when the data is updated
  updateQueries?: string[]; // Update other queries when the data is updated
  onSuccess?: (data: Awaited<ReturnType<T>>) => void; // Callback function that is called when the asynchronous function resolves successfully
  onError?: (error: string) => void; // Callback function that is called when the asynchronous function rejects or encounters an error
  abort?: () => void; // Abort the request
  args?: Parameters<T>; // Arguments to pass to the asynchronous function
};

// Default values for the hook's options
const DEFAULT_CACHE_ENABLED = false;
const DEFAULT_STORE_ENABLED = false;
const DEFAULT_ENABLED = true;
const DEFAULT_AUTO_FETCH = false;
const DEFAULT_RETRY_LIMIT = 1;
const DEFAULT_REVALIDATION_ENABLED = false;
const DEFAULT_REVALIDATE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_RETRY_TIME = 5 * 60 * 1000; // 5 minutes

// The main hook type that includes the async function along with its additional properties.
export type UseAsyncResult<
  U extends string,
  T extends (...args: any[]) => Promise<any>,
> = UseAsyncResultBase<T> & Record<U, T>;

const getArgs = (args?: any[]): any[] =>
  args ? (Array.isArray(args) ? args : [args]) : [];

const getKeyWithArgs = (key: string, args: any[]) =>
  (getArgs(args)?.length ?? 0) > 0 ? `${key}/${JSON.stringify(args)}` : key;

/**
 * A custom React hook that manages asynchronous operations, providing easy-to-use states and controls over fetching, caching, and retry mechanisms.
 * This hook abstracts away the complexity of handling loading, error, and success states for any asynchronous function.
 *
 *
 * ```tsx
 * // Example of using useAsync to manage fetching user data from an API.
 * const fetchUserData = async (userId) => {
 *   const response = await fetch(`/api/users/${userId}`);
 *   if (!response.ok) throw new Error('Failed to fetch');
 *   return await response.json();
 * };
 *
 * const UserDetails = ({ userId }) => {
 *   const {
 *     isLoading,
 *     data,
 *     error,
 *     revalidate,
 *   } = useAsync('userDetails', fetchUserData, {
 *     cache: true,
 *     revalidateTime: 60000, // 1 minute
 *     autoFetch: true,
 *     onSuccess: (data) => console.log('User data fetched successfully:', data),
 *     onError: (error) => console.error('Error fetching user data:', error),
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   return (
 *     <div>
 *       <h1>{data.name}</h1>
 *       <button onClick={() => revalidate()}>Refresh</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useAsync = <
  U extends string,
  T extends (...args: any[]) => Promise<any>,
>(
  key: U,
  asyncFunction: T,
  options?: UseAsyncOptions<T>
): UseAsyncResult<U, T> => {
  // Resolving optional parameters with default values
  const retryLimit = options?.retryLimit ?? DEFAULT_RETRY_LIMIT;
  const autoFetch = options?.autoFetch ?? DEFAULT_AUTO_FETCH;
  const retryTime = options?.retryTime ?? DEFAULT_RETRY_TIME;
  const cacheEnabled = options?.cache ?? DEFAULT_CACHE_ENABLED;
  const storeEnabled = options?.store ?? DEFAULT_STORE_ENABLED;
  const enabled = options?.enable ?? DEFAULT_ENABLED;
  const revalidationEnabled =
    options?.revalidation ?? DEFAULT_REVALIDATION_ENABLED;
  const revalidateTime = options?.revalidateTime ?? DEFAULT_REVALIDATE_TIME;
  const updateQueries = options?.updateQueries ?? [];
  const invalidateQueries = options?.invalidateQueries ?? [];
  const onSuccess = options?.onSuccess;
  const onError = options?.onError;
  const args = getArgs(options?.args ?? []);

  // Using a custom hook to manage state specific to asynchronous operations
  const { getStates, setQueryState, setQueriesState, makeQueryInError } =
    useAsyncState();

  // Storing the last arguments used to call the async function
  const storedArgsRef = useRef<any[]>(args);

  const controllerRef = useRef<AbortController | null>(null);

  // Apply different key for different requests
  const keyWithArgs = getKeyWithArgs(key, storedArgsRef.current);

  // Retrieving the current state of async operations using the same custom hook
  const {
    isFetched,
    fetchedDateTime,
    isLoading,
    isEnabled,
    error,
    isSuccess,
    isInvalidated,
    data,
    errorCount,
  } = getStates(keyWithArgs);

  /**
   * FETCH FUNCTION
   *
   * Manage parallel fetching across multiple instances of the hook
   * Manage state updates on success and error
   * Manage eventual invalidation of other queries
   */
  const fetch: T = (async (...args) => {
    const keyWithArgs = getKeyWithArgs(key, args);

    /**
     * ABORT CONTROLLER
     *
     * cancel an unnecessary request.
     * For example, if a user navigates away from a page or triggers a new request that makes the previous one obsolete, you can abort the previous fetch
     */
    if (controllerRef.current) {
      // Abort the previous request
      controllerRef.current.abort();
    }

    // Create a new AbortController
    const controller = new AbortController();
    controllerRef.current = controller;

    /**
     * PENDING PROMISES
     *
     * This logic ensures that if two parts of your application trigger the same request simultaneously,
     * only one network call is made, and both receive the same result.
     */
    if (pendingPromises.has(keyWithArgs)) {
      // Return the existing pending promise
      return pendingPromises.get(keyWithArgs);
    }

    const promise = (async () => {
      setQueryState(keyWithArgs, { isLoading: true });
      let response = null;

      try {
        // Ensure asyncFunction returns a Promise
        const asyncResult = asyncFunction(...args);

        // Check if the result is a Promise-like object
        if (!asyncResult || typeof asyncResult.then !== 'function') {
          throw new Error('asyncFunction must return a Promise');
        }

        const result = await asyncResult;
        response = result;

        setQueryState(keyWithArgs, {
          data: result,
          errorCount: 0,
          isLoading: false,
          isFetched: true,
          fetchedDateTime: new Date(),
          isSuccess: true,
          isInvalidated: false,
          error: null,
        });

        onSuccess?.(result);

        // Invalidate other queries if necessary
        if ((invalidateQueries.length ?? 0) > 0) {
          setQueriesState(invalidateQueries, {
            isInvalidated: true,
          });
        }

        // Update other queries if necessary
        if ((updateQueries.length ?? 0) > 0) {
          setQueriesState(updateQueries, {
            data: result,
          });
        }

        // Store the result in local storage
        if (storeEnabled) {
          localStorage.setItem(keyWithArgs, JSON.stringify(result));
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);

        makeQueryInError(keyWithArgs, msg);
        onError?.(msg);
      } finally {
        // Remove the pending promise from the cache
        pendingPromises.delete(keyWithArgs);
      }

      return response;
    })();

    // Store the pending promise in the cache
    pendingPromises.set(keyWithArgs, promise);

    return await promise;
  }) as T;

  /**
   * REVALIDATE FUNCTION
   *
   * Wrap core function to handle revalidation
   * Handle arguments caching
   *
   */
  const revalidate: T = (async (...args) => {
    if (!isEnabled || !enabled) return; // Hook is disabled

    if (args) {
      // Revalidation arguments can be different from the initial fetch arguments
      // If arguments are provided, store/update them for future periodic revalidation

      storedArgsRef.current = getArgs(args);
    }

    return await fetch(...storedArgsRef.current);
  }) as T;

  /**
   * EXECUTION FUNCTION
   *
   * Wrap revalidation function
   * If data is valid return it directly to avoid fetching again
   */
  const execute: T = (async (...args) => {
    if (!isEnabled || !enabled) return; // Hook is disabled
    if (isLoading) return; // Fetch is already in progress

    const shouldReturnData =
      !isInvalidated && // If data are invalidated, we should refetch to revalidate the data
      isSuccess &&
      cacheEnabled &&
      data;

    if (shouldReturnData) return data; // Data are already fetched and should be returned directly. Avoid fetching again.

    return await revalidate(...args);
  }) as T;

  /**
   * HANDLE SYNCHRONIZATION HOOKS DISACTIVATION
   *
   * If one instance of the hook is disabled, the other instances should be disabled too.
   * This is to prevent inconsistencies in the state of the hook.
   */
  useEffect(() => {
    if (enabled !== isEnabled) {
      setQueryState(keyWithArgs, {
        isEnabled,
      });
    }
  }, [enabled, isEnabled, keyWithArgs]);

  /**
   * HANDLE LOCAL STORAGE LOADING
   *
   * If store is enabled, load data from local storage
   */
  useEffect(() => {
    if (!isEnabled || !enabled) return; // Hook is disabled
    if (!storeEnabled) return; // Hook should not use local storage
    if (isInvalidated || isFetched || data) return; // Hook have been already mounted and fetched or invalidated

    const storedData = localStorage.getItem(keyWithArgs);

    // Wrap parsing in a try-catch block to handle invalid JSON data
    try {
      if (storedData) {
        setQueryState(keyWithArgs, {
          data: JSON.parse(storedData),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    storeEnabled,
    keyWithArgs,
    isFetched,
    isInvalidated,
    isEnabled,
    enabled,
    data,
  ]);

  /**
   * HANDLE AUTO-FETCH ON HOOK MOUNT
   *
   * If autoFetch is enabled, fetch the data when the hook is mounted
   */
  useEffect(() => {
    if (!autoFetch) return; // Auto-fetch is disabled
    if (!isEnabled || !enabled) return; // Hook is disabled
    if (isFetched && !isInvalidated) return; // Hook have already fetched or invalidated
    if (isLoading) return; // Fetch is already in progress

    fetch(...storedArgsRef.current);
  }, [
    autoFetch,
    isEnabled,
    enabled,
    isFetched,
    isInvalidated,
    isLoading,
    fetch,
  ]);

  /**
   * HANDLE RETRY
   *
   * If fetching fails, retry the fetch after a certain time
   */
  useEffect(() => {
    const isRetryEnabled = errorCount > 0 && retryLimit > 0;
    const isRetryLimitReached = errorCount > retryLimit;

    if (!isEnabled || !enabled) return; // Hook is disabled
    if (!isRetryEnabled) return; // Retry is disabled
    if (isRetryLimitReached) return; // Retry limit has been reached
    if (isLoading) return; // Fetch is already in progress
    if (isSuccess) return; // Hook has already fetched successfully

    const timeout = setTimeout(() => {
      fetch(...storedArgsRef.current);
    }, retryTime);

    return () => clearTimeout(timeout);
  }, [
    isEnabled,
    errorCount,
    retryLimit,
    enabled,
    retryTime,
    isSuccess,
    isLoading,
    fetch,
  ]);

  /**
   * HANDLE PERIODIC REVALIDATION
   *
   * If revalidation is enabled, revalidate the data periodically
   */
  useEffect(() => {
    if (!revalidationEnabled || revalidateTime <= 0) return; // Revalidation is disabled
    if (!isEnabled || !enabled) return; // Hook is disabled
    if (isLoading) return; // Fetch is already in progress
    if (!isSuccess || !fetchedDateTime) return; // Should retry either of revalidate

    const timeout = setTimeout(() => {
      fetch(...storedArgsRef.current);
    }, revalidateTime);

    return () => clearTimeout(timeout);
  }, [
    revalidationEnabled,
    revalidateTime,
    isSuccess,
    fetchedDateTime,
    isLoading,
    isEnabled,
    enabled,
    fetch,
  ]);

  // Memoization of the setData function to prevent unnecessary re-renders
  const setDataMemo = (data: Awaited<ReturnType<T> | null>) => {
    setQueryState(keyWithArgs, {
      data,
    });
  };

  const abort = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  // Memoization to prevent unnecessary re-renders
  const memoResult = {
    isFetched,
    isInvalidated,
    error,
    data,
    errorCount,
    isSuccess,
    isEnabled,
    isDisabled: !isEnabled,
    isLoading,
    isWaitingData: isLoading && !isFetched && !data, // Check if the data is still being fetched. Stay at true during revalidation or if data are stored in local storage
    isRevalidating: isLoading && isFetched, // Check if the data is valid and is being revalidated
    [key]: execute, // Name the execute function as the given key to avoid conflicts with other hooks (e.g. `const { fetchUser } = useAsync('fetchUser', () => fetchUserFunction());`)
    revalidate,
    setData: setDataMemo,
    abort,
  };

  useEffect(
    () => () => {
      // Clean up the controller on unmount
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    },
    []
  );

  // Return the hook's result, including all state and control functions
  return memoResult as UseAsyncResultBase<T> & Record<U, T>;
};
