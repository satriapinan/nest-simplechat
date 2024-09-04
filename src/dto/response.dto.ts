export class ResponseDto<T> {
  data: T;
  message: string;
  status: number;

  constructor(data: T, message: string, status: number) {
    this.data = data;
    this.message = message;
    this.status = status;
  }
}
