var waypoints=[],
	// start,
	// end,
	directionsDisplay=[],
	directions=[];
GoToPlan();//規劃路現 返回 click

function moving(step){
	var h=window.innerHeight,
		w=window.innerWidth;
	var response=function(){
		if(h>w||w<=500)
			return 'h';
		return 'w';
	}
	var gotoplan=function(){
		$('#plan').css('opacity','0.7');		
			$('#mapInfo').css('zIndex','0').animate({opacity:'0'});
			$('#planDistance').css('zIndex','10').animate({opacity:'0.95'});
	}
	var gobacksearch=function(){
		$('#plan').css('opacity','1');
			$('#mapInfo').css('zIndex','10').animate({opacity:'0.95'});
			$('#planDistance').css('zIndex','0').animate({opacity:'0'});
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
			//FindList();	
			moving('gotoplan');
			//block();
			BuildPage();
		}	
		else{
			alert('請選擇兩個以上地點')
		}	
	});
	$('#distanceGoback').on('click',function(){
		ShowMarker();
		moving('gobacksearch');
		//ShowListMarker();
		HideDisplay();
	})
}
function BuildPage(){
	$('#output').empty();
	var length=$('#schedule').find('.list_con').length-1;
		prevId='',
		displayCount=0;
	$('#schedule').find('.list_con').each(function(index){
		var id=$(this).find('p').attr('id');
		if(index!=0){
			if(index!=1){
			directionsDisplay[displayCount]= new google.maps.DirectionsRenderer({
				map:map
			});
			directions[displayCount]=new google.maps.DirectionsService();
			Directions(directions[displayCount],
				my_list[prevId].geometry.location,
				my_list[id].geometry.location,
				prevId,
				directionsDisplay[displayCount]);	
			}			
			$('#output')
				.append('<div id="displayCount'+displayCount+'"><h4 id="distance'+id+'">'
					+my_list[id].name
				+'</h4></div><div></div>');
			prevId=id;
			displayCount++;
		}		
	})
}

// function initWaypoints(){
// 	start=end='';
// 	waypoints=[];
// 	document.getElementById('output').innerHTML='';
// }
// function FindList(){
// 	initWaypoints();
// 	var max=$('#schedule').find('.list_con').length-1;
// 	console.log('length:'+max);
// 	$('#schedule').find('.list_con').each(function(index){
// 		console.log('index:'+index);
// 		if(index!=0){
// 			var id=$(this).find('p').attr('id'),
// 				location=my_list[id].geometry.location;
// 			if(index==1)
// 				start=location;
// 			else if(index==max)
// 				end=location;
// 			else
// 				waypoints.push({location:location,stopover:true});
// 		}
// 	})
// }
// function ShowListMarker(){
	
// 	$('#schedule').find('.list_con').each(function(index){
// 		if(index!=0){
// 			var id=$(this).find('p').attr('id');
// 			if(list_marker[id])
// 				list_marker[id].setMap(map);
// 		}
// 	});
// }
function Directions(directions,start,end,id,display){
	display.setOptions( { suppressMarkers: true });
	var request={
		origin:start,
  		destination:end,
  		//waypoints:waypoints,
  		optimizeWaypoints: true,
  		travelMode:'DRIVING'
	}
	directions.route(request,function(result, status){
		callback(result, status,id,display);
	});
}
function callback(result, status,id,display) {
 if(status=='OK'){		
 	var instruct='';
 	var area=$('#output').find('#distance'+id).parent().next();
 	for (var i = 0; i < result.routes[0].legs[0].steps.length; i++) {
 		instruct+=result.routes[0].legs[0].steps[i].instructions+'<br>';
 	}
 	var info='<a class="travelMode" key="DRIVING">汽車</a>'
 		+'<a class="travelMode" key="BICYCLING">機車</a>'
 		+'<a class="travelMode" key="WALKING">走路</a><br>'
 		+result.routes[0].legs[0].distance.text+'<br>'+result.routes[0].legs[0].duration.text
 		+'<br><a class="openInstruc">詳細資訊</a>'
 		+'<div class="instruc" >'+instruct+'<div>';
 	area.append(info);

 	display.setDirections(result);

 	area.find('.openInstruc').click(function(){//openInstruc
 		$(this).next().css('display','block');
 	})
 	area.find('.travelMode').click(function(){//travelMode
 		var id=$(this).parent().prev().attr('id'),
 			count=id.replace ( /[^\d.]/g, '' );
 			//....
 	})
 	
 	close_block();
 	}
}
function ChangeMode(count){
	directions.set
}
function CleanDisplay(){
	HideDisplay()
	directionsDisplay=[];
	directions=[];
}
function HideDisplay(){
	console.log(directionsDisplay.length);
	for (var i = 0; i < directionsDisplay.length; i++) {
		if(directionsDisplay[i])directionsDisplay[i].setMap(null);
	}
}