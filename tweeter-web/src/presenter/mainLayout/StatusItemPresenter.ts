import { AuthToken, Status, User } from "tweeter-shared";

export interface StatusItemView {
    addItems: (items: Status[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {

    private _view: StatusItemView;
    private _hasMoreItems: boolean = true;

    protected constructor(view: StatusItemView) {
        this._view = view;
    }

    protected get view(): StatusItemView {
        return this._view;
    }

    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    public abstract loadMoreItems(authToken: AuthToken, displayedUser: User): void;
}