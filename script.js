function save () {
    var key = document.getElementById("abbreviation_text").value;
    var text = document.getElementById("full_text").value;

    chrome.storage.local.get(key, function(val) {
        if(val[key]){
            if(confirm("저장된 약어가 있습니다. 덮어쓰시겠습니까?")){
                val[key] = text;
                chrome.storage.local.remove(key);
                chrome.storage.local.set(val);
            }
        } else {
            val[key] = text;
            chrome.storage.local.set(val);
        }
        show();
    });
}
function remove() {
    var key = "";
    var size = document.getElementsByName("checkKey").length;

    for(var i = 0; i < size; i++) {
        alert(document.getElementsByName("checkKey")[i].value);
        if(document.getElementsByName("checkKey")[i].checked) {
            key  = document.getElementsByName("checkKey")[i].value ;
            break;
        }
    }
    alert("KEY  " + key);
    if(key) {
        chrome.storage.local.remove(key);
        show();
    } else {
        alert("삭제할 약어를 선택하세요.");
    }
}
function show() {
    var textBody = document.getElementById('textBody');
    chrome.storage.local.get(null, function (items) {
        var allKeys = Object.keys(items);
        textBody.innerHTML = "";
        for(var i=0 ; i< allKeys.length ; i++ ) {
            var tr = document.createElement("tr");
            tr.innerHTML = "<td><input type='radio' name='checkKey' value='"+allKeys[i]+"' /></td><td>" + allKeys[i] + "</td><td>" + items[allKeys[i]]  + "</td>";
            textBody.append(tr);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("saveBtn").addEventListener("click", function () {
        save();
    });
    document.getElementById("removeBtn").addEventListener("click", function () {
        remove();
    });
});

window.onload = show;