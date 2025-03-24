const core = require('@actions/core');
const github = require('@actions/github');

try {
  // Get the input
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  
  // Get the current time
  const time = new Date().toTimeString();
  
  // Set the output
  core.setOutput('time', time);
  
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}