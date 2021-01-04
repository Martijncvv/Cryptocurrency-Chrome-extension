console.log("background is running background.js")

chrome.runtime.onMessage.addListener(receiver);

window.coin_ticker = "coin value global";

function receiver(request) {
    console.log(request);
    coin_ticker = request;
}