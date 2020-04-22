# ace-wimson
Wimson - An Ace UI Widget Import Json Generation Tool

Generates import json for Ace UI widgets.

Files in the files root directory which names contains `manifest.json`, `style.css`,
`template.html` or `widget.js` are treated special that they are imported with their names
shortened to the names just listed. *Note that the tool does not examine the widgets manifest
file but are relying solely on a conventional layout of the file structure.*

## Install as cli

```
$ npm install @atex/ace-wimson -g
$ wimson --help
```

## Developer setup

```
$ git clone ...
$ cd ace-wimson
$ npm install -g
$ npm link
```

## Use as lib

```javascript
const wimson = require ('@atex/ace-wimson');

const options = {
  alias: '_widget/anAliasForTheWidget',
  workingDir: 'theDirWhereTheGeneratedJsonIsSupposedToLive',
  filesDir: 'rootDirForTheFileStructureToBeImported',
  name: 'nameOfTheWidget'
};

const result = wimson (options);

console.log (JSON.stringify (result, null, ' '));
```

The module exports a function taking an options object that returns the result
as an js object.
