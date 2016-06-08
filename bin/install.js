#!/usr/bin/env node

/**
 * @file
 * Installs these tools into a given project.
 */

// Load dependencies.
const fs = require('fs-extra');
const args = require('minimist')(process.argv.slice(2));
const path = require('path');
const exec = require('sync-exec');
const jsonFile = require('jsonfile');

// Process arguments.
const dest = args.d || args.destination;

// If a destination was not passed in, exit.
if (typeof dest === 'undefined') {
  console.error([
    'Please pass in a -d or --destination parameter.',
    'This should be the path to the project in which you',
    'would like to install these tools.',
  ].join(' '));
  process.exit(1);
}

// Decide on json file path.
const packageJsonPath = path.join(dest, 'package.json');

// If the destination does exist and does not have a package.json file, exit.
try {
  fs.statSync(packageJsonPath).isFile();
}
catch (err) {
  console.error([
    'Destination folder must exist and contain a package.json file.',
    `Please run "npm init" in ${dest}.`,
  ].join(' '));
  process.exit(1);
}

// Copy over configuration files.
const files = [
  '.eslintrc',
  '.eslintignore',
  '.codeclimate.yml',
];

let i;
for (i = 0; i < files.length; i++) {
  console.log(`Copying over ${files[i]}.`);
  fs.copySync(files[i], path.join(dest, files[i]));
}

// Create testing directory.
console.log('Creating test and coverage directory.');
fs.mkdirsSync(path.join(dest, 'test'));
fs.mkdirsSync(path.join(dest, '.nyc_output'));

// Install tool dependencies.
console.log('Installing dependencies.');
const command = 'npm install --save-dev';
const options = { cwd: dest };
exec(`${command} alex`, options);
exec(`${command} ava`, options);
exec(`${command} eslint`, options);
exec(`${command} eslint-plugin-import`, options);
exec(`${command} babel-eslint`, options);
exec(`${command} eslint-config-airbnb-base`, options);
exec(`${command} nyc`, options);
exec(`${command} write-good`, options);

// Add helper scripts.
console.log('Installing helper scripts');
const scripts = {
  test: './node_modules/.bin/nyc ./node_modules/.bin/ava',
  lint: './node_modules/.bin/eslint .',
  coverage: './node_modules/.bin/nyc report --reporter=text-lcov > coverage.lcov',
  'lint-english': './node_modules/.bin/write-good *.md && ./node_modules/.bin/alex',
  'coverage-report': './node_modules/.bin/nyc report --reporter=html ./node_modules/.bin/ava && open ./coverage/index.html',
}

// Load existing package.json file, and set scripts property.
const packageJson = jsonFile.readFileSync(packageJsonPath);
packageJson.scripts = scripts;
jsonFile.writeFileSync(packageJsonPath, packageJson, { spaces: 2 });
