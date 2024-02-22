import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Buffer } from "buffer";
import { ChangeEvent } from "react";

export interface RegisterView {
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken
    ) => void;
    displayErrorMessage: (message: string) => void;
    navigate: (url: string) => void;
    setImageUrl: (url: string) => void;
}

export class RegisterPresenter {

    private view: RegisterView;
    private service: UserService;

    private imageBytes: Uint8Array;

    public constructor(view: RegisterView) {
        this.view = view;
        this.service = new UserService();
        this.imageBytes = new Uint8Array();
    }

    public handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        this.handleImageFile(file);
    };

    public handleImageFile(file: File | undefined) {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                this.imageBytes = bytes;
            };
            reader.readAsDataURL(file);
        } else {
            this.view.setImageUrl("");
            this.imageBytes = new Uint8Array();
        }
    };

    public async doRegister(firstName: string, lastName: string, alias: string, password: string) {
        try {
            let [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                this.imageBytes
            );

            this.view.updateUserInfo(user, user, authToken);
            this.view.navigate("/");
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        }
    };
}