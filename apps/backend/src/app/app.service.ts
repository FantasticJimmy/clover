import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { Request, Response } from '../../../../proto/app';
import * as fs from 'fs';
import * as path from 'path';
import { AppService as ProtoAppService, Result } from 'proto/app';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf
const protoPath = path.join(__dirname, 'assets', 'proto', 'app.proto');
const packageDefinition = protoLoader.loadSync(protoPath);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).app;

@Injectable()
export class AppService implements OnModuleInit {
  // @Client({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'app',
  //     protoPath: protoPath,
  //     url: 'localhost:50051', // gRPC python server address
  //   },
  // })
  private client: ClientGrpc;
  private appServiceClient: ProtoAppService;

  onModuleInit() {
    // @ts-ignore
    this.appServiceClient = new protoDescriptor.AppService(
      'localhost:50051',
      grpc.credentials.createInsecure()
    );
    // this.client.getService<ProtoAppService>('AppService');
  }

  processData() {
    return new Promise((resolve, reject) => {
      const request: Request = { message: 'I want ma stuff' };
      // @ts-ignore
      this.appServiceClient.GetResult(request, (error, response) => {
        if (!error) {
          resolve(true);
        } else {
          console.error('Error:', error);
          reject(false);
        }
      });
    });
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
      console.log(e);
      return false;
    }
  }

  // responding as nestjs being a grpc server
  GetResponse(request: Request): Response {
    console.log(`saying hello to ${request.message}`);
    const reply: Response = { reply: `Hello ${request.message} from Node` };
    return reply;
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
