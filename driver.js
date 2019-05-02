
var wd = require('webdriver-sync');
var ChromeDriver = wd.ChromeDriver;
var driver = new ChromeDriver();

driver.initialize=function(config){
    driver.manage().window().setSize(new wd.Dimension(config.width, config.height));
}

module.exports = driver