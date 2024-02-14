import { StatusItemPresenter, StatusItemView } from './StatusItemPresenter';
import { StatusService } from '../../model/service/StatusService';
import { AuthToken, Status, User } from 'tweeter-shared';

export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusItemPresenter {

    private service: StatusService;

    private lastItem: Status | null = null;

    public constructor(view: StatusItemView) {
        super(view);
        this.service = new StatusService();
    }

    public async loadMoreItems(authToken: AuthToken, user: User) {
        try {
            if (this.hasMoreItems) {
                let [newItems, hasMore] = await this.service.loadMoreStoryItems(
                    authToken!,
                    user!,
                    PAGE_SIZE,
                    this.lastItem
                );

                this.hasMoreItems = hasMore;
                this.lastItem = newItems[newItems.length - 1];
                this.view.addItems(newItems);
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to load feed items because of exception: ${error}`
            );
        }
    };

}