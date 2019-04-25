
var wd = require('webdriver-sync');
var ChromeDriver = wd.ChromeDriver;
var driver = new ChromeDriver();
driver.manage().window().setSize(new wd.Dimension(1200, 900));


module.exports = driver