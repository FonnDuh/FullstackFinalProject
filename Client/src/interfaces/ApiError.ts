export interface ApiError {
  response: {
    data: {
      message?: string;
      code?: string;
      [key: string]: unknown;
    };
    status: number;
  };
}
