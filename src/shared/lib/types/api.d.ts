import { UserInfo } from "./user";

declare type IApiResponse<T> = IErrorResponse | ISuccessResponse<T>

declare interface IErrorResponse {
  status: false
  code: number
  message: string
  errors?: Array<{
    path: string
    message: string;
  }>
}

declare interface ISuccessResponse {
  status: true
  code: number
  message?: string
  payload?: Payload
  resetToken?: string
}

export type Payload = {
    user: UserInfo
}
