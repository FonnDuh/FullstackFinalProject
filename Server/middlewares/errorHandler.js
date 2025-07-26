class AppError extends Error {
  constructor(message, status = 400, code = null) {
    super(message);
    this.status = status;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  if (!(err instanceof Error)) {
    err = new Error(String(err));
    err.status = 500;
  }

  const status = err.status || 500;

  const response = {
    success: false,
    status,
    message: err.message || "Something went wrong.",
  };

  if (err.code) {
    response.code = err.code;
  }

  if (process.env.ENVIRONMENT === "development") {
    const { name, message, status, code } = err;
    console.error({ name, message, status, code });
    response.error = { name, message, status, code };
  } else {
    if (status >= 500) {
      console.error("Server Error:", err.message);
    }
  }

  res.status(status).json(response);
};

module.exports = { errorHandler, AppError };
