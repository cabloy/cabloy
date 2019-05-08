NPM_PACKAGE := $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION := $(shell node -e 'process.stdout.write(require("./package.json").version)')

TMP_PATH    := /tmp/${NPM_PACKAGE}-$(shell date +%s)

REMOTE_NAME ?= origin
REMOTE_REPO ?= $(shell git config --get remote.${REMOTE_NAME}.url)

CURR_HEAD   := $(firstword $(shell git show-ref --hash HEAD | cut -b -6) master)
GITHUB_PROJ := https://github.com//markdown-it/${NPM_PACKAGE}


lint:
	./node_modules/.bin/eslint .

test: lint
	./node_modules/.bin/mocha -R spec

coverage:
	rm -rf coverage
	./node_modules/.bin/istanbul cover node_modules/.bin/_mocha

report-coverage:
	istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

browserify:
	rm -rf ./dist
	mkdir dist
	# Browserify
	( printf "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */" ; \
		./node_modules/.bin/browserify ./ -s markdownitContainer \
		) > dist/markdown-it-container.js
	# Minify
	./node_modules/.bin/uglifyjs dist/markdown-it-container.js -b beautify=false,ascii-only=true -c -m \
		--preamble "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */" \
		> dist/markdown-it-container.min.js

.PHONY: lint test coverage
.SILENT: lint test
