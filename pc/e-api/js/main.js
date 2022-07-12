window.onload = function(){
    let apiWeb = document.getElementById('e-api-web')
    let apiChrome = document.getElementById('e-api-chrome')
    apiWeb.onclick = function(){
        window.open('http://e-api.nodebook.top')
    }
    apiChrome.onclick = function(){
        window.open(chrome.runtime.getURL('e-api/index.html'))
    }
}