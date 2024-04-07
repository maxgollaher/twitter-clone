import { AuthToken, User, Status } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";
import { StatusDTO } from "../../entity/StatusDTO";
import { Follower } from "../../entity/Follower";
import { PostStatusResponse } from "tweeter-shared";
import { PaginatedDao } from "../../dataAccess/FollowsDao";
import { PaginatedFeedDao } from "../../dataAccess/StatusDao";
import { AuthService } from "./AuthService";

export class StatusService extends AuthService {
  private static followsDao: PaginatedDao =
    StatusService.DaoFactory.getFollowsDao();
  private static feedDao: PaginatedFeedDao =
    StatusService.DaoFactory.getFeedDao();
  private static storyDao: PaginatedFeedDao =
    StatusService.DaoFactory.getStoryDao();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    this.verifyAuthToken(authToken);

    let alias = JSON.parse(JSON.stringify(user))._alias;
    let response: DataPage<Status> = await StatusService.feedDao.getPageOfFeed(
      alias,
      pageSize,
      lastItem?.timestamp
    );
    return [response.values, response.hasMorePages];
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    this.verifyAuthToken(authToken);

    let alias = JSON.parse(JSON.stringify(user))._alias;
    let response: DataPage<Status> = await StatusService.storyDao.getPageOfFeed(
      alias,
      pageSize,
      lastItem?.timestamp
    );
    return [response.values, response.hasMorePages];
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<PostStatusResponse> {
    this.verifyAuthToken(authToken);

    // get the alias of the user
    let status: Status = Status.fromJson(JSON.stringify(newStatus))!;
    let alias = status.user.alias;

    // Add the status to the feed of everyone who follows the user
    let followers = await StatusService.followsDao.getAllItems(
      alias,
      "follower_handle"
    );
    let follower: Follower;
    for (follower of followers) {
      let statusDTO = new StatusDTO(
        follower.followee_handle,
        status.timestamp,
        status
      );
      await StatusService.feedDao.putItem(statusDTO);
    }

    // Add the status to the user's own story
    let statusDTO = new StatusDTO(alias, status.timestamp, status);
    await StatusService.storyDao.putItem(statusDTO);

    return new PostStatusResponse(true);
  }
}
