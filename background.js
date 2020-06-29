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
                        iframedoc.body.innerHTML = iframedoc.body.innerHTML.replace(iframedoc.getSelection().toString(),items[iframedoc.getSelection().toString()]);
                        /*
                        iframedoc.contents().text($(this).text().replace('Password','Name:'));*/
                        // iframedoc.writeln(items[iframedoc.getSelection().toString()]);
/*                        var sText = iframedoc.selection.createRange();
                        sText = iframedoc.getSelection();
                        myTag = textEditor.document.createElement("div");
                        myTag.setAttribute("text", items[iframedoc.getSelection().toString()]);
                        sText.getRangeAt(0).surroundContents(myTag);*/

                        iframedoc.close();

                    });
                }
            } else if (iframedoc.selection) {
                chrome.storage.local.get(iframedoc.selection.createRange().text, function (items) {
                    if(!items[iframedoc.selection.createRange().text]){
                        alert("없는 약어입니다.");
                        return;
                    }
                    var text = items[iframedoc.selection.createRange().text];

                    var sText=iframedoc.selection.createRange();
                    sText.innerText = text;
                    var temp=sText.parentElement().innerHTML;
                    var newNode=iframedoc.createElement("h1");
                    var replacement=sText.parentElement().replaceNode(newNode);
                    newNode.innerHTML=temp;

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
    } else if( activeTextarea.tagName == "INPUT" ){
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
