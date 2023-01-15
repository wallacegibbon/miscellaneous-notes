##############################################################################
## The nodejs repl doesn't work well with rlwrap. (try to use Ctrl-u to delete)
## But you can make it right by setting a environment variable.
NODE_NO_READLINE=1 rlwrap -a node

##############################################################################
## Sometimes it fails to install package with npm.
## Adding some arguments can solve this problem. e.g.
npm install --unsafe-perm=true --allow-root sharp

##############################################################################
## specify a npm repository (e.g. use taobao's npm)
npm config set registry https://registry.npm.taobao.org

## read infomation about a package
npm info marked

## npm install package, use "-g" to install it global, usually in /usr/local/..
## (the global node packages need to be added to env variable: NODE_PATH)
npm install -g mysql

##############################################################################
## A useful package call js-beautify, format you js code on command line
npm install -g js-beautify

## When installed globally, you will get three scripts:
##    js-beautify, html-beautify, css-beautify
## usage
js-beautify -s 2 a.js > p.js
## or
cat a.js | js-beautify -s 2 > p.js

## JSON works, too
cat blah.json | js-beautify -s 2 | less


##############################################################################
## you can run script from command line with `-e`:
## e.g.
node -e 'console.log(os.platform());'
#> linux
node -e 'console.log(os.release());'
#> 4.4.0-38-generic
node -e 'console.log(os.arch());'
#> x64

## if you want to print the result, `-p` is more convenient
node -p 'os.arch()'
#> x64

