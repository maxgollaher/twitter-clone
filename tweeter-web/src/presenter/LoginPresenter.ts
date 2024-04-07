import {
  AuthenticatedPresenter,
  AuthenticatedView,
} from "./AuthenticatedPresenter";

export class LoginPresenter extends AuthenticatedPresenter {
  public constructor(view: AuthenticatedView) {
    super(view);
  }

  public async doLogin(alias: string, password: string, originalUrl?: string) {
    this.doAuthenticationOperation(
      async () => {
        let [user, authToken] = await this.service.login(alias, password);
        this.view.updateUserInfo(user, user, authToken);
      },
      "log user in",
      () => {
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate("/");
        }
      }
    );
  }
}
