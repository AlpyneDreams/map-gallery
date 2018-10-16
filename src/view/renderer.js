// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer, remote} = require('electron')


$ = (x) => document.querySelector(x)
$$ = (x) => document.querySelectorAll(x)

/** @type {function(HTMLElement): string} */
function getImagePath(x) {
    var path = x.getAttribute('name')
    if (x.parentElement.className.includes('folder')) {
        path = `${x.parentElement.getAttribute('name')}/${path}`
    }
    
    return `img/${path}.jpg`
}

window.onload = function() {
    /**
     * @param {HTMLElement} x
     */
    $$('.gallery .item').forEach(x => {
        x.addEventListener('click', function(e) {
            ipcRenderer.send('launch-map', e.currentTarget.getAttribute('name'))
        })

        if (!x.firstElementChild || x.firstElementChild.tagName != 'IMG') {
            var img = document.createElement('img');
            img.setAttribute('src', getImagePath(x))
            x.insertAdjacentElement('afterbegin', img)
        }
    })
}

$('.close').addEventListener('click', function() {
    remote.getCurrentWindow().close()
})

$('.minimize').addEventListener('click', function() {
    remote.getCurrentWindow().minimize()
})

