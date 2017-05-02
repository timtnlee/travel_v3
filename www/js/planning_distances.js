var disInfoCount = 0,
    displays = {}

function Plan() {
    TimeLine()
}

function TimeLine() {
    var html = $('.timeline_ex').html(),
        firstDrop = $('.first_drop_ex').html()
    $('#output').html(html)
    $('#output').find('.time_con')
        .on('dragover', function(e) {
            e.preventDefault()
        })
    var target = $('#output').find('.time_con').html(firstDrop).find('.first_drop')
    _activateFirstDrop(target)
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
    var ele = e.originalEvent.dataTransfer.getData('text'),
        eleAry = ele.split(","),
        id = eleAry[1]
    if (eleAry[0] == 'new') {
        var content = $('#' + id).html()
        _newList(eleAry[1], target, content, eleAry[1])
    } else if (eleAry[0] == 'edit') {
        var content = $('#' + id).find('.distance_name').html()
        _retrivePlan(id)
        _refillFirstDrop(id)
        $('#' + id).remove()
        _newList(id, target, content, eleAry[2])
    }
}

function _newList(ele, target, content, placeId) { //first drop
    var id = '#' + ele,
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
        '<p class="distance_info"></p></div>'
    if (step == 'before') {
        $(insert).insertBefore(target)
    } else if (step == 'after') {
        $(insert).insertAfter(target)
    }
    _distanceMarker(placeId)
}

function _timePDrop() {
    $('#output').find('.time_place').unbind()
        .on('dragstart', function(e) {
            var data = ['edit', e.target.id, $(this).attr('placeId')]
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
            console.log('placeId :' + $(this).attr('placeId'))
            console.log('front :' + $(this).attr('front'))
            console.log('end :' + $(this).attr('end'))
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
        })
}

function _tempP(e, target) {
    var id = '#' + target.attr('id')
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
        var target = parent.html(firstDrop).find('.first_drop')
        _activateFirstDrop(target)
    }
}

function PlanDistance() {
    var places = $('#output').find('.time_place')
    if (places.length >= 2) {
        places.each(function(index) {
            console.log('PlanDistance')
            let //first_f=places.eq(index).attr('front'),
                first_e = places.eq(index).attr('end'),
                last_f = places.eq(index + 1).attr('front'),
                id = this.id

            //last_e=places.eq(index+1).attr('end')
            if ((first_e != 'yes' || last_f != 'yes') && index != places.length - 1) {
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
                if (displays[id]) {
                    console.log('remove render')
                    displays[id].setMap(null)
                }
            }

        })
    } else if (places.length >= 1) {
        places.last().find('.distance_info').empty()
    }
}

function _distanceMarker(id) {
    let place = _findPlaceInfo(id),
        mark = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: {
                url: 'img/blue-dot.png',
                scaledSize: { width: 40, height: 32 }
            }
        }),
        info = new google.maps.InfoWindow()
    info.setContent(place.name)
    info.open(map, mark)
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
            let distance = result.routes[0].legs[0].distance.text
            $('#' + id).find('.distance_info')
                .empty().html('<i class="fa fa-car" aria-hidden="true"></i>' + distance)
            _directionRender(result, id)
        }
    })
}

function _directionRender(result, id) {

    let display = new google.maps.DirectionsRenderer({
            map: map
        }),
        places = $('#output').find('.time_place')
    display.setOptions({ suppressMarkers: true })
    display.setDirections(result)
    _renderDel(id)
    displays[id] = display
}

function _renderDel(id) {
    console.log('fk')
    console.log(displays)
    if (displays[id]) {
        displays[id].setMap(null)
        delete displays[id]
    }
}
