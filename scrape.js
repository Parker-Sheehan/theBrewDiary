const {Builder, Capabilities, By} = require('selenium-webdriver')
require('chromedriver')

let count = 0
let arr = []

async function scrape(){
    for(let i = 0; i < 10; i++){
        count++
        const driver = await new Builder().forBrowser("chrome").build();

        await driver.get(`https://thegingerman.com/beer-book/page/${count}/`)


        beers = await driver.findElements(By.css(".beer-index-headline"));
        let info = await driver.findElements(By.css(".beer-sub-headline-index"))

        for (let i = 0; i < beers.length; i++){
            let split = (await info[i].getText()).split(" ")
            let beer = await beers[i].getText()

            if(beer === ''){
                console.log('yay')
                break
            }

            console.log(beer)
            console.log(split)

            let volume = split[0].replace("oz", "")
            let abv = split.pop().replace('%', "")

            let beerObj = {
                beer,
                volume,
                abv
            }

            arr.push(beerObj)
        }



        driver.quit();
    }

    return(arr)
}

scrape().then(data => {
    console.log(data)
})