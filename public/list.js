

const sortBy = (dataType, ascOrDesc) => {
    let bodyObj = {
        type : `${dataType}`,
        direction : `${ascOrDesc}`
    }

    console.log(bodyObj)

    axios.get('/dbSorted', bodyObj)
}



sortBy('name', 'ASC')