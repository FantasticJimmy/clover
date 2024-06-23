import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Request, Response, Result } from '../../../../proto/app';

@Controller('data')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('save_file')
  save(@Body() list: Result[]) {
    return this.appService.saveData(list);
  }
  // http server that calls grpc python
  @Get('process')
  process() {
    return this.appService.processData();
  }

  // Direct grpc server
  @GrpcMethod('AppService', 'GetResponse')
  getResponse(request: Request, metadata: any): Response {
    return this.appService.GetResponse(request);
  }
}
