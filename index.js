#!/usr/bin/env node
// Delete the 0 and 1 argument (node and script.js)
var args = process.argv.splice(process.execArgv.length + 2);
var params = {
    baseURL : args[1],
    width : args[2],
    height : args[3]
}
console.log(params);
params.file = args[0];

var fs = require('fs');
var list = [];

if (!params.file){
    console.error("Usage: selenium-web-checker [url|config.json] [baseurl] [width] [height]");
    return;
}

var config = require('./config');
if (params.width>0){
    config.width = params.width*1;
}
if (params.height>0){
    config.height = params.height*1;
}

var wd = require('webdriver-sync');

var driver = require('./driver.js');
driver.initialize(config);

var analyze = require('./analyze.js');

function analyze_list(list,baseURL){
    for(var index in list){
        var item=list[index];
        var url = item.url;
        if (baseURL){
            url = baseURL + url;
        }
        analyze(driver,url);
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


if (fs.existsSync(params.file)){
    //console.log("Opening "+ file);
    fs.readFile(params.file, 'utf8', function(err, data) {  
        var baseURL = null;
        if (err) {
            
        }else{
            list = JSON.parse(data).pages;
            baseURL = JSON.parse(data).baseURL;
            if (params.baseURL){
                baseURL = params.baseURL;
            }
            analyze_list(list,baseURL);
        }

    });
}else{
    analyze_list([{url:params.file}],params.baseURL);
}
