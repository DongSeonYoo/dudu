import fs from 'fs';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import path, { join } from 'path';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuthGuard } from 'src/decorators/jwt-auth.decorator';

@ApiTags('Pages')
@Controller()
export class PagesController {
  /**
   * 루트 페이지 서빙
   */
  @Get('/')
  serveIndexPage(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '..', '..', 'client'));
  }

  /**
   * 페이지 이름을 받아서 해당 페이지 서빙
   */
  @Get(':page')
  @LoginAuthGuard()
  servePage(@Param('page') page: string, @Res() res: Response) {
    return this.serveHtmlPage(page, res);
  }

  private serveHtmlPage(page: string, res: Response) {
    const filePath = join(
      __dirname,
      '..',
      '..',
      'client',
      'html',
      `${page}.html`,
    );

    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).send('Page not found');
    }
  }
}
