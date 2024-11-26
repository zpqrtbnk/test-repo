const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs').promises;

async function run() {
    
  try {

    core.info('Begin');

    // get inputs
    const token = core.getInput('token', { required: true });
    const name = core.getInput('name', { required: true });
    const path = core.getInput('path', { required: true });
    const version = core.getInput('version', { required: false });
    
    // get the REST api
    const octokit = github.getOctokit(token);
    const rest = octokit.rest;
    
    // get the context, the workflow, etc.
    const context = github.context;
    const workflow = context.workflow;
    const repository = context.payload.repository;
    
    core.info('Running!');   
    core.info('Completed.');
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

const getSha = (context) => {
  if (context.eventName === "pull_request") {
    return context.payload.pull_request.head.sha || context.payload.after;
  } else {
    return context.sha;
  }
};

run();
