import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { Link } from "react-router-dom";
import Post from "../statusItem/Post";
import useToastListener from "../toaster/ToastListenerHook";

interface Props {
    item: Status;
}

const StatusItem = (props: Props) => {
    const { setDisplayedUser, currentUser, authToken } =
        useContext(UserInfoContext);
    const { displayErrorMessage } = useToastListener();

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

    return (
        <div className="col bg-light mx-0 px-0">
            <div className="container px-0">
                <div className="row mx-0 px-0">
                    <div className="col-auto p-3">
                        <img
                            src={props.item.user.imageUrl}
                            className="img-fluid"
                            width="80"
                            alt="Posting user"
                        />
                    </div>
                    <div className="col">
                        <h2>
                            <b>
                                {props.item.user.firstName} {props.item.user.lastName}
                            </b>{" "}
                            -{" "}
                            <Link
                                to={props.item.user.alias}
                                onClick={(event) => navigateToUser(event)}
                            >
                                {props.item.user.alias}
                            </Link>
                        </h2>
                        {props.item.formattedDate}
                        <br />
                        <Post status={props.item} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusItem;