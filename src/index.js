const core = require('@actions/core');
const fs = require('fs')

const fileCache = {};

const readFile = (sourcePath) => {
  console.log('reading file into cache:', sourcePath);
  fileCache[sourcePath] = fs.readFileSync(sourcePath).toString();
  return fileCache[sourcePath];
}

const transclude = (sourcePath, pathStack = []) => {
  if (pathStack.includes(sourcePath)) throw new Error(`Detected circular dependency: ${pathStack.join(' -> ')} -> ${sourcePath}`);
  else pathStack.push(sourcePath);

  if (!fs.existsSync(sourcePath)) throw new Error(`File not found: ${sourcePath}`)

  const sourceFolder = sourcePath.substring(0, sourcePath.lastIndexOf('/'));

  const sourceFile = fileCache[sourcePath] || readFile(sourcePath)

  // const regex = /(?!```[a-z]*\n.*)(?!`.*)!\[\[([\w\-.\/ ]+)\]\](?!.*`)(?!.*\n```)/g
  const regex = /(?:(?!.*`)!\[\[(.+)\]\])/g

  let match;
  let destFile = sourceFile;
  while ((match = regex.exec(sourceFile)) !== null) {
    console.log(match);
    let transPath = match[1];
    let transPathExists = fs.existsSync(transPath);

    if (transPath.startsWith('./')) transPath = transPath.replace('.', sourceFolder);

    if (!transPathExists && !transPath.endsWith('.md')) {
      transPath += '.md';
      transPathExists = fs.existsSync(transPath);
    }
    if (!transPathExists && !transPath.startsWith(sourceFolder)) {
      transPath = sourceFolder + (transPath.startsWith('/') ? '' : '/') + transPath;
      transPathExists = fs.existsSync(transPath);
    }

    if (!transPathExists) {
      throw new Error(`Cannot find transcluded file: ${match[1]}`);
    }
    else {
      destFile = destFile.replace(match[0], transclude(transPath, pathStack));
    }
  }

  pathStack.pop();
  return destFile;
}

try {

  let sourcePath = core.getInput('source');//'./templates/README.md'
  console.log("source:", sourcePath);

  if (!fs.existsSync(sourcePath)) throw new Error(`Source file not found: ${sourcePath}`)
  const destFile = transclude(sourcePath)
  core.setOutput("markdown", destFile);

  let destPath = core.getInput('dest');//'./README.md'
  console.log("dest:", destPath);
  core.setOutput("deatPath", destPath);

  console.log("writing to output file: ", destPath);
  fs.writeFileSync(destPath, destFile);
  console.log("File write complete!");
  
    // // `who-to-greet` input defined in action metadata file
  // const nameToGreet = "World"//core.getInput('who-to-greet');
  // console.log(`Hello ${nameToGreet}!`);
  // const time = (new Date()).toTimeString();
  // // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);

} catch (error) {
  core.setFailed(error.message);
}