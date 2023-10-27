import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = value => {
  const request = axios.post(baseUrl, value)
  return request.then(response => response.data)
}

const update = (id, value) => {
  const request = axios.put(`${baseUrl}/${id}`, value)
  return request.then(response => response.data)
}

const deleteById = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { getAll, create, update, deleteById }