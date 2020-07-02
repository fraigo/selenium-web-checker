const {Builder, By, Key, until} = require('selenium-webdriver');
var analyze = require('./analyze.js');
var fs = require('fs');

function analyze_list(driver,list,params){
    var baseURL = params.baseURL;
    if (params.debug){
        console.log(JSON.stringify(params));
    }
    for(var index in list){
        var item=list[index];
        var screenShotFile = null;
        var isDebug = params.debug?params.debug:item.debug;
        if (params.screenshotFile){
            item.screenShotFile = params.screenshotFile.replace("{ID}",item.id?item.id:index);
        }
        if (params.resultFile){
            item.resultFile = params.resultFile.replace("{ID}",item.id?item.id:index);
        }
        item.fullURL = item.url;
        if (baseURL){
            item.fullURL = baseURL + item.url;
        }
        var url = item.fullURL;
        if (isDebug){
            console.log("URL",url);
        }
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
                            if (isDebug){
                                console.error("Submit "+action.xpath+" "+action.submit)
                            }
                            el.sendKeys(action.submit);
                        }
                        if (action.click){
                            if (isDebug){
                                console.error("Click "+action.xpath);
                            }
                            el.click();    
                        }
                        
                    }
                }
            }    
        }
        analyze(driver,params,item, function(list,item){
            if (item.resultFile){
                console.log("Saving to", item.resultFile);
                fs.writeFileSync(item.resultFile, list.join("\n"));    
            }else{
                console.log("===",item.url,"===");
                list.forEach(function(result){
                    console.log(result);
                })    
            }
            if (item.screenShotFile){
                driver.sleep(100);
                console.log("Screenshot", item.screenShotFile);
				driver.takeScreenshot().then(
					function(image, err) {
						require('fs').writeFile(item.screenShotFile, image, 'base64', function(err) {
							if (err) console.error("Screenshot error : "+err);
						});
					}
				);
			}
        });
    }    
    driver.quit();
}

module.exports = analyze_list