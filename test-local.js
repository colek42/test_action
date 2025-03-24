// Simple script to test the action locally
// Run with: node test-local.js

const fs = require('fs');

// Mock the @actions/core module
global.process.env['INPUT_STRING-INPUT'] = 'Local test run';
global.process.env['INPUT_NUMBER-INPUT'] = '777';
global.process.env['INPUT_BOOLEAN-INPUT'] = 'false';
global.process.env['INPUT_ARRAY-INPUT'] = 'local,test,run';
global.process.env['INPUT_OBJECT-INPUT'] = '{"local":true,"test":"run"}';
global.process.env['INPUT_OUTPUT-FILE-PATH'] = 'local-debug.json';

// Mock core module
const core = {
  getInput: (name) => {
    return process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
  },
  setOutput: (name, value) => {
    console.log(`Setting output ${name}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
  },
  setFailed: (message) => {
    console.error(`Action failed: ${message}`);
  }
};

// Mock github module
const github = {
  context: {
    eventName: 'local-run',
    sha: 'mock-sha',
    ref: 'refs/heads/main',
    workflow: 'local-workflow',
    action: 'local-action',
    actor: 'local-user',
    job: 'local-job',
    runNumber: 1,
    runId: 1,
    apiUrl: 'https://api.github.com',
    serverUrl: 'https://github.com',
    graphqlUrl: 'https://api.github.com/graphql'
  }
};

// Replace actual requires with our mocks
const originalRequire = require;
require = function(moduleName) {
  if (moduleName === '@actions/core') {
    return core;
  } else if (moduleName === '@actions/github') {
    return github;
  }
  return originalRequire(moduleName);
};

// Run the action
console.log('Running action locally...');
console.log('==========================================');
require('./index.js');
console.log('==========================================');
console.log('Action completed. Check local-debug.json for output.');

// Restore original require
require = originalRequire;