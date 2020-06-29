# Selenium Web Checker

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

`selenium-web-checker [config.json] [BaseURL] [width] [height]`

Where config.json is a configuration file with a list of pages to test:

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
* `width`  : Browser window width (default: 1200)
* `height` : Browser window height (default: 900)

### Results

The results are written in a JSON-like format. It includes visual information about HTML dom elements (position, width, height, margin, padding)

