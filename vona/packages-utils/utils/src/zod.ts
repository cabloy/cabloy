export function zodCustomError(path: string[], message: string): Error {
  const error = new Error();
  (error as any).code = 422;
  error.message = [
    {
      code: 'custom',
      path,
      message,
    },
  ] as any;
  return error;
}
