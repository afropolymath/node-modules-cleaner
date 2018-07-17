# node-modules-cleaner

![npm](https://img.shields.io/npm/l/node-modules-cleaner.svg)
![GitHub issues](https://img.shields.io/github/issues-raw/afropolymath/node-modules-cleaner.svg)
![npm](https://img.shields.io/npm/v/node-modules-cleaner.svg)
![npm](https://img.shields.io/npm/dt/node-modules-cleaner.svg)

Node script to delete unused `node_modules` folders in a specified folder

### Usage

Install the script on your machine using npm

```sh
npm install -g node-modules-cleaner
```

Run the script using the `clean-node-modules` command

```sh
clean-node-modules
```

Confirm the notification to clear redundant folders

![Illustration](http://g.recordit.co/dOIB6AJNFd.gif)

That's it, all redundant `node_modules` folders (more than 30 days old) within the specified folder are gone.