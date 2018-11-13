let intervalTimer;
let steamListingInfo = {};
let listingInfoPromises = [];

// retrieve g_rgListingInfo from page script
window.addEventListener('message', (e) => {
    if (e.data.type == 'listingInfo') {
        steamListingInfo = e.data.listingInfo;

        // resolve listingInfoPromises
        for (let promise of listingInfoPromises) promise(steamListingInfo);

        listingInfoPromises = [];
    }
});

const retrieveListingInfoFromPage = function(listingId) {
    if (listingId != null && (listingId in steamListingInfo)) {
        return Promise.resolve(steamListingInfo);
    }

    window.postMessage({
        type: 'requestListingInfo'
    }, '*');

    return new Promise((resolve, reject) => {
        listingInfoPromises.push(resolve);
    });
};

const inspectButton_OnClicked = function(e) {
    let id = e.currentTarget.id.replace('inspect_', '');

    retrieveListingInfoFromPage(id)
    .then((steamListingData) => {
        let listingData = steamListingData[id];

        if (!listingData) return;

        let inspectLink = listingData.asset.market_actions[0].link
        .replace('%listingid%', id)
        .replace('%assetid%', listingData.asset.id);

        let match;
        if (typeof inspectLink === 'string' && (match = inspectLink.match(/[SM](\d+)A(\d+)D(\d+)$/))) {
            window.open("https://csgodesign.com/?SaSuSi=chrome-extension&T=M&I=" + match[1] + "&A=" + match[2] + "&D=" + match[3], "_blank");
        } else {
            console.log("Error incpecting: " + inspectLink);
        }
    });
};

const addButtons = function() {
    // Iterate through each item on the page
    let listingRows = document.querySelectorAll('#searchResultsRows .market_listing_row.market_recent_listing_row');

    for (let row of listingRows) {
        let id = row.id.replace('listing_', '');

        let field = document.getElementById(row.id).getElementsByClassName('market_listing_price_listings_block')[0].getElementsByClassName('market_listing_right_cell market_listing_action_buttons')[0].getElementsByClassName('market_listing_buy_button')[0];
 
        if (field.querySelector(`#inspect_${id}`)) { continue; }

        let buy = field.getElementsByClassName('item_market_action_button btn_green_white_innerfade btn_small')[0];
        let val = buy.getElementsByTagName('span')[0];
        
        let bar = document.createElement('a');
        bar.innerHTML = "&nbsp;";
        field.insertBefore(bar, buy);

        let br = document.createElement('br');
        field.appendChild(br);

        let buttonText = document.createElement('span');
        switch (val.innerText)
        {
            case '立即购买': buttonText.innerText = '立即检视';break;
            case '立即購買': buttonText.innerText = '立即檢視';break;
            default: buttonText.innerText = 'Inspect Now';break;
        }

        let button = document.createElement('a');
        button.id = 'inspect_' + id;
        button.classList.add('item_market_action_button');
        button.classList.add('btn_green_white_innerfade');
        button.classList.add('btn_small');
        button.classList.add('inspectbutton');
        button.addEventListener('click', inspectButton_OnClicked);
        field.appendChild(button);

        button.appendChild(buttonText);
    }
};

// register the message listener in the page scope
let script = document.createElement('script');
script.innerText = `
    window.addEventListener('message', (e) => {
        if (e.data.type == 'requestListingInfo') {
            window.postMessage({
                type: 'listingInfo',
                listingInfo: g_rgListingInfo
            }, '*');
        }
    });
`;
document.head.appendChild(script);

intervalTimer = setInterval(() => { addButtons(); }, 100);

console.log('%cCSGO.Design Chrome Extension (beta v0.1) by %cKyle \"Kxnrl\" Frankiss . ', 'background: #000000;color: #ffffff', 'background: #000000;color: #7EBE45');
