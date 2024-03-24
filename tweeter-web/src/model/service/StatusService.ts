import {
  AuthToken,
  User,
  Status,
  LoadPagedItemRequest,
  PostStatusRequest,
} from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService {
  private _serverFacade: ServerFacade;

  constructor() {
    this._serverFacade = this.getServerFacade();
  }

  getServerFacade(): ServerFacade {
    return new ServerFacade();
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    let request = new LoadPagedItemRequest<Status>(
      authToken,
      user,
      pageSize,
      lastItem
    );
    console.log(request);
    let response = await this._serverFacade.loadMoreFeedItems(request);
    console.log(response);
    return [response.items, response.hasMorePages];
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    let request = new LoadPagedItemRequest<Status>(
      authToken,
      user,
      pageSize,
      lastItem
    );
    let response = await this._serverFacade.loadMoreStoryItems(request);
    return [response.items, response.hasMorePages];
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    let request = new PostStatusRequest(authToken, newStatus);
    await this._serverFacade.postStatus(request);
  }
}
