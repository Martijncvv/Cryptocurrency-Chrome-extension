console.log("Chrome extension is running, content.js")

window.addEventListener("mouseup", coin_selected) ;

function coin_selected() {
    let selected_coin = window.getSelection().toString().trim();
    if (selected_coin.length > 2 && selected_coin.length < 10) {
        let message = {
            ticker: selected_coin
        }
        chrome.runtime.sendMessage(message);
    }
}