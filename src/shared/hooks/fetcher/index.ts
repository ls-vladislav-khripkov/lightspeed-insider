import { useCallback, useEffect, useRef } from 'react';
import { SubmitFunction, useFetcher } from '@remix-run/react';

export function useAsyncFetcher<T>(options?: { key?: string }) {
  const resolveRef = useRef<(value: T | PromiseLike<T>) => void>();
  const promiseRef = useRef<Promise<T>>();

  const fetcher = useFetcher<T>(options);

  if (!promiseRef.current) {
    promiseRef.current = new Promise<T>((resolve) => {
      resolveRef.current = resolve;
    });
  }

  const resetResolver = useCallback(() => {
    promiseRef.current = new Promise<T>((resolve) => {
      resolveRef.current = resolve;
    });
  }, [promiseRef, resolveRef]);

  const submit = useCallback(
    async (...args: Parameters<SubmitFunction>) => {
      fetcher.submit(...args);
      return promiseRef.current as Promise<T>;
    },
    [fetcher, promiseRef]
  );

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle') {
      resolveRef.current?.(fetcher.data as T);
      resetResolver();
    }
  }, [fetcher, resetResolver]);

  return { ...fetcher, submit };
}
