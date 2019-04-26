#!/usr/bin/env node
// Delete the 0 and 1 argument (node and script.js)
var args = process.argv.splice(process.execArgv.length + 2);

var fs = require('fs');
var list = [];
var file = args[0];
if (!file){
    console.error("Usage: selenium-web-checker [url|config.json]");
    return;
}

var wd = require('webdriver-sync');
var driver = require('./driver.js');
var analyze = require('./analyze.js');
function analyze_list(list,baseURL){
    for(var index in list){
        var item=list[index];
        var url = item.url;
        if (baseURL){
            url = baseURL + url;
        }
        analyze(url);
        if (item.submit){
            for(var key in item.submit){
                driver.findElement(wd.By.name(key)).sendKeys(item.submit[key]);
            }    
        }
        if (item.click){
            driver.findElement(wd.By.name(item.click)).click();    
        }    
    }    
    driver.quit();
}


if (fs.existsSync(file)){
    //console.log("Opening "+ file);
    fs.readFile(file, 'utf8', function(err, data) {  
        var baseURL = null;
        if (err) {
            
        }else{
            list = JSON.parse(data).pages;
            baseURL = JSON.parse(data).baseURL;
            analyze_list(list,baseURL);
        }

    });
}else{
    analyze_list([{url:args[0]}],args[1]);
}
