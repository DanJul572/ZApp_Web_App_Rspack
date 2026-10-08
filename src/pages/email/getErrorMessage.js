// Request rejects with the API response body. Validation errors carry the
// first failing rule in `data.body`, other errors only a `message`.
const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.data?.body?.[0]?.message ||
  error?.data?.query?.[0]?.message ||
  error?.message ||
  fallback;

export default getErrorMessage;
