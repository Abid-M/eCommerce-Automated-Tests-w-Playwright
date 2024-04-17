class Customer {
    firstName : string
    lastName : string
    address : string
    city : string 
    postcode: string
    phoneNumber : string
    email : string    

    constructor(firstName: string, lastName: string, address: string, city: string, postcode: string, phoneNumber: string, email: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.postcode = postcode;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }
}

export default Customer;