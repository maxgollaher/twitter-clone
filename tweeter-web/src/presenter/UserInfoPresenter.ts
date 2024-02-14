import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
    setIsFollower: (isFollower: boolean) => void;
    setFolloweesCount: (count: number) => void;
    setFollowersCount: (count: number) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    displayErrorMessage: (message: string) => void;
    clearLastInfoMessage: () => void;
}

export class UserInfoPresenter {

    private service;
    private view: UserInfoView;

    public constructor(view: UserInfoView) {
        this.view = view;
        this.service = new UserService();
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        try {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
                );
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to determine follower status because of exception: ${error}`
            );
        }
    };

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followees count because of exception: ${error}`
            );
        }
    };

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this.view.setFollowersCount(await this.service.getFollowersCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followers count because of exception: ${error}`
            );
        }
    };

    public async followDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
        try {
            this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);

            let [followersCount, followeesCount] = await this.follow(
                authToken!,
                displayedUser!
            );

            this.view.clearLastInfoMessage();

            this.view.setIsFollower(true);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to follow user because of exception: ${error}`
            );
        }
    };

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the following message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server

        let followersCount = await this.service.getFollowersCount(authToken, userToFollow);
        let followeesCount = await this.service.getFolloweesCount(authToken, userToFollow);

        return [followersCount, followeesCount];
    };

    public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
        try {
            this.view.displayInfoMessage(
                `Removing ${displayedUser!.name} from followers...`,
                0
            );

            let [followersCount, followeesCount] = await this.unfollow(
                authToken!,
                displayedUser!
            );

            this.view.clearLastInfoMessage();

            this.view.setIsFollower(false);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to unfollow user because of exception: ${error}`
            );
        }
    };

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the unfollowing message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server

        let followersCount = await this.service.getFollowersCount(authToken, userToUnfollow);
        let followeesCount = await this.service.getFolloweesCount(authToken, userToUnfollow);

        return [followersCount, followeesCount];
    };

}