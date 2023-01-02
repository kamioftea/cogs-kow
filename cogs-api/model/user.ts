import {dynamoDbClient} from "../lib/dynamo-db-client";
import {GetCommand} from "@aws-sdk/lib-dynamodb";

const USERS_TABLE = process.env.USERS_TABLE;

export interface User {
    email: string,
    name: string,
    password?: string
}

export class UserResponse {
    email: string;
    name: string;

    constructor(user: User) {
        this.email = user.email;
        this.name = user.name;
    }
}

export async function findByEmail(email: string): Promise<User | undefined> {
    const query = new GetCommand({
        TableName: USERS_TABLE,
        Key: {email},
    })

    const {Item} = await dynamoDbClient.send(query)
    return Item ? <User> Item : undefined
}


