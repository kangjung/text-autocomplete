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
                if(iframedoc.getSelection() != "") {
                    chrome.storage.local.get(iframedoc.getSelection().toString(), function (items) {
                        alert("text items " + items[iframedoc.getSelection().toString()]);
                        if (!items[iframedoc.getSelection().toString()]) {
                            alert("없는 약어입니다.");
                            return;
                        }
                        let oldText = iframedoc.getSelection().focusNode.parentElement.innerText;
                        start =iframedoc.getSelection().anchorOffset;
                        end = iframedoc.getSelection().focusOffset;
                        before = oldText.slice(0, start > end ? end : start);
                        after = oldText.slice(start < end ? end : start);
                        iframedoc.getSelection().focusNode.parentElement.innerText = before+items[iframedoc.getSelection().toString()]+after;
                    });
                }
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
            }
            iframedoc.close();
        }
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
    } else {

        var sel = document.getSelection();
        chrome.storage.local.get(sel.toString(), function (items) {
            if(!items[sel.toString()]){
                alert("없는 약어입니다.");
                return;
            }
        });
    }
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
