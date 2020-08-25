const express = require ('express');
const router = express.Router();
const puppeteer = require('puppeteer');
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
    
        const dependencies = document.querySelector('table').innerText.match(/(?<="dependencies": {)(.*?)(?=},)/gs)
        let newString = ""
        
        dependencies[0].split(/[\n "]/).map(txt => txt.trim()).filter(txt => txt !== "").forEach(t => newString += t)
        
        const dependenciesList = newString.split(',')
        return dependenciesList
        // const links = Object.values(document.querySelector('.js-active-navigation-container').querySelectorAll('a'))
        // const type = links .find(link => link.innerText == "package.json")
        
        // result =  type ? await openPackagePage(browser, page) : null

        // return result
    })


    // console.log({packages});
    await browser.close();

    res.send({packages})
});


module.exports = router;
    // res.end(JSON.stringify({name})
