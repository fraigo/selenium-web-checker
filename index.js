#!/usr/bin/env node
// Delete the 0 and 1 argument (node and script.js)
const {Builder, By, Key, until} = require('selenium-webdriver');

var args = process.argv.splice(process.execArgv.length + 2);
var params = {
    baseURL : args[1],
    width : args[2],
    height : args[3],
    output : args[4]
}
var outputFile = args[0];

var fs = require('fs');
var list = [];

if (!outputFile){
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

function analyze_list(list,params,screenshots){
    var baseURL = params.baseURL;
    console.log(JSON.stringify(params));
    for(var index in list){
        var item=list[index];
        var screenShotFile = outputFile.replace('.json','')+"_"+(item.id?item.id:index)+".png";
        if (!screenshots){
            screenShotFile = null;
        }
        item.fullURL = item.url;
        if (baseURL){
            item.fullURL = baseURL + item.url;
        }
        var url = item.fullURL;
        driver.get(url);    
        if (item.actions){
            for(var idx in item.actions){
                var action = item.actions[idx];
                if (action.xpath){
                    //console.error("Waiting "+(new Date()).getTime());
                    driver.wait(until.elementLocated(By.xpath(action.xpath)), 1000);
                    //console.error("Ready "+(new Date()).getTime());
                    var el = driver.findElement(By.xpath(action.xpath) );
                    if (el){
                        if (action.submit){
                            if (item.debug){
                                console.error("Submit "+action.xpath+" "+action.submit)
                            }
                            el.sendKeys(action.submit);
                        }
                        if (action.click){
                            if (item.debug){
                                console.error("Click "+action.xpath);
                            }
                            el.click();    
                        }
                        
                    }
                }
            }    
        }
        analyze(driver,params,item, function(list,item){
            console.log("===",item.url,"===");
            list.forEach(function(result){
                console.log(result);
            })
        }, screenShotFile);
        
    }    
    driver.quit();
}


if (fs.existsSync(outputFile)){
    fs.readFile(outputFile, 'utf8', function(err, data) {  
        var baseURL = null;
        if (err) {
            
        }else{
            var configData = JSON.parse(data);
            list = configData.pages;
            baseURL = configData.baseURL;
            if (params.baseURL){
                baseURL = params.baseURL;
            }
            params.baseURL= baseURL;
            analyze_list(list,params,configData.screenshots);
        }

    });
}else{
    analyze_list([{url:outputFile}],params);
}
