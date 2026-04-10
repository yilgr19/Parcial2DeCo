export function ok(res, data, status = 200) {
  return res.status(status).json({ data });
}

export function error(res, status, code, message, details) {
  const body = {
    error: {
      code,
      message,
    },
  };
  if (details && details.length) {
    body.error.details = details;
  }
  return res.status(status).json(body);
}
