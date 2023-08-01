export const useHttp = () => {
  const [loading, setLoading] = false;
  const [error, setError] = null;
  const [process, setProcess] = "waiting";

  const request = async (
    url,
    method = "POST",
    body = null,
    headers = { "Content-type": "application/json" }
  ) => {
    setLoading(true);
    setProcess("loading");

    try {
      const response = await fetch(url, { method, body, headers });

      if (!response.ok) {
        throw new Error(`Could not fetch ${url}, status: ${response.status}`);
      }

      const data = await response.json();

      setLoading(false);
      return data;
    } catch (e) {
      setLoading(false);
      setError(e.message);
      setProcess("error");
      throw e;
    }
  };

  const clearError = () => {
    setError(null);
    setProcess("loading");
  };

  return { loading, error, request, clearError, process };
};
