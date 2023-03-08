require('dotenv').config()
const {CONNECTION_STRING} = process.env
const { query } = require('express')
const {Builder, Capabilities, By} = require('selenium-webdriver')
require('chromedriver')

const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    dbSorted: (req, res) => {
        console.log(req.body)
        let {type, direction} = req.body

        sequelize.query(`
            SELECT *
            FROM list
            ORDER BY(${type}) ${direction};
        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    getNamesAndIds: (req, res) => {
        sequelize.query(`
            SELECT *
            FROM list
            ORDER BY(name) ASC;
        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    seed: (req, res) => {
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
                        break
                    }
                
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
            sequelize.query(`
            drop table if exists list;

            CREATE TABLE list(
                drink_id serial primary key,
                name VARCHAR,
                rating FLOAT,
                size FLOAT,
                abv FLOAT,
                oz_alcohol FLOAT
            );`)
            for(let i = 0; i < data.length; i++){
                let {beer, volume, abv} = data[i]
                sequelize.query(`
                INSERT INTO list (name, size, abv, oz_alcohol)
                    values ('${beer}', ${volume}, ${abv}, ${volume*(abv/100)});
                    `)
            }

        })
    }
}