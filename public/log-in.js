console.log("Ayaya")

const displayProfile = () => {
    let main = document.querySelector('main')
    main.innerHTML = ""

    let profileDiv = document.createElement('div')
    let welcomeDiv = document.createElement('div')
    let welcomeTitle = document.createElement('h1')
    let createEntryDiv = document.createElement('div')
    let createEntryBtn = document.createElement('button')


    profileDiv.setAttribute('id','profile-div')
    welcomeDiv.setAttribute('id','welcome-div')
    welcomeTitle.textContent = 'Welcome in, Parker!'
    createEntryDiv.setAttribute('id','create-entry-div')
    createEntryBtn.setAttribute('id','create-entry-btn')
    createEntryBtn.setAttribute('onclick','createEntryCard()')
    createEntryBtn.textContent = 'Create Entry'

    welcomeDiv.appendChild(welcomeTitle)
    profileDiv.appendChild(welcomeDiv)
    createEntryDiv.appendChild(createEntryBtn)
    profileDiv.appendChild(createEntryDiv)
    main.appendChild(profileDiv)

}

const createEntryCard = () =>{

    axios.get('/getNamesAndIds')
        .then(res => {

        let entryBtn = document.querySelector('#create-entry-div')
        entryBtn.innerHTML = ('')
        let beerCard = document.createElement('div')
        beerCard.setAttribute('class','beer-card')


        let beerCardTop = document.createElement('div')
        beerCardTop.setAttribute('class','beer-card-top')

        let beerNameDiv = document.createElement('div')
        beerNameDiv.setAttribute('class', 'beer-name-div')

        let beerName = document.createElement('h3')
        beerName.innerHTML = 'Beer Name:'

        let beerNameSelector = document.createElement('select')
        beerNameSelector.setAttribute('id',"beer-name-selector")
            
        // grabing beer names to put into beer name selector
        res.data.forEach(item => {
            let {name, beer_id} = item
            let nameOption = document.createElement('option')
            nameOption.setAttribute('value',`${beer_id}_-_${name}`)
            // nameOption.setAttribute('name',``)
            nameOption.innerHTML = (`${name}`)
            beerNameSelector.appendChild(nameOption)
        });


        let beerRatingDiv = document.createElement('div')
        beerRatingDiv.setAttribute('class','beer-rating-div')

        let beerRatingTitle = document.createElement('h3')
        beerRatingTitle.innerHTML = 'Rating:'

        let beerRatingSelector = document.createElement('select')
        beerRatingSelector.setAttribute('id','beer-rating-selector')

        // for loop to create each rating option 1-5
        for (let i = 1; i <= 5; i++){
            let rateingOption = document.createElement('option')
            rateingOption.setAttribute('value',`${i}`)
            rateingOption.innerHTML = (`${i}`)
            beerRatingSelector.appendChild(rateingOption)
        }

        beerNameDiv.appendChild(beerName)
        beerNameDiv.appendChild(beerNameSelector)
        beerCardTop.appendChild(beerNameDiv)
        beerRatingDiv.appendChild(beerRatingTitle)
        beerRatingDiv.appendChild(beerRatingSelector)
        beerCardTop.appendChild(beerRatingDiv)
        beerCard.appendChild(beerCardTop)

        //Middle portion of beer card

        let beerCardMiddle = document.createElement('div')
        beerCardMiddle.setAttribute('class','beer-card-middle')

        let beerNotes = document.createElement('div')
        beerNotes.setAttribute('class','beer-notes')

        let beerNotesHeader = document.createElement('div')
        beerNotesHeader.setAttribute('class','beer-notes-header')

        let beerNotesTitle = document.createElement('h4')
        beerNotesTitle.innerHTML = 'Notes'

        let beerNotesBody = document.createElement('div')
        beerNotesBody.setAttribute('class','beer-notes-body')

        let beerNotesInput = document.createElement('textarea')
        beerNotesInput.setAttribute('id',"beer-notes-input")
        beerNotesInput.setAttribute('placeholder',"What did you think about this beer")
        beerNotesInput.setAttribute('rows',"10")

        beerNotesHeader.appendChild(beerNotesTitle)
        beerNotes.appendChild(beerNotesHeader)
        beerNotesBody.appendChild(beerNotesInput)
        beerNotes.appendChild(beerNotesBody)
        beerCardMiddle.appendChild(beerNotes)
        beerCard.appendChild(beerCardMiddle)

        //Bottom portion of beer card

        let beerCardBottom = document.createElement('div')
        beerCardBottom.setAttribute('class','beer-card-bottom')
        let beerCardButtonDiv = document.createElement('div')
        beerCardButtonDiv.setAttribute('class','btn-div')
        let beerCardSubmit = document.createElement('button')
        beerCardSubmit.setAttribute('class','card-btn')
        beerCardSubmit.setAttribute('id','submit')
        beerCardSubmit.setAttribute('onclick','createPost()')
        beerCardSubmit.innerHTML = "Submit"

        beerCardButtonDiv.appendChild(beerCardSubmit)
        beerCardBottom.appendChild(beerCardButtonDiv)
        beerCard.appendChild(beerCardBottom)


        entryBtn.appendChild(beerCard)

    })
}

const createPost = (evt) => {
    let name = document.querySelector('#beer-name-selector').value.split('_-_')[1]
    let beerId = document.querySelector('#beer-name-selector').value.split('_-_')[0]
    let rating = document.querySelector('#beer-rating-selector').value
    let notes = document.querySelector('#beer-notes-input').value

    console.log(beerId)
    let bodyObj = {name, rating, notes, beerId}

    axios.post('/createPost', bodyObj)
        .then(res => {
            console.log(res.data)
            console.log('data was seeded in the base')
        }).catch(err => (console.log(err)))
}