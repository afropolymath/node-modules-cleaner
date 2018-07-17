const colors = require('colors')
const dialog = require('dialog')
const inquirer = require('inquirer')
const PathPrompt =  require('inquirer-path').PathPrompt

inquirer.registerPrompt('path', PathPrompt)

const messager = {
  /**
   * Notify user of folders to be deleted and get user input as to
   * whether to delete those files or not
   * 
   * @param {Array} folders Folders to be deleted
   * @returns {Promise} Promise containing users input
   */
  confirmDelete(folders) {
    console.log(
      colors.yellow(`Found ${folders.length} redundant node_modules folders`)
    );
    return inquirer.prompt([{
      type: 'checkbox',
      message: 'Select the folders you want to clean',
      name: 'foldersToClean',
      choices: folders
    }]);
  },
  /**
   * Displays a native dialog with the specified message
   * 
   * @param {string} message Message to display
   */
  alert(message) {
    console.log(colors.green(message))
  },
  /**
   * Collect folder path input from user and return promise with input
   * stored in the path parameter
   * 
   * @returns {Promise}
   * 
   */
  ask() {
    return inquirer.prompt([{
      type: 'path',
      name: 'path',
      message: 'Enter the full path of the folder housing your projects',
      default: process.cwd()
    }])
  }
}

module.exports = messager