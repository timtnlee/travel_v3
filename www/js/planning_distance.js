var waypoints=[],
	start,
	end,
	directionsDisplay,
	directions;
GoToPlan();

function moving(step){
	var h=window.innerHeight,
		w=window.innerWidth;
	var response=function(){
		if(h>w||w<=500)
			return 'h';
		return 'w';
	}
	var gotoplan=function(){
		console.log(response);
		$('#plan').css('opacity','0.7');
		if(response()=='w'){		
			console.log('w');
			$('#mapInfo').animate({left:'23vw'});
			$('#planDistance').animate({left:'50vw'});
		}
		else{
			$('#mapInfo').animate({left:'-100vw'});
			$('#planDistance').animate({left:'0vw'});
		}
	}
	var gobacksearch=function(){
		$('#plan').css('opacity','1');
		if(response()=='w'){
			$('#mapInfo').animate({left:'50vw'});
			$('#planDistance').animate({left:'77vw'});
		}
		else{
			$('#mapInfo').animate({left:'0vw'});
			$('#planDistance').animate({left:'100vw'});
		}
	}

	if(step=='gotoplan')
		gotoplan();
	else
		gobacksearch();	
}

function GoToPlan(){
	$('#plan').on('click',function(){
		if($('#schedule').find('.list_con').length>=3){
			HideMarker();
			//HideListMarker();
			CleanDisplay();
			FindList();	
			moving('gotoplan');
			block();
			Directions();
		}		
	});
	$('#distanceGoback').on('click',function(){
		ShowMarker();
		moving('gobacksearch');
		//ShowListMarker();
		HideDisplay();
	})
}
function initWaypoints(){
	start=end='';
	waypoints=[];
	document.getElementById('output').innerHTML='';
}
function FindList(){
	initWaypoints();
	var max=$('#schedule').find('.list_con').length-1;
	console.log('length:'+max);
	$('#schedule').find('.list_con').each(function(index){
		console.log('index:'+index);
		if(index!=0){
			var id=$(this).find('p').attr('id'),
				location=my_list[id].geometry.location;
			if(index==1)
				start=location;
			else if(index==max)
				end=location;
			else
				waypoints.push({location:location,stopover:true});
		}
	})
}
function ShowListMarker(){
	$('#schedule').find('.list_con').each(function(index){
		if(index!=0){
			var id=$(this).find('p').attr('id');
			if(list_marker[id])list_marker[id].setMap(map);
		}
	});
}
function Directions(){
	directions=new google.maps.DirectionsService();
	directionsDisplay= new google.maps.DirectionsRenderer({
		map:map
	});
	directionsDisplay.setPanel(document.getElementById('output'));
	var request={
		origin:start,
  		destination:end,
  		waypoints:waypoints,
  		optimizeWaypoints: true,
  		travelMode:'DRIVING'
	}
	directions.route(request,function(result, status){
		callback(result, status);
	});
}
function callback(result, status,display) {
 if(status=='OK'){		
 	 directionsDisplay.setDirections(result);
 	 close_block();
 	}
}
function CleanDisplay(){
	if(directionsDisplay)
	directionsDisplay.setMap(null);
	directionsDisplay='';
}
function HideDisplay(){
	if(directionsDisplay)
	directionsDisplay.setMap(null);
}