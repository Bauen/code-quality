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
let dest = args.d || args.destination;

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
let files = [
  '.eslintrc',
  '.eslintignore',
  '.codeclimate.yml',
];

for (let i in files) {
  console.log(`Copying over ${files[i]}.`);
  fs.copySync(files[i], path.join(dest, files[i]));
}

// Create testing directory.
console.log('Creating test directory.');
fs.mkdirsSync(path.join(dest, 'test'));

// Install tool dependencies.
console.log('Installing dependencies.');
let command = 'npm install --save-dev';
exec(`${command} alex`, {cwd: dest});
exec(`${command} ava`, {cwd: dest});
exec(`${command} eslint`, {cwd: dest});
exec(`${command} eslint-plugin-import`, {cwd: dest});
exec(`${command} babel-eslint`, {cwd: dest});
exec(`${command} eslint-config-airbnb-base`, {cwd: dest});
exec(`${command} nyc`, {cwd: dest});
exec(`${command} write-good`, {cwd: dest});

// Add helper scripts.
console.log('Installing helper scripts');
let scripts = {
  'test': './node_modules/.bin/nyc ./node_modules/.bin/ava',
  'lint': './node_modules/.bin/eslint .',
  'lint-english': './node_modules/.bin/write-good *.md && ./node_modules/.bin/alex',
  'coverage': './node_modules/.bin/nyc report --reporter=text-lcov > coverage.lcov && ./node_modules/.bin/codecov',
}

// Load existing package.json file, and set scripts property.
let packageJson = jsonFile.readFileSync(packageJsonPath);
packageJson.scripts = scripts;
jsonFile.writeFileSync(packageJsonPath, packageJson, {spaces: 2});
