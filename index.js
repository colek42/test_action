const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

try {
  // Get all the inputs with different YAML types
  const stringInput = core.getInput('string-input');
  const numberInput = parseInt(core.getInput('number-input'), 10);
  const booleanInput = core.getInput('boolean-input').toLowerCase() === 'true';
  const arrayInput = core.getInput('array-input').split(',');
  const objectInput = JSON.parse(core.getInput('object-input'));
  const outputFilePath = core.getInput('output-file-path');

  // Get system environment info
  const workingDirectory = process.cwd();
  const envPath = process.env.PATH;
  
  // Get file listing
  let fileList = '';
  try {
    fileList = execSync('ls -al').toString();
  } catch (err) {
    fileList = `Error listing files: ${err.message}`;
  }

  // Get git info
  let gitInfo = '';
  try {
    gitInfo = `
Git Status:
${execSync('git status').toString()}

Git Log (last 5 commits):
${execSync('git log -n 5 --oneline').toString()}

Git Remote:
${execSync('git remote -v').toString()}

Git Branch:
${execSync('git branch').toString()}
`;
  } catch (err) {
    gitInfo = `Error getting git info: ${err.message}`;
  }

  // Get GitHub context
  const githubContext = {
    eventName: github.context.eventName,
    sha: github.context.sha,
    ref: github.context.ref,
    workflow: github.context.workflow,
    action: github.context.action,
    actor: github.context.actor,
    job: github.context.job,
    runNumber: github.context.runNumber,
    runId: github.context.runId,
    apiUrl: github.context.apiUrl,
    serverUrl: github.context.serverUrl,
    graphqlUrl: github.context.graphqlUrl
  };

  // Get environment variables
  const environmentVariables = { ...process.env };
  
  // Sanitize any sensitive information (remove tokens, etc.)
  if (environmentVariables.GITHUB_TOKEN) {
    environmentVariables.GITHUB_TOKEN = '***REDACTED***';
  }
  // Redact any other potential sensitive values
  Object.keys(environmentVariables).forEach(key => {
    if (
      key.includes('TOKEN') || 
      key.includes('SECRET') || 
      key.includes('PASSWORD') || 
      key.includes('KEY')
    ) {
      environmentVariables[key] = '***REDACTED***';
    }
  });

  // Compile all debug info
  const allDebugInfo = {
    timestamp: new Date().toISOString(),
    inputs: {
      stringInput,
      numberInput,
      booleanInput,
      arrayInput,
      objectInput,
      outputFilePath
    },
    workingDirectory,
    path: envPath,
    fileList,
    gitInfo,
    githubContext,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    env: environmentVariables
  };

  // Output to stdout
  console.log('=== DEBUG INFO ACTION OUTPUT ===');
  console.log(`Working Directory: ${workingDirectory}`);
  console.log(`PATH: ${envPath}`);
  console.log('\nFile Listing:');
  console.log(fileList);
  console.log('\nGit Info:');
  console.log(gitInfo);
  console.log('\nInputs:');
  console.log(`  String Input: ${stringInput} (${typeof stringInput})`);
  console.log(`  Number Input: ${numberInput} (${typeof numberInput})`);
  console.log(`  Boolean Input: ${booleanInput} (${typeof booleanInput})`);
  console.log(`  Array Input: ${JSON.stringify(arrayInput)} (${typeof arrayInput})`);
  console.log(`  Object Input: ${JSON.stringify(objectInput)} (${typeof objectInput})`);
  console.log('\nNode Info:');
  console.log(`  Version: ${process.version}`);
  console.log(`  Platform: ${process.platform}`);
  console.log(`  Architecture: ${process.arch}`);
  console.log('\nGitHub Context:');
  console.log(JSON.stringify(githubContext, null, 2));
  
  // Print environment variables
  console.log('\nEnvironment Variables:');
  Object.keys(environmentVariables).sort().forEach(key => {
    console.log(`  ${key}: ${environmentVariables[key]}`);
  });
  
  console.log('=== END DEBUG INFO ===');

  // Write to file
  const outputContent = JSON.stringify(allDebugInfo, null, 2);
  fs.writeFileSync(outputFilePath, outputContent);
  console.log(`\nDebug information written to ${path.resolve(outputFilePath)}`);

  // Set outputs
  core.setOutput('working-directory', workingDirectory);
  core.setOutput('file-list', fileList);
  core.setOutput('git-info', gitInfo);
  core.setOutput('all-debug-info', outputContent);

} catch (error) {
  core.setFailed(`Action failed with error: ${error.message}`);
  console.error(error.stack);
}