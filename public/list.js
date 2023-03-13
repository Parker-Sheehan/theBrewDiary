const sortBy = (dataType, ascOrDesc) => {
    let bodyObj = {
        type : `${dataType}`,
        direction : `${ascOrDesc}`
    }
    console.log('yaya')
    axios.post('/dbSorted',bodyObj)
        .then(res => {
            let tableBody = document.querySelector('tbody')
            tableBody.innerHTML = ""
            
            res.data.forEach(item => {
            let tableItem = document.createElement('tr')
            let beerNameEntry = document.createElement('td')
            let ratingEntry = document.createElement('td')
            let volumeEntry = document.createElement('td')
            let abvEntry = document.createElement('td')
            let alcoholUnitsEntry = document.createElement('td')
            let {name, abv, oz_alcohol, rating, size, beer_id} = item

            beerNameEntry.textContent = name
            beerNameEntry.setAttribute('onClick',`getPostsByBeer(${beer_id})`)
            beerNameEntry.setAttribute('class','beer-name')
            if (rating == null){
                ratingEntry.textContent = "N/A"
            }else{
                ratingEntry.textContent = rating.toFixed(1)
            }
            volumeEntry.textContent = size
            abvEntry.textContent = abv
            alcoholUnitsEntry.textContent = oz_alcohol.toFixed(2)

            tableItem.appendChild(beerNameEntry)
            tableItem.appendChild(ratingEntry)
            tableItem.appendChild(volumeEntry)
            tableItem.appendChild(abvEntry)
            tableItem.appendChild(alcoholUnitsEntry)
            tableBody.appendChild(tableItem)
            })
        })
        .catch(err => console.log(err))
}

const getPostsByBeer = (beerId) => {
    console.log('yay')
    axios.put(`/getPostsByBeer/${beerId}`)
        .then(res => {
            let main = document.querySelector('main')
            main.innerHTML = ''
            let profileDiv = document.createElement('div')
            let titleDiv = document.createElement('div')
            let title = document.createElement('h1')
            let backBtnDiv = document.createElement('div')
            let backBtn = document.createElement('button')
            let postBtn = document.createElement('button')
            profileDiv.setAttribute('id','profile-div')
            titleDiv.setAttribute('id','welcome-div')
            if(res.data[0] === undefined){
                title.textContent = "No Posts Yet!"
                console.log(title)
            }else{
                title.textContent = `${res.data[0].name}`
            }
            backBtnDiv.setAttribute('id','back-button-div')
            backBtn.innerHTML = '<- Head back to list'
            backBtn.setAttribute('onclick', "location.href='./'")
            backBtn.setAttribute('class','back-to-list-btn')
            if(res.data[0] === undefined){
                postBtn.innerHTML = 'Be the first ->'
            } else{
                postBtn.innerHTML = 'Create new post ->'
            }
            postBtn.setAttribute('onclick', "location.href='./log-in'")
            postBtn.setAttribute('class','back-to-list-btn')
            console.log(backBtn)
            console.log(postBtn)
            backBtnDiv.appendChild(backBtn)
            backBtnDiv.appendChild(postBtn)
            titleDiv.appendChild(title)
            profileDiv.appendChild(backBtnDiv)
            profileDiv.appendChild(titleDiv)

            res.data.forEach(item => {
                let {name, notes, rating} = item
                

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

                beerCardBottom.appendChild(beerCardButtonDiv)
                beerCard.appendChild(beerCardBottom)


                profileDiv.appendChild(beerCard)
            })
            main.appendChild(profileDiv)
        })
        .catch(err => {console.log(err)})
}

const createBubble = () => {
    for(let i = 0; i < 50; i++){
        let newBubble = document.createElement('div')
        newBubble.setAttribute('class','bubbles')
        newBubble.setAttribute('id',`bubble${i}`)
        container.appendChild(newBubble)
        let size = Math.floor((Math.random()*20)) + 5
        let speed = (Math.random()*3) +1.5
        let position = (Math.random()*100)
        let opacity = Math.random()


        document.getElementById(`bubble${i}`).style.cssText = `
        width: ${size}px;
        height: ${size}px;
        animation: rise ${speed}s linear infinite;
        left: ${position}vw;
        opacity: ${opacity};
        animation-delay: ${opacity * 2.2}s;
        `
    }
}

createBubble()

sortBy('name','ASC')