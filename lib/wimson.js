const path = require ('path');
const Walk = require ('walk');

module.exports = ({ workingDir, filesDir, widgetName, alias }) => {

  return new Promise ((resolve, reject) => {
    if (!(workingDir && filesDir && widgetName && alias)) {
      throw 'Error: Insufficient arguments for ace widget import json generation.';
    }

    let result = {
      importerMetadata: { alias },
      system: { contentType: 'aceUIWidgetContent' },
      operations: [{ _type: 'aceAssignToViews', views: ['acePublic'] }],
      aspects: {
        aceUIWidget: { name: 'Ace UI Widget - ' + widgetName },
        aceFiles: {
          files: {}
        }
      },
    };

    Walk.walk (path.resolve (filesDir), {
      listeners: {
        names: (root, nodeNames) => {
          nodeNames.slice (). reverse ().forEach ((name, i, arr) => {
            if (name.startsWith ('.')) {
              nodeNames.splice (arr.length - 1 - i, 1);
            } else if (name === 'node_modules') {
              nodeNames.splice (arr.length - 1 - i, 1);
            } else if (name === `${widgetName}.json`) {
              nodeNames.splice (arr.length - 1 - i, 1);
            } else if (name.endsWith ('.json')) {
              console.warn (' - !  Adding a file with .json extension might confuse the content importer.');
              console.warn (` - !    -> ${name} (${path.relative (workingDir, path.resolve (root, name))})`);
            }
          });
        },
        file: (root, stats, next) => {
          let entry = {
            fileUri: 'file:' + path.relative (workingDir, path.resolve (root, stats.name)),
            filePath: path.relative (filesDir, path.resolve (root, stats.name))
          }
    
          if (filesDir === root) {
            if (entry.filePath.includes ('manifest.json')) {
              entry.filePath = 'manifest.json'
            }
            if (entry.filePath.includes ('widget.js')) {
              entry.filePath = 'widget.js';
            }
            if (entry.filePath.includes ('template.html')) {
              entry.filePath = 'template.html';
            }
            if (entry.filePath.includes ('style.css')) {
              entry.filePath = 'style.css';
            }
          }
    
          result.aspects.aceFiles.files[entry.filePath] = entry;
    
          next ();
        },
        end: () => {
          resolve (result);
        },
        errors: (root, nodeStatsArray, next) => {
          reject ({ root, nodeStatsArray });
        }
      }
    });

  });


}