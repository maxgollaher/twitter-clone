import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter {
  private _service: StatusService;

  constructor(view: PostStatusView) {
    super(view);
    this._service = new StatusService();
  }

  protected get view(): PostStatusView {
    return super.view as PostStatusView;
  }

  public get service(): StatusService {
    return this._service;
  }

  public clearPost(): void {
    this.view.setPost("");
  }

  public async submitPost(
    authToken: AuthToken,
    post: string,
    currentUser: User
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Posting status...", 0);

      let status = new Status(post, currentUser!, Date.now());

      let response = await this.service.postStatus(authToken!, status);

      // TODO: Handle response
      this.view.clearLastInfoMessage();
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");
  }
}
