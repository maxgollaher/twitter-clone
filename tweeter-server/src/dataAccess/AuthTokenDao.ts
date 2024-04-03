import { UserDTO } from "../entity/UserDTO";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";


export class AuthTokenDao {
    readonly tableName = "tokens";
    readonly primaryKey = "token";
    readonly alias = "alias";
    
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async putAuthToken(token: string, alias: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.primaryKey]: token,
                [this.alias]: alias,
            },
        };
        await this.client.send(new PutCommand(params));
        console.log(`Put token: ${token}`);
    }

    async getAlias(token: string): Promise<string | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.primaryKey]: token,
            },
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined ? null : output.Item[this.alias];
    }
}
