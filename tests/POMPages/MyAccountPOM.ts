import {Page} from '@playwright/test'
import AllOrdersPOM from './AllOrdersPOM';

class MyAccountPOM {

    page : Page; 
    
    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    logoutLink = () => this.page.getByRole('link', { name: 'Logout' });
    ordersLink = () => this.page.getByRole('link', { name: 'Orders' });
    nFocusHeader = () => this.page.getByRole("link", { name: 'nFocus Shop' });
    loginText = () => this.page.getByText("Login");

    async Logout() {
        await this.logoutLink().click();

        return this;
    }

    async GoToOrders() {
        // Two elements, choose first and redirect, both take to same page anyways
        await this.ordersLink().first().click();
        console.log("Navigated to All Orders on account page")

        return new AllOrdersPOM(this.page);
    }
}

export default MyAccountPOM