function block(){
	$('#block_you').css('display','block');
}
function close_block(){
	$('#block_you').css('display','none');
}
function initVar(){
	console.log('init radius,center in initVar()');
	radius=700000,
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
	service = new google.maps.places.PlacesService(map);
	var searchBox = new google.maps.places.SearchBox(input,{
		bounds:defaultBounds
	})
	close_block();
}
function setButton(){
	console.log('setButton');
	$('#searchSubmit').click(function(){
		query=$('#textSearch').val();
		if($(this).val()=='查詢'){//大範圍搜特定地點
			initVar();
			Steps('start_search');			
			TextSearch(query,radius,center);
			Steps('done_search');
		}
		else{//在特定地點進行Nearby Search		
			NearbySearch();
			Steps('done_search');
		}
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
function TextSearch(my_query,my_radius,my_center){	
	console.log('TextSearch');
	console.log('radius:'+radius);
	newMap();
	block();
	CleanMarker();
	CreateListMarker();
    bounds=new google.maps.LatLngBounds();
    place_bounds=new google.maps.LatLngBounds();
    if(my_query!=''){
      request={
        location:my_center,
        radius:my_radius,
        query:my_query
      }
      service = new google.maps.places.PlacesService(map);
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
		$('#allPlaces').empty().prepend('<h4>搜尋結果</h4>');
		for(var i=0;i<result.length;i++){			
			CreateMarker(result[i]);
			if(result[i].geometry.viewport)
				bounds.union(result[i].geometry.viewport)
			else{
				bounds.extend(result[i].geometry.location)
			}			
		}	
		map.fitBounds(bounds);
		close_block();
	}
}
function NearbySearch(){
	console.log('NearbySearch');
	TextSearch(query,radius,center);
}
function PtagClick(place,mark,infowindow){
	$('#allPlaces').append('<p>'+place.name+'</p>');
	$('#allPlaces').find('p').last().click(function(){
		MarkInfo(place);
	}).mouseover(function(){
		if(infowindows)
		infowindows.close();
		infowindow.setContent(place.name);
		infowindow.open(map,mark);
		infowindows=infowindow;
		return;
	})
}

function CreateMarker(place){
	console.log('CreateMarker');
	var infowindow=new google.maps.InfoWindow();
	var mark=new  google.maps.Marker({
    	map: map,
    	position: place.geometry.location,
    	icon: {
     		path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      		fillColor: 'red',
      		fillOpacity: 1,
      		strokeColor: 'black',
      		strokeWeight: 0.5,
      		scale: 5
    		}
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
			radius=500;
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
    	icon: {
    		path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
     		fillColor: 'lightgreen',
     		fillOpacity: 1,
     		strokeColor: 'green',
     		strokeWeight: 0.5,
     		scale: 6
    		}
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
	$(element).attr('draggable',true).unbind()
			.on('dragstart',function(e){
				e.originalEvent.dataTransfer.setData('text',e.target.id);
			})	
			.on('dragend',function(e){
				$('.tempor').remove();
			})
			.on('click',function(){
				ListClick(this);
			})
}
function dragover(element){
	$(element)
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
	$(id).parent().remove();
	
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
function CleanMarker(){
	console.log('CleanMarker');		
	//CleanSingleMark();
	for (var i = 0; i < marker.length; i++) {
		marker[i].setMap(null);
	}
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