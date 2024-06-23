const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the protobuf
const PROTO_PATH = path.join(__dirname, '../../proto/app.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).app;

// Create a gRPC client
const client = new protoDescriptor.AppService(
  'localhost:5000',
  grpc.credentials.createInsecure()
);

// Call the service
client.GetResponse({ message: 'World' }, (error, response) => {
  if (!error) {
    console.log('Greeting:', response.reply);
  } else {
    console.error('Error:', error);
  }
});
