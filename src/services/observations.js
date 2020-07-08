import axios from 'axios'
const baseUrl = "http://localhost:3001/api/observations"

const getAll = async () => {
    const request =  axios.get(baseUrl)
    const response = await request
    return response.data
}

const create = async newObject => {
    const request = axios.post(baseUrl, newObject)
    const response = await request
    return response.data  
}

const deleteEntry = async (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    const response = await request
    return response.data
}


export default { getAll, create, deleteEntry }