import { StatusItemPresenter, StatusItemView } from './StatusItemPresenter';
import { AuthToken, Status, User } from 'tweeter-shared';
import { PAGE_SIZE } from "./PagedItemPresenter";


export class FeedPresenter extends StatusItemPresenter {
  public constructor(view: StatusItemView) {
    super(view);
  }

  protected get view(): StatusItemView {
    return super.view as StatusItemView;
  }

  protected getMoreItems(
    authToken: AuthToken,
    user: User
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(
      authToken!,
      user!,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load feed items";
  }
}