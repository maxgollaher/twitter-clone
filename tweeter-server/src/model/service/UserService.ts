import { User, AuthToken } from "tweeter-shared";
import { UserDTO } from "../../entity/UserDTO";
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { IDao } from "../../dataAccess/DaoFactory";
import { AuthTokenDTO } from "../../entity/AuthTokenDTO";

import CryptoJS from "crypto-js";
import { Follower } from "../../entity/Follower";
import { PaginatedDao } from "../../dataAccess/FollowsDao";
import { AuthService } from "./AuthService";

const BUCKET = "max-gollaher-tweeter";
const REGION = "us-west-2";

export class UserService extends AuthService {
  private static userDao: IDao = UserService.DaoFactory.getUserDao();
  private static followsDao: PaginatedDao =
    UserService.DaoFactory.getFollowsDao();

  private async getAuthToken(alias: string): Promise<AuthToken> {
    let authToken = AuthToken.Generate();
    let authRequest = new AuthTokenDTO(
      authToken.token,
      authToken.timestamp,
      alias
    );

    await UserService.authTokenDao.putItem(authRequest);
    return authToken;
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string
  ): Promise<[User, AuthToken]> {
    let fileName = alias + ".png";
    const imageUrl = await this.putImage(fileName, userImageBytes);

    let user = new UserDTO(firstName, lastName, alias, imageUrl, password);
    await UserService.userDao.putItem(user);
    let response = (await UserService.userDao.getItem(alias)).toUser();

    let authResponse = await this.getAuthToken(alias);
    return [response, authResponse];
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    let isValid = await this.verifyUser(alias, password);
    if (!isValid) {
      throw new Error("Invalid alias or password");
    }
    let user = (await UserService.userDao.getItem(alias)).toUser();
    let authToken = await this.getAuthToken(alias);

    console.log(`User: ${JSON.stringify(user)}`);
    console.log(`AuthToken: ${JSON.stringify(authToken)}`);

    return [user, authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await UserService.authTokenDao.deleteItem(authToken.token);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    this.verifyAuthToken(authToken);
    let response = await UserService.userDao.getItem(alias);
    return response?.toUser() || null;
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    this.verifyAuthToken(authToken);
    let followerRelationship = new Follower(
      user.alias,
      user.name,
      selectedUser.alias,
      selectedUser.name
    );
    let response = await UserService.followsDao.getItem(followerRelationship);
    return response !== undefined;
  }

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    this.verifyAuthToken(authToken);
    let response = await UserService.followsDao.getCount(
      user.alias,
      "followee_handle"
    );
    console.log(`Followees count: ${response}`);
    return response;
  }

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    this.verifyAuthToken(authToken);
    let response = await UserService.followsDao.getCount(
      user.alias,
      "follower_handle"
    );
    return response;
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    this.verifyAuthToken(authToken);

    let token: AuthTokenDTO = await UserService.authTokenDao.getItem(
      authToken.token
    );
    let user: User = (await UserService.userDao.getItem(token!.alias)).toUser();

    let follower = new Follower(
      userToFollow.alias,
      userToFollow.name,
      user.alias,
      user.name
    );
    await UserService.followsDao.putItem(follower);

    let followersCount = await this.getFollowersCount(authToken, userToFollow);
    let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

    return [followersCount, followeesCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    this.verifyAuthToken(authToken);

    let token = await UserService.authTokenDao.getItem(authToken.token);
    let user = (await UserService.userDao.getItem(token!.alias)).toUser();

    let follower = new Follower(
      userToUnfollow.alias,
      userToUnfollow.name,
      user.alias,
      user.name
    );
    await UserService.followsDao.deleteItem(follower);

    let followersCount = await this.getFollowersCount(
      authToken,
      userToUnfollow
    );
    let followeesCount = await this.getFolloweesCount(
      authToken,
      userToUnfollow
    );

    return [followersCount, followeesCount];
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

  async verifyUser(alias: string, password: string): Promise<boolean> {
    const user = await UserService.userDao.getItem(alias);

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
}
