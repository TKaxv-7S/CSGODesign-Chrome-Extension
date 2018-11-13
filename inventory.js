const addButton = function(id) {

    let itemActions = $(".inventory_iteminfo").find(".item_desc_content").find(".item_desc_description").find("#iteminfo" + id + "_item_actions");
    let but = $(itemActions).find("a").first();
    let url = but.attr('href');
    if(typeof url != 'string' || url.indexOf('steam://rungame') == -1) {
        console.log("wrong link: " + url);
        return;
    }

    let match;
    if ((match = url.match(/[SM](\d+)A(\d+)D(\d+)$/))) {
        url = "https://csgodesign.com/?SaSuSi=chrome-extension&T=S&I=" + match[1] + "&A=" + match[2] + "&D=" + match[3];
    } else {
        console.log("Error incpecting: " + url);
    }

    let buttonText = document.createElement('span');
    switch ($(itemActions).find("a").find("span").first().text())
    {
        case '在游戏中检视...': buttonText.innerText = '一键生成检视图';break;
        case '在遊戲中檢視...': buttonText.innerText = '快照檢視圖';break;
        default: buttonText.innerText = 'Inspect via CSGO.Design';break;
    }

    let button = document.createElement('a');
    button.id = "inspectButton" + id;
    button.href = url;
    button.target = '_blank';
    button.classList.add('btn_grey_white_innerfade');
    button.classList.add('btn_small');
    button.classList.add('inspectbutton');
    $(itemActions).append(button);
    button.appendChild(buttonText);
};

$(document).ready(function() {
    $('#iteminfo1_item_icon').on('load', function() {
        addButton(1);
    });
    $('#iteminfo0_item_icon').on('load', function() {
        addButton(0);
    });
});

console.log('%cCSGO.Design Chrome Extension (beta v0.1) by %cKyle \"Kxnrl\" Frankiss . ', 'background: #000000;color: #ffffff', 'background: #000000;color: #7EBE45');
