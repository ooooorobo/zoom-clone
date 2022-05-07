export const saveToStorage = (key, data) => {
    window.localStorage.setItem(key, data)
}
export const getFromStorage = (key) => {
    return window.localStorage.getItem(key)
}
export default {}