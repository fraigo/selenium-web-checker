# Selenium Web Checker

![npm](https://img.shields.io/npm/v/selenium-web-checker)


Automation script to record and track visual changes in web sites.

## Usage

### Installation

```bash
# chromedriver required
npm install -g chromedriver
# module install
npm install -g selenium-web-checker
```


### Basic usage (URL check)

`selenium-web-checker URL [BaseURL] [width] [height]`

Example : `selenium-web-checker / https://www.google.com 1024 768`

### Advanced usage

`selenium-web-checker config.json [BaseURL|''] [width] [height] [outputPath]`

Where config.json is a JSON configuration file with a list of pages to test:

```json
{
    "baseURL" : "http://192.168.99.100",
    "screenshots" : true,
    "fileOutput" : true,
    "pages" : [
        { 
            "id" : "login",
            "url" : "/user/login", 
            "actions" :  [
                {
                    "xpath" : "//input[@name='user']",
                    "submit" : "username"
                },
                {
                    "xpath" : "//input[@name='password']",
                    "submit" : "password"
                },
                {
                    "xpath" : "//button[@type='submit']",
                    "click" : true
                }
            ]
        },
        {
            "id" : "home",
            "url" : "/home"
        }
    ]
}
```

### Additional parameters

* `baseURL` : (Optional) To test pages with a different base URL (overwrites baseURL in config.json)
* `screenshots` : `true` to activate screenshots by page (it uses `id` attribute to name file, or the page position in config if no `id` is defined )
* `fileOutput` : `true` to activate file output separated logs (one by each page)
* `width`  : Browser window width (default: 1200)
* `height` : Browser window height (default: 900)

### Results

The results are written in a JSON-like format. It includes visual information about HTML dom elements (position, width, height, margin, padding)
You can make diffs with previous versions to check what's changing between scannings.

```
{"tag":"DIV","id":"app","orig":"242.5px 150px","w":"485px","h":"300px","nodes":1,"text":""}
  {"tag":"DIV","orig":"242.5px 150px","w":"485px","h":"300px","nodes":3}
    {"tag":"UL","orig":"242.5px 0px","w":"485px","nodes":0}
    {"tag":"DIV","orig":"242.5px 150px","w":"485px","h":"300px","nodes":3}
      {"tag":"HEADER","orig":"242.5px 108.5px","w":"485px","h":"217px","nodes":4}
        {"tag":"DIV","id":"header","orig":"121.25px 38px","w":"242.5px","h":"76px","pd":"10px","nodes":7}
          {"tag":"A","orig":"0px 0px","w":"auto","h":"auto","nodes":1,"text":"skip to package search"}
          {"tag":"A","orig":"0px 0px","w":"auto","h":"auto","nodes":1,"text":"skip to main content"}
          {"tag":"SPAN","orig":"0px 0px","w":"auto","h":"auto","nodes":4}
            {"tag":"A","orig":"0px 0px","w":"auto","h":"auto","nodes":1,"text":"skip to sign up"}
            {"tag":"A","orig":"0px 0px","w":"auto","h":"auto","nodes":1,"text":"skip to sign in"}
          {"tag":"A","orig":"0px 0px","w":"auto","h":"auto","nodes":1,"text":"skip to footer"}
```

