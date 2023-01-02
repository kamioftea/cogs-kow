import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import express, { Express, Request, Response } from 'express';
import serverless from "serverless-http";
import {User} from "./model/user";
import {userRouter} from "./routes/users";

const app: Express = express();

const USERS_TABLE = process.env.USERS_TABLE;
// noinspection HttpUrlsUsage
const dynamoDBClientOptions = process.env.LOCALSTACK_HOSTNAME
    ? {endpointUrl: `https://${process.env.LOCALSTACK_HOSTNAME}:4566`}
    : {}

const dynamoDbClient = new DynamoDBClient(dynamoDBClientOptions);

app.use(express.json());
app.use('/user', userRouter)

type Error = {
    error: string
}

app.get("/users/:email", async function (req: Request, res: Response<User | Error>) {
    console.log(req.params.email)

    const query = new GetCommand({
        TableName: USERS_TABLE,
        Key:       {
            email: req.params.email,
        },
    })

    try {
        const {Item} = await dynamoDbClient.send(query);
        if (Item) {
            const {email, name} = Item;
            await res.json({email, name});
        }
        else {
            await res
                .status(404)
                .json({error: 'Could not find user with provided "email"'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Could not retrieve user"});
    }
});

app.post("/users", async function (req: Request<User>, res: Response<User | Error>) {
    const {email, name} = req.body;
    if (typeof email !== "string") {
        res.status(400).json({error: '"email" must be a string'});
    }
    else if (typeof name !== "string") {
        res.status(400).json({error: '"name" must be a string'});
    }

    const putItem = new PutCommand({
        TableName: USERS_TABLE,
        Item:      {
            email: email,
            name:   name,
        },
    });

    try {
        await dynamoDbClient.send(putItem);
        res.json({email, name});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Could not create user"});
    }
});

app.use((req, res) => {
    return res.status(404).json({
        error: "Not Found",
    });
});


module.exports.handler = serverless(app);
