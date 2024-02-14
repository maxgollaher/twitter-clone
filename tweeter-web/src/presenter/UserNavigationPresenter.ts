import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void;
    currentUser: User | null;
    authToken: AuthToken | null;
}

export class UserNavigationPresenter {

    private view: UserNavigationView;
    private service: UserService;

    public constructor(view: UserNavigationView) {
        this.view = view;
        this.service = new UserService();
    }

    public async navigateToUser(event: React.MouseEvent): Promise<void> {
        try {
            let alias = this.extractAlias(event.target.toString());

            let user = await this.service.getUser(this.view.authToken!, alias);

            if (!!user) {
                if (this.view.currentUser!.equals(user)) {
                    this.view.setDisplayedUser(this.view.currentUser!);
                } else {
                    this.view.setDisplayedUser(user);
                }
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    };

    private extractAlias(value: string): string {
        let index = value.indexOf("@");
        return value.substring(index);
    };
}