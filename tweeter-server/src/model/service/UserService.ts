import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { AuthToken, User } from "tweeter-shared";
import { IDao } from "../../dataAccess/DaoFactory";
import { AuthTokenDTO } from "../../entity/AuthTokenDTO";
import { UserDTO } from "../../entity/UserDTO";

import CryptoJS from "crypto-js";
import { PaginatedDao } from "../../dataAccess/FollowsDao";
import { Follower } from "../../entity/Follower";
import { AuthService } from "./AuthService";

const BUCKET = "max-gollaher-tweeter";
const REGION = "us-west-2";

export class UserService extends AuthService {
  private static userDao: IDao = UserService.db.users;
  private static followsDao: PaginatedDao = UserService.db.follows;

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
    // Check if the alias is already taken
    let existingUser = await UserService.userDao.getItem(alias);
    if (existingUser) {
      throw new Error("[Bad Request] Alias already taken.");
    }

    // upload image to s3
    let fileName = alias + ".png";
    const imageUrl = await this.putImage(fileName, userImageBytes);

    // add user to database
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
    await this.verifyUser(alias, password);

    let user = (await UserService.userDao.getItem(alias)).toUser();
    let authToken = await this.getAuthToken(alias);

    return [user, authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await UserService.authTokenDao.deleteItem(authToken.token);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    await this.verifyAuthToken(authToken);
    let response = await UserService.userDao.getItem(alias);
    return response?.toUser() || null;
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    await this.verifyAuthToken(authToken);
    let followerRelationship = new Follower(
      selectedUser.alias,
      selectedUser.name,
      user.alias,
      user.name
    );
    let response = await UserService.followsDao.getItem(followerRelationship);
    return response !== undefined;
  }

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    await this.verifyAuthToken(authToken);
    let response = await UserService.userDao.getItem(user.alias);
    return response.following;
  }

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    await this.verifyAuthToken(authToken);
    let response = await UserService.userDao.getItem(user.alias);
    return response.followers;
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    await this.verifyAuthToken(authToken);

    let token: AuthTokenDTO = await UserService.authTokenDao.getItem(
      authToken.token
    );

    let user: User;
    let userDTO: UserDTO;
    let userToFollowDTO: UserDTO;
    try {
      userDTO = (await UserService.userDao.getItem(token!.alias));
      userToFollowDTO = (await UserService.userDao.getItem(userToFollow.alias));
      user = userDTO.toUser();
    } catch (error) {
      throw new Error("[Not Found] User not found.");
    }

    let follower = new Follower(
      userToFollow.alias,
      userToFollow.name,
      user.alias,
      user.name
    );
    await UserService.followsDao.putItem(follower);

    userDTO.following++;
    userToFollowDTO.followers++;
    await UserService.userDao.updateItem(userToFollowDTO);
    await UserService.userDao.updateItem(userDTO);

    let followersCount = await this.getFollowersCount(authToken, userToFollow);
    let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

    return [followersCount, followeesCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    await this.verifyAuthToken(authToken);

    let token = await UserService.authTokenDao.getItem(authToken.token);

 
    let user: User;
    let userDTO: UserDTO;
    let userToUnfollowDTO: UserDTO;
    try {
      userDTO = (await UserService.userDao.getItem(token!.alias));
      userToUnfollowDTO = (await UserService.userDao.getItem(userToUnfollow.alias));
      user = userDTO.toUser();
    } catch (error) {
      throw new Error("[Not Found] User not found.");
    }

    if (user.alias === userToUnfollow.alias) {
      throw new Error("[Bad Request] Cannot unfollow yourself.");
    }

    let follower = new Follower(
      userToUnfollow.alias,
      userToUnfollow.name,
      user.alias,
      user.name
    );
    await UserService.followsDao.deleteItem(follower);

    userDTO.following--;
    userToUnfollowDTO.followers--;
    await UserService.userDao.updateItem(userToUnfollowDTO)
    await UserService.userDao.updateItem(userDTO)


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
      throw Error("[Internal Server Error] s3 putImage failed with: " + error);
    }
  }

  private async verifyUser(alias: string, password: string): Promise<boolean> {
    const user = await UserService.userDao.getItem(alias);

    if (user === null) {
      throw new Error("[Bad Request] User not found.");
    }

    console.log("User: ", user);

    // Hash the provided password with the retrieved salt
    const hash = CryptoJS.SHA256(password + user.salt);
    const hashedPassword = hash.toString(CryptoJS.enc.Base64);
    console.log("Hashed Password: ", hashedPassword)


    // Compare the hashed password with the stored hashed password
    const isPasswordValid = hashedPassword === user.password;

    if (!isPasswordValid) {
      throw new Error("[Bad Request] Invalid username or password.");
    }

    return isPasswordValid;
  }
}
