import { AuthToken, User } from "tweeter-shared";
import { Follower } from "../../entity/Follower";
import { DataPage } from "../../entity/DataPage";
import { UserDTO } from "../../entity/UserDTO";
import { IDao } from "../../dataAccess/DaoFactory";
import { PaginatedDao } from "../../dataAccess/FollowsDao";
import { AuthService } from "./AuthService";

export class FollowService extends AuthService {
  private static userDao: IDao = FollowService.DaoFactory.getUserDao();
  private static followsDao: PaginatedDao =
    FollowService.DaoFactory.getFollowsDao();

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    this.verifyAuthToken(authToken);

    let alias = JSON.parse(JSON.stringify(user))._alias;
    let response: DataPage<Follower> =
      await FollowService.followsDao.getPageOfFollowers(
        alias,
        pageSize,
        lastItem?.alias
      );

    let userPromises: Promise<User | null>[] = response.values.map(
      async (follower) => {
        let foundUser: UserDTO | null = await FollowService.userDao.getItem(
          follower.followee_handle
        );
        return foundUser ? foundUser.toUser() : null;
      }
    );

    let users = await Promise.all(userPromises);
    let validUsers = users.filter((user) => user !== null) as User[];

    return [validUsers, response.hasMorePages];
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    this.verifyAuthToken(authToken);

    let alias = JSON.parse(JSON.stringify(user))._alias;
    let response: DataPage<Follower> =
      await FollowService.followsDao.getPageOfFollowees(
        alias,
        pageSize,
        lastItem?.alias
      );

    let userPromises: Promise<User | null>[] = response.values.map(
      async (followee) => {
        let foundUser: UserDTO | null = await FollowService.userDao.getItem(
          followee.follower_handle
        );
        return foundUser ? foundUser.toUser() : null;
      }
    );

    let users = await Promise.all(userPromises);
    let validUsers = users.filter((user) => user !== null) as User[];

    return [validUsers, response.hasMorePages];
  }
}
