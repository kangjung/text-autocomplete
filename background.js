var funcToInject = function() {
    var selection = window.getSelection();
    return (selection.rangeCount > 0) ? selection.toString() : '';
};

var jsCodeStr = ';(' + funcToInject + ')();';


function replace(text) {

}

chrome.commands.onCommand.addListener(function(cmd) {
    if (cmd === 'selectedText') {
        chrome.tabs.executeScript({
            code: jsCodeStr,
            allFrames: true
        }, function(selectedTextPerFrame) {
            if (chrome.runtime.lastError) {
                alert('ERROR:\n' + chrome.runtime.lastError.message);
            } else if ((selectedTextPerFrame.length > 0) && (typeof(selectedTextPerFrame[0]) === 'string')) {
                var keys = [selectedTextPerFrame[0]];
                chrome.storage.local.get(selectedTextPerFrame[0], function (items) {
                    replace(items[keys]);
                });
            }
        });
    }
});
