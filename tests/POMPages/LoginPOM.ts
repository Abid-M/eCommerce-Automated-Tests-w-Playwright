import {Page} from '@playwright/test'

class LoginPOM {

    page : Page; 
    
    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    usernameField = () => this.page.getByLabel('Username or email address *');
    passwordField = () => this.page.locator('#password');
    loginButton = () => this.page.getByRole('button', { name: 'Log in' });
    logoutButton = () => this.page.getByRole('link', { name: 'Logout' });

    /* Clears and sets the value of the username field. */
    async SetUsername(username : string) {
        await this.usernameField().fill(username);
    }

    /* Clears and sets the value of the password field. */
    async SetPassword(password : string) {
        await this.passwordField().fill(password)
    }

    /* Clicks the login button. */
    async GoLogin() {
        await this.loginButton().click();
    }

    /* Attempts to log in with the specified username and password. */
    async ValidLogin(username : string, password : string) : Promise<boolean> {
        await this.SetUsername(username);
        await this.SetPassword(password);
        await this.GoLogin();
        
        return await this.logoutButton().isVisible();
    }
}

export default LoginPOM