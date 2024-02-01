import { AuthToken, User, FakeData } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";

interface UserNavigation {
    navigateToUser: (event: React.MouseEvent) => Promise<void>;
    extractAlias: (value: string) => string;
    getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
}

const useUserNavigation = (): UserNavigation => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } =
        useUserInfo();

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();

        try {
            let alias = extractAlias(event.target.toString());

            let user = await getUser(authToken!, alias);

            if (!!user) {
                if (currentUser!.equals(user)) {
                    setDisplayedUser(currentUser!);
                } else {
                    setDisplayedUser(user);
                }
            }
        } catch (error) {
            displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    };

    const extractAlias = (value: string): string => {
        let index = value.indexOf("@");
        return value.substring(index);
    };

    const getUser = async (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    return {
        navigateToUser,
        extractAlias,
        getUser
    };

}

export default useUserNavigation;