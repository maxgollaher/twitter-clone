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

import CryptoJS from "crypto-js";

import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";

const BUCKET = "max-gollaher-tweeter";
const REGION = "us-west-2";

export class UserDao {
  readonly tableName = "users";
  readonly primaryKey = "alias";
  readonly firstName = "first_name";
  readonly lastName = "last_name";
  readonly imageUrl = "image_url";
  readonly password = "password";
  readonly salt = "salt";
  readonly followersCount = "followers_count";
  readonly followeesCount = "followees_count";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getUser(alias: string): Promise<UserDTO | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.primaryKey]: alias,
      },
    };
    const output = await this.client.send(new GetCommand(params));
    console.log(`Get user: ${JSON.stringify(output)}`);
    return output.Item == undefined
      ? null
      : new UserDTO(
          output.Item[this.firstName],
          output.Item[this.lastName],
          output.Item[this.primaryKey],
          output.Item[this.imageUrl],
          output.Item[this.password],
          output.Item[this.salt],
          output.Item[this.followersCount],
          output.Item[this.followeesCount]
        );
  }

  async verifyUser(alias: string, password: string): Promise<boolean> {
    const user = await this.getUser(alias);

    if (user === null) {
      return false; // User not found
    }

    // Hash the provided password with the retrieved salt
    const hash = CryptoJS.SHA256(password + user.salt);
    const hashedPassword = hash.toString(CryptoJS.enc.Base64);

    console.log(`Hashed password: ${hashedPassword}`);
    console.log(`Stored password: ${user.password}`);

    // Compare the hashed password with the stored hashed password
    const isPasswordValid = hashedPassword === user.password;

    if (!isPasswordValid) {
      console.log(`Invalid password for user ${alias}.`);
    }

    return isPasswordValid;
  }

  async putUser(user: UserDTO): Promise<User> {
    // Upload image to S3
    let userImageBytes = user.imageUrl;
    let userImageFileName = user.alias + ".png";
    let imageUrl = await this.putImage(userImageFileName, userImageBytes);

    // user crypto to hash password
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const hash = CryptoJS.SHA256(user.password + salt);
    const hashedPassword = hash.toString(CryptoJS.enc.Base64);

    console.log(`Hashed password: ${hashedPassword}`);
    console.log(`Salt: ${salt}`);

    // Put user in DynamoDB
    const params = {
      TableName: this.tableName,
      Item: {
        [this.primaryKey]: user.alias,
        [this.firstName]: user.firstName,
        [this.lastName]: user.lastName,
        [this.imageUrl]: imageUrl,
        [this.password]: hashedPassword,
        [this.salt]: salt,
        [this.followersCount]: 0,
        [this.followeesCount]: 0,
      },
    };

    await this.client.send(new PutCommand(params));
    console.log(`Put user: ${user.toString()}`);
    return new User(user.firstName, user.lastName, user.alias, user.imageUrl);
  }

  async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
