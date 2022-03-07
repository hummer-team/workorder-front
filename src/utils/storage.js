/*
*  storage 对象封装
*
*/

// let storage = localStorage
let storage = sessionStorage

function set (key, value) {
  if (value === false || value === null) { remove(key) }
  var data = {
    value: value,
    time: Date.now()
  }
  storage.setItem(key, JSON.stringify(data))
}

function setAll (data) {

}

function get (key) {
  var data = storage.getItem(key)
  if (!data || data === 'null') {
    return null
  }
  return JSON.parse(data).value
}

function getAll () {

}

function remove (key) {
  storage.removeItem(key)
}

function clear () {
  storage.clear()
}

function has (key) {
  return storage.hasOwnProperty(key)
}

export default {
  set,
  setAll,
  get,
  getAll,
  remove,
  clear,
  has
}
