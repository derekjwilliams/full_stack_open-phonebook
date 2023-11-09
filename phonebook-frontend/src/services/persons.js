import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const getByName = (value) => {
  const request = axios.get(`${baseUrl}?name=${value}`)
  return request.then((response) => response.data)
}

const create = (value) => {
  const request = axios.post(baseUrl, value)
  return request.then((response) => response.data)
}

const updateUsingLocation = (location, value) => {
  const request = axios.put(location, value)
  return request.then((response) => response.data)
}

const update = (id, value) => {
  const request = axios.put(`${baseUrl}/${id}`, value)
  return request.then((response) => response.data)
}

const deleteById = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then((response) => response.data)
}

export default { getAll, getByName, create, update, deleteById, updateUsingLocation }
