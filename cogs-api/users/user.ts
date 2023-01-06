import {dynamoDbClient} from "../lib/dynamo-db-client";
import {GetCommand, PutCommand, PutCommandOutput} from "@aws-sdk/lib-dynamodb";
import {Role} from "../lib/auth";

const USERS_TABLE = process.env.USERS_TABLE;

export interface User {
    email: string,
    name: string,
    password?: string
    roles?: Role[]
}

export class UserResponse {
    email: string;
    name: string;

    constructor(user: User) {
        this.email = user.email;
        this.name = user.name;
    }
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
    const query = new GetCommand({
        TableName: USERS_TABLE,
        Key: {email},
    })

    const {Item} = await dynamoDbClient.send(query)
    return Item ? <User>Item : undefined
}

export async function putUser(user: User): Promise<PutCommandOutput> {
    const putItem = new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
    });

    return await dynamoDbClient.send(putItem);
}



