console.log('singleTrip.js')
var map,
	service,
	marker=[],
	mapArticle=[],
	pageCount=0,
	start,
	bounds;
newMap()
welcomeOption('地圖',welcomeClick )
function welcomeClick(e, target){
    console.log('welcomeOption')
    target.toggleClass('showNow')
    if(target.hasClass('showNow')){
            $('#map').css('zIndex', '5')        
    }else{
            $('#map').css('zIndex', '0')
    }
}
Message($('.message_input'),$('.message_btn'),'message_map',_tripObj.id,'singleTrip')
function newMap(){
	console.log('newMap');
	 map= new google.maps.Map(document.getElementById('map'), {
      center: {lat:24,lng:121.2},
      zoom: 10,
      disableDefaultUI: true,
      disableDoubleClickZoom: true
    //scrollwheel: false
  	});
	service = new google.maps.places.PlacesService(map)
	getPlaces()
}

function CleanMapMarker(){
	console.log('CleanMapMarker');
	for(var i=0;i<marker.length;i++){
		marker[i].mark.setMap(null);
	}
	marker=[];
	mapArticle=[];
	pageCount=-1;
}
function _btn(length){
	$('.goBtn').on('click',function(){
		$('.start_page').css('display','none')
		$('.trip_page').css('display','block')
		map.setZoom(14)
		PageEvent(length)
	})
	$('.trip_bar').find('#prev').on('click',function(){
		if(pageCount!=0)
			pageCount--
		PageEvent(length)
	})
	$('.trip_bar').find('#next').on('click',function(){
		if(pageCount!=length-1)
			pageCount++
		PageEvent(length)
	})
}
function getPlaces(){
	//$('#trip_date').text(_tripObj.date)
	$('#trip_title').text(_tripObj.title)
	$('#trip_author').text(_tripObj.author)
	AjaxPost('article/single_mapArticle',{id:_tripObj.id},function(res){
		var place=res.Places,
			article=res.Articles,
			message=res.Message	
		$.map(message,function(mes){
			$('.message_area').prepend('<p>'+mes.message+
							'<small>'+mes.name+' '+
							mes.date.toString().substring(0,10)+'</small></p>')
		})
		Promise.all(getDetail(place)).then(()=>{
			CreateArticle(article)
			_btn(res.Articles.length)
			Direction()
		})	
		
	})
}
function CreateMarker(result,i,resolve,reject){	
	var infowindow=new google.maps.InfoWindow();
				var mark = new google.maps.Marker({
    				map: map,
    				position: result.geometry.location,
    				icon: {
    					url: 'img/blue-dot.png',
                		scaledSize: { width: 40, height: 32 }
    				}
  					})
				infowindow.setContent((i+1)+'.'+result.name)
				infowindow.open(map,mark);
				marker[i]={
					mark:mark,
					center:result.geometry.location,
					name:result.name
				}
				if (result.geometry.viewport) {// Only geocodes have viewport.
        			bounds.union(result.geometry.viewport);} 
        		else {bounds.extend(result.geometry.location);}        		
        		map.fitBounds(bounds)
        		return resolve()
}
function getDetail(place){
	var promise=[]
	bounds=new google.maps.LatLngBounds()
	$.map(place,function(_place,i){
		promise.push(new Promise(function(resolve,reject){
			service.getDetails({placeId:_place}, function(result,status){
			if(status === google.maps.places.PlacesServiceStatus.OK){							
					CreateMarker(result,i,resolve,reject)
				}//if(status == google.maps.places.PlacesServiceStatus.OK)
			});//service.getDetails	
		}))		
	})	
	return promise		
}
function Direction(){
	let waypoints=[]
	for (var i = 0; i < marker.length; i++) {
		if(i!=0&&i!=marker.length-1)
		waypoints.push({location:marker[i].center})
	}
	console.log(waypoints[0])
	let directions = new google.maps.DirectionsService(),
		request={
			origin: marker[0].center,
            destination: marker[marker.length-1].center,
            waypoints:waypoints,
            optimizeWaypoints: true,
            travelMode:'DRIVING'
		}
	directions.route(request, function(result, status) {
		if(status=='OK'){
			let display = new google.maps.DirectionsRenderer({
           		 map: map,
           		 directions:result
        	})
        	display.setOptions({ suppressMarkers: true })
		}
	})
}
function CreateArticle(article){
	$.map(article,function(art){
		mapArticle.push(art)
	})
	$('.trip_content').html(mapArticle[pageCount])
}
function PageEvent(length){
	if(pageCount==0)
		$('#prev').css('display','none')
	else
		$('#prev').css('display','inline')
	if(pageCount==length-1)
		$('#next').css('display','none')
	else
		$('#next').css('display','inline')
	$('.trip_content').html(mapArticle[pageCount])
	$('.placeTitle').text(marker[pageCount].name)
	//map.setZoom(14)
	map.panTo(marker[pageCount].center)
}