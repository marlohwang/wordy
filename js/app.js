// Create app namespace to hold all methods
var app = {};

app.titleTriggered = false;

// Collect user input
app.collectInfo = function() {

	$('form.search').on('submit', function(e){
		e.preventDefault();

		$('summary #clearthis').empty();
		app.titleTriggered = false;	
		// now we need to get entered input by user
		app.words = $(this).find('input[type=search]').val();

		// pass that input value to the methods
		// This when method takes ajax calls and when they are all done
		// it will call a .then method and pass in the the data
		// in the order of the calls

		$.when( app.dictionary(), app.synonyms(), app.sentence() ).then(function(dictionary, synonyms, sentence) {
			app.displayResult(dictionary, synonyms, sentence);
		});

		// app.dictionary();
		// app.synonyms();
		// app.sentence();

		// clear search value each time user enters query
		$(this).find('input[type=search]').val('');
		$('#clearthis').empty();
		$('#clearthistoo').empty();
	});

};

// Make AJAX request with user inputted data

app.dictionary = function() {
	return $.ajax({
		url: "https://wordsapiv1.p.mashape.com/words/" + app.words +  "/definitions",
		type: "GET",
		dataType: "json",
		headers: {
			'X-Mashape-key' : 'ev6E14CtS2mshV14OZLmkpS8jubJp1ME9wvjsnNMgBLMEAM7j7',
			'Accept' : 'application/json'
		}
	});
};

app.synonyms = function() {
		return $.ajax({
			url: "https://wordsapiv1.p.mashape.com/words/" + app.words +  "/synonyms",
			type: "GET",
			dataType: "json",
			headers: {
				'X-Mashape-key' : 'ev6E14CtS2mshV14OZLmkpS8jubJp1ME9wvjsnNMgBLMEAM7j7',
				'Accept' : 'application/json'
			}
		});
};

app.sentence = function() {
	return $.ajax({
		url: "https://wordsapiv1.p.mashape.com/words/" + app.words +  "/examples",
		type: "GET",
		dataType: "json",
		headers: {
			'X-Mashape-key' : 'ev6E14CtS2mshV14OZLmkpS8jubJp1ME9wvjsnNMgBLMEAM7j7',
			'Accept' : 'application/json'
		}
	});
};

// Display data on the page
app.displayResult = function(dic, syn, sen) {

	//if result is undefined show etc. ... 

	var title =  '<h3 class="wordDefine">' + app.words + '</h3>';
	var paragraph = '<p id="clearthis"> <span class="category">definition: </span>' + dic[0].definitions[0].definition + '</p>';
	var synonyms = '<p id="clearthis"> <span class="category">synonym(s): </span>' + syn[0].synonyms[0] +'</p>';
	var example = '<p id="clearthis"> <span class="category">example: </span>' + sen[0].examples[0] +'</p>';

	$('article').append(title);
	$('summary').append(paragraph);
	$('summary').append(synonyms);
	$('summary').append(example);

 // retrieve a background colour from the search word via colourLovers
    
  $.getJSON("http://www.colourlovers.com/api/colors?keywords=" + app.words + "&keywordExact=1&numResults=1&jsonCallback=?", function(data) {
    	var element = data[Math.floor(Math.random()*1)];

    	$('body').fadeTo('slow', 0.8, function(){
   		 $(this).css('background-image', 'url('+ element.imageUrl +')');}).fadeTo('slow', 1);

    // 	$('body').delay(5000).queue(function(){
	   //  	$(this).css({"background-image": "url("+ element.imageUrl +")"});
	  	// });
    });
};

// Start app
app.init = function() {
	app.collectInfo();
}

$(function() {
	app.init();
});