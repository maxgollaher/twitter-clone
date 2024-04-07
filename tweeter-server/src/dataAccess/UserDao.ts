import { UserDTO } from "../entity/UserDTO";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import CryptoJS from "crypto-js";
import { IDao } from "./DaoFactory";

export class UserDao implements IDao {
  readonly tableName = "users";
  readonly primaryKey = "alias";
  readonly firstName = "first_name";
  readonly lastName = "last_name";
  readonly imageUrl = "image_url";
  readonly password = "password";
  readonly salt = "salt";

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
            output.Item[this.salt]
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
        },
      };
      await this.client.send(new PutCommand(params));
    } catch (error) {
      throw new Error("[InternalServerError]" + error);
    }
  }
}
