export class ResponseMock {
  private _headers = {};

  getHeader(field: string) {
    return this._headers[field];
  }

  setHeader(field: string, val: any) {
    this._headers[field] = val;
  }

  hasHeader(field: string) {
    return this._headers[field] !== undefined;
  }

  removeHeader(field: string) {
    delete this._headers[field];
  }
}
