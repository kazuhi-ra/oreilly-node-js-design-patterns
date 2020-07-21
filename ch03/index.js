const request = require('request')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const utilities = require('./utilities')

const saveFile = (filename, contents, callback) => {
  mkdirp(path.dirname(filename), err => {
    if (err) {
      return callback(err)
    }
    fs.writeFile(filename, contents, callback)
  })
}

const download = (url, filename, callback) => {
  console.log(`Downloading ${url}`)
  request(url, (err, response, body) => {
    if (err) return callback(err)

    saveFile(filename, body, err => {
      if (err) return callback(err)
      callback(null, body)
    })
  })
}

// 指定したurlのHTMLを保存し、終わったらcallbackを呼び出す
const spider = (url, callback) => {
  const filename = utilities.urlToFilename(url)
  fs.exists(filename, exists => {
    if (exists) return callback(null, filename, false)
    download(url, filename, err => {
      if (err) return callback(err)
      callback(null, filename, true)
    })
  })
}

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console.log(err)
  } else if (downloaded) {
    console.log(`Completed the download of ${filename}`)
  } else {
    console.log(`${filename} was already downloaded`)
  }
})
