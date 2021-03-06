

//--------------------------------------
function initVar(){
	console.log('init radius,center in initVar()');
	radius=500000,
	center={lat:24.5,lng:121.2};
}
function newMap(){
	console.log('newMap,searchBox');
	map=new google.maps.Map(document.getElementById('map'),{
      center:{lat:23.6,lng:121.2},
      zoom: 8,
      disableDefaultUI: true,
      disableDoubleClickZoom: true
    //scrollwheel: false
  })
	var defaultBounds = new google.maps.LatLngBounds(
   	 	new google.maps.LatLng(26.037, 122.69),
    	new google.maps.LatLng(21.268, 119.333)
    );
	//service = new google.maps.places.PlacesService(map);
	var searchBox = new google.maps.places.SearchBox(input,{
		bounds:defaultBounds
	})
	service = new google.maps.places.PlacesService(map);
	close_block();
}
function setButton(){
	console.log('setButton');
	$('#searchSubmit').click(function(){
		query=$('#textSearch').val();
		if($(this).val()=='查詢'){//大範圍搜特定地點
			initVar();
			newMap();
			Steps('start_search');			
			TextSearch(query,radius,center);
			Steps('done_search');
		}
		else{//在特定地點進行Nearby Search
			radius=500;		
			TextSearch(query,radius,center);
			Steps('done_search');
		}
	})
	//
	$('#getLocationBtn').click(function(e){
		e.preventDefault();
		getUserLocation();
	})
	//
	$('#goback').click(function(){
			map.fitBounds(bounds);
			Steps('done_search');
	})
	//
	$('#option').find('a').click(function(){
		query=$(this).attr('key');
		NearbySearch();
		Steps('done_search');
	})
}
function getUserLocation(){
	 if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(ShowUserLocation);
    }
  	else{alert("不支援定位或權限未開啟")}
}
function ShowUserLocation(position){
	var userCenter={lat: position.coords.latitude,lng:position.coords.longitude};
	CreateUserMarker(userCenter);
	map.setZoom(15);
 	map.panTo(userCenter); 	
}
function CreateUserMarker(Ucenter){
	var mark=new google.maps.Marker({
		map:map,
		position:Ucenter,
		icon:'img/red-dot.png'
	})
	var Userinfowindow=new google.maps.InfoWindow()
	Userinfowindow.setContent('目前位置')
	Userinfowindow.open(map,mark)
	marker.push(mark)
	center=Ucenter
	focusMark='我的位置'
	Steps('marker_click')
}
function TextSearch(my_query,my_radius,my_center){	
	console.log('TextSearch');
	console.log('radius:'+radius);	
	CleanMarker();
	CreateListMarker();
    bounds=new google.maps.LatLngBounds();
    place_bounds=new google.maps.LatLngBounds();
    if(my_query!=''){
    	block();
      	request={
        location:my_center,
        radius:my_radius,
        query:my_query
      }
      service.textSearch(request, textSearchCallback);
    }   
}
function Steps(step){
	switch(step){
		case 'start_search'://textSubmit click
			$('#searchSubmit').attr('disabled',true).val('載入中..');
			
			break;
		case 'done_search'://textSearchCallback done	
			console.log('render done_search');		
			hint.innerHTML='點選紅標找附近景點!<br>沒有想要的結果?試著用更確切的關鍵字或是搜尋地區';
			$('#hint').animate({height:'60px'});
			$('#searchSubmit').attr('disabled',false).val('查詢');
			$('#info').css('display','block');
			$('#searchArea').find('h4').text('搜尋地點:');
			$('#option').css('display','none');
			$('#goback').css('display','none');
			$('#allPlaces').css('display','block');
			break;
		case 'marker_click'://MarkInfo
			console.log('render marker_click');	
			$('#hint').animate({height:'0px'});
			$('#searchSubmit').val('附近找');
			$('#info').css('display','block');
			$('#option').css('display','block');
			$('#goback').css('display','block');
			$('#searchArea').find('h4').text('附近找:');
			$('#allPlaces').css('display','none');
			break;
		case 'user_location':
			console.log('render user_location');	
			//$('#hint').animate({height:'0px'});
			$('#searchSubmit').val('附近找');
			$('#info').css('display','block');
			$('#option').css('display','block');
			$('#goback').css('display','block');
			$('#searchArea').find('h4').text('附近找:');
			$('#allPlaces').css('display','none');
			break;
		case 'list_info':
			console.log('render list_info');	
			$('#hint').animate({height:'0px'});
			$('#searchSubmit').val('附近找');
			$('#add')
				.html('<i class="fa fa-plus-circle" aria-hidden="true"></i>再次加入(已加入)');
			$('#info').css('display','block');
			$('#option').css('display','block');
			$('#goback').css('display','block');
			$('#searchArea').find('h4').text('附近找:');
			$('#allPlaces').css('display','none');
			break;
	}
}
function textSearchCallback(result,status){
	console.log('textSearchCallback');
	if(status == google.maps.places.PlacesServiceStatus.OK){
		if(radius==500000)
			$('#allPlaces').empty().prepend('<h4>全域搜尋"'+query+'"</h4>');
		else{
			var key=query,
				translate=['餐廳','景點','住宿','停車場'];
			switch(key){
				case 'parking':
					key=translate[3];
					break;
				case 'restaurant':
					key='餐廳';
					break;
				case 'attrications':
					key='景點';
					break;
				case "Cafe'":
					key='咖啡廳';
					break;
			}
			$('#allPlaces').empty().prepend('<h4>"'+focusMark+'"附近搜尋"'+key+'"</h4>');
		}
		for(var i=0;i<result.length;i++){			
			CreateMarker(result[i]);
			if(result[i].geometry.viewport)
				bounds.union(result[i].geometry.viewport)
			else{
				bounds.extend(result[i].geometry.location)
			}			
		}	
		map.fitBounds(bounds);		
	}
	close_block();
}
function NearbySearch(){
	radius=1000;
	console.log('NearbySearch');
	 var request = {
    	location:center,
    	radius: '500',
    	type:query
 		}
 	bounds=new google.maps.LatLngBounds();
 	CleanMarker()
  	service.nearbySearch(request, textSearchCallback)
	//TextSearch(query,radius,center);//center在點擊mark時定義 或是我的位置
}
function PtagClick(place,mark,infowindow){
	$('#allPlaces').append('<p>'+place.name+'</p>');
	$('#allPlaces').find('p').last().click(function(){
		MarkInfo(place);
		if(infowindows)
		infowindows.close();
		infowindow.setContent(place.name);
		infowindow.open(map,mark);
		infowindows=infowindow;
	}).mouseover(function(){
		if(infowindows)
		infowindows.close();
		infowindow.setContent(place.name);
		infowindow.open(map,mark);
		infowindows=infowindow;
		return;
	})
}

function CreateMarker(place,location){
	console.log('CreateMarker');
	if(!location)location=place.geometry.location;
	var infowindow=new google.maps.InfoWindow();
	var mark=new  google.maps.Marker({
    	map: map,
    	position:location,
    	icon:'img/red-dot.png'    		
  		})
	mark.addListener('click',function(){
		block();
		MarkInfo(place);
	})
	mark.addListener('mouseover',function(){
		if(infowindows)
		infowindows.close();
		infowindow.setContent(place.name);
		infowindow.open(map,mark);
		infowindows=infowindow;
		return;
	})
	PtagClick(place,mark,infowindow);
	marker.push(mark);
}
function MarkInfo(place,list){
	var new_bounds=new google.maps.LatLngBounds();
	console.log('MarkInfo');
	focusMark=place.name;
	var Rating,Vicinity;
	 if (place.geometry.viewport) {
        // Only geocodes have viewport.
        new_bounds.union(place.geometry.viewport);
      } else {
        new_bounds.extend(place.geometry.location);
      }
    mark_bounds=new_bounds;
	map.fitBounds(new_bounds);
	service.getDetails({placeId:place.place_id},function(result,status){
		if(status===google.maps.places.PlacesServiceStatus.OK){
			var img='';
			(result.rating)?Rating=result.rating:Rating='無評分';
    		(result.vicinity)?Vicinity=result.vicinity:Vicinity='';
    		$('#info').empty()
				.prepend('<h2>'+result.name+'/'+Rating
				+'<a id="add"><i class="fa fa-plus-circle" aria-hidden="true"></i>加入清單</a>'
				+'</h2><p>'
				+Vicinity+'</p><div id="infoImg"></div>');
			if(result.photos){
				for(var i=0;i<result.photos.length;i++){
              		var src=result.photos[i].getUrl({'maxWidth': 300, 'maxHeight': 300}); 
              		img+='<img src="'+src+'" >';
            	}
            	$('#infoImg').append(img);
			}
			AddToList(result);
			
			console.log('change center,radius');
			center=result.geometry.location;
			close_block();
			(list)?Steps('list_info'):Steps('marker_click');
		}
	})	
}
function AddToList(result){
	$('#add').click(function(){
		Steps('list_info');
		my_list.push(result);
		NewListMarker(result);
		var name;
		(result.name.length>15)?name=result.name.substr(0,15)+'...':name=result.name;
		//var sec=new Date().getMilliseconds();
		$('#schedule').append(
			'<div class="list_con" id="div'
			+listCount+'"><p class="dragP" id="'
			+listCount+'">'			
			+name+'<i class="fa fa-trash-o" aria-hidden="true"></i></p></div>');
		dragstart('.dragP');//裡面有unbind() 注意  //裡面也綁定click
		dragover('.list_con');//裡面有unbind() 注意	
		Trash();	
		listCount++;
	})//$('#add').click
}
function NewListMarker(place){
	var infowindow=new google.maps.InfoWindow();
	var placeLoc=place.geometry.location;
	var mark=new google.maps.Marker({
		map: map,
   		position: placeLoc,
   		optimized: false,
      	zIndex:9,
    	icon:'img/green-dot.png'  
	})
	infowindow.setContent(place.name);
	infowindow.open(map,mark);
	list_marker.push(mark);
}
function CreateListMarker(){
	for (var i = 0; i < list_marker.length; i++) {
		if(list_marker[i]!='')
		list_marker[i].setMap(map);
	}
}
function Trash(){
	$('.fa-trash-o').unbind().on('click',function(){
		var count=$(this).parent().attr('id');
		list_marker[count].setMap(null);
		list_marker[count]='';
		my_list[count]='';
		$(this).parent().parent().remove();
	})
}
function ListClick(target){
	block();
	console.log('listclick');
	var count=$(target).attr('id');
	MarkInfo(my_list[count],'list');
}
function dragstart(element){
	$('#schedule')
	.find(element).attr('draggable',true).unbind()
			.on('dragstart',function(e){
				//$('#'+e.target.id).parent().css('visibility','hidden');
				e.originalEvent.dataTransfer.setData('text',e.target.id);
			})	
			.on('dragend',function(e){
				$('.tempor').remove();
				//$('#'+e.target.id).parent().css('display','block');
			})
			.on('click',function(){
				ListClick(this);
			})
}
function dragover(element){
	$('#schedule')
	.find(element)
		.on('dragover',function(e){	

			//這個e.target是指被drag的.dragP不是.list_con		
			e.preventDefault();
			if(dragCount!=this.id){	//this才是,list_con
				$('.tempor').remove();			
				var id='#'+this.id;
				$('<div class="tempor">'
					+'<i class="fa fa-inbox" aria-hidden="true"></i>'
					+'</div>').insertAfter(id);
				$('.tempor')
					.on('dragover',function(e){
						e.preventDefault();
					})
					.on('drop',function(e){
						drop(e);
					})
			}
			dragCount=this.id;
	})	
}
function drop(e){
	var ele=e.originalEvent.dataTransfer.getData('text');
	var id='#'+ele,
		content=$(id).text(),
		divId=$(id).parent().attr('id');
	$('#schedule')
	.find(id).parent().remove();
	
	$('<div class="list_con" id="'
			+divId+'"><p class="dragP" id="'
			+ele+'">'
			+content+'<i class="fa fa-trash-o" aria-hidden="true"></i></p></div>')
			.insertAfter('.tempor');
	$('.tempor').remove();
	dragstart('#'+ele);// ***為新複製的物件綁定事件!****
	dragover('#'+divId);
	Trash();
}
function ShowMarker(){
	for (var i = 0; i < marker.length; i++) {
		marker[i].setMap(map);
	}
}
function HideMarker(){
	for (var i = 0; i < marker.length; i++) {
		marker[i].setMap(null);
	}
}
function CleanMarker(){
	console.log('CleanMarker');		
	HideMarker();
	marker=[];	
}

function CleanListMark(){
	HideListMarker();
	list_marker=[];
}
function HideListMarker(){
	for (var i = 0; i < list_marker.length; i++) {
		if(list_marker[i]!='')
		list_marker[i].setMap(null);
	}
}