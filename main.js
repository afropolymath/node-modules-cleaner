const inquirer = require('inquirer')
const PathPrompt =  require('inquirer-path').PathPrompt
const dialog = require('dialog')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const notifier = require('node-notifier')

inquirer.registerPrompt('path', PathPrompt)

const run = () => {
  getInput()
    .then((result) => getProjectFolders(result.path))
    .then(notifyUser)
}

/**
 * Collect folder path input from user and return promise with input
 * 
 * @returns Promise
 */
const getInput = () => {
  return inquirer.prompt([{
    type: 'path',
    name: 'path',
    message: 'Enter a folder that we should watch',
    default: process.cwd()
  }])
}

/**
 * Return a promise containing the list of folders with
 * nested node_modules folder
 * 
 * @param {any} folderPath Root folder to search
 * @returns Promise
 */
const getProjectFolders = (folderPath) => {
  try {
    const files = fs.readdirSync(folderPath) || []

    return Promise.resolve(
      files.map((filename) => path.join(folderPath, filename))
        .filter((filepath) => {
          return fs.statSync(filepath).isDirectory()
        })
        .filter((filepath) => {
          const contents = fs.readdirSync(filepath) || []
          return contents.find(f => f === 'node_modules')
        })
        .filter((filepath) => {
          const folderPointer = path.join(filepath, 'node_modules')
          const lastChanged = fs.statSync(folderPointer).ctime
          const timeDiff = moment().diff(moment(lastChanged), 'days')
          return timeDiff > 30
        })
    )  
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Notify user of folders to be deleted and delete the folders afterwards
 * 
 * @param {any} folders Folders to be deleted
 */
const notifyUser = (folders) => {
  if (folders.length) {
    notifier.notify({
      title: 'node-modules-cleaner',
      message: `Found ${folders.length} redundant node_modules folders`,
      wait: true,
      closeLabel: 'Ignore',
      actions: 'Delete',
    }, (err, response) => {
      if (response === 'activate') {
        folders.map(dir => path.join(dir, 'node_modules'))
          .forEach(deleteFolderRecursive)
        const foldernames = folders.map(foldername => `✅ ${foldername}`).join('\n')
        const information = `Done deleting ${folders.length} folders.\n\n${foldernames}`
        dialog.info(information, 'node-modules-cleaner')
      }
    })
  } else {
    dialog.info('All clean! No redundant folders found.', 'node-modules-cleaner')
  }
}

/**
 * Recursively delete the folder specified by the path argument
 * 
 * @param {any} path Path to the folder to be deleted 
 */
const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

run()
