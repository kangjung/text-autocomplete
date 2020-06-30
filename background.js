var funcToInject = function() {

    var selection,before,after,input_text;
    const activeTextarea = document.activeElement;
    if(activeTextarea){

    }
    var start = activeTextarea.selectionStart;
    var end = activeTextarea.selectionEnd;

    if( activeTextarea.tagName == "IFRAME" ){
        var iframedoc = activeTextarea.document;
        if (activeTextarea.contentDocument) {
            iframedoc = activeTextarea.contentDocument;
        } else if (activeTextarea.contentWindow) {
            iframedoc = activeTextarea.contentWindow.document;
        }
        if (iframedoc) {
            if (iframedoc.getSelection) {
                // alert(iframedoc.getSelection().toString());
                if(iframedoc.getSelection().toString() != "") {
                    chrome.storage.local.get(iframedoc.getSelection().toString(), function (items) {
                        alert("text items " + items[iframedoc.getSelection().toString()]);
                        if (!items[iframedoc.getSelection().toString()]) {
                            alert("없는 약어입니다.");
                            return;
                        }

                        var text = items[iframedoc.getSelection().toString()];
                        let newNode = document.createElement('u');
                        newNode.innerHTML = items[iframedoc.getSelection().toString()];

                        let oldText = iframedoc.getSelection().focusNode.textContent;
                        before = oldText.slice(0, iframedoc.getSelection().anchorOffset);
                        after = oldText.slice(iframedoc.getSelection().focusOffset);

                        alert(before+text+after);
                    });
                }
            } else if (iframedoc.selection) {
                chrome.storage.local.get(iframedoc.selection.createRange().text, function (items) {
                    if(!items[iframedoc.selection.createRange().text]){
                        alert("없는 약어입니다.");
                        return;
                    }
                    var text = items[iframedoc.selection.createRange().text];
                });
            }

        }
        // if ( iframedoc ) {
        //
        //     var range = iframedoc.createRange();
        //     range.setStart(iframedoc.body.firstChild, start);
        //     range.setEnd(iframedoc.body.firstChild, end);
        //     var selection = iframedoc.getSelection();
        //     selection.removeAllRanges();
        //     selection.addRange(range);
        // }
    } else if( activeTextarea.tagName == "INPUT" ||  activeTextarea.tagName == "TEXTAREA" ){
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
