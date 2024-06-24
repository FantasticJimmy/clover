import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        if (req.method === 'GET' && req.path === '/') {
          res.sendFile(join(__dirname, 'assets', 'index.html'));
        } else {
          next();
        }
      })
      .forRoutes('*');
  }
}
