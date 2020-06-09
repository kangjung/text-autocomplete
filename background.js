var funcToInject = function() {
    var sel, range, node;
    sel = window.getSelection();

    if (sel) {
        chrome.storage.local.get(sel.toString(), function (items) {
            if(!items[sel.toString()]){
                alert("없는 약어입니다.");
                return;
            }
            if (sel.getRangeAt && sel.rangeCount) {
                var text = items[sel.toString()];
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode( document.createTextNode(text) );
            }
        });
    }else if (document.selection && document.selection.createRange) {
        chrome.storage.local.get(document.selection.toString(), function (items) {
            if(!items[sel.toString()]){
                alert("없는 약어입니다.");
                return;
            }
            alert("document.selection && document.selection.createRange");
            document.selection.createRange().text = items[selection.toString()];
        });
    }
    return (selection.rangeCount > 0) ? selection.toString() : '';
};

var jsCodeStr = ';(' + funcToInject + ')();';

chrome.commands.onCommand.addListener(function(cmd) {
    if (cmd === 'selectedText') {
        chrome.tabs.executeScript({
            code: jsCodeStr,
            allFrames: true
        }, function(selectedTextPerFrame) {
            if (chrome.runtime.lastError) {
                alert('ERROR:\n' + chrome.runtime.lastError.message);
            }
        });
    }
});
