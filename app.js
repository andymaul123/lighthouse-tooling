const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fse = require('fs-extra');

const opts = {
  chromeFlags: ['--show-paint-rects']
};

async function readInput() {
  const data = JSON.parse(await fse.readFile('./input.json', 'utf8'));
  for(let path of data.paths) {
    const result = await launchChromeAndRunLighthouse(data.root + '/' + path, opts);
    fse.writeFile('./reports/' + path + '.json');
  }
}

async function launchChromeAndRunLighthouse(url, opts, config = null) {
  const chrome = await chromeLauncher.launch({chromeFlags: opts.chromeFlags});
  opts.port = chrome.port;
  const { lhr } = await lighthouse(url, opts, config);
  await chrome.kill();
  return lhr;
}



readInput();


