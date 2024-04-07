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
    StatusService.db.follows;
  private static feedDao: PaginatedFeedDao =
    StatusService.db.feed;
  private static storyDao: PaginatedFeedDao =
    StatusService.db.story;

  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    await this.verifyAuthToken(authToken);

    let response: DataPage<Status> = await StatusService.feedDao.getPageOfFeed(
      user.alias,
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
    await this.verifyAuthToken(authToken);

    let response: DataPage<Status> = await StatusService.storyDao.getPageOfFeed(
      user.alias,
      pageSize,
      lastItem?.timestamp
    );
    return [response.values, response.hasMorePages];
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<PostStatusResponse> {
    await this.verifyAuthToken(authToken);

    // Add the status to the feed of everyone who follows the user
    let followers = await StatusService.followsDao.getAllItems(
      newStatus.user.alias,
      "follower_handle"
    );
    let follower: Follower;
    for (follower of followers) {
      let statusDTO = new StatusDTO(
        follower.followee_handle,
        newStatus.timestamp,
        newStatus
      );
      await StatusService.feedDao.putItem(statusDTO);
    }

    // Add the status to the user's own story
    let statusDTO = new StatusDTO(newStatus.user.alias, newStatus.timestamp, newStatus);
    await StatusService.storyDao.putItem(statusDTO);

    return new PostStatusResponse(true);
  }
}
