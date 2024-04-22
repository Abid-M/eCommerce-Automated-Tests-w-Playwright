import BasePOM from "./BasePOM";
class LoginPOM extends BasePOM {
    // Locators
    private usernameField = () => this.page.getByLabel('Username or email address *');
    private passwordField = () => this.page.locator('#password');
    private loginButton = () => this.page.getByRole('button', { name: 'Log in' });
    private logoutButton = () => this.page.getByRole('link', { name: 'Logout' });

    /* Clears and sets the value of the username field. */
    async setUsername(username: string) {
        await this.usernameField().fill(username);
    }

    /* Clears and sets the value of the password field. */
    async setPassword(password: string) {
        await this.passwordField().fill(password)
    }

    /* Clicks the login button. */
    async goLogin() {
        await this.loginButton().click();
    }

    /* Attempts to log in with the specified username and password. */
    async validLogin(username: string, password: string) : Promise<boolean> {
        await this.setUsername(username);
        await this.setPassword(password);
        await this.goLogin();
        
        return await this.logoutButton().isVisible();
    }
}

export default LoginPOM
