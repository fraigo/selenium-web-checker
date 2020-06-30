
const {Builder} = require('selenium-webdriver');
var web_driver = require('selenium-webdriver/chrome');

function webdriver(config){
    const screen = {
        width: config.width,
        height: config.height
    };
    var driver = new Builder().forBrowser('chrome')
        .setChromeOptions(new web_driver.Options().headless().windowSize(screen))
        .build();
    return driver;
}

module.exports = webdriver