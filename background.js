var funcToInject = function() {

    var selection,before,after,input_text
    const activeTextarea = document.activeElement;
    var start = activeTextarea.selectionStart;
    var end = activeTextarea.selectionEnd;

    if( activeTextarea.tagName == "IFRAME" ){
        var iframedoc = activeTextarea.document;
        if (activeTextarea.contentDocument) {
            iframedoc = activeTextarea.contentDocument;
        } else if (activeTextarea.contentWindow) {
            iframedoc = activeTextarea.contentWindow.document;
        }
        if ( iframedoc ) {

        }
    } else {
        input_text = activeTextarea.value;
        selection = input_text.slice(start, end);
        before = input_text.slice(0, start);
        after = input_text.slice(end);

        chrome.storage.local.get(selection.toString(), function (items) {
            if(!items[selection.toString()]){
                alert("없는 약어입니다.");
                return;
            }
            var text = items[selection.toString()];
            document.activeElement.value = before+text+after;
        });
    }

};
function getAncestorWithTagName(node, tagName) {
    tagName = tagName.toUpperCase();
    while (node) {
        if (node.nodeType == 1 && node.tagName.toUpperCase() == tagName) {
            return node;
        }
        node = node.parentNode;
    }
    return null;
}


chrome.commands.onCommand.addListener(function(cmd) {
    if (cmd === 'selectedText') {
        chrome.tabs.executeScript({
            code: ';(' + funcToInject + ')();',
            allFrames: true
        }, function(selectedTextPerFrame) {
            if (chrome.runtime.lastError) {
                alert('ERROR:\n' + chrome.runtime.lastError.message);
            }
        });
    }
});
