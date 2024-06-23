import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { Request, Response } from '../../../../proto/app';
import * as fs from 'fs';
import * as path from 'path';
import { AppService as ProtoAppService, Result } from '../../../../proto/app';

const assetsPath = path.join(__dirname, 'assets');
const protoPath = path.join(assetsPath, 'proto', 'app.proto');

@Injectable()
export class AppService {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'app',
      protoPath: protoPath,
      url: process.env.CONVERT_IP + ':50051', // gRPC python server address
    },
  })
  private client: ClientGrpc;
  private appServiceClient: ProtoAppService;

  onModuleInit() {
    this.appServiceClient =
      this.client.getService<ProtoAppService>('AppService');
  }

  saveData(data: Result[]) {
    try {
      const formattedContent = data.map(formatRecord).join('\n');
      const outputFileName = `testformat1_${new Date()
        .toISOString()
        .slice(0, 10)}.txt`;
      // Write the content to a .txt file
      const outputPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'apps',
        'convert',
        'data',
        outputFileName
      );
      fs.writeFileSync(outputPath, formattedContent);
      return true;
    } catch (e) {
      console.log(`error occured`);
      return false;
    }
  }

  // responding as nestjs being a grpc server
  GetResponse(request: Request): Response {
    console.log(`saying hello to ${request.message}`);
    const reply: Response = { reply: `Hello ${request.message} from Node` };
    return reply;
  }

  async processData() {
    return this.appServiceClient.GetResult({ message: 'I want ma result' });
  }
}

const formatRules = {
  eventName: 10,
  valid: 1,
  count: 3,
};

function formatRecord(record) {
  if (!record.eventName || !record.count) {
    throw 'cannot submit empty fileds';
  }
  const formattedName = record.eventName.padEnd(formatRules.eventName, ' ');
  const formattedValid = (record.valid ? '1' : '0').padEnd(
    formatRules.valid,
    ' '
  );
  const formattedCount = record.count
    .toString()
    .padStart(formatRules.count, ' ');

  return `${formattedName}${formattedValid}${formattedCount}`;
}
