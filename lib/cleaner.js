const fs = require('fs')
const path = require('path')
const moment = require('moment')

const messager = require('./_messager')

const cleaner = {
  init() {
    return messager.ask()
  },
  /**
   * Attempt to rid a folder of all nested project folders having a
   * nested node_modules folders
   * 
   * @param {string} folder Root folder to search
   */
  clean(folder) {
    cleaner.getProjectFolders(folder)
      .then((folders) => {
        if (!folders.length)
          messager.alert('All clean! No redundant folders found.')
        else
          messager.confirmDelete(folders)
            .then((response) => {
              const foldersToClean = response.foldersToClean
              if (!foldersToClean.length)
                messager.alert('All done! Nothing to clean.')
              else
                foldersToClean.map(dir => path.join(dir, 'node_modules'))
                  .forEach(cleaner.deleteFolderRecursive)
                const foldernames = foldersToClean.map(foldername => `✓ ${foldername}`).join('\n')
                messager.alert(`Done deleting ${foldersToClean.length} folders.\n\n${foldernames}`)
              if (response === 'activate') {
                folders
              }
            })
      })
  },
  /**
   * Return a promise containing the list of folders having a
   * nested node_modules folder
   * 
   * @param {any} folderPath Root folder to search
   * @returns {Promise} Promise containing folders to be deleted
   */
  getProjectFolders(folderPath) {
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
  },
  /**
   * Recursively delete the contents of the folder specified by the path argument
   * 
   * @param {any} path Path to the folder to be deleted 
   */
  deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          cleaner.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
}

module.exports = cleaner