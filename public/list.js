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
            let {name, abv, oz_alcohol, rating, size} = item
            beerNameEntry.textContent = name
            if (rating == null){
                ratingEntry.textContent = "N/A"
            }else{
                ratingEntry.textContent = rating
            }
            volumeEntry.textContent = size
            abvEntry.textContent = abv
            alcoholUnitsEntry.textContent = oz_alcohol

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

sortBy('name','ASC')