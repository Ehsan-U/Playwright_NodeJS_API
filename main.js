const { chromium } = require('playwright-extra');
const stealth =  require('puppeteer-extra-plugin-stealth')()
const express = require("express");
const parser = require("body-parser")
const urlparser = require("url")
const redis = require("redis")
const { createHash } = require('crypto')
const compression = require('compression')()
const client = redis.createClient("redis://localhost:6379")
const app = express()
app.use(parser.json())
app.use(compression)
chromium.use(stealth)



async function cache_lookup(url, cache_update) {
    var response_id = createHash('md5').update(url).digest('hex')
    lookup_result = await client.get(response_id)
    if (cache_update) {
        await client.del(response_id)
        return false
    }
    else if (lookup_result) {
        return lookup_result
    }
    else {
        return false
    }
}


async function cache_dump(url, content) {
    var response_id = createHash('md5').update(url).digest('hex')
    await client.set(response_id, content, {EX: 86400})
}


async function getPage(url, wait_until, timeout, wait_for, images_enabled) {
    try {
        var browser = await chromium.launch({headless:true})
        var page = await browser.newPage()
        await page.goto(url)
        if (images_enabled === false) {
            var hostname = urlparser.parse(url).hostname
            await page.route(`**${hostname}/*`, route => {
                return route.request().resourceType() === 'image' ?
                    route.abort() : route.continue();
              });
        }
        if (wait_until) {
            await page.waitForSelector(wait_until, {timeout: timeout})
        }
        if (wait_for) {
            await page.waitForTimeout(wait_for)
        }
        var content = await page.content()
        await cache_dump(url, content)
    }
    catch (err) {
        console.log(err)
        content = err
    }
    finally {
        await browser.close()
        return content
    }
}


// API endpoint
app.post('/', async (req, resp) => {
    url = req.body.url
    var cache_update = req.body.cache_update
    await client.connect()
    var response = await cache_lookup(url, cache_update)
    if (!response) {
        wait_until = req.body.wait_until
        timeout = req.body.timeout
        wait_for = req.body.wait_for
        images_enabled = req.body.images_enabled  
        if (images_enabled === undefined){
            images_enabled = true
        }
        response = await getPage(url, wait_until, timeout, wait_for, images_enabled)
    }
    await client.disconnect()
    resp.send({response})
})

app.listen(3000, () => {
    console.log("app listening on 3000..")
})


