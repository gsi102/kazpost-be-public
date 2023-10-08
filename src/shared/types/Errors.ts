enum ErrorType {
  Caught = "caught",
  NoData = "noData",
  WrongData = "wrongData",
  NotFound = "notFound",
  DB = "DB",
  DoNotRespond = "doNotRespond",
  Unauthorized = "unauthorized",
}

enum ErrorMsgs {
  NoData = "Not enough data in request",
  WrongData = "Wrong data",
  WrongFormat = "Wrong format",
  NoDbModel = "Cannot define DB Model",
}

export { ErrorType, ErrorMsgs };
