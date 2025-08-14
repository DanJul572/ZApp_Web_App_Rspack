const handleError = (error) => {
  if (error.statusCode && error.statusCode === 400) {
    if (error?.details?.body?.length > 0) {
      return error.details.body[0].message;
    }

    if (error?.message) {
      return error.message;
    }

    return 'An error occurred while processing your request.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred.';
};

export default handleError;
