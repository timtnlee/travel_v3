var origins=[];
distance_service=new google.maps.DistanceMatrixService();
GoToPlan();


function callback(response, status) {
  // See Parsing the Results for
  // the basics of a callback function.
}
function GoToPlan(){
	$('#plan').on('click',function(){
		$(this).css('opacity','0.7');
		$('#mapInfo').animate({left:'23vw'});
		$('#planDistance').animate({left:'50vw'});
		Distance();
	})
	$('#distanceGoback').on('click',function(){
		$('#plan').css('opacity','1');
		$('#mapInfo').animate({left:'50vw'});
		$('#planDistance').animate({left:'77vw'});
	})
}
function Distance(){
	for (var i = 0; i < my_list.length; i++) {
		if(my_list[i]!='')
			origins.push(my_list[i].geometry.location);
	}
	
}
function deleteMarkers(){

}