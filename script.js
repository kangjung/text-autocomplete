function save () {
    var key = document.getElementById("abbreviation_text").value;
    var text = document.getElementById("full_text").value;

    chrome.storage.local.get(key, function(val) {
        if (typeof val[key] != 'string') val[key] = '';
        val[key] += text;
        chrome.storage.local.set(val);
        show();
    });
}
function show() {
    var textBody = document.getElementById('textBody');
    chrome.storage.local.get(null, function (items) {
        var allKeys = Object.keys(items);
        textBody.innerHTML = "";
        for(var i=0 ; i< allKeys.length ; i++ ) {
            var tr = document.createElement("tr");
            tr.innerHTML = "<td>" + allKeys[i] + "</td><td>" + items[allKeys[i]]  + "</td>";
            textBody.append(tr);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var btns = document.querySelectorAll('button');
    document.getElementById("saveBtn").addEventListener("click", function () {
        save();
    });
});

window.onload = show;