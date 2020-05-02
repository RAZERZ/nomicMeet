window.addEventListener("load", () => {
    chrome.storage.sync.get("toggleState", (response) => {currentState(response.toggleState)});
    chrome.storage.onChanged.addListener((changes) => {
        currentState(changes.toggleState.newValue);
    });
});

currentState = (bool) => {
    let spanElement = document.getElementsByTagName("span")[0];
    if(bool) {
        spanElement.innerText = "active";
        spanElement.style.color = "#34e234";
    }
    else {
        spanElement.innerText = "inactive";
        spanElement.style.color = "red";
    }
};

isInACall = () => {
    let isInACallBool;
    let appEl = document.getElementById("app");
    if(appEl == null || appEl.children.length == 0) {
        isInACallBool = false;
    }
    else {
        isInACallBool = true;
    }
    return isInACallBool;
};

addScript = () => {
    let hasTooltipEl = document.querySelectorAll("[data-tooltip]");
    let tooltipElIndex;
    for(let i = 0; i < hasTooltipEl.length; i++) {
        if(hasTooltipEl[i].getAttribute("data-tooltip").includes("ctrl + d")){tooltipElIndex = i;}
    }

    window.addEventListener("blur", blur = () => {
        if(hasTooltipEl[tooltipElIndex].getAttribute("data-is-muted") == "false") {
            hasTooltipEl[tooltipElIndex].click();
        }
    });
    window.addEventListener("focus", focus = () =>{
        if(hasTooltipEl[tooltipElIndex].getAttribute("data-is-muted") == "true") {
            hasTooltipEl[tooltipElIndex].click();
        }
    });
};

removeScript = () => {
    window.removeEventListener("blur", blur);
    window.removeEventListener("focus", focus);
};

executeScripts = () => {
    chrome.tabs.executeScript({code:'(' + isInACall + ')();'}, (inACall) =>{
        if(inACall[0]) {
            chrome.storage.sync.get("toggleState", (boolean) => {
                console.log(boolean.toggleState);
                if (boolean.toggleState) {
                    chrome.tabs.executeScript({code: '(' + removeScript + ')();'});
                    chrome.storage.sync.set({toggleState: 0});
                } else {
                    chrome.tabs.executeScript({code: '(' + addScript + ')();'});
                    chrome.storage.sync.set({toggleState: 1});
                }
            });
        }
        else {
            document.getElementsByClassName("inACall")[0].innerText = "Enter a call first";
        }

    });
};

document.getElementsByTagName("button")[0].addEventListener("click", ()=> {executeScripts()});