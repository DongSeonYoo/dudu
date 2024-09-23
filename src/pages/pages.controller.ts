import fs from 'fs';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import path, { join } from 'path';

@Controller()
export class PagesController {
  @Get('/')
  serveIndexPage(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '..', '..', 'client'));
  }

  @Get(':page')
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
