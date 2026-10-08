// Values of "emailExecutions"."status" in the API.
export const EMAIL_STATUS = {
  onQueue: { value: 'onQueue', label: 'On Queue', color: 'warning' },
  success: { value: 'success', label: 'Success', color: 'success' },
  failed: { value: 'failed', label: 'Failed', color: 'error' },
};

export const EMAIL_TRIGGER = {
  manual: 'Manual',
  scheduler: 'Scheduler',
  test: 'Test',
};

// While emails are on queue the log refreshes itself to show the worker's
// progress.
export const REFRESH_INTERVAL_MS = 5000;
