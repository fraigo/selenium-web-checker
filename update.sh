#!/bin/bash
if [ "$1" == "" ]; then
	echo "Usage: $0 patch|minor|major|version"
	exit 1
fi

VERSION=$1
npm version $VERSION && git commit -m "Version update $VERSION"
npm publish
