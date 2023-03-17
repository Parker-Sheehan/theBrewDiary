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
    displayPost: (req,res) => {
        console.log(req.params)

        sequelize.query(`
            SELECT *
            From post
            Where user_id = ${req.params.id}
            ORDER BY(post_id) DESC;
        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    createAccount: (req, res) => {
        let {signUpFirst, signUpLast, signUpUser, signUpPassword} = req.body

        sequelize.query(`
        INSERT INTO user_list (first, last, username, password)
            values ('${signUpFirst}', '${signUpLast}','${signUpUser}', '${signUpPassword}');
        `)
        sequelize.query(`
        SELECT *
        FROM user_list
        WHERE username = '${signUpUser}' AND password = '${signUpPassword}';
        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    grabAccount: (req, res) => {
        sequelize.query(`
        SELECT first, user_id
        FROM user_list
        WHERE user_id = ${req.params.id}
        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    checkForAccount: (req, res) => {
        let {logInUser, logInPassword} = req.body
        sequelize.query(`
        SELECT user_id
        FROM user_list
        WHERE username = '${logInUser}' AND password = '${logInPassword}';
        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    dbSorted: (req, res) => {
        console.log(req.body)
        let {type, direction} = req.body

        sequelize.query(`
            SELECT *
            FROM beer_list
            ORDER BY(${type}) ${direction};
        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    getPostsByBeer: (req, res) => {
        console.log('yay')
        sequelize.query(`
            SELECT  *
            FROM post
            WHERE beer_id = ${req.params.id}
            ORDER BY(post_id) DESC
        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    getNamesAndIds: (req, res) => {
        sequelize.query(`
            SELECT *
            FROM beer_list
            ORDER BY(name) ASC;
        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    createPost: (req, res) => {
        console.log(req.body)
        let {name, rating, notes, beerId, userId} = req.body
        console.log(beerId)

        sequelize.query(`
        INSERT INTO post (beer_id, user_id, name, rating, notes)
            values (${beerId}, ${userId},'${name}', ${rating}, '${notes}');
        
        WITH temporaryTable (averageRating, beer_id) as
            (SELECT avg(rating), avg(beer_id)
            FROM post
            WHERE beer_id = ${beerId})
            UPDATE beer_list AS b
            SET 
                rating = averageRating
            FROM temporaryTable AS t
                WHERE b.beer_id = t.beer_id;

        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    updatePost: (req, res) => {
        console.log(req.body)
        let {name, rating, notes, beerId, postId} = req.body

        sequelize.query(`
            UPDATE post
            SET beer_id = ${beerId}, name = '${name}', rating = ${rating}, notes = '${notes}'
            WHERE post_id =  ${postId};

            WITH temporaryTable (averageRating, beer_id) as
            (SELECT avg(rating), avg(beer_id)
            FROM post
            WHERE beer_id = ${beerId})
            UPDATE beer_list AS b
            SET 
                rating = averageRating
            FROM temporaryTable AS t
                WHERE b.beer_id = t.beer_id;

        `).then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    deletePost: (req, res) => {
        sequelize.query(`
            DELETE FROM post
            WHERE post_id =  ${req.params.id};

        `)
        .then(dbRes => {res.status(200).send(dbRes[0])
        }).catch(err=> console.log(err))
    },
    createFakePosts: (req, res) => {
        sequelize.query(`
        SELECT name, beer_id
        FROM beer_list
        ORDER BY(beer_id) ASC;
        `).then(dbRes => {
            let count = 0
            let notesArray = ["Umm this beer is a little silly", "Notes of lawn clipings", "A little on the heavy side",
                            "Wish it was a little hoppier", "This one is perfect", "Flavorless!!", "Great drink", "Perfect summer beer",
                            "Nice", "Cool", "Neat", "Funky", "Too sweet", "Nice sweetness","Taste like coffee"]
            for (let i = 0; i < 150; i++){
                let idAndNameNum = Math.floor(Math.random()* 79)
                let name = dbRes[0][idAndNameNum].name
                let beer_id = dbRes[0][idAndNameNum].beer_id
                let user_id = Math.ceil(Math.random()* 13)
                let rating = Math.ceil(Math.random()* 5)
                let notes = notesArray[Math.floor(Math.random()* notesArray.length)]

                sequelize.query(`
                INSERT INTO post (beer_id, user_id, name, rating, notes)
                    values (${beer_id}, ${user_id},'${name}', ${rating}, '${notes}');

                    WITH temporaryTable (averageRating, beer_id) as
                    (SELECT avg(rating), avg(beer_id)
                    FROM post
                    WHERE beer_id = ${beer_id})
                    UPDATE beer_list AS b
                    SET 
                        rating = averageRating
                    FROM temporaryTable AS t
                    WHERE b.beer_id = t.beer_id;

                `)
            }
            })
        // for(let i=0; i<150; i++){

            // sequelize.query(`
            // INSERT INTO post (beer_id, user_id, name, rating, notes)
            //     values (${beerId}, ${userId},'${name}', ${rating}, '${notes}');
            // `)
        // }
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
            DROP TABLE if exists post;
            DROP TABLE if exists user_list;
            DROP TABLE if exists beer_list;

            CREATE TABLE beer_list(
                beer_id serial primary key,
                name VARCHAR,
                rating FLOAT,
                size FLOAT,
                abv FLOAT,
                oz_alcohol FLOAT
            );

            CREATE TABLE user_list(
                user_id SERIAL PRIMARY KEY,
                first VARCHAR,
                last VARCHAR,
                username VARCHAR,
                password VARCHAR
            );

            CREATE TABLE post(
                post_id SERIAL PRIMARY KEY,
                beer_id INTEGER NOT NULL REFERENCES beer_list(beer_id),
                user_id INTEGER NOT NULL REFERENCES user_list(user_id),
                name VARCHAR,
                rating INTEGER,
                notes Varchar(300)
            );
            `)
            for(let i = 0; i < data.length; i++){
                let {beer, volume, abv} = data[i]
                sequelize.query(`
                INSERT INTO beer_list(name, size, abv, oz_alcohol)
                    values ('${beer}', ${volume}, ${abv}, ${volume*(abv/100)});
                    `)
            }

            sequelize.query(`
            `)

        })
    }
}