import { Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export async function handler(
    event: any
): Promise<void> {
    let statusJSON = JSON.parse(event.Records[0].body).status;
    let userArray = JSON.parse(event.Records[0].body).followers;

    let status = Status.fromJson(JSON.stringify(statusJSON))!;
    await new StatusService().postStatus(status, userArray);
}
