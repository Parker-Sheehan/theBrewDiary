
const displayProfile = (userId) => {
    console.log(userId)

    axios.put(`/grabAccount/${userId}`)
        .then(res => {
            console.log(res.data)
            let {user_id, first} = res.data[0]
            console.log(first)
            console.log(userId)

    let main = document.querySelector('main')
    main.innerHTML = ""

    let profileDiv = document.createElement('div')
    let welcomeDiv = document.createElement('div')
    let welcomeTitle = document.createElement('h1')
    let createEntryDiv = document.createElement('div')
    let createEntryBtn = document.createElement('button')


    profileDiv.setAttribute('id','profile-div')
    welcomeDiv.setAttribute('id','welcome-div')
    welcomeDiv.setAttribute('class',`${user_id}`)
    welcomeTitle.textContent = `Welcome in, ${first}!`
    createEntryDiv.setAttribute('id','create-entry-div')
    createEntryBtn.setAttribute('id','create-entry-btn')
    createEntryBtn.setAttribute('onclick','createEntryCard()')
    createEntryBtn.textContent = 'Create Entry'

    welcomeDiv.appendChild(welcomeTitle)
    profileDiv.appendChild(welcomeDiv)
    createEntryDiv.appendChild(createEntryBtn)
    profileDiv.appendChild(createEntryDiv)
    main.appendChild(profileDiv)
        })
        .catch(err => console.log(err))

        
        
    axios.put(`/displayPost/${userId}`)
        .then(res => {
            console.log(res.data)
            res.data.forEach(item => {

                let {name, notes, rating} = item

                let profileDiv = document.querySelector('#profile-div')

                // TOP OF BEER CARD
                let beerCard = document.createElement('div')
                beerCard.setAttribute('class','beer-card')

                let beerCardTop = document.createElement('div')
                beerCardTop.setAttribute('class','beer-card-top')

                let beerNameDiv = document.createElement('div')
                beerNameDiv.setAttribute('class', 'beer-name-div')

                let beerName = document.createElement('h3')
                beerName.innerHTML = `Beer Name: ${name}`

                let beerRatingDiv = document.createElement('div')
                beerRatingDiv.setAttribute('class','beer-rating-div')

                let beerRatingTitle = document.createElement('h3')
                beerRatingTitle.innerHTML = `Rating: ${rating}`

                beerNameDiv.appendChild(beerName)
                beerCardTop.appendChild(beerNameDiv)
                beerRatingDiv.appendChild(beerRatingTitle)
                beerCardTop.appendChild(beerRatingDiv)
                beerCard.appendChild(beerCardTop)

                // TOP OF BEER CARD

                // MIDDLE OF BEER CARD
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
        
                let beerNotesInput = document.createElement('p')
                beerNotesInput.innerHTML = `${notes}`
        
                beerNotesHeader.appendChild(beerNotesTitle)
                beerNotes.appendChild(beerNotesHeader)
                beerNotesBody.appendChild(beerNotesInput)
                beerNotes.appendChild(beerNotesBody)
                beerCardMiddle.appendChild(beerNotes)
                beerCard.appendChild(beerCardMiddle)
                // MIDDLE OF BEER CARD

                // BOTTOM OF BEER CARD

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


                profileDiv.appendChild(beerCard)
                // BOTTOM OF BEER CARD
            })


        }).catch(err => (console.log(err)))
        
}

const createAccount = (event) => {
    event.preventDefault()
    let signUpFirst = document.querySelector('#su-first').value
    let signUpLast = document.querySelector('#su-last').value
    let signUpUser = document.querySelector('#su-user').value
    let signUpPassword = document.querySelector('#su-password').value
    let signUpPasswordConfirm = document.querySelector('#su-password-confirm').value



    if (signUpFirst !== '' && signUpLast  !== '' && signUpUser !== '' && signUpPassword !== '' && signUpPasswordConfirm !== '' && signUpPassword === signUpPasswordConfirm){
        let bodyObj = {signUpFirst, signUpLast, signUpUser, signUpPassword}
        axios.post('/createAccount', bodyObj)
            .then(res=> {
                let userId = res.data[0].user_id
                displayProfile(userId)

            })
            .catch(err => (console.log(err)))
    }else{
        alert("something is a little off")
    }
}

const login = (event) =>{
    event.preventDefault()

    let logInUser = document.querySelector('#li-user').value
    let logInPassword = document.querySelector('#li-password').value

    let bodyObj = {logInUser, logInPassword}

    axios.post('/checkForAccount', bodyObj)
        .then(res=> {
            let userId = res.data[0].user_id
            displayProfile(userId)
        })
    
    
}

const createEntryCard = () =>{

    axios.get('/getNamesAndIds')
        .then(res => {

        

        let entryBtn = document.querySelector('#create-entry-div')
        entryBtn.setAttribute('id', 'create-entry-toggle')
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
    let userId = document.querySelector('#welcome-div').className
    if (notes.includes("'")){
        notes = notes.replaceAll("'", "")
    }

    let bodyObj = {name, rating, notes, beerId, userId}

    axios.post('/createPost', bodyObj)
        .then(res => {
            let ID = document.querySelector('#welcome-div').className
            console.log('yay')
            console.log(+ID.className)
            displayProfile(+ID)
        }).catch(err => (console.log(err)))
}


document.querySelector('#sign-in-btn').addEventListener('click', createAccount)
document.querySelector('#log-in-btn').addEventListener('click', login)
