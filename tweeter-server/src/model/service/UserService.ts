import { User, AuthToken, FakeData } from "tweeter-shared";
import { UserDTO } from "../../entity/UserDTO";
import { UserDao } from "../../dataAccess/UserDao";

export class UserService {
  private static dao: UserDao = new UserDao();

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string
  ): Promise<[User, AuthToken]> {
    let user = new UserDTO(
      firstName,
      lastName,
      alias,
      userImageBytes,
      password
    );
    await UserService.dao.putUser(user);
    let response = await UserService.dao.getUser(alias);
    return [response!.toUser(), FakeData.instance.authToken];
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    let isValid = await UserService.dao.verifyUser(alias, password);
    if (!isValid) {
      throw new Error("Invalid alias or password");
    }
    let user = await UserService.dao.getUser(alias);
    return [user!.toUser(), FakeData.instance.authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await new Promise((f) => setTimeout(f, 2000));
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    let response = await UserService.dao.getUser(alias);
    console.log(response);
    console.log(response?.toUser());
    if (response === null) {
      return null;
    }
    return response.toUser();
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    let response = await UserService.dao.getUser(user.alias);
    console.log(response);
    if (response === null) {
      return 0;
    }
    return response.followeesCount;
  }

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    let response = await UserService.dao.getUser(user.alias);
    console.log(response)
    if (response === null) {
      return 0;
    }
    return response.followersCount;
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the following message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    let followersCount = await this.getFollowersCount(authToken, userToFollow);
    let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

    return [followersCount, followeesCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the unfollowing message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

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
}
