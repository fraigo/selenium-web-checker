#web checker install
which chromedriver || npm install -g chromedriver
NEEDS_UPDATE=$(npm outdated -g | grep chromedriver)
if [ "$NEEDS_UPDATE" != "" ]; then
  npm install -g chromedriver
fi
NEEDS_UPDATE=$(npm outdated -g | grep selenium-webdriver)
if [ "$NEEDS_UPDATE" != "" ]; then
  npm install -g selenium-webdriver
fi