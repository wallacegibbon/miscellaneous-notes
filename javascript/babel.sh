## Compile ES6 or JSX in command line:
npm install --save-dev babel-preset-es2015
npm install --save-dev babel-preset-react
npm install --global babel-cli

## Before compile, you need the `.babelrc` file in *CURRENT* path. Content
## of that file:
##  { "presets": ["react", "es2015"] }

## The "es2015" is not necessary if you write normal javascript.

## Compile a whole directory
## `-d` can also be `--out-dir`, `-s` means generate source map
babel src -d lib -s
