import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";

describe("PostStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  let authToken = new AuthToken("token", Date.now());
  let currentUser = new User("first", "last", "alias", "imgURL");
  let post = "post";

  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusPresenterViewInstance = instance(
      mockPostStatusPresenterView
    );

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusPresenterViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance);
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(authToken, post, currentUser);
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(authToken, post, currentUser);
    verify(mockStatusService.postStatus(authToken, anything())).once();

    let [authTokenArg, statusArg] = capture(
      mockStatusService.postStatus
    ).first();
    expect(authTokenArg).toEqual(authToken);
    expect(statusArg.post).toEqual(post);
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
    await postStatusPresenter.submitPost(authToken, post, currentUser);
    verify(mockPostStatusPresenterView.clearLastInfoMessage()).once();
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)
    ).once();

    verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not tell it to do the following: clear the last info message, clear the post, and display a status posted message", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

    await postStatusPresenter.submitPost(authToken, post, currentUser);

    verify(
      mockPostStatusPresenterView.displayErrorMessage(
        "Failed to post the status because of exception: An error occurred"
      )
    ).once();

    verify(mockPostStatusPresenterView.clearLastInfoMessage()).never();
    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)
    ).never();
  });
});
