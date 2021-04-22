// https://stackoverflow.com/questions/3916191/download-data-url-file/15832662#15832662
export default function downloadURI(uri, name) {
  var link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
