const dialog = require('dialog')
const notifier = require('node-notifier')


const messager = {
  /**
   * Notify user of folders to be deleted and get user input as to
   * whether to delete those files or not
   * 
   * @param {Array} folders Folders to be deleted
   * @returns {Promise} Promise containing users input
   */
  confirmDelete(folders) {
    return new Promise((resolve, reject) => {
      notifier.notify({
        title: 'node-modules-cleaner',
        message: `Found ${folders.length} redundant node_modules folders`,
        wait: true,
        closeLabel: 'Ignore',
        actions: 'Delete',
      }, (err, response) => {
        if (err)
          reject(err)
        else
          resolve(response)
      })
    })
  },
  /**
   * Displays a native dialog with the specified message
   * 
   * @param {string} message Message to display
   */
  alert(message) {
    dialog.info(message, 'node-modules-cleaner')
  }
}

module.exports = messager