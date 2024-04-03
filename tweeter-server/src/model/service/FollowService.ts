import { AuthToken, User } from "tweeter-shared";
import { FollowsDao } from "../../dataAccess/FollowsDao";
import { Follower } from "../../entity/Follower";
import { DataPage } from "../../entity/DataPage";
import { UserDao } from "../../dataAccess/UserDao";
import { UserDTO } from "../../entity/UserDTO";

export class FollowService {
  private static followsDao: FollowsDao = new FollowsDao();
  private static userDao: UserDao = new UserDao();

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    let alias = JSON.parse(JSON.stringify(user))._alias;
    let response: DataPage<Follower> =
      await FollowService.followsDao.getPageOfFollowers(
        alias,
        pageSize,
        lastItem?.alias
      );

    let userPromises: Promise<User | null>[] = response.values.map(
      async (follower) => {
        let foundUser: UserDTO | null = await FollowService.userDao.getUser(
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
    let alias = JSON.parse(JSON.stringify(user))._alias;
    let response: DataPage<Follower> =
      await FollowService.followsDao.getPageOfFollowees(
        alias,
        pageSize,
        lastItem?.alias
      );

    let userPromises: Promise<User | null>[] = response.values.map(
      async (followee) => {
        let foundUser: UserDTO | null = await FollowService.userDao.getUser(
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
