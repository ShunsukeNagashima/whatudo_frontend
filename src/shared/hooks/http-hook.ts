import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const useHttpClient = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null);

  const signal = axios.CancelToken.source();

  useEffect(() => {
    return () => {
      signal.cancel("Api is being canceled")
    }
  }, [])

  const sendRequest = useCallback(
    async (url, method = 'GET', data = null, headers = {}) => {
      setLoading(true);

      try {
        const responseData = await axios.request({
          method,
          url,
          data,
          headers,
          cancelToken: signal.token
        })
        console.log(headers)

        if (!(responseData.status === 200 || responseData.status === 201)) {
          throw new Error(responseData.data.message);
        }

        setLoading(false);
        return responseData
      } catch(err) {
        console.log(err);
        setError(err.message);
        setLoading(false);
        throw err
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  return { loading, error, sendRequest, clearError }
}