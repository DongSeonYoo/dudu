import { HttpException, Type, applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiExceptions = (...errors: Type<HttpException>[]) => {
  return applyDecorators(
    ...errors.map((error) => {
      const instance = new error();
      return ApiResponse({
        status: instance.getStatus(),
        schema: {
          properties: {
            statusCode: {
              type: 'number',
              example: instance.getStatus(),
            },
            message: {
              type: 'string',
              example: instance.message,
            },
            requestURL: {
              type: 'string',
            },
            timestamp: {
              type: 'Date',
              example: new Date(),
            },
          },
        },
      });
    }),
  );
};
