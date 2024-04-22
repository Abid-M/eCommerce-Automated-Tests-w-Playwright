import { Page } from "@playwright/test";

class BasePOM {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}

export default BasePOM