var wd = require('webdriver-sync');
var driver = require('./driver.js');
var analyze = require('./analyze.js');
console.log(analyze);

analyze("http://192.168.99.100:8000/user/login");
driver.findElement(wd.By.name('email')).sendKeys('user@site.com');
driver.findElement(wd.By.name('password')).sendKeys('User.123');
driver.findElement(wd.By.name('submit')).click();
analyze("http://192.168.99.100:8000/");
driver.quit();