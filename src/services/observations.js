import axios from 'axios'
const baseUrl = "/api/observations"

const getAll = () => {
    const request =  axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)  
}

//deleting, editing and getting single observation 
//was not on the requirement but can be implemented very easily

export default { getAll, create }