//var ip='http://127.0.0.1:3000/';
var _articleObj = {
        title: '',
        date: '',
        author: '',
        id: ''
    },
    _tripObj={
    	title: '',
        date: '',
        author: '',
        id:''
    },
    _goback = '',
    _display_user,
    _display_title,
    _display_place = [],
    _display_mode = [],
    _user_name,
    _user_icon
    //Dom events go here
$(function() {
    $(window).on('load',function(){
        location.hash='home'
    })
    LoadHomePage();
    URLset();
    setIp();
    
    // $('._header').find('a').on('click', function(e) {
    //     //e.preventDefault();
    //     //if (Window() > 500)
        
    //     // else
    //     //     $('.welcome').css({ height: '0px' }).animate({ height: '30px' });
    //     //HeaderButton($(this));
    // })
    // var lat=39.7391536
    // $.ajax({
    //     type:"GET",
    //     url:"https://maps.googleapis.com/maps/api/elevation/json?locations="+lat+",-104.9847034&key=AIzaSyCdVoiikIt7QWJ2Ea6M2JQ2Nu0suzM5P8A",
    //     success:function(res){
    //         console.log(res)
    //     }
    // })
    // $.ajax({
    //     type:"GET",
    //     url:"http://140.119.19.15:3000/file/test",
    //     success:function(res){
    //         console.log('test')
    //         console.log(res)
    //     }
    // })
    // var parm=encodeURI(encodeURI('http://140.119.19.40:8080/googleSearcher/search/韓國'))
    //  $.ajax({
    //     type:"GET",
    //     url:parm,
    //     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    //     success:function(res){
    //         console.log('test2')
    //         var jdata=JSON.parse(res)
    //         for(let i in jdata){
    //              console.log(jdata[i])
    //         }
           
    //     }
    // })
    PhoneButton();
    
})

function URLset() {
    $(window).on('hashchange', function(e) {
        let hash = location.hash,
            page = hash.substr(1),
            allcontain = $('._content').find('._pages'),
            contain = $('._content').find('#page_' + page),
            reload = $('._reloadPage')
        $('[name="title"]').text(_translate(page))
        $('.welcome').css({ height: '0px' }).animate({ height: '40px' });
        allcontain.css('display', 'none')
        reload.html('')
        if (reloadPage(page)) {
            console.log('reloadPage')
            $.ajax({
                url: "page/" + page + ".html",
                success: function(result) {
                    reload.html(result)
                }
            })
            reload.css('display', 'block')
        } else {
            console.log('page')

            if (contain.length == 1) {
                
                contain.css('display', 'block')
            } else {
               

                $.ajax({
                    url: "page/" + page + ".html",
                    success: function(result) {
                        $('._content').append('<div id="page_' + page + '" class="_pages">' + result + '</div>')
                    }
                })
            }
        }
    })
}

function reloadPage(ch) {
    let page = ['addArticle','planning', 'schedule',
                 'singleArticle', 'mapArticles', 'singleUser',
                 'singleTrip','article','trip','personal']
    for (let i = 0; i < page.length; i++) {
        if (ch == page[i])
            return true
    }
    return false
}
function _translate(check){
    let eng='addArticle,article,home,login,mapArticles,personal,'+
            'planning,register,schedule,signout,singleArticle,'+
            'singleTrip,singleUser,trip,users',
        chi='新增文章,文章專區,首頁,登入,編輯地圖故事,個人頁面,'+
            '行程規劃,註冊,行程,登出,文章,'+
            '行程,使用者資料,地圖故事,社群',
        engAry=eng.split(','),
        chiAry=chi.split(','),
        reval=''
    
    $.map(engAry,function(match,i){
        if(match==check){
            reval=chiAry[i]
        }
    })
    return reval
}
function leadToLogin(){
    if(localStorage.logined!='yes'){
        alert('請先登入')
        location.href='#login'
    }
}
function Window() {
    let w = window.innerWidth
    return w
}

function setIp() {
	//ip = 'http://127.0.0.1:3000/';
    ip = 'http://140.119.19.15:3000/';
}

if (!localStorage.logined)
    localStorage.logined = 'no';
if (!localStorage.username)
    localStorage.username = '';

function Message(input,btn,url,id,page){
    
    
    btn.click(function(e){
        leadToLogin()
        e.preventDefault()
        if(localStorage.logined=='yes'){
            var data=input.val()
            if(data!=''){
                AjaxPost('article/'+url, {message:data,id:id,date:new Date(),name:localStorage.username}, function(res){
                reNewPage(page)
             })
            }            
        }
        
        
    })
}

function LoadHomePage() {

    $("._content").prepend('<div id="home" class="_pages">瀏覽器不支援</div>');
    $.ajax({
        url: "page/home.html",
        success: function(result) {
            $("#home").html(result);
        }
    });
    LoginOption();
}

function LoginOption() {
    $('._loginOption').each(function() {
        var a = $(this).find('a'),
            first = a.first(),
            last = a.last();
        if (a.length == 2) {
            if (localStorage.logined == 'yes') {
                first.css('display', 'none')
            } else {
                last.css('display', 'none')
            }
        } else {
            if (localStorage.logined == 'no') {
                first.css('display', 'none')
            }
        }
    })
}

function welcomeOption(text, func) { //can only be used in reload pages
    console.log('welcome')
    $('#welcomeOption').text(text).removeClass('showNow')
    $('#welcomeOption').unbind().click(function(e) {
        func(e, $(this))
    })
}

function reNewPage(href) {
    page=href
    reload = $('._reloadPage')
    $('._content').find('._pages').css('display', 'none');
    reload.html();
       
            console.log('reloadPage')
            $.ajax({
                url: "page/" + page + ".html",
                success: function(result) {
                    reload.html(result)
                }
            })
            reload.css('display', 'block')
}

function InsertImg(ele, insert) {
    $(ele).on('change', function() {
        var file = document.querySelector(ele).files[0];
        var reader = new FileReader();
        //----------檔案讀取+預覽------
        reader.addEventListener("load", function() {
            console.log('load');
            var result = reader.result;
            insert(result);
        })
        if (file) reader.readAsDataURL(file);
    })
}
// function HeaderButton(target,text){
// 	var href=target.attr('href'),
// 		reload=target.attr('reload'),
// 		option=target.attr('optional')
// 	if(!text)
// 		var text=target.text();
// 	$("[name='title']").text(href);
// 	$('._content').find('._pages').css('display','none');
// 	$('._reloadPages').remove();
// 	if(option&&localStorage.logined=='no')
// 		href=option;
// 	var id='#'+href;
// 	if(reload=='true'){		
// 		$("._content").prepend('<div id="'+href+'" class="_reloadPages"></div>');
// 		$.ajax({
// 			url: "page/"+href+".html", 
// 			success: function(result){        	
//         		$(id).html(result);
// 				}
// 			});
// 	}

// 	else{
// 		if(document.getElementById(href)){
// 			$(id).css('display','block');
// 		}
// 		else{
// 		$("._content").prepend('<div id="'+href+'" class="_pages"></div>');
// 		$.ajax({
// 			url: "page/"+href+".html", 
// 			success: function(result){        	
//         		$(id).html(result);
// 				}
// 			});
// 		}
// 	}	
// }
function PhoneButton() {
    $('#menuBar').click(function() {
        $('._menu').animate({ left: '0' });
    })
    $('._menu').click(function() {
        $('._menu').animate({ left: '-100%' });
    })
}

function ResetInput(input) {
    $(input).on('focus', function() {
        $(this).val('');
        return;
    })
}

function EnterSubmit(ele) {
    $(window).unbind('keydown').keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $(ele).click();
        }
    })
}

function checkData(str) {
    var regExp = /[^0-9a-zA-Z]/;
    return regExp.test(str);
}

function CheckInput(ele, addition) {
    $(ele).on('change keyup', function(e) {
        e.preventDefault()
        var str = $(this).val();
        var display = $(this).parent().next().children();
        if (str == '')
            display.text('未輸入');
        else if (checkData(str))
            display.text('請輸入英文或數字');
        else {
            if (addition) addition();
            else display.text('✔');
        }
    })
    console.log('input set')
}

function AjaxPost(route, data, success, error) {
    console.log('AjaxPost');
    $.ajax({
        type: "POST",
        url: ip + route,
        data: data,
        success: function(res) {
            if (success) success(res);
        },
        error: function(res) {
            if (error) error(res);
        }
    }).done(function() {
        console.log('POST done');
    })
}

function block() {
    $('#block_you').css('display', 'block');
}

function close_block() {
    $('#block_you').css('display', 'none');
}
