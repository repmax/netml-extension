/*
Each entry is saved with the twitter handle as a key, so that multiple
additions of the same profile overwrites eachother and do not produce
duplicates. Another advantage is that the latest entries can easily be 
deleted using the key.
*/

let pageHandle = "";
let pageNetml = "";

async function textToClipboard(text) {
    await navigator.clipboard.writeText(text);
}

function textToClipboard_wrapper() {
    textToClipboard(pageNetml);
}

function saveToStack() {
  chrome.storage.sync.get(["twitter2netml"]).then((result) => {
      result.twitter2netml[pageHandle] = pageNetml;
      chrome.storage.sync.set({
          twitter2netml: result.twitter2netml
      })
  });
}

function removeLatest() {
    chrome.storage.sync.get(["twitter2netml"]).then((result) => {
        delete result.twitter2netml[pageHandle];
        chrome.storage.sync.set({
            twitter2netml: result.twitter2netml
        })
    });
}

function printStack() {
    chrome.storage.sync.get("twitter2netml").then((result) => {
        let allNetml = Object.values(result.twitter2netml).reduce((acc, cur) => acc + cur + "\n\n", "");
        textToClipboard(allNetml);
    });
}

function clearStack() {
    chrome.storage.sync.set({
        twitter2netml: {}
    });
}

function closeWindow() {
    window.close();
}

/* in a chrome extension some javascripts commands can not be inline */
document.getElementById("remove").addEventListener('click', removeLatest);
document.getElementById("copy").addEventListener('click', textToClipboard_wrapper);
document.getElementById("close").addEventListener('click', closeWindow);
document.getElementById("print").addEventListener('click', printStack);
document.getElementById("clear").addEventListener('click', clearStack);

const search = () => {
    var result = "";
    const user = document.querySelector("[data-testid=UserName]").innerText;
    const userArray = user.split(/\r?\n/);
    result += userArray[0];
    const twitterhandle = userArray[1].substring(1);
    result += "; x" + twitterhandle;
    const userDescRaw = document.querySelector("[data-testid=UserDescription]").innerText;
    result += "; " + userDescRaw.replace(/\||\n|\r/g, ' - ').replace(/  |;/g, ' ');
    result += " | tw:" + twitterhandle;
    const userUrl = document.querySelector("[data-testid=UserUrl]").innerText;
    if (userUrl) {
        result += " ww:" + userUrl;
    }
    return {
        handle: twitterhandle,
        netml: result
    };
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, {
            oldValue,
            newValue
        }] of Object.entries(changes)) {
        if (key === "twitter2netml") {
            document.getElementById("counter").innerText = Object.keys(newValue).length;
        }
    }
});

chrome.storage.sync.get(["twitter2netml"]).then((result) => {
    if (typeof result.twitter2netml != "undefined") {
        document.getElementById("counter").innerText = Object.keys(result.twitter2netml).length;
    } else {
        chrome.storage.sync.set({
            twitter2netml: {}
        });
    }
});

chrome.tabs.query({
    active: true,
    currentWindow: true
}, (tabs) => {
    chrome.scripting.executeScript({
        target: {
            tabId: tabs[0].id
        },
        func: search
    }, (result) => {
        if (typeof result[0].result != "undefined") {
            pageHandle = result[0].result.handle;
            pageNetml = result[0].result.netml;
            document.getElementById("netml").innerText = result[0].result.netml;
            document.getElementById("greeting").style.visibility = "visible";
            document.getElementById("copy").style.visibility = "visible";
            saveToStack();
        }
    });
});