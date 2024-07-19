//'use strict';
//
//const { exec } = require('child_process');
//const path = require('path');
//const fs = require('fs');
//const dotenv = require('dotenv');
//
//// Directory where your .env files are located
//const envDir = './envs';
//// Path to your main script
//const scriptPath = path.resolve(__dirname, './pullGradebook.js');
//
//// Get all .env files in the directory
//fs.readdir(envDir, (err, files) => {
//  if (err) {
//    console.error(`Unable to read directory ${envDir}:`, err);
//    process.exit(1);
//  }
//
//  // Filter out only .env files
//  const envFiles = files.filter(file => file.endsWith('.env'));
//
//  envFiles.forEach(file => {
//    // Load the environment variables from the .env file
//    const envPath = path.join(envDir, file);
//    dotenv.config({ path: envPath });
//
//    // Execute the script with the loaded environment variables
//    exec(`node ${scriptPath}`, (err, stdout, stderr) => {
//      if (err) {
//        console.error(`Error executing script for ${file}:`, err);
//        return;
//      }
//
//      if (stderr) {
//        console.error(`Error output from script for ${file}:`, stderr);
//        return;
//      }
//
//      console.log(`Successfully executed script for ${file}.`, stdout);
//    });
//  });
//});

'use strict';

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const util = require('util');

const execPromise = util.promisify(exec);

// Directory where your .env files are located
const envDir = './envs';
// Path to your main script
const scriptPath = path.resolve(__dirname, './pullGradebook.js');

// Function to execute the script with a specific .env file
async function executeScript(envFile) {
  // Load the environment variables from the .env file
  const envPath = path.join(envDir, envFile);

  // Execute the script with the loaded environment variables
  try {
    const { stdout, stderr } = await execPromise(`ENVPATH=${envPath} node ${scriptPath}`);
    console.log(`Successfully executed script for ${envFile}:`, stdout);
    if (stderr) {
      console.error(`Error output from script for ${envFile}:`, stderr);
    }
  } catch (err) {
    console.error(`Error executing script for ${envFile}:`, err);
  }
}

// Main function to read .env files and execute the script sequentially
async function main() {
  try {
    const files = await fs.promises.readdir(envDir);
    const envFiles = files.filter(file => file.endsWith('.env'));

    for (const file of envFiles) {
      await executeScript(file);
    }
  } catch (err) {
    console.error(`Error reading directory ${envDir}:`, err);
    process.exit(1);
  }
}

main();
