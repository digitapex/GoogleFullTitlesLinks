// background script needed for urls which are http (mixed content)
// https://stackoverflow.com/a/7699773

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {  
        $.ajax({
            type: request.method,
            async: true,
            url: request.url,
            success: function(responseText, textStatus, xhr){
                callback(responseText);
            },
            complete: function(xhr, textStatus) {
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                callback();
            }
        });     
  
      return true;
    }
  });