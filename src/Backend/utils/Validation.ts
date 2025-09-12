import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { responseStatusCode } from "./responseHandler";

export const validateSchema =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body.start_date = req.body.start_date && new Date(req.body.start_date);
      schema.parse(req.body);
      next();
    } catch (error) {
      const typeError = error as Error;
      res.json({
        statusCode: responseStatusCode.failure,
        message: typeError.message || "Internal Server Error",
      });
      return;
    }
  };
