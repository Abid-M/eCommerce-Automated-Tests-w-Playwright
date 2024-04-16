## 🛒 eCommerce Automated Tests w/ Playwright <img src="https://github.com/Abid-M/AbidMiah-Website/assets/77882906/22b9b0ad-3dd9-4822-8a31-36592704af68" alt="nfocus_logo" align="right" width="125">

User end-to-end tests written in typescript, with the use of Playwright.

![Visual Studio Code Badge](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?logo=visualstudiocode&logoColor=fff&style=for-the-badge)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge)
![Playwright Badge](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=fff&style=for-the-badge)
![.ENV Badge](https://img.shields.io/badge/.ENV-ECD53F?logo=dotenv&logoColor=000&style=for-the-badge)
![Git Badge](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff&style=for-the-badge)

## Overview
This project develops end-to-end tests using Playwright for an e-commerce website. The tests simulate user interactions like purchasing items, applying discounts, and verifying order details.

### Test Cases:
#### Test Case 1:
- Login to the e-commerce site as a registered user
- Add an item to the cart
- Apply a discount code 'edgewords' and verify the discount
- Verify that the total after discount & shipping is correct
- Log out

#### Test Case 2:
- Login to the e-commerce site as a registered user
- Add an item to the cart and proceed to checkout
- Complete billing details and select payment method
- Capture the order number and verify its presence in the 'My Orders' section
- Log out

## Pre-requisites
Before running the tests, make sure to manually register a new account on the [e-commerce site](https://www.edgewordstraining.co.uk/demo-site/my-account/).

## Website
The tests will be conducted on the following e-commerce site:
- [Edgewords Demo Site](https://www.edgewordstraining.co.uk/demo-site/)

## Setup Instructions
1. Clone this repo to your local machine.
```
git clone https://github.com/Abid-M/uk.co.nfocus.ecommerceproject.git
```
   
2. Install the following packages with `npm install`
     
3. Create a `.env` file containing:
   - `EMAIL=RegisteredEmail`
   - `PASSWORD=AccountPassword`
     - `USERNAME` and `PASSWORD` must be the registered login details
     
5. Run the test with `npx playwright test` or via the VSC Test Explorer
