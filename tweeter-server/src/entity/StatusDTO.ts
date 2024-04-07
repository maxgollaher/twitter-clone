import { Status } from "tweeter-shared";

export class StatusDTO {
    receiverAlias: string;
    timestamp: number;
    post: Status;

    constructor(receiver_handle: string, timestamp: number, post: Status) {
        this.receiverAlias = receiver_handle;
        this.timestamp = timestamp;
        this.post = post;
    }

    toString(): string {
        return `StatusDTO: ${this.receiverAlias} ${this.timestamp} ${this.post}`;
    }

    static fromJson(json: any): StatusDTO {
        return new StatusDTO(json.receiverAlias, json.timestamp, Status.fromJson(json.post)!);
    }
}