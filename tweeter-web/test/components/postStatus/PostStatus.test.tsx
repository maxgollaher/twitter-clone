import React from "react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { anything, instance, mock, verify } from "ts-mockito";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
}));

describe("PostStatus Component", () => {
    
    beforeAll(() => {
        const mockUser = mock<User>();
        const mockUserInstance = instance(mockUser);

        const mockAuthToken = mock<AuthToken>();
        const mockAuthTokenInstance = instance(mockAuthToken);

        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
        });
    });


    it("should disable the post status and clear buttons when first rendered", () => {
        const { postStatusButton, clearButton } = renderPostStatusAndGetElements();
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("should enable both buttons when the text field has text", async () => {
        const { postStatusTextArea, postStatusButton, clearButton, user } = renderPostStatusAndGetElements();
        await user.type(postStatusTextArea, "Hello World");
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it("should disable both buttons when the text field is cleared", async () => {
        const { postStatusTextArea, postStatusButton, clearButton, user } = renderPostStatusAndGetElements();
        await user.type(postStatusTextArea, "Hello World");
        await user.clear(postStatusTextArea);
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("should call the presenter when the post status button is clicked", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const { postStatusTextArea, postStatusButton, user } = renderPostStatusAndGetElements(mockPresenterInstance);

        await user.type(postStatusTextArea, "Hello World");
        await user.click(postStatusButton);
        verify(mockPresenter.submitPost(anything(), "Hello World", anything())).once();
    });

});

const renderPostStatusAndGetElements = (
    presenter?: PostStatusPresenter
) => {
    const user = userEvent.setup();
    render(<PostStatus presenter={presenter}/>);

    const postStatusTextArea = screen.getByLabelText("status-box");
    const postStatusButton = screen.getByRole("button", { name: "Post Status" });
    const clearButton = screen.getByRole("button", { name: "Clear" });
 
    return { postStatusTextArea, postStatusButton, clearButton, user};
}

