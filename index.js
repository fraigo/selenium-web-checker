#!/usr/bin/env node
// Delete the 0 and 1 argument (node and script.js)
const {Builder, By, Key, until} = require('selenium-webdriver');

var args = process.argv.splice(process.execArgv.length + 2);
var params = {
    baseURL : args[1],
    width : args[2],
    height : args[3]
}
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


var chrome = require('selenium-webdriver/chrome');
const screen = {
    width: config.width,
    height: config.height
};
var driver = new Builder().forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .build();

var analyze = require('./analyze.js');

function analyze_list(list,params){
    var baseURL = params.baseURL;
    for(var index in list){
        var item=list[index];
        var url = item.url;
        if (baseURL){
            url = baseURL + url;
        }
        analyze(driver,config,url, function(list,url){
            console.log("===",url,"===");
			list.forEach(function(item){
				console.log(item);
			})
        });
        if (item.submit){
            for(var key in item.submit){
                driver.findElement(By.name(key)).sendKeys(item.submit[key]);
            }    
        }
        if (item.click){
            driver.findElement(By.name(item.click)).click();    
        }    
    }    
    driver.quit();
}


if (fs.existsSync(params.file)){
    fs.readFile(params.file, 'utf8', function(err, data) {  
        var baseURL = null;
        if (err) {
            
        }else{
            list = JSON.parse(data).pages;
            baseURL = JSON.parse(data).baseURL;
            if (params.baseURL){
                baseURL = params.baseURL;
            }
            params.baseURL= baseURL;
            analyze_list(list,params);
        }

    });
}else{
    analyze_list([{url:params.file}],params);
}
