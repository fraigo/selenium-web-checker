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
    outputPath : args[4]
}
var sourceFileOrURL = args[0];
var fs = require('fs');
var path = require('path');
var list = [];

if (!sourceFileOrURL){
    console.error("Usage: selenium-web-checker [url|config.json] [baseurl] [width] [height] [outputPath]");
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

if (fs.existsSync(sourceFileOrURL)){
    fs.readFile(sourceFileOrURL, 'utf8', function(err, data) {  
        var baseURL = null;
        if (err) {
            
        }else{
            var configData = null;
            try{
                configData = JSON.parse(data)
            } catch (e) {
                console.error(sourceFileOrURL+ ': Not a valid JSON file')
                return;
            }
            var outPath = path.resolve(path.dirname(sourceFileOrURL));
            var outName = path.basename(sourceFileOrURL).replace('.json','');
            if (params.outputPath) {
                outPath = path.resolve(params.outputPath);
            }
            if (!fs.existsSync(outPath)){
                console.log('Output path not found: '+ outPath);
                return;
            }
            list = configData.pages;
            baseURL = configData.baseURL;
            if (params.baseURL){
                baseURL = params.baseURL;
            }
            params.baseURL= baseURL;
            params.debug = configData.debug;
            params.screenshotDelay = configData.screenshotDelay;
            if (configData.screenshots){
                params.screenshotFile = outPath + "/" + outName + "_{ID}.png";
            }
            if (configData.fileOutput){
                params.resultFile = outPath + "/" + outName + "_{ID}.log";
            }
            analyze_list(driver,list,params);
        }

    });
}else{
    if (!sourceFileOrURL.startsWith("http")){
        console.error("Invalid file "+sourceFileOrURL);
        return;
    }
    analyze_list(driver,[{url:sourceFileOrURL}],params);
}
