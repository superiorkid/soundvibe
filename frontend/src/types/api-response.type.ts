export type TApiResponse<T = null> = {
  success: boolean;
  message: string;
  data?: T;
};
