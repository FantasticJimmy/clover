const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the protobuf
const PROTO_PATH = path.join(__dirname, '../../proto/app.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).app;

// Create a gRPC client
const client = new protoDescriptor.AppService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Call the service
client.GetResult({ message: 'World' }, (error, response) => {
  if (!error) {
    console.log('Greeting:', response.reply);
  } else {
    console.error('Error:', error);
  }
});
