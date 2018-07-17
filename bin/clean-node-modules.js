#!/usr/bin/env node

const lib = require('../lib')

lib.cleaner.init()
  .then((result) => lib.cleaner.clean(result.path))