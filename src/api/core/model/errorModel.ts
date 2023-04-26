/**
 * @description: Login interface return value
 */
export interface ErrorResultModel<T> {
  code: number;
  reason: string;
  message: string;
  metadata: T;
}
