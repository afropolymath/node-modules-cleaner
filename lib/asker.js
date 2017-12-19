const inquirer = require('inquirer')
const PathPrompt =  require('inquirer-path').PathPrompt

inquirer.registerPrompt('path', PathPrompt)

const asker = {
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
      message: 'Enter a folder to should watch',
      default: process.cwd()
    }])
  }
}

module.exports = asker