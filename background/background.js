chrome.runtime.onInstalled.addListener(() => {

    //Make extension only run on meet.google.com
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            {conditions:[new chrome.declarativeContent.PageStateMatcher({pageUrl:{hostEquals:'meet.google.com'}})], actions: [new chrome.declarativeContent.ShowPageAction()]}
        ]);
    });

});