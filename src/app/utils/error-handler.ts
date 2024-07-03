import { Prisma } from "@prisma/client";
import startCase from "lodash/startCase";
import z from "zod";

interface ErrorObj {
  [key: string]: CustomError;
}

class CustomError {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}

export const ErrorObj: ErrorObj = {
  USER_NOT_FOUND: new CustomError(401, "User Not Found"),
  INCORRECT_PASSWORD: new CustomError(401, "Incorrect password"),
  NOT_FOUND: new CustomError(404, "Not Found"),
};

const errorHandler = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return Response.json(
      {
        error: `[${startCase(error.issues[0].path.join("-"))}]: ${
          error.issues[0].message
        }`,
      },
      { status: 422 }
    );
  }

  if (error instanceof CustomError) {
    return Response.json(
      {
        error: error.message,
      },
      { status: error.code }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return prismaErrorHandler(error);
  }

  return Response.json({ error: error }, { status: 500 });
};

const prismaErrorHandler = (error: Prisma.PrismaClientKnownRequestError) => {
  if (error.code === "P2002") {
    if (error.meta?.modelName == "User" && error.meta?.target == "email") {
      return Response.json(
        {
          error:
            "Sorry, it looks like the email address you entered is already registered. Please use a different email address",
        },
        {
          status: 422,
        }
      );
    }
  }
};

export default errorHandler;
