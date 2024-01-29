import { HttpMethod } from '~entities/http';

export type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown | undefined | null | Record<string, unknown>;
};

export const createApi = () => {
  const isServer = typeof window === 'undefined';

  const api = Object.values(HttpMethod).reduce((prevApi, currentMethod) => {
    return {
      ...prevApi,
      [currentMethod]: async <T = unknown>(url: string, options?: RequestOptions) => {
        const { body, ...restOptions } = options || {};

        if (isServer) console.info(`Proxying ${currentMethod} request to ${url}`);

        const response = await fetch(url, {
          method: currentMethod,
          body: body ? JSON.stringify(body) : undefined,
          ...restOptions,
          headers: { 'Content-Type': 'application/json', ...options?.headers },
        });

        let data = {};

        try {
          data = await response.json();
        } catch (e) {
          data = {};
        }

        if (isServer) {
          if (response.status >= 400) {
            console.error(
              `${currentMethod} ${url} returned ${response.status} with payload ${JSON.stringify(
                data
              )}`
            );

            throw new Error('Error', { cause: { status: response } });
          } else {
            console.debug(`${currentMethod} ${url} returned ${response.status}`);
          }
        }

        return {
          ...response,
          status: response.status,
          data: data as T,
        };
      },
    };
  }, {} as Record<HttpMethod, <T>(url: string, options?: RequestOptions) => Promise<{ data: T } & Response>>);

  return api;
};
