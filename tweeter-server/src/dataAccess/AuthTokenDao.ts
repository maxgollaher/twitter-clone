import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthTokenDTO } from "../entity/AuthTokenDTO";
import { IDao } from "./DaoFactory";

export class AuthTokenDao implements IDao {
  readonly tableName = "tokens";
  readonly primaryKey = "token";
  readonly alias = "alias";
  readonly timestamp = "timestamp";
  readonly expireTime = "expire_time";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  /**
   * Puts a token in the database
   * @param token - the token to put in the database
   */
  async putItem(token: AuthTokenDTO): Promise<void> {
    // create the 1 hour expiration time
    const expiration = token.timestamp + 3600;

    try {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.primaryKey]: token.token,
          [this.alias]: token.alias,
          [this.timestamp]: token.timestamp,
          [this.expireTime]: expiration,
        },
      };
      await this.client.send(new PutCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Gets a token from the database given the token
   * @param token
   * @returns the token or null if the token is not found
   */
  async getItem(token: string): Promise<AuthTokenDTO | null> {
    const params = {
      TableName: this.tableName,
      Key: this.generateTokenItem(token),
    };
    try {
      const output = await this.client.send(new GetCommand(params));
      return output.Item == undefined
        ? null
        : new AuthTokenDTO(
            output.Item[this.primaryKey],
            output.Item[this.timestamp],
            output.Item[this.alias]
          );
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Deletes a token from the database
   * @param token - the token to delete
   */
  async deleteItem(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.primaryKey]: token,
      },
    };
    try {
      await this.client.send(new DeleteCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Updates a token in the database
   * 
   * @param token - the token to update
   */
  async updateItem(token: AuthTokenDTO): Promise<void> {
    const expiration = token.timestamp + 3600;
    const params = {
      TableName: this.tableName,
      Key: this.generateTokenItem(token.token),
      UpdateExpression: "SET #alias = :a, #timestamp = :t, #expire_time = :e",
      ExpressionAttributeNames: {
        "#alias": this.alias,
        "#timestamp": this.timestamp,
        "#expire_time": this.expireTime,
      },
      ExpressionAttributeValues: {
        ":a": token.alias,
        ":t": token.timestamp,
        ":e": expiration,
      },
    };
    try {
      await this.client.send(new UpdateCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  private generateTokenItem(token: string) {
    return {
      [this.primaryKey]: token,
    };
  }
}
