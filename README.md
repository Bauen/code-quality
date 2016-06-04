# Code Quality Tools
This repository contains a mechanism that allows you to easily set up code quality enforcement tools on any existing node project.

## What's included?
The following tools are included and configured:
* [Eslint](http://eslint.org/).
* [Code Climate](https://codeclimate.com/).
* [NYC coverage reporter](https://github.com/bcoe/nyc).
* [AVA test runner](https://www.npmjs.com/package/ava).

The following npm scripts allow you to easily execute these tools in a sensible way.
* `npm run test` - Executes AVA and NYC, and runs all tests.
* `npm run lint` - Runs eslint on all code.
* `npm run lint-english` - Runs documentation through static language analysis tools.
* `npm run coverage` - Generates a coverage report.
* `npm run coverage-report` - Renders an HTML coverage report in your browser.

## Installation
* Clone this repository.
* Run `npm install` in the root of this project.

## Usage
To install code quality enforcement tools on your existing node project, use the `install` run script:

```bash
npm run install -- --destination ~/Path/To/My/Node/Project
```

This will install all the listed tools, and add scripts that you can use to run these tools.
