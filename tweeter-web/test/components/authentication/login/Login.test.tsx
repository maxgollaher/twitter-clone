import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { instance, mock, verify } from "ts-mockito";
import Login from "../../../../src/components/authentication/login/Login";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login Component", () => {

    it("should be disabled when first rendered", () => {
        const { signInButton } = renderLoginAndGetElements("/");
        expect(signInButton).toBeDisabled();
    });

    it("should be enabled when both the alias and password fields have text", async () => {
        const { signInButton, aliasInput, passwordInput, user } = renderLoginAndGetElements("/");

        await user.type(aliasInput, "alias");
        await user.type(passwordInput, "password");
        expect(signInButton).toBeEnabled();
    });

    it("should be disabled if either the alias or password field is cleared", async () => {
        const { signInButton, aliasInput, passwordInput, user } = renderLoginAndGetElements("/");

        await user.type(aliasInput, "alias");
        await user.type(passwordInput, "password");
        expect(signInButton).toBeEnabled();

        await user.clear(aliasInput);
        expect(signInButton).toBeDisabled();

        await user.type(aliasInput, "alias");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordInput);
        expect(signInButton).toBeDisabled();
    });

    it("should call the presenter's login method with correct parameters when the sign-in button is pressed", async () => {

        const mockLoginPresenter = mock<LoginPresenter>();
        const mockLoginPresenterInstance = instance(mockLoginPresenter);

        const { signInButton, aliasInput, passwordInput, user } = renderLoginAndGetElements("/", mockLoginPresenterInstance);

        await user.type(aliasInput, "alias");
        await user.type(passwordInput, "password");
        await user.click(signInButton);

        verify(mockLoginPresenter.doLogin("alias", "password", "/")).once();
    });

});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <Login originalUrl={originalUrl} presenter={presenter} />
            ) : (
                <Login originalUrl={originalUrl} />
            )}
        </MemoryRouter>
    );
};

const renderLoginAndGetElements = (originalUrl: string, presenter?: LoginPresenter) => {
    const user = userEvent.setup();
    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", { name: /Sign in/i });
    const aliasInput = screen.getByLabelText("alias");
    const passwordInput = screen.getByLabelText("password");

    return { signInButton, aliasInput, passwordInput, user };
}