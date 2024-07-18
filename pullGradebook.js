'use strict';

// Import required modules
const puppeteer = require('puppeteer');
const path = require('path');
const Timeout = require('await-timeout');

// Load environment variables from .env file
require('dotenv').config();

// Define constants from environment variables
const URL_MOODLE = process.env.URL_MOODLE;
const ID_COURSE = process.env.ID_COURSE;
const USERNAME_PROFESOR = process.env.USERNAME_PROFESOR;
const PASSWORD_PROFESOR = process.env.PASSWORD_PROFESOR;

// Construct the URL for downloading the CSV file
const URL_DOWNLOAD_CSV = `${URL_MOODLE}/grade/export/txt/index.php?id=${ID_COURSE}`;

(async () => {
  // Define the path where files will be downloaded
  const downloadPath = path.resolve('./grade_books');

  // Launch a new browser instance
  const browser = await puppeteer.launch({ headless: false });

  // Open a new page in the browser
  const page = await browser.newPage();

  // Set the download behavior to allow file downloads
  const client = await page.createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  // Navigate to the Moodle login page
  await page.goto(URL_DOWNLOAD_CSV);

  // Type the username and password into the login form
  await page.type('input[name="username"]', USERNAME_PROFESOR);
  await page.type('input[name="password"]', PASSWORD_PROFESOR);

  // Submit the login form and wait for navigation to complete
  await Promise.all([
    page.waitForNavigation(), // Wait for navigation to complete
    page.click('#loginbtn') // Click the login button
  ]);

  // Wait for the download button to be available and click it
  await page.waitForSelector('#id_submitbutton');
  await page.click('#id_submitbutton');

  // Wait for a few seconds to ensure the download completes
  await Timeout.set(3000);

  // Close the browser instance
  await browser.close();
})();

