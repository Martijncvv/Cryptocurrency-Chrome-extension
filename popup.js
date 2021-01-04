document.addEventListener('DOMContentLoaded', function () {
    // checks if user changes quote value to USD or BTC
    let pair_btn = document.getElementById('pair_switch');
    pair_btn.addEventListener('click', function() {
        let ticker = document.getElementById("coin_ticker").innerHTML;
        let quote = "usd";
        let pair = document.getElementById("pair_switch").innerHTML;
        if (pair.split("/").pop() == "btc") {
            quote = "btc";
        }
        display_coin_info(quote, ticker);
    });

    // checks if user clicks 'read more' button
    let descr_btn = document.getElementById('read_more_button');
    descr_btn.addEventListener('click', function() {
        if (getComputedStyle(document.getElementById('coin_description_box')).display == "none") {
            document.getElementById('coin_description_box').style.display = "block";
            document.getElementById('descr_preview_box').style.display = "none";
            document.getElementById('read_more_button').style.display = "none";
        }
        else {
            document.getElementById('coin_description_box').style.display = "none";
            document.getElementById('descr_preview_box').style.display = "block";
            document.getElementById('read_more_button').style.display = "block";
        }
    });
});    

let bg_page = chrome.extension.getBackgroundPage();
let coin_ticker = bg_page.coin_ticker.ticker;
if (coin_ticker != undefined) {
    let ticker = coin_ticker.replace(/[#$?!.,:]/g, "");
    display_coin_info("usd", ticker);
}

function display_coin_info(quote, ticker) {
    // fetches all available coins on CoinGecko
    fetch("https://api.coingecko.com/api/v3/coins/list")
    .then(response => response.json())
    .then(coin_list => { 
        // loops over coin list and checks if there is a coin with the ticker
        coin_list.forEach((coin) => {
            if (coin["symbol"] == ticker.toLowerCase()) {
                // if coin exists, gets info about coin
                fetch("https://api.coingecko.com/api/v3/coins/" + coin["id"]+ "?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false") 
                .then(response => response.json())
                .then(coin => { 
                    console.log(coin);
                    // creates all coin data elements in HTML
                    document.getElementById("coin_image").setAttribute("src", coin.image.large );
                    document.getElementById("coin_name").innerHTML = coin.name + " ";
                    document.getElementById("coin_ticker").innerHTML = coin.symbol;

                    // sets usd quote values
                    if (quote == "usd") {
                        document.getElementById("pair_switch").innerHTML = coin.symbol + "/btc";
                        if (coin.market_data.current_price.usd > 10000) {
                            document.getElementById("coin_current_price").innerHTML = "$" + coin.market_data.current_price.usd.toPrecision(3)/1000 + " K ";
                        }
                        else {
                            document.getElementById("coin_current_price").innerHTML = "$" + coin.market_data.current_price.usd.toPrecision(3);
                        }
                        if (coin.market_data.total_volume.usd > 1000000000) {
                            document.getElementById("coin_total_volume").innerHTML = "$" + (coin.market_data.total_volume.usd / 1000000000).toPrecision(3) + " B";
                        }
                        else if (coin.market_data.total_volume.usd > 1000000) {
                            document.getElementById("coin_total_volume").innerHTML = "$" + (coin.market_data.total_volume.usd / 1000000).toPrecision(3) + " M";
                        }
                        else {
                            document.getElementById("coin_total_volume").innerHTML = "$" + (coin.market_data.total_volume.usd / 1000).toPrecision(3) + " K";
                        }
                        if (coin.market_data.ath.usd > 10000) {
                            document.getElementById("coin_ath").innerHTML = "$" + coin.market_data.ath.usd.toPrecision(3)/1000 + " K ";
                        }
                        else {
                            document.getElementById("coin_ath").innerHTML = "$" + coin.market_data.ath.usd.toPrecision(3);
                        }
                        if (coin.market_data.atl.usd > 10000) {
                            document.getElementById("coin_atl").innerHTML = "$" + coin.market_data.atl.usd.toPrecision(3)/1000 + " K ";
                        }
                        else {
                            document.getElementById("coin_atl").innerHTML = "$" + coin.market_data.atl.usd.toPrecision(3);
                        }
                    }
                    // sets btc quote values
                    else {
                        document.getElementById("pair_switch").innerHTML = coin.symbol + "/usd";
                        document.getElementById("coin_current_price").innerHTML = "&#8383;" + coin.market_data.current_price.btc.toPrecision(3);
                        document.getElementById("coin_ath").innerHTML = "&#8383;" + coin.market_data.ath.btc.toPrecision(3);
                        document.getElementById("coin_atl").innerHTML = "&#8383;" + coin.market_data.atl.btc.toPrecision(3);
                        if (coin.market_data.total_volume.btc > 1000000) {
                            document.getElementById("coin_total_volume").innerHTML = "&#8383;" + (coin.market_data.total_volume.btc / 10000000).toPrecision(3) + " M";
                        }
                        else if (coin.market_data.total_volume.btc > 1000) {
                            document.getElementById("coin_total_volume").innerHTML = "&#8383;" + (coin.market_data.total_volume.btc / 1000).toPrecision(3) + " K";
                        }
                        else {
                            document.getElementById("coin_total_volume").innerHTML = "&#8383;" + (coin.market_data.total_volume.btc).toPrecision(3);
                        }
                    }
                    // sets other coin information
                    if (coin.market_data.market_cap.usd > 1000000000) {
                        document.getElementById("coin_mc").innerHTML = "$" +(coin.market_data.market_cap.usd / 1000000000).toPrecision(3) + " B " + " (" + coin.market_cap_rank + ")";
                    }
                    else {
                        document.getElementById("coin_mc").innerHTML = "$" +(coin.market_data.market_cap.usd / 1000000).toPrecision(3) + " M " + " (" + coin.market_cap_rank + ")";
                    }
                    
                    if (coin.market_data.circulating_supply > 1000000000) {
                        document.getElementById("coin_circ_supply_total").innerHTML = (coin.market_data.circulating_supply / 1000000000).toPrecision(3) + " B (" + (coin.market_data.total_supply /1000000000).toPrecision(3) + " B)";
                    }
                    else {
                        document.getElementById("coin_circ_supply_total").innerHTML = (coin.market_data.circulating_supply / 1000000).toPrecision(3) + " M (" + (coin.market_data.total_supply / 1000000).toPrecision(3) + " M)";
                    }
                    document.getElementById("coin_senti_up").innerHTML = coin.sentiment_votes_up_percentage.toPrecision(3) + "%";

                    // displays icons and sets website links if available
                    document.getElementById("coin_website").setAttribute("href", coin.links.homepage[0]);
                    document.getElementById("coin_coingecko").setAttribute("href", "https://www.coingecko.com/en/coins/" + coin.id);
                    let coin_twitter_handle = coin.links.twitter_screen_name;
                    let coin_telegram_handle = coin.links.telegram_channel_identifier;
                    let coin_block_explorer = coin.links.blockchain_site[0];

                    if (coin_twitter_handle.length != 0) {
                        document.getElementById("coin_twitter").setAttribute("href", "https://twitter.com/" + coin_twitter_handle);
                    }
                    else {
                        document.getElementById('coin_twitter').style.display = "none";
                    }
                    if (coin_telegram_handle.length != 0) {
                        document.getElementById("coin_telegram").setAttribute("href", "https://t.me/" + coin_telegram_handle);
                    }
                    else {
                        document.getElementById('coin_telegram').style.display = "none";
                    }
                    if (coin_block_explorer.length != 0) {
                        document.getElementById("coin_blockexplorer").setAttribute("href", coin_block_explorer);
                    }
                    else {
                        document.getElementById('coin_blockexplorer').style.display = "none";
                    }
                         
                    // sets coin description if available
                    if (coin.description.en.length != 0) {
                        document.getElementById("descr_preview").innerHTML = coin.description.en;
                        document.getElementById("coin_description").innerHTML = coin.description.en;
                        document.getElementById('read_more_button').style.display = "flex";
                    }
                    else {
                        document.getElementById("descr_preview").innerHTML = "No description available";
                        document.getElementById("coin_description").innerHTML = "No description available";
                        document.getElementById('read_more_button').style.display = "none";
                    }
                    
                    // sets right quote pair variables
                    let currency_symbol = "$";
                    let tooltip_decimals = 5;
                    if (quote == "btc") {
                        currency_symbol = "\u20BF";
                        tooltip_decimals = 8;
                    }

                    // gets coin history chart data
                    fetch("https://api.coingecko.com/api/v3/coins/" + coin["id"] + "/market_chart?vs_currency=" + quote + "&days=30&interval=daily")
                    .then(response => response.json())
                    .then(chart_data => {
                        // creates an empty array to store the paired data
                        let price_data_array = [];
                        price_data_array.push(['Date', currency_symbol])
                 
                        let min_tick = 0;
                        let max_tick = 0;
                        chart_data.prices.forEach(function (price_data) {
                            // stores min and max price value, (used for y-axis of graph)
                            if (min_tick > price_data[1]) {
                                min_tick = price_data[1].toPrecision(3);
                            }
                            if (max_tick < price_data[1]) {
                                max_tick = price_data[1].toPrecision(3);
                            }
                        
                            let dateObject = new Date(price_data[0]);
                            let date = dateObject.toLocaleString("en-US", {day: "numeric"}) + " " + dateObject.toLocaleString("en-US", {month: "long"}).substring(0, 3);

                            let data_pair = [date, price_data[1] ];
                            price_data_array.push(data_pair);
                        });
                        google.charts.load('current', {'packages':['corechart']});
                        google.charts.setOnLoadCallback(drawChart);

                        // draw chart
                        function drawChart() {
                            var data = google.visualization.arrayToDataTable(price_data_array);

                            min_tick *= 0.9;
                            max_tick *= 1.1;
                            let average_tick = (min_tick + max_tick) / 2;

                            var formatter = new google.visualization.NumberFormat( {
                                decimalSymbol: ',',
                                groupingSymbol: '.', 
                                negativeColor: 'red', 
                                negativeParens: true,
                                fractionDigits: [tooltip_decimals],
                            });
                                formatter.format(data, 1);
                            
                            var options = {
                                title: "Passed 30 days (" + currency_symbol + ")",
                                titlePosition: "out",
                                legend: {
                                    position: "none",
                                },
                                titleTextStyle: { 
                                    color: "#999999",
                                    fontName: "Segoe UI, Tahoma, sans-serif",
                                    fontSize: 10,
                                    bold: true,
                                    italic: false,
                                },
                                vAxis: {
                                    baselineColor: 'white',
                                    textPosition: 'in',
                                    format: '#,###.###########',
                                    ticks: [min_tick, average_tick, max_tick],
                                },
                                hAxis: {
                                    showTextEvery: 8,
                                    textPosition : 'in',
                                },
                                fontSize: "11",
                                chartArea: {
                                    top: 20,
                                    width: '91%', 
                                    height: '100%',
                                   
                                },
                                lineWidth: 1,
                                colors: ['#ff8a4f'],                                
                            }
                            var chart = new google.visualization.LineChart(document.getElementById('price_chart'));
                            
                            chart.draw(data, options);
                        }
                    }); 
                });
            }    
        });
    });   
}