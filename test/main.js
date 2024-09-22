let a = document.createElement('a')
a.id = 'xxx'
document.body.appendChild(a)
a.addEventListener('click', function() {
  window.open(url)
})
a.click()
document.body.removeChild(a)