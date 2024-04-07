import {
  AuthToken,
  User,
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
  GetUserRequest,
  GetUserInfoRequest,
  GetIsFollowerRequest,
  FollowRequest,
} from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../net/ServerFacade";

export class UserService {
  private _serverFacade: ServerFacade = new ServerFacade();

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array
  ): Promise<[User, AuthToken]> {
    let imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    let request = new RegisterRequest(
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64
    );
    let response = await this._serverFacade.register(request);

    if (response.user === null || response.token === null) {
      throw new Error("Invalid registration");
    }

    return [response.user, response.token];
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    let request = new LoginRequest(alias, password);
    let response = await this._serverFacade.login(request);

    if (response.user === null || response.token === null) {
      throw new Error("Invalid login");
    }

    return [response.user, response.token];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    let request = new LogoutRequest(authToken);
    let response = await this._serverFacade.logout(request);
    return response;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    let request = new GetUserRequest(authToken, alias);
    let response = await this._serverFacade.getUser(request);
    return response.user;
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    let request = new GetIsFollowerRequest(authToken, user, selectedUser);
    let response = await this._serverFacade.getIsFollowerStatus(request);
    return response.isFollower;
  }

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    let request = new GetUserInfoRequest(authToken, user);
    let response = await this._serverFacade.getFolloweesCount(request);
    return response.followCount;
  }

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    let request = new GetUserInfoRequest(authToken, user);
    let response = await this._serverFacade.getFollowersCount(request);
    return response.followCount;
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    let request = new FollowRequest(authToken, userToFollow);
    let response = await this._serverFacade.follow(request);

    return [response.followersCount, response.followeesCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    let request = new FollowRequest(authToken, userToUnfollow);
    let response = await this._serverFacade.unfollow(request);

    return [response.followersCount, response.followeesCount];
  }
}
