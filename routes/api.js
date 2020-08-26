const express = require ('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const latestVersion = require('latest-version');
var NpmApi = require('npm-api');


// const metadata = require('github-metadata');
// const axios = require('axios');

const openPackagePage = async(browser, page)=> {
    console.log({browser}, {page})
    await page.goto(`${baseUrl}/blob/master/package.json`, { waitUntil: 'networkidle2' } );
    
    const result = await page.evaluate(()=>{
        const dependencies = document.querySelector('table').innerText.match(/(?<="dependencies": {)(.*?)(?=},)/gs)
        let newString = ""
        
        dependencies[0].split(/[\n "]/).map(txt => txt.trim()).filter(txt => txt !== "").forEach(t => newString += t)
        
        const dependenciesList = newString.split(',')
        return dependenciesList
    })
}


router.post('/repo-packages-info', async (req, res) => {

    const owner = req.body.owner
    const repo = req.body.repo

    const baseUrl = `https://github.com/${owner}/${repo}`
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`${baseUrl}/blob/master/package.json`, { waitUntil: 'networkidle2' } );

    const packages = await page.evaluate(async () => {
        const repoPackageTable = document.querySelector('table').innerText
        const repoPackage = JSON.parse(repoPackageTable)
    
        return repoPackage
    })

    browser.close();
    // const packageVersion = await latestVersion('@testing-library/jest-dom')

    res.send({packages})
});


module.exports = router;
    // res.end(JSON.stringify({name})
