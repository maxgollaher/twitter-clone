import { AuthToken, PostStatusResponse, Status, User } from "tweeter-shared";
import { PaginatedDao } from "../../dataAccess/FollowsDao";
import { PaginatedFeedDao } from "../../dataAccess/StatusDao";
import { DataPage } from "../../entity/DataPage";
import { Follower } from "../../entity/Follower";
import { StatusDTO } from "../../entity/StatusDTO";
import { AuthService } from "./AuthService";

export class StatusService extends AuthService {
  private static feedDao: PaginatedFeedDao = StatusService.db.feed;
  private static storyDao: PaginatedFeedDao = StatusService.db.story;

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

  /**
   * Posts a status to the feeds of all followers
   * @param authToken
   * @param newStatus
   * @returns
   */
  public async postStatus(
    newStatus: Status,
    followers: string[]
  ): Promise<void> {
    let items = followers.map((follower) => {
      return new StatusDTO(follower, newStatus.timestamp, newStatus);
    });
    await StatusService.feedDao.batchWriteItems(items);
  }

  /**
   * Posts a status to the user's own story
   * @param authToken
   * @param status
   * @returns
   */
  public async postStory(authToken: AuthToken, status: Status) {
    await this.verifyAuthToken(authToken);

    // Add the status to the user's own story
    let statusDTO = new StatusDTO(status.user.alias, status.timestamp, status);
    await StatusService.storyDao.putItem(statusDTO);

    return new PostStatusResponse(true);
  }
}
