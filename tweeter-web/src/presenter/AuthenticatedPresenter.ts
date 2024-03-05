import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthenticatedView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken
  ) => void;
  navigate: (url: string) => void;
}

export abstract class AuthenticatedPresenter extends Presenter {
  private _service: UserService;

  protected constructor(view: AuthenticatedView) {
    super(view);
    this._service = new UserService();
  }

  protected get service(): UserService {
    return this._service;
  }

  protected get view(): AuthenticatedView { 
    return super.view as AuthenticatedView;
  }

  protected async doAuthenticationOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    navigation: () => void
  ): Promise<void> {
    this.doFailureReportingOperation(operation, operationDescription);
    navigation();
  }
}
