interface Props {
    setAlias: (alias: string) => void;
    setPassword: (password: string) => void;
}

const AuthenticationFields = (props: Props) => {
    
    return (
        <>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    size={50}
                    id="aliasInput"
                    aria-label="alias"
                    placeholder="name@example.com"
                    onChange={(event) => props.setAlias(event.target.value)}
                />
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control bottom"
                    id="passwordInput"
                    aria-label="password"
                    placeholder="Password"
                    onChange={(event) => props.setPassword(event.target.value)}
                />
                <label htmlFor="passwordInput">Password</label>
            </div>
        </>

    );
};

export default AuthenticationFields;