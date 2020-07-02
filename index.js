#!/usr/bin/env node
// Delete the 0 and 1 argument (node and script.js)

if (require.main !== module) {
    console.log('required as a module');
    return;
}

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

var webdriver = require('./webdriver.js');
var driver = webdriver(config);

var analyze_list = require('./analyze_list.js');

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
            params.debug = configData.debug;
            params.screenshotDelay = configData.screenshotDelay;
            if (configData.screenshots){
                params.screenshotFile = outputFile.replace('.json','')+"_{ID}.png";
            }
            if (configData.fileOutput){
                params.resultFile = outputFile.replace('.json','')+"_{ID}.log";
            }
            analyze_list(driver,list,params);
        }

    });
}else{
    analyze_list(driver,[{url:outputFile}],params);
}
