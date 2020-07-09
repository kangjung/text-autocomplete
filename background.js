var funcToInject = function() {

    var selection,before,after,input_text;
    const activeTextarea = document.activeElement;

    if( activeTextarea.tagName == "IFRAME" ){
        var iframedoc = activeTextarea.document;
        if (activeTextarea.contentDocument) {
            iframedoc = activeTextarea.contentDocument;
        } else if (activeTextarea.contentWindow) {
            iframedoc = activeTextarea.contentWindow.document;
        }
        if (iframedoc) {
            if (iframedoc.getSelection()) {
                selection = iframedoc.getSelection();

                var iframeSelection = iframedoc.getSelection().toString();
                if(iframeSelection != "") {
                    chrome.storage.local.get(iframeSelection, function (items) {
                        alert("text items " + items[iframeSelection]);
                        if (!items[iframeSelection]) {
                            alert("없는 약어입니다.");
                            return;
                        }
                        let oldText = selection.focusNode.parentElement.innerText;
                        start =selection.anchorOffset;
                        end = selection.focusOffset;
                        before = oldText.slice(0, start > end ? end : start);
                        after = oldText.slice(start < end ? end : start);
                        selection.focusNode.parentElement.innerText = before+items[iframeSelection]+after;
                    });
                }
                iframedoc.close();
                return;
            } else if (iframedoc.selection) {
                chrome.storage.local.get(iframedoc.selection.createRange().text, function (items) {
                    if(!items[iframedoc.selection.createRange().text]){
                        alert("없는 약어입니다.");
                        return;
                    }
                    let oldText = iframedoc.selection.createRange().focusNode.parentElement.innerText;
                    start =iframedoc.getSelection().anchorOffset;
                    end = iframedoc.getSelection().focusOffset;
                    before = oldText.slice(0, start > end ? end : start);
                    after = oldText.slice(start < end ? end : start);
                    iframedoc.selection.createRange().parentElement.innerText = before+items[iframedoc.selection.createRange().text]+after;
                    iframedoc.onfocus
                });
                iframedoc.close();
                return;
            }
            iframedoc.close();
        }
    } else if( activeTextarea.tagName == "INPUT" ||  activeTextarea.tagName == "TEXTAREA" ){
        var start = activeTextarea.selectionStart;
        var end = activeTextarea.selectionEnd;

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
    } /*else if(document.getSelection('div[contenteditable=true]')){
        var sel = document.getSelection();
        selection = sel.toString();
        chrome.storage.local.get(selection, function (items) {
            if(!items[selection]){
                alert("없는 약어입니다.");
                return;
            }
            var range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(items[selection]));
        });
    }*/
};

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
