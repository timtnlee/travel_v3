var waypoints=[],
	// start,
	// end,
	directionsId=[],
	directionsResult=[],
	directionsRequest=[],
	directionsDisplay=[],
	directionsObject=[],
	directions;
GoToPlan();//規劃路現 返回 click
SaveRouting();
function moving(step){
	// var h=window.innerHeight,
	// 	w=window.innerWidth;
	// var response=function(){
	// 	if(h>w||w<=500)
	// 		return 'h';
	// 	return 'w';
	// }
	var gotoplan=function(){
		$('#plan').css('opacity','0.7');
		$('#schedule').css('zIndex','0');		
			$('#mapInfo').animate({opacity:'0'});
			$('#planDistance').animate({opacity:'0.95'}).css('zIndex','19');
	}
	var gobacksearch=function(){
		$('#plan').css('opacity','1');
			$('#schedule').css('zIndex','19');
			$('#mapInfo').animate({opacity:'0.95'});
			$('#planDistance').animate({opacity:'0'}).css('zIndex','0');
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
			directionsId[index-1]=my_list[id].place_id;
			$('#output')
				.append('<div id="displayCount'+displayCount+'"><h4 id="list'+id+'">'//Display Place Tag
					+my_list[id].name
				+'</h4></div><div></div>');
			if(index!=1){
			display= new google.maps.DirectionsRenderer({
				map:map
			});
			
			directions=new google.maps.DirectionsService();
			var request={
				origin:my_list[prevId].geometry.location,
  				destination:my_list[id].geometry.location,
  				//waypoints:waypoints,
  				optimizeWaypoints: true,
  				travelMode:'DRIVING',
  				transitOptions: {
   					//modes: ['BUS'],
    				routingPreference: 'FEWER_TRANSFERS'
 					}
				};
			directionsDisplay.push(display);			
			Directions(
				request,
				prevId,
				display,
				displayCount,
				'car')
				displayCount++;
			}			
			prevId=id;			
		}		
	})
}

function Directions(request,id,display,count,mode){
	display.setOptions( { suppressMarkers: true });
	directions.route(request,function(result, status){
		directionsObject.push(directions);
		callback(result, status,id,display,request,count,mode);
	});
}
function callback(result, status,id,display,request,count,mode) {
 if(status=='OK'){
 	console.log('callback'+id)
 	//directionsResult.push(result);	
 	directionsRequest[count]=request;	
 	var instruct='';
 	var area=$('#output').find('#list'+id).parent().next();
 	for (var i = 0; i < result.routes[0].legs[0].steps.length; i++) {
 		instruct+=result.routes[0].legs[0].steps[i].instructions+'<br>';
 	}
 	var info=
 		'<i class="fa fa-'+mode+'" aria-hidden="true"></i><br>'
 		+'<a class="travelMode" key="DRIVING" mode="car">汽車</a>'
 		+'<a class="travelMode" key="TRANSIT" mode="bus">大眾運輸</a>'
 		+'<a class="travelMode" key="WALKING" mode="child">走路</a><br>'
 		+result.routes[0].legs[0].distance.text+'<br>'+result.routes[0].legs[0].duration.text
 		+'<br><a class="openInstruc">詳細資訊</a>'
 		+'<div class="instruc" >'+instruct+'<div>';
 	area.html(info);										//display route
 	display.setDirections(result);

 	area.find('.openInstruc').click(function(){//openInstruc
 		$(this).next().css('display','block');
 	})
 	area.find('.travelMode').click(function(){//travelMode
 		var count=$(this).parent().prev().attr('id'),
 			count=count.replace ( /[^\d.]/g, '' ),
 			id=$(this).parent().prev().children().attr('id'),
 			id=id.replace ( /[^\d.]/g, '' ),
 			key=$(this).attr('key'),
 			mode=$(this).attr('mode');
 			request.travelMode=key;
 			//directions_requests[count]=request;
 			Directions(request,id,display,count,mode);
 	}) 	
 	close_block();
 	}
}
function CleanDisplay(){
	HideDisplay()
	directionsDisplay=[];
	directions='';
	directionsResult=[];
	directionsRequest=[];
}
function HideDisplay(){
	for (var i = 0; i < directionsDisplay.length; i++) {
		if(directionsDisplay[i])directionsDisplay[i].setMap(null);
	}
}
function SaveRouting(){
	$('#saveRouting').click(function(){
		var title=window.prompt('行程名稱','我的行程');
		var placeId={};
		if(title&&title!=''){
			placeId[0]=title;
			placeId.name=localStorage.username;
				
		for (var i = 0; i < directionsId.length; i++) {
			placeId[i*2+1]=directionsId[i]
			if(directionsRequest[i])
			placeId[(i+1)*2]=directionsRequest[i].travelMode
		}
		AjaxPost('user/saveRouting',placeId,function(res){
			console.log(res);
			reNewPage('personal');
			})
		}
	})
}