import { AuthToken, LoadPagedItemRequest, User } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService {
  private _serverFacade: ServerFacade = new ServerFacade();

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    let request = new LoadPagedItemRequest<User>(
      authToken,
      user,
      pageSize,
      lastItem
    );
    let response = await this._serverFacade.loadMoreFollowers(request);
    return [response.items, response.hasMorePages];
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    let request = new LoadPagedItemRequest<User>(
      authToken,
      user,
      pageSize,
      lastItem
    );
    let response = await this._serverFacade.loadMoreFollowees(request);
    return [response.items, response.hasMorePages];
  }
}
