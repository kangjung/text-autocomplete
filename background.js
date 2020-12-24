var funcToInject = function() {

    var selection,before,after,input_text;
    const activeTextarea = document.activeElement;

    var tagName =  activeTextarea.tagName.toString();

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

                start =selection.anchorOffset;
                end = selection.focusOffset;

                var range = selection.getRangeAt(0);

                // let innerText = selection.focusNode.parentElement.innerText;
                var innerText = range.commonAncestorContainer.textContent;

                if(start == end){
                    var j=0;
                    do {
                        start--;
                        if(innerText.slice(start, end-j) == " "){
                            start++;
                            alert(innerText.slice(start,end));
                            iframeSelection = innerText.slice(start,end);
                            break;
                        } else if(start == 0){
                            iframeSelection = innerText.slice(start,end);
                            break;
                        }
                        j++;
                    } while (start > 0);
                }
                if(iframeSelection != "") {
                    chrome.storage.local.get(iframeSelection, function (items) {
                        if (!items[iframeSelection]) {
                            alert("없는 약어입니다.");
                            return tagName;
                        }
                        before = innerText.slice(0, start > end ? end : start);
                        after = innerText.slice(start < end ? end : start);
                        range.commonAncestorContainer.textContent = before+items[iframeSelection]+after;
                    });
                }
                iframedoc.close();
            } else if (iframedoc.selection) {
                alert(iframedoc.selection);
                chrome.storage.local.get(iframedoc.selection.createRange().text, function (items) {
                    if(!items[iframedoc.selection.createRange().text]){
                        alert("없는 약어입니다.");
                        return tagName;
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
            }
            iframedoc.close();
        }
    } else if( activeTextarea.tagName == "INPUT" ||  activeTextarea.tagName == "TEXTAREA" ){

        var start = activeTextarea.selectionStart;
        var end = activeTextarea.selectionEnd;
        input_text = activeTextarea.value;
        if(start == end){
            var j=0;
            do {
                start--;
                if(input_text.slice(start, end-j) == " "){
                    start++;
                    break;
                }
                j++;
            } while (start > 0);
        }
        selection = input_text.slice(start, end);
        before = input_text.slice(0, start);
        after = input_text.slice(end);

        chrome.storage.local.get(selection.toString(), function (items) {
            if(!items[selection.toString()]){
                alert("없는 약어입니다.");
                return tagName;
            }
            var text = items[selection.toString()];
            document.activeElement.value = before+text+after;

            return tagName;
        });
    }
};
chrome.commands.onCommand.addListener(function(cmd) {
    if (cmd === 'selectedText') {
        chrome.tabs.executeScript({
            code: ';(' + funcToInject + ')();',
            allFrames: false
        }, function(selectedTextPerFrame) {
            if (chrome.runtime.lastError) {
                alert('ERROR:\n' + chrome.runtime.lastError.message);
            }
        });
    }
});
