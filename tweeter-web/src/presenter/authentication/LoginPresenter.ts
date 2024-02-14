import { useNavigate } from "react-router-dom";
import { UserService } from "../../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";

const navigate = useNavigate();

export interface LoginView {
    updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
    displayErrorMessage: (message: string) => void;
    originalUrl?: string;
}

export class LoginPresenter {

    private view: LoginView;
    private service: UserService;

    public constructor(view: LoginView) {
        this.view = view;
        this.service = new UserService();
    }

    public async doLogin(alias: string, password: string, rememberMeRef: React.MutableRefObject<boolean>) {
        try {
            let [user, authToken] = await this.service.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, rememberMeRef.current);

            if (!!this.view.originalUrl) {
                navigate(this.view.originalUrl);
            } else {
                navigate("/");
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        }
    };

}