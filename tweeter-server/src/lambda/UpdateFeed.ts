import { Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export async function handler(
    event: any
): Promise<void> {
    let statusJSON = JSON.parse(event.Records[0].body).status;
    let userArray = JSON.parse(event.Records[0].body).followers;

    console.log("status: ", JSON.stringify(statusJSON));
    console.log("followers: ", JSON.stringify(userArray));

    let status = Status.fromJson(JSON.stringify(statusJSON))!;
    let followers = userArray.map((user: any) => User.fromJson(JSON.stringify(user))!);
    await new StatusService().postStatus(status, followers);
}
