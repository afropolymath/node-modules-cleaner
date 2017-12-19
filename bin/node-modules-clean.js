#!/usr/bin/env node

const lib = require('../lib')

lib.asker.ask()
  .then((result) => lib.cleaner.clean(result.path))