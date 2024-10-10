import {
  HttpException,
  HttpStatus,
  Type,
  applyDecorators,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ExamplesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { IExceptionResponse } from 'src/interfaces/response.interface';

export interface ErrorResponseOption {
  /**
   * 에러 예시의 제목
   */
  exampleTitle: string;

  /**
   * 에러 스키마
   */
  schema: Type<HttpException>;
}

export const ApiExceptions = (
  statusCode: HttpStatus,
  errorResponseOption: ErrorResponseOption[],
) => {
  const examples = errorResponseOption
    .map((err: ErrorResponseOption): ExamplesObject => {
      const errorInstance = new err.schema();
      const errorResponse: IExceptionResponse = {
        message: errorInstance.message,
        requestURL: 'requestURL',
        statusCode: statusCode,
        timestamp: new Date(),
      };

      return {
        [err.exampleTitle]: {
          value: {
            ...errorResponse,
          },
        },
      };
    })
    .reduce((result, item) => {
      Object.assign(result, item);
      return result;
    });

  return applyDecorators(
    ApiExtraModels(HttpException),
    ApiResponse({
      status: statusCode,
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                $ref: getSchemaPath(HttpException),
              },
            ],
          },
          examples: examples,
        },
      },
    }),
  );
};
