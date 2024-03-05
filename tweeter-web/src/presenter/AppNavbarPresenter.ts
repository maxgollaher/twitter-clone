import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView {
  navigateToLogin(): void;
  clearUserInfo: () => void;
}

export class AppNavbarPresenter extends Presenter {
  private _service: UserService;

  public constructor(view: AppNavbarView) {
    super(view);
    this._service = new UserService();
  }

  protected get view(): AppNavbarView {
    return super.view as AppNavbarView;
  }

  public get service(): UserService {
    return this._service;
  }

  public async logOut(authToken: AuthToken) {
    this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Logging Out...", 0);

      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
      this.view.navigateToLogin();
    }, "log the user out");
  }
}
