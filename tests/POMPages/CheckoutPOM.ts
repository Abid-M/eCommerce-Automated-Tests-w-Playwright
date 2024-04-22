import OrderInfoPOM from "./OrderInfoPOM";
import CustomerData from "../Data/CustomerInterface";
import BasePOM from "./BasePOM";

class CheckoutPOM extends BasePOM {
    // Locators
    private fNameField = () => this.page.getByRole('textbox', { name: 'First name *' }).first();
    private lNameField = () => this.page.getByRole('textbox', { name: 'Last name *' }).first();
    private streetAdressField = () => this.page.getByRole('textbox', { name: 'Street address *' }).first();
    private cityField = () => this.page.getByRole('textbox', { name: 'Town / City *' }).first();
    private postcodeField = () => this.page.getByRole('textbox', { name: 'Postcode *' }).first();
    private phoneField = () => this.page.getByLabel('Phone *').first();
    private emailField = () => this.page.getByLabel('Email address *').first();

    private cashPaymentButton = () => this.page.getByText('Cash on delivery');
    private chequePaymentButton = () => this.page.getByText('Check payments');
    private placeOrderButton = () => this.page.getByRole('button', { name: 'Place order' });

    /* FillInBillingDetails(Cu stomer)
       - Fills in the billing details using the provided Customer object.
       - Sets the first name, last name, address, city, postcode, phone, and email. 
    */
    async fillInBillingDetails(customerInfo : CustomerData) {
        await this.fNameField().fill(customerInfo.fName);
        await this.lNameField().fill(customerInfo.lName);
        await this.streetAdressField().fill(customerInfo.address);
        await this.cityField().fill(customerInfo.city);
        await this.postcodeField().fill(customerInfo.postcode);
        await this.phoneField().fill(customerInfo.phone);
        await this.emailField().fill(customerInfo.email);

        console.log("Billing Details Populated..")
    }

    /* Validates whether the billing details within the input fields 
    match those provided in the Customer object. */
    async validateDetails(customer : CustomerData) : Promise<string> {
        let mismatch : string[] = [];

        if(customer.fName != await this.fNameField().inputValue())
            mismatch.push(`Expected First Name to be '${customer.fName}' but got '${await this.fNameField().inputValue()}'`)

        if (customer.lName !== await this.lNameField().inputValue()) 
            mismatch.push(`Expected Last Name to be '${customer.lName}' but got '${await this.lNameField().inputValue()}'`)

        if (customer.address !== await this.streetAdressField().inputValue())
            mismatch.push(`Expected Address to be '${customer.address}' but got '${await this.streetAdressField().inputValue()}'`)

        if (customer.city !== await this.cityField().inputValue())
            mismatch.push(`Expected City to be '${customer.city}' but got '${await this.cityField().inputValue()}'`)

        if (customer.postcode !== await this.postcodeField().inputValue())
            mismatch.push(`Expected Postcode to be '${customer.postcode}' but got '${await this.postcodeField().inputValue()}'`)
        
        if (customer.phone !== await this.phoneField().inputValue())
            mismatch.push(`Expected Phone Number to be '${customer.phone}' but got '${await this.phoneField().inputValue()}'`)
        
        if (customer.email !== await this.emailField().inputValue())
            mismatch.push(`Expected Email to be '${customer.email}' but got '${await this.emailField().inputValue()}'`)

        // Join all invalid inputs into a string, comma seperation
        return mismatch.join(", ");
    }

    /* Selects the payment method for checkout (check or cash). */
    async selectPayment(paymentMethod: string) {
        if (paymentMethod === "Cash") {
            await this.cashPaymentButton().click();
            console.log("Cash Payment Selected")
        } else {
            // Default option is paying by check
            await this.chequePaymentButton().click();
            console.log("Cheque Payment Selected")
        }
    }

    /* Places the order by clicking on the place order button. */
    async placeOrder(){
        await this.placeOrderButton().click();
        console.log("Order Placed..");

        return new OrderInfoPOM(this.page);
    }
}

export default CheckoutPOM;
