var driver = require('./driver.js');

var analyze = function(url){
	console.log("===",url,"===");
	driver.get(url);

	driver
		.executeAsyncScript(`
		var callback = arguments[arguments.length-1]; 
		
		var elements=document.body;
		var result=[];
		var checkElements=function(e){
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
					result.push(JSON.stringify(props));
					if (el.childNodes && el.childNodes.length>0){
						checkElements(el);
					}
				}
			}
		}

		checkElements(elements);
		
		callback(result);
		`)
		.forEach(function(el){
			console.log(el);
		});
}

module.exports = analyze