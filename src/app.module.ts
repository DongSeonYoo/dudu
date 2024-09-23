import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UnhandledExceptionFilter } from './filters/unhandled-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { SuccessResponseInterceptor } from './interceptors/response.interceptor';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './apis/auth/auth.module';
import { StudentsModule } from './apis/students/students.module';
import { ParentModule } from './apis/parent/parent.module';
import { EnrollmentModule } from './apis/enrollment/enrollment.module';
import { AttendanceModule } from './apis/attendance/attendance.module';
import { OutingModule } from './apis/outing/outing.module';
import { AcademyScheduleModule } from './apis/academy-schedule/academy-schedule.module';
import { DateUtilModule } from './utils/date-util/dtae-util.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PagesController } from './pages/pages.controller';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';
import { JwtAccessGuard } from './apis/auth/guards/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env' : '.env.test',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
      serveRoot: '/',
    }),
    PrismaModule,
    DateUtilModule,
    AuthModule,
    TokenModule,
    StudentsModule,
    ParentModule,
    EnrollmentModule,
    AttendanceModule,
    OutingModule,
    AcademyScheduleModule,
  ],
  controllers: [PagesController, AppController],
  providers: [
    AppService,
    LoggerMiddleware,
    Logger,
    {
      provide: APP_FILTER,
      useClass: UnhandledExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
        }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('**');
  }
}
