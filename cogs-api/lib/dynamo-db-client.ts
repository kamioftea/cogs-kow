import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

const dynamoDBClientOptions = process.env.LOCALSTACK_HOSTNAME
    ? {endpointUrl: `https://${process.env.LOCALSTACK_HOSTNAME}:4566`}
    : {}

export const dynamoDbClient = new DynamoDBClient(dynamoDBClientOptions);
