import AllOrdersPOM from './AllOrdersPOM';
import BasePOM from './BasePOM';

class MyAccountPOM extends BasePOM{
    // Locators
    private logoutLink = () => this.page.getByRole('link', { name: 'Logout' });
    private ordersLink = () => this.page.getByRole('link', { name: 'Orders' });
    public nFocusHeader = () => this.page.getByRole("link", { name: 'Edgewords Shop' });
    public loginText = () => this.page.getByText("Login");

    async logout() {
        await this.logoutLink().click();
    }

    async goToOrders(): Promise<AllOrdersPOM> {
        // Two elements, choose first and redirect, both take to same page anyways
        await this.ordersLink().first().click();
        console.log("Navigated to All Orders on account page")

        return new AllOrdersPOM(this.page);
    }
}

export default MyAccountPOM
