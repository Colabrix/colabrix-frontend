import { useState, useCallback } from "react";
import apiClient from "../services/api.client.js";

export function useApi(endpoint = null, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    retries = 1,
    retryDelay = 1000,
    onSuccess = null,
    onError = null,
  } = options;

  const execute = useCallback(
    async (customEndpoint = null, fetchOptions = {}) => {
      const targetEndpoint = customEndpoint || endpoint;

      if (!targetEndpoint) {
        throw new Error("No endpoint provided");
      }

      let attempt = 0;
      const maxAttempts = retries + 1;

      while (attempt < maxAttempts) {
        try {
          setLoading(true);
          setError(null);

          const response = await apiClient.get(targetEndpoint, fetchOptions);

          setData(response.data);

          if (onSuccess) {
            onSuccess(response.data, response);
          }

          return response;
        } catch (err) {
          attempt++;

          if (attempt >= maxAttempts) {
            setError(err.message);

            if (onError) {
              onError(err);
            }

            throw err;
          }

          if (attempt < maxAttempts && retryDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        } finally {
          if (attempt >= maxAttempts || attempt === 0) {
            setLoading(false);
          }
        }
      }
    },
    [endpoint, retries, retryDelay, onSuccess, onError]
  );

  const post = useCallback(
    async (customEndpoint = null, body = {}, headers = {}) => {
      const targetEndpoint = customEndpoint || endpoint;

      if (!targetEndpoint) {
        throw new Error("No endpoint provided");
      }

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.post(targetEndpoint, body, {
          headers,
        });

        setData(response.data);

        if (onSuccess) {
          onSuccess(response.data, response);
        }

        return response;
      } catch (err) {
        setError(err.message);

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, onSuccess, onError]
  );

  const put = useCallback(
    async (customEndpoint = null, body = {}, headers = {}) => {
      const targetEndpoint = customEndpoint || endpoint;

      if (!targetEndpoint) {
        throw new Error("No endpoint provided");
      }

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.put(targetEndpoint, body, { headers });

        setData(response.data);

        if (onSuccess) {
          onSuccess(response.data, response);
        }

        return response;
      } catch (err) {
        setError(err.message);

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, onSuccess, onError]
  );

  const remove = useCallback(
    async (customEndpoint = null, headers = {}) => {
      const targetEndpoint = customEndpoint || endpoint;

      if (!targetEndpoint) {
        throw new Error("No endpoint provided");
      }

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.delete(targetEndpoint, { headers });

        setData(response.data);

        if (onSuccess) {
          onSuccess(response.data, response);
        }

        return response;
      } catch (err) {
        setError(err.message);

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    post,
    put,
    delete: remove,
    reset,
    fetch: execute,
    get: execute,
  };
}

export function useApiFetch(endpoint, options = {}) {
  const hook = useApi(endpoint, { ...options, autoFetch: true });

  useState(() => {
    if (endpoint) {
      hook.execute();
    }
  });

  return hook;
}
