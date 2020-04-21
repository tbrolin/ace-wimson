#!/usr/bin/env node

const path = require ('path');
const wimson = require ('./lib/wimson.js');
const minimist = require ('minimist');
const fs = require ('fs');

// Wimson - An Ace UI Widget Import Json Generation Tool

const args = minimist (process.argv.slice (2));

if (args.help) {
  console.log ();
  console.log ('  Usage: wimson [options]')
  console.log ();
  console.log ('  A tool to generate ace import json for ace-ui widgets. Generates json to standard output.');
  console.log ('  Example:  wimson --name MyCoolWidget > MyCoolWidget.json');
  console.log ();
  console.log ('  Options:');
  console.log ();
  console.log ('    --alias         Alias to be used for import - [ "_widget/${name}" ]');
  console.log ('    --filesDir      File structure root - [ "contentfiles" | workingDir ]');
  console.log ('    --name          The name of the widget - [ workingDir ]');
  console.log ('    --workingDir    Generated file URIs will be relative to this directory - [ current working directory ]');
  console.log ();
  process.exit (0);
}

const workingDir = args.workingDir || path.resolve ();
const filesDir = args.filesDir || fs.existsSync ('contentfiles') && path.resolve ('contentfiles') || workingDir;
const widgetName = args.name || path.basename (workingDir);
const alias = args.alias || '_widget/' + widgetName;

wimson ({ alias, filesDir, workingDir, widgetName })
  .then ((result) => {
    console.log (JSON.stringify (result, null, ' '));
    process.exit (0);
  })
  .catch ((error) => {
    console.error ('ERROR: ');
    console.error (error);
    process.exit (1);
  });