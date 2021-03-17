const select = (langKey) => {
  var res
  switch (langKey) {
    case "en":
      res = 0
      break
    case "cn":
      res = 1
      break
    default:
      res = null
  }
  return res
}

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export { select, uuidv4 }
