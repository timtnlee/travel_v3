function scrollEvent(){
	$('#allPlaces,#option').on('scroll',function(e){
		let scroll=$(this).scrollTop()
		if(Window()<500){
			if(scroll>50){
				$('#mapInfo').stop().animate({top:'0'},200)
			} else{
				console.log('<50')
				$('#mapInfo').stop().animate({top:'43vh'})
			}
		}
	})
}

function setButton() {
    $('#searchSubmit').on('click', function(e) {
            e.preventDefault()
            google.maps.event.trigger(input, 'focus')
            google.maps.event.trigger(input, 'keydown', {
                keyCode: 13
            })
        })
        //...
    $('#goback').on('click', function(e) {
            e.preventDefault()
            SetPage('placeList')
        })
        //
    $('#option_bar').find('a').on('click', function(e) {
            e.preventDefault()
            let key = $(this).attr('key')
            NearbySearch(key)
        })
        //
    $('#infoGotop').click(function() {
            $('#option').animate({ scrollTop: '0' });
        })
        //
    $('#scheduleGoback').on('click', function(e) {
            e.preventDefault()
       		$('#welcomeOption').removeClass('showNow')
            SetPage('close_schedule')
        })
        //
    $('#plan').on('click', function() {
        SetPage('plan')
    })
    $('#distanceGoback').on('click', function() {
            SetPage('close_plan')
        })
        //
}

function newMap() {
    console.log('newMap,searchBox');
   	map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 8,
        disableDefaultUI: true,
        disableDoubleClickZoom: true
            //scrollwheel: false
    })
    let defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(26.037, 122.69),
        new google.maps.LatLng(21.268, 119.333)
    );
    service = new google.maps.places.PlacesService(map);
    searchBox = new google.maps.places.SearchBox(input, {
        bounds: defaultBounds
    })
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('searchArea'))
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds())
    })
    searchBox.addListener('places_changed', function() {
        let places = searchBox.getPlaces()
        SearchConsole(places)
    })
    setButton()
    scrollEvent()
    close_block()
}
function _resizeMap(num) {
	let wid=num+'vw'
	$('#map').css({width:wid})
	let lastBounds=map.getBounds()
	google.maps.event.trigger(map, "resize")
	map.fitBounds(lastBounds)
	console.log('resize')
}
function SearchConsole(places) {
    SetPage('placeList')

    if (places.length == 0)
        return

    _initPlace()
    console.log('search ' + places.length + ' places')
    places.forEach(function(place) {
        _placeList(place)
    })

    map.fitBounds(bounds)
}

function _initPlace() {
    bounds = new google.maps.LatLngBounds()
    $('#allPlaces').empty()
    _cleanMarker()
}

function _placeList(place) {
    let src = 'img/red-dot.png',
        infowindow = new google.maps.InfoWindow()
        //,add='<a id="add">+加入清單</a>'
    infowindow.setContent(place.name)
        //get photo
    if (place.photos)
        src = place.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 })
    $('#allPlaces').append('<p><span class="placeIcon"><img src="' + src + '"></span>' +
            '<span class="placeName">' + place.name +'</span></p>')
    //AddToList(place, src,$('#allPlaces').find('p').last())    
        //generate bounds
    if (place.geometry.viewport)
        bounds.union(place.geometry.viewport)
    else
        bounds.extend(place.geometry.location)
    let mark = _createMarker(place, infowindow)
    $('#allPlaces').find('p').last()
        .on('mouseover', function() {
            _infowindowOpen(infowindow, mark)
        }).on('click', function() {
        	console.log('p click')
            _markInfo(place)
        })
}

function _infowindowOpen(infowindow, mark) {
    if (infowindows)
        infowindows.close()
    infowindow.open(map, mark)
    infowindows = infowindow
}

function _createMarker(place, infowindow) {
    let location = place.geometry.location
    let mark = new google.maps.Marker({
        map: map,
        position: location,
        icon: 'img/red-dot.png'
    })
    marker.push(mark)
    mark.addListener('click', function() {
        _markInfo(place) //...
    })
    mark.addListener('mouseover', function() {
        _infowindowOpen(infowindow, mark)
    })
    return mark
}

function _createListMarker(place, infowindow) {
    let location = place.geometry.location
    let mark = new google.maps.Marker({
        map: map,
        position: location,
        optimized: false,
        zIndex: 2,
        icon: 'img/green-dot.png'
    })
    list_marker.push(mark)
    mark.addListener('click', function() {
        _markInfo(place) //...
    })
    infowindow.setContent(place.name)
    infowindow.open(map, mark)
        //return mark
}
function _hideListMarker() {
	console.log(list_marker)
	for (let i = 0; i < list_marker.length; i++) {
        list_marker[i].setMap(null)
    }
}
function _showListMarker() {
	for (let i = 0; i < list_marker.length; i++) {
        list_marker[i].setMap(map)
    }
}
function _delListMarker(){

}
function _showMarker() {
    for (let i = 0; i < marker.length; i++) {
        marker[i].setMap(map)
    }
}

function _hideMarker() {
    for (let i = 0; i < marker.length; i++) {
        marker[i].setMap(null)
    }
}

function _cleanMarker() {
    _hideMarker()
    marker = []
}

function _markInfo(place) {
    //...
    SetPage('markInfo')
    _initMarkInfo()
    let location = place.geometry.location,
        src = 'img/red-dot.png'

    map.panTo(location)
    map.setZoom(15)

    center = location

    if (place.photos)
        src = place.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 })
    _markInfoPanel(place.place_id, place.name, src)
}

function _markInfoPanel(place_id, place_name, src) {
    let vicinity,
        website,
        phone,
        rating,
        open = []
    service.getDetails({ placeId: place_id }, function(result, status) {
        if (status == 'OK') {
            if (result.photos) {
                for (let i = 1; i < result.photos.length; i++) {
                    $('#info').append('<img src="' + result.photos[i].getUrl({ 'maxWidth': 600, 'maxHeight': 600 }) + '" >')
                }
            }
            if (result.opening_hours)
                open = _openingHour(result.opening_hours)
            else
                open[0] = open[1] = '';
            (result.rating) ? rating = '評分 : ' + result.rating: rating = '';
            (result.formatted_phone_number) ? phone = result.formatted_phone_number: phone = '';
            (result.vicinity) ? vicinity = '地址 : ' + result.vicinity: vicinity = '';
            (result.website) ? website = '<a href="' + result.website + '">網頁</a>': website = '';
            $('#infoText').prepend('<p><strong>' +
                rating + '</strong><br>' +
                vicinity + '<br>' +
                phone + '<br>' +
                website + '<br>' +
                open[0] +
                open[1] +
                '</p>')
            $('#infoText').find('a').click(function(e) {
                e.preventDefault()
                let href = $(this).attr('href')
                window.open(href)
            })
            let add = '<a id="add">+加入清單</a>',
                num = _foundListExist(place_id)
            if (num > 0) {
                add = '<a id="add">已加入</a>'
            }
            $('#optionTag').html('<span class="placeIcon"><img src="' + src + '"></span>' +
                '<span class="placeName">' + place_name + add + '</span>')
            if (num == 0)
                AddToList(result, src,$('#optionTag'))
        }
    })

}

function _openingHour(opening_hours) {
    let openInfo = [],
        dayChar = function(day) {
            let days = [0, 1, 2, 3, 4, 5, 6],
                char = ['日', '一', '二', '三', '四', '五', '六']
            for (let i = 0; i < days.length; i++) {
                if (day == days[i])
                    return char[i]
            }
        };
    (opening_hours.open_now) ? openInfo[0] = '營業中': openInfo[0] = '休息中';
    openInfo[1] = ''
    let exday
    for (let i = 0; i < opening_hours.periods.length; i++) {
        let day = opening_hours.periods[i].open.day,
            time = opening_hours.periods[i].open.time,
            close;
        (opening_hours.periods[i].close) ? close = opening_hours.periods[i].close.time: close = '';
        time = time.substring(0, 2) + ":" + time.substring(2, 4)
        close = close.substring(0, 2) + ":" + close.substring(2, 4)
        if (day == exday) {
            openInfo[1] += ('/' + time + '~' + close)
        } else
            openInfo[1] += ('<br>' + dayChar(day) + ':' + time + '~' + close)

        exday = day
    }

    return openInfo;
}

function _initMarkInfo() {
    $('#optionTag').empty()
    $('#info').empty()
    $('#infoText').empty()
}

function SetPage(step) {    
    switch (step) {
        case 'markInfo':
            $('#allPlaces').css('display', 'none')
            $('#option').css('display', 'block')
            $('#hint').animate({ height: '0' })
            $('#schedule').css('zIndex', '-1')
            $('#welcomeOption').attr('class','')
            $('#planDistance').css('zIndex', '-1').animate({ opacity: '0' })
            if(Window()>500)
                _resizeMap(75)
            else
                _resizeMap(100)
            break

        case 'placeList':
            if(Window()>500){
                $('#hint').animate({ height: '50px' })
                _resizeMap(75)
            } else {
                $('#hint').animate({ height: '0px' })
                _resizeMap(100)
            }
            $('#allPlaces').css('display', 'block')
            $('#option').css('display', 'none')
            
            $('#schedule').css('zIndex', '-1')
            $('#welcomeOption').attr('class','')
            $('#planDistance').css('zIndex', '-1').animate({ opacity: '0' })
            
            if (bounds) map.fitBounds(bounds)
            break

        case 'schedule':
            $('#schedule').css('zIndex', '19')
            $('#welcomeOption').attr('class','showNow')
            break

        case 'close_schedule':
        	$('#welcomeOption').attr('class','')
            $('#schedule').css('zIndex', '-1')
            break

        case 'plan':
        console.log('plan')
            _hideMarker()
            _hideListMarker()
            $('#planDistance').css('zIndex', '2').animate({ opacity: '1' })
            if(Window()>500)
                _resizeMap(50)
            break

        case 'close_plan':
            console.log('close_plan')
            _showMarker()
            _showListMarker()        	
            $('#planDistance').css('zIndex', '-1').animate({ opacity: '0' })
            if(Window()>500)
                _resizeMap(75)
            break
    }
}

function AddToList(place, src,target) {
	let add=$('#add')
	if(target)
		add=target.find('#add')
    add.unbind().on('click', function(e) {
        e.preventDefault()
        let name = place.name,
            placeId = place.place_id,
            infowindow = new google.maps.InfoWindow()
        $(this).text('已加入').unbind()
        _createListMarker(place, infowindow)
        $('#schedule').append(
            '<p class="list_con" id="' + placeId + '" draggable="true">' +
            '<span class="placeIcon"><img src="' + src + '" draggable="false"></span>' +
            '<span class="placeName">' + name + '<a id="delList" class="btn btn-link">移除</a></span>' +
            '</p>')
        _showListNum()
        let placeList = {
            id: placeId,
            place: place
        }
        my_list.push(placeList)
            //list info		
        $('#schedule').find('#' + placeId).on('click', function(e) {
            e.preventDefault()
            SetPage('close_schedule')
            _markInfo(place)
        }).find('#delList').on('click', function(e) { //delete
            e.preventDefault()
            $('#schedule').find('#' + placeId).remove()
            _showListNum()
        })
        _dragstart('#' + placeId)
    })
}

function _dragstart(ele) {
    $('#schedule').find(ele)
        .on('dragstart', function(e) {
            let data = []
            data[0] = 'new'
            data[1] = e.target.id
            e.originalEvent.dataTransfer.setData('text', data)
        }).on('dragend', function(e) {
            console.log('end1')
            $('.tempor').remove()
        })
}

function _foundListExist(_id) {
    let id = '#' + _id,
        num = $('#schedule').find(id).length
    return num
}

function _showListNum() {
    let num = $('#schedule').find('.list_con').length - 1
    if (num == 0)
        $('#welcomeOption').text('清單')
    else
        $('#welcomeOption').text('清單(' + num + ')')
}

function NearbySearch(key) {
    //radius=1000;
    //console.log('NearbySearch');
    let request = {
        location: center,
        radius: '1000',
        type: key
    }
    service.nearbySearch(request, function(places, status) {
        if (status == 'OK') {
            SearchConsole(places)
        }
    })
}
