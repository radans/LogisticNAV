require('chromedriver');
const assert = require('assert');
const webdriver = require('selenium-webdriver');

const driver = new webdriver.Builder().forBrowser('chrome').build();
const host = 'http://localhost:8000';

const By = webdriver.By;
const until = webdriver.until;

const headingCheck = async (expected) => {
    await driver.wait(until.elementLocated(By.css('h2')));
    const elementText = await driver.findElement(By.css('h2')).getText();
    assert.equal(elementText, expected);
};

const textCheck = async (selector, text) => {
    await driver.wait(until.elementLocated(By.css(selector)));
    const elementText = await driver.findElement(By.css(selector)).getText();
    assert(elementText.indexOf(text) >= 0);
};

const clickElement = async (selector) => {
    await driver.wait(until.elementLocated(By.css(selector)));
    return driver.findElement(By.css(selector)).click();
};

describe('Walk through the app', () => {
    after(async () => {
        return driver.quit();
    });
    it('should show error page for not-found', async () => {
        await driver.get(`${host}/not-found-page`);
        await textCheck('main .alert', 'ei leitud');
    });
    it('should render old browser page', async () => {
        await driver.get(`${host}/old`);
        await textCheck('p', 'uuemat lehitsejat');
    });
    it('should render login page', async () => {
        await driver.get(`${host}/`);
        await headingCheck('Sisene');
    });
    it('should open new password form', async () => {
        await clickElement('form a');
        await headingCheck('Parooli muutmine');
    });
    it('should show sent message', async () => {
        await clickElement('form button');
        await headingCheck('Parooli muutmine');
        await textCheck('main .alert', 'saadetud');
    });
    it('should display orders page', async () => {
        await driver.get(`${host}/orders`);
        await headingCheck('Tellimused');
    });
    it('should display companies page', async () => {
        await driver.get(`${host}/companies`);
        await headingCheck('Vedajad');
    });
    it('should display a company page', async () => {
        await clickElement('table:nth-of-type(1) > tbody > tr > td:first-child a');
        await headingCheck('Astar');
    });
});
