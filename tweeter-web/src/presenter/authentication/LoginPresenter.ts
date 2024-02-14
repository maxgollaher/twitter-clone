import { UserService } from "../../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";

export interface LoginView {
    updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
    displayErrorMessage: (message: string) => void;
    navigate: (url: string) => void;
    originalUrl?: string;
    rememberMeRef: React.MutableRefObject<boolean>;
}

export class LoginPresenter {

    private view: LoginView;
    private service: UserService;

    public constructor(view: LoginView) {
        this.view = view;
        this.service = new UserService();
    }

    public async doLogin(alias: string, password: string) {
        try {
            let [user, authToken] = await this.service.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, this.view.rememberMeRef.current);

            if (!!this.view.originalUrl) {
                this.view.navigate(this.view.originalUrl);
            } else {
                this.view.navigate("/");
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        }
    };

}