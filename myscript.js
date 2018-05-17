var resultUrlElements = document.getElementsByClassName("iUh30");

var resultTitleElements = document.querySelectorAll("div.rc .r");

var dates = document.getElementsByClassName("G1Rrjc");
for(i=0; i<dates.length; i++){
	dates[i].style.whiteSpace = "nowrap";
}

// sublinks, such as for stackoverflow, quora
var sublinkElements = document.getElementsByClassName("i4vd5e");


for (i = 0; i < resultTitleElements.length; i++) {
	var originalTitleText = resultTitleElements[i].getElementsByTagName("a")[0].innerText;

	resultTitleElements[i].style.whiteSpace = "normal";
	resultTitleElements[i].parentElement.querySelector(".iUh30").innerHTML = resultTitleElements[i].getElementsByTagName("a")[0];
	
	var title = resultTitleElements[i];
	var urlElement = title.getElementsByTagName("a")[0];
	var urlLink = title.getElementsByTagName("a")[0].href;
	sendToBackground(urlLink, urlElement, originalTitleText);	
}

for (i=0; i<sublinkElements.length; i++){
	var originalTitleElement = sublinkElements[i].querySelector(".fl");	
	if (originalTitleElement == null){
		continue;
	}
	var originalTitleText = originalTitleElement.innerText;
	var sublinkUrlElement = sublinkElements[i].querySelector(".fl");
	var sublinkUrlLink = sublinkElements[i].querySelector(".fl").href;
	sendToBackground(sublinkUrlLink, sublinkUrlElement, originalTitleText);
}



function sendToBackground(urlLink, urlElement, originalTitle)
{
	chrome.runtime.sendMessage({
		method: 'GET',
		action: 'xhttp',
		url: urlLink
	}, function(responseText) {
		var htmlObject = document.createElement('div');

		// some pages have autoplay videos and then when we create an element with such html, the audio plays in the background in Chrome (on the search results page!)
		responseText = responseText.replace(/autoplay/g, "");
		responseText = responseText.replace(/video/g, "");
		responseText = responseText.replace(/script/g, "");

		//some pages have scripts that redirect with window.location, with the consequence of opening the page in the google search results without the user doing anything
		responseText = responseText.replace(/window.location/g, "");
		
		htmlObject.innerHTML = responseText;
        var fullTitle = htmlObject.getElementsByTagName("title")[0].innerText;

		// if the original title is longer, it's probably more descriptive, so don't change it (for some sites Google puts as a title something else that isn't from <title>, and it depends on each site, so this is a rough all-encompasing solution)
		if (originalTitle.length > fullTitle.length) {
			return;
		}
		fullTitle = fullTitle.trim();

		// remove new lines because some pages have <br> inside <title>
		fullTitle = fullTitle.replace(/(\r\n\t|\n|\r\t)/gm,"");
		urlElement.innerText = fullTitle;
	}); 
}