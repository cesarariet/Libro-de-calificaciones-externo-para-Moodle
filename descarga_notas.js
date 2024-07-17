'use strict';

const puppeteer = require('puppeteer');
const path = require('path');
const Timeout = require('await-timeout');


require('dotenv').config();

const URL_MOODLE = process.env.URL_MOODLE;
const ID_CURSO = process.env.ID_CURSO;
const USERNAME_PROFESOR = process.env.USERNAME_PROFESOR;
const PASSWORD_PROFESOR = process.env.PASSWORD_PROFESOR;

const URL_DESCARGA_CSV = `${URL_MOODLE}/grade/export/txt/index.php?id=${ID_CURSO}`;

(async () => {
  const downloadPath = path.resolve('./listas')
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // Configurar la ruta de descarga
  const client = await page.createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });
  await page.goto(URL_DESCARGA_CSV);
  await page.type('input[name="username"]', USERNAME_PROFESOR);
  await page.type('input[name="password"]', PASSWORD_PROFESOR);
  // 3. Enviar el formulario de inicio de sesión
  // const botonSubmit = await page.waitForSelector('#loginbtn')
  // await botonSubmit.click();
  await Promise.all([
    page.waitForNavigation(), // Esperar a que la navegación termine
    page.click('#loginbtn')
  ])
  const botonDownload = await page.waitForSelector('#id_submitbutton');
  await botonDownload.click('#id_submitbutton');
  await Timeout.set(3000);
  await browser.close();
})();
