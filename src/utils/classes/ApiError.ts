class ApiError extends Error {
  public statusCode: number;
  public status: "fail" | "error";

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ApiError;
