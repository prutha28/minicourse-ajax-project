

var loadup = function(){
	console.log('Hello');
	
	
	console.log($zipcode);

};

// Global
var $display_area = $('#displayArea');
var $searchBtn = $('#searchBtn');


$(document).ready( function(){

	console.log('Inside the ready function');

	$('#searchBtn').submit(function(e){
		
		e.preventDefault();
		console.log('Inside the submit function');
		var zipcode = $('#zipcode').val();
		console.log(zipcode);

		// Collect the results

		// Update the display area with the data
		$display_area.html("heelo world!");

	});

	$display_area.html("heelo world!!!!!!!");
});

// window.onload = loadup();