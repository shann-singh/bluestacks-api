class ApiError extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }

  static badRequest(message) {
    /* server cannot or will not process the request due to 
    something that is perceived to be a client error */
    return new ApiError(400, message);
  }

  static notFound(message) {
    /* server can't find the requested resource */
    return new ApiError(404, message);
  }

  static conflict(message) {
    /* request conflict with current state of the target resource */
    return new ApiError(409, message);
  }

  static unprocessable(message) {
    /* server understands the content type of the request entity, 
    and the syntax of the request entity is correct, but it was unable 
    to process the contained instructions */
    return new ApiError(422, message);
  }

  static internal(message) {
    /* server encountered an unexpected condition 
    that prevented it from fulfilling the request */
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
