#!/bin/bash
if [ "$1" == "" ]; then
	echo "Usage: $0 version|patch|minor|major"
	exit 1
fi

VERSION=$1
npm version $VERSION && git commit -m "Version update $VERSION"
npm publish
