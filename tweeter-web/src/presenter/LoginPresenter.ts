import { UserService } from "../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  updateUserInfo: (
    user: User,
    displayedUser: User,
    authToken: AuthToken
  ) => void;
  navigate: (url: string) => void;
}

export class LoginPresenter extends Presenter {
  private service: UserService;

  public constructor(view: LoginView) {
    super(view);
    this.service = new UserService();
  }

  protected get view(): LoginView {
    return super.view as LoginView;
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
