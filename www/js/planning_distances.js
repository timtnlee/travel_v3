var disInfoCount = 0,
    dayCount = 0,
    pageCount = 0,
    maxPage = 0,
    displays = {},
    displayMarkers = [],
    displayBounds = new google.maps.LatLngBounds()

function Plan() { //will execute in planning.html
    TimeLine()
    DayPageEvent()
    AddTimLine() //activate
    DelTimeLine() //activate
    DayBtn() //activate
}

function AddTimLine() {
    $('#addADay').on('click', function(e) {
        e.preventDefault()
        TimeLine()
        DayPageEvent()
    })
}

function DelTimeLine() {
    $('#delADay').on('click', function(e) {
        e.preventDefault()
        if (dayCount >= 2) {
            let confirm = window.confirm('將刪除第' + (dayCount) + '天，是否確定')
            if (confirm) {
                _delTimeLine()
            }
        } else {
            alert('只有一天')
        }
    })
}

function _delTimeLine() {
    let id = 'timeLine' + (dayCount - 1),
    	places=$('#'+id).find('.time_place')
    places.each(function(i){
    	if(i!=0){
    		console.log(places.eq(i).attr('id'))
    		_renderDel(places.eq(i).attr('id'))
    	}
    })
    $('#' + id).remove()
    if (pageCount == dayCount - 1)
        pageCount--
        dayCount--
        DayPageEvent()
}

function DayPageEvent() {
    $('#output').find('.time_line').css({ display: 'none', opacity: '0' })
    $('#timeLine' + pageCount).css('display', 'block').animate({ opacity: '1' })
    $('#dayTitle').text('第' + (pageCount + 1) + '天')
    $('#maxDay').text(dayCount + '日遊')
    if (pageCount == 0)
        $('#prevDay').text(' ')
    else
        $('#prevDay').text('<')
    if (pageCount == dayCount - 1)
        $('#nextDay').text(' ')
    else
        $('#nextDay').text('>')
}

function DayBtn() {
    $('#prevDay').on('click', function(e) {
        e.preventDefault()
        if (pageCount != 0)
            pageCount--
            DayPageEvent()
    })
    $('#nextDay').on('click', function(e) {
        e.preventDefault()
        if (pageCount != dayCount - 1)
            pageCount++
            DayPageEvent()
    })
}

function TimeLine() {
    let html = $('.timeline_ex').html(),
        firstDrop = $('.first_drop_ex').html(),
        timeLineId = 'timeLine' + dayCount
    $('#output').append(html)
        .find('.time_line').last()
        .attr('id', timeLineId).css('display', 'block')
    pageCount = dayCount
    dayCount++
    $('#output').find('.time_con')
        .on('dragover', function(e) {
            e.preventDefault()
        })
    let target = $('#' + timeLineId).find('.time_con').html(firstDrop).find('.first_drop')
    GetLastPlace(pageCount)
    _activateFirstDrop(target)
}

function GetLastPlace(index) {

    if (index >= 1) {
        let id = $('#timeLine' + (index)),
            prev = $('#timeLine' + (index - 1)),
            lastPlace = prev.find('.time_place').last(),
            html,
            placeId,
            newId,
            noPlace
        if (lastPlace.length >= 1) {
            html = lastPlace.html(),
                placeId = lastPlace.attr('placeId'),
                newId = dragId + placeId
        } else {
            html = '',
                placeId = '',
                newId = (dragId + 'noPrevPlace'),
                noPlace = 'noPlace'
        }
        id.find('#prevPlace').html('<p>前天停留地點</p>' 
        	+ '<div class="time_place" id="' + newId + '" placeId="' + placeId + '">' + html + '</div>')
        id.find('.time_place').addClass(noPlace).find('#delList').remove()

        dragId++
    }
}

function _activateFirstDrop(target) {
    target
        .on('drop', function(e) {
            _firstdrop(e, $(this))
        })
        .on('dragenter', function(e) {
            $(this).text('加入').css('height', '70px')
            $('.tempor').remove()
        })
        .on('dragleave', function() {
            $(this).text('拖曳加入地點').css('height', '50px')
        })
}

function _firstdrop(e, target) {
    $('.tempor').remove()
    let ele = e.originalEvent.dataTransfer.getData('text'),
        eleAry = ele.split(","),
        id = eleAry[1]
    if (eleAry[0] == 'new') {
        let content = $('#' + id).html()
        _newList(eleAry[1], target, content, eleAry[1])
    } else if (eleAry[0] == 'edit') {
        let content = $('#' + id).find('.distance_name').html()
        _retrivePlan(id)
        _refillFirstDrop(id)
        $('#' + id).remove()
        _newList(id, target, content, eleAry[2])
    }
}

function _newList(ele, target, content, placeId) { //first drop
    let id = '#' + ele,
        newId = dragId + ele
    _createList({
        step: 'after',
        insertTarget: target,
        placeId: placeId,
        newId: newId,
        content: content
    })

    target.remove()
    _activateDel((dragId + ele))
    _timePDrop()
    dragId++
    PlanDistance()
}

function _createList(paramObj) {
    let step = paramObj.step,
        placeId = paramObj.placeId,
        newId = paramObj.newId,
        content = paramObj.content,
        target = paramObj.insertTarget,
        insert = '<div class="time_place" id="' + newId + '" draggable="true" ' +
        'placeId="' + placeId + '" front="" end="">' +
        '<p class="distance_name">' + content + '</p>' +
        '<p class="distance_info"></p>' +
        '<p class="distance_detail"></p></div>'

    
    if (step == 'before') {
        $(insert).insertBefore(target)
    } else if (step == 'after') {
        $(insert).insertAfter(target)
    }
    _activateDetail(newId)
    _distanceMarker(placeId, newId)
}
function _activateDetail(newId){
	$('#' + newId).find('.distance_info')
        .on('click', function() {
            let detail = $(this).next('.distance_detail')
            if (detail.hasClass('show'))
                detail.css('display', 'none').removeClass('show')
            else
                detail.css('display', 'block').addClass('show')
        })
    $('#' + newId).find('.distance_detail')
    	.on('click', function() {
            let detail = $(this)
            if (detail.hasClass('show'))
                detail.css('display', 'none').removeClass('show')
            else
                detail.css('display', 'block').addClass('show')
        })
}
function _timePDrop() {
    $('#output').find('.time_place').unbind()
        .on('dragstart', function(e) {
            let data = ['edit', e.target.id, $(this).attr('placeId')]
            e.originalEvent.dataTransfer.setData('text', data)
        })
        .on('dragover', function(e) {
            e.preventDefault()
        })
        .on('dragend', function(e) {
            $('#output').find('.tempor').remove()
        })
        .on('dragenter', function(e) {
            e.preventDefault()
            _tempP(e, $(this))
        })
        .on('click', function() {
            // console.log('placeId :' + $(this).attr('placeId'))
            // console.log('classes :' + $(this).attr('class'))
        })
}

function _activateDel(id) {
    $('#' + id).find('.distance_name').find('#delList').unbind()
        .on('click', function(e) {
            e.preventDefault()
            let parent = $(this).parents('.time_con'),
                num = parent.find('.time_place').length
            if (num == 1) {
                let firstDrop = $('.first_drop_ex').html()
                _retrivePlan(id)
                parent.html(firstDrop)
                let target = parent.find('.first_drop')
                _renderDel(id)
                _activateFirstDrop(target)
                PlanDistance()
            } else {
                parent = $(this).parents('.time_place')
                _retrivePlan(id)
                _renderDel(id)
                parent.remove()
                PlanDistance()
            }
            _distanceMarkerDel(id)
        })
}

function _tempP(e, target) {
    let id = '#' + target.attr('id')
    $('.tempor').remove()
    $('<p class="tempor" id="temp_last" name="' + target.attr('id') + '">' + '</p>').insertAfter(id)
    $('<p class="tempor" id="temp_first" name="' + target.attr('id') + '">' + '</p>').insertBefore(id)

    $('.tempor')
        .on('dragenter', function(e) {
            e.preventDefault()
            $(this).text('加入').css('height', '70px')
        })
        .on('dragover', function(e) {
            e.preventDefault()
        })
        .on('drop', function(e) {
            _temporDrop(e, $(this))
        })
}

function _retrivePlan(id) {
    let places = $('#output').find('.time_place')
    places.each(function(i) {
        if ($(this).attr('id') == id) {
            console.log('_retrivePlan:' + i)
            places.eq(i - 1).attr('end', '')
            places.eq(i + 1).attr('front', '')
        }
    })
}

function _temporDrop(e, target) {
    let eleAry = e.originalEvent.dataTransfer.getData('text').split(","),
        place = '#' + e.target.id,
        id = '#' + eleAry[1],
        name = target.attr('name'),
        placeId,
        content,
        newId;
    if (name != eleAry[1]) {

        if (eleAry[0] == 'edit') {
            newId = eleAry[1]
            _retrivePlan(eleAry[1])
            content = $(id).find('.distance_name').html()
            placeId = $(id).attr('placeId')
            _refillFirstDrop(eleAry[1])
            $(id).remove()
        } else if (eleAry[0] == 'new') { //new
            content = $(id).html()
            placeId = eleAry[1]
            newId = dragId + eleAry[1]
        }
        if (place == '#temp_first') {
            _createList({
                step: 'before',
                insertTarget: place,
                placeId: placeId,
                newId: newId,
                content: content
            })

        } else {
            _createList({
                step: 'after',
                insertTarget: place,
                placeId: placeId,
                newId: newId,
                content: content
            })

        }
        $('.tempor').remove()
        _timePDrop()
        _activateDel(newId)
        dragId++
        PlanDistance()
    }
}

function _refillFirstDrop(id) {
    let parent = $('#' + id).parent(),
        num = parent.find('.time_place').length
    if (num == 1) {

        let firstDrop = $('.first_drop_ex').html()
        let target = parent.html(firstDrop).find('.first_drop')
        _activateFirstDrop(target)
    }
}

function PlanDistance(num) {
    let count = pageCount
    if (num)
        count = num
    let places = $('#timeLine' + count).find('.time_place')
    if (places.length >= 2) {
        places.each(function(index) {
            console.log('PlanDistance')
            let //first_f=places.eq(index).attr('front'),
                first_e = places.eq(index).attr('end'),
                last_f = places.eq(index + 1).attr('front'),
                id = this.id,
                noPlace = $('#' + id).hasClass('noPlace')

            //last_e=places.eq(index+1).attr('end')
            if ((first_e != 'yes' || last_f != 'yes') && index != places.length - 1 && noPlace == false) {
                console.log('change')
                let firstId = $(this).attr('placeId'),
                    lastId = places.eq(index + 1).attr('placeId')
                    //$('#'+id).find('.distance_info').empty().text(disInfoCount+'\n'+firstId+'\n'+lastId)
                _distances(firstId, lastId, id)
                places.eq(index).attr('end', 'yes')
                places.eq(index + 1).attr('front', 'yes')
                disInfoCount++;
            } else if (index == places.length - 1) {
                $('#' + id).find('.distance_info').empty()
                $('#' + id).find('.distance_detail').empty().css('display', 'none')
                _renderDel(id)
                    // if (displays[id]) {
                    //     console.log('remove render')
                    //     displays[id].setMap(null)
                    // }
            }

        })
    } else if (places.length >= 1) {
        places.last().find('.distance_info').empty()
        places.last().find('.distance_detail').empty().css('display', 'none')
        _renderDel(places.last().attr('id'))
    }
    console.log('count:'+count)
    if(count<dayCount-1)
    	_nextDayPlace(count)
}

function _nextDayPlace(index) {
	console.log('nextPlace')
    if (pageCount < dayCount - 1) {
        let id = $('#timeLine' + (index)),
            next = $('#timeLine' + (index + 1)),
            nextFirst = next.find('#prevPlace').find('.time_place'),
            place = id.find('.time_place').last(),
            placeId = place.attr('placeId')

        if (place.length >= 1) {

            let html = place.html()

            nextFirst.removeClass('noPlace')
                .attr('end', '').attr('placeId', placeId)
            nextFirst.html(html).find('#delList').remove()
            PlanDistance(index + 1)
        } else {
            nextFirst.addClass('noPlace')
                .attr('end', '').attr('placeId', '')
            nextFirst.html('')
            PlanDistance(index + 1)
        }
    }
}

function _distanceMarker(placeId, id) {
    let place = _findPlaceInfo(placeId),
        mark = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: {
                url: 'img/blue-dot.png',
                scaledSize: { width: 40, height: 32 }
            }
        }),
        info = new google.maps.InfoWindow()
    displayMarkers.push({
        id: id,
        marker: mark
    })
    info.setContent(place.name)
    info.open(map, mark)
}

function _distanceMarkerDel(id) {
    for (let i = 0; i < displayMarkers.length; i++) {
        if (displayMarkers[i].id == id) {
            displayMarkers[i].marker.setMap(null)
            displayMarkers[i] = ''
        }
    }
}

function _findPlaceInfo(id) {
    for (let i = 0; i < my_list.length; i++) {
        if (my_list[i].id == id)
            return my_list[i].place
    }
}

function _distances(firstId, lastId, id) {
    let firstPlace = _findPlaceInfo(firstId),
        lastPlace = _findPlaceInfo(lastId)

    console.log('distance: ' + firstId + ' ' + lastId)
    let directions = new google.maps.DirectionsService(),
        request = {
            origin: firstPlace.geometry.location,
            destination: lastPlace.geometry.location,
            //waypoints:waypoints,
            optimizeWaypoints: true,
            travelMode: 'DRIVING',
            transitOptions: {
                //modes: ['BUS'],
                //routingPreference: 'FEWER_TRANSFERS'
            }
        }
    directions.route(request, function(result, status) {
        if (status == 'OK') {
            let distance = result.routes[0].legs[0].distance.text,
                instruct = ''
            for (let i = 0; i < result.routes[0].legs[0].steps.length; i++) {
                instruct += result.routes[0].legs[0].steps[i].instructions + '<br>';
            }
            $('#' + id).find('.distance_info')
                .empty().html('<i class="fa fa-car" aria-hidden="true"></i>' + distance)
            $('#' + id).find('.distance_detail').empty().html(instruct)
            _directionRender(result, id)
        }
    })
}

function _directionRender(result, id) {

    let display = new google.maps.DirectionsRenderer({
            map: map
        })
    display.setOptions({ suppressMarkers: true })
    display.setDirections(result)
    _renderDel(id)
    displays[id] = display

}

function _renderDel(id) {

    if (displays[id]) {
        displays[id].setMap(null)
        delete displays[id]
    }
}
