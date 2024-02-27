import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
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
    return this.service.loadMoreStoryItems(
      authToken!,
      user!,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load story items";
  }
}
