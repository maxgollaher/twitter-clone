import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import CryptoJS from "crypto-js";
import { UserDTO } from "../entity/UserDTO";
import { IDao } from "./DaoFactory";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

export class UserDao implements IDao {
  readonly tableName = "users";
  readonly primaryKey = "alias";
  readonly firstName = "first_name";
  readonly lastName = "last_name";
  readonly imageUrl = "image_url";
  readonly password = "password";
  readonly salt = "salt";
  readonly followers = "followers";
  readonly following = "following";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  /**
   * Gets a user from the database by alias
   * @param key = the alias of the user
   * @returns the UserDTO object or null if the user is not found
   */
  async getItem(key: string): Promise<UserDTO | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.primaryKey]: key,
      },
    };
    try {
      const output = await this.client.send(new GetCommand(params));
      return output.Item == undefined
        ? null
        : new UserDTO(
            output.Item[this.firstName],
            output.Item[this.lastName],
            output.Item[this.primaryKey],
            output.Item[this.imageUrl],
            output.Item[this.password],
            output.Item[this.salt],
            output.Item[this.followers],
            output.Item[this.following]
          );
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Deletes a user from the database by alias
   * @param key - the alias of the user to delete
   */
  async deleteItem(key: any): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.primaryKey]: key,
      },
    };
    try {
      await this.client.send(new DeleteCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Put a user into the database, hashing the password, and storing the salt
   * @param user - the user object to insert
   * @returns the User object that was inserted
   */
  async putItem(user: UserDTO): Promise<void> {
    // user crypto to hash password
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const hash = CryptoJS.SHA256(user.password + salt);
    const hashedPassword = hash.toString(CryptoJS.enc.Base64);

    try {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.primaryKey]: user.alias,
          [this.firstName]: user.firstName,
          [this.lastName]: user.lastName,
          [this.imageUrl]: user.imageUrl,
          [this.password]: hashedPassword,
          [this.salt]: salt,
          [this.followers]: 0,
          [this.following]: 0,
        },
      };
      await this.client.send(new PutCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Updates a user in the database
   * @param user - the user object to update
   * @returns the User object that was updated
   */
  async updateItem(user: UserDTO): Promise<void> {
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const hash = CryptoJS.SHA256(user.password + salt);
    const hashedPassword = hash.toString(CryptoJS.enc.Base64);

    const params = {
      TableName: this.tableName,
      Key: {
        [this.primaryKey]: user.alias,
      },
      UpdateExpression:
        "SET first_name = :fn, last_name = :ln, image_url = :iu, password = :pw, salt = :s, followers = :f, following = :g",
      ExpressionAttributeValues: {
        ":fn": user.firstName,
        ":ln": user.lastName,
        ":iu": user.imageUrl,
        ":pw": hashedPassword,
        ":s": salt,
        ":f": user.followers,
        ":g": user.following,
      },
    };

    try {
      await this.client.send(new UpdateCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }

  /**
   * Batch writes multiple users to the database
   * @param users - an array of UserDTO objects to insert
   */
  async batchWriteItems(users: UserDTO[]): Promise<void> {
    const items = users.map((user) => {
      const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
      const hash = CryptoJS.SHA256(user.password + salt);
      const hashedPassword = hash.toString(CryptoJS.enc.Base64);

      return {
        [this.primaryKey]: user.alias,
        [this.firstName]: user.firstName,
        [this.lastName]: user.lastName,
        [this.imageUrl]: user.imageUrl,
        [this.password]: hashedPassword,
        [this.salt]: salt,
        [this.followers]: user.followers,
        [this.following]: user.following,
      };
    });

    const params = {
      RequestItems: {
        [this.tableName]: items.map((item) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    };

    try {
      await this.client.send(new BatchWriteCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError] " + error);
    }
  }
}
