const {Builder, By, Key, until} = require('selenium-webdriver');

var analyze = function(driver,config,item, callBack, screenshotPath){
	var result=driver
		.executeAsyncScript(`
		var callback = arguments[arguments.length-1]; 
		
		var elements=document.body;
		var result=[];
		var checkElements=function(e,spc){
			for(var i=0;i<e.childNodes.length;i++){
				var el=e.childNodes[i];
				if (el.offsetParent){
					var style=getComputedStyle(el);
					var styles=["perspectiveOrigin","width","height","margin","padding"];
					var alias=["orig","w","h","mg","pd"];
					var props={
						"tag":el.tagName,
					};
					if (el.id){
						props["id"]=el.id;
					}
					for(var index in styles){
						if (style[styles[index]]!="0px"){
							props[alias[index]] = style[styles[index]];
						}
					}
					props["nodes"]=el.childNodes.length;
					if (!el.childNodes || el.childNodes.length==1){
						if (el.innerText && el.innerText!=''){
							props["text"] = el.innerText;
						}
					}
					result.push(spc+JSON.stringify(props));
					if (el.childNodes && el.childNodes.length>0){
						checkElements(el,spc+"  ");
					}
				}
			}
		}

		checkElements(elements,"");
		
		callback(result);
		`)
		result.then(function(list){
			if (screenshotPath){
				driver.sleep(1000)
				driver.executeScript('var videos = document.querySelectorAll("video"); for(video of videos) {video.pause(); video.currentTime=0;}').then(
					function(return1){
						driver.takeScreenshot().then(
							function(image, err) {
								require('fs').writeFile(screenshotPath, image, 'base64', function(err) {
									if (err) console.log("Screenshot error : "+err);
								});
							}
						);		
					}
				)
			}
			callBack(list,item);
		});
}

module.exports = analyze