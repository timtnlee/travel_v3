//var ip='http://127.0.0.1:3000/';
var _articleObj={
            title:'',
            date:'',
            author:'',
            id:''
        },
        _goback='',
        _display_title,
        _display_place=[],
        _display_mode=[];
    	//Dom events go here
$(function(){

            setIp(); 
            LoadHomePage();    		
            $('._header').find('a').on('click',function(e){
             e.preventDefault();
             if(Window()>500)
             	$('.welcome').css({height:'0px'}).animate({height:'40px'});
             else
             	$('.welcome').css({height:'0px'}).animate({height:'25px'});
             HeaderButton($(this));
         })
            PhoneButton();
})

function Window(){
	let w=window.innerWidth
	return w
}

function setIp(){
	ip=window.prompt('local host?','http://140.119.19.15:3000/');
}

if(!localStorage.logined)
    	localStorage.logined='no';
if(!localStorage.username)
    	localStorage.username='';

function LoadHomePage(){
	$("._content").empty();
	$("._content").prepend('<div id="home" class="_pages">瀏覽器不支援</div>');
	$.ajax({
		url: "page/home.html", 
		success: function(result){
        $("#home").html(result);
		}
	});
	LoginOption();
}
function LoginOption(){
	var first=$('._loginOption').find('a').first(),
		last=$('._loginOption').find('a').last();
	if(localStorage.logined=='yes'){
		first.css('display','none')
	}
	else{
		last.css('display','none')
	}

}
function welcomeOption(text,func){//can only be used in reload pages
	$('#welcomeOption').text(text).removeClass('showNow')
	$('#welcomeOption').unbind().click(function(e){
		func(e,$(this))
	})	
}
function reNewPage(href){
	console.log(123);
		id='#'+href;
		$('._content').find('._pages').css('display','none');
		$('._reloadPages').remove();
		$(id).remove();
		$("._content").prepend('<div id="'+href+'" class="_pages"></div>');
		$.ajax({
			url: "page/"+href+".html", 
			success: function(result){        	
        		$(id).html(result);
				}
			});
} 
function InsertImg(ele,insert){
	$(ele).on('change',function(){
				var file= document.querySelector(ele).files[0];
				var reader  = new FileReader();				
				//----------檔案讀取+預覽------
				reader.addEventListener("load", function () {
					console.log('load');
					var result=reader.result;
					insert(result);
				})
				if(file)reader.readAsDataURL(file);
			})}
function HeaderButton(target,text){
	var href=target.attr('href'),
		reload=target.attr('reload'),
		option=target.attr('optional')
	if(!text)
		var text=target.text();
	$("[name='title']").text(href);
	$('._content').find('._pages').css('display','none');
	$('._reloadPages').remove();
	if(option&&localStorage.logined=='no')
		href=option;
	var id='#'+href;
	if(reload=='true'){		
		$("._content").prepend('<div id="'+href+'" class="_reloadPages"></div>');
		$.ajax({
			url: "page/"+href+".html", 
			success: function(result){        	
        		$(id).html(result);
				}
			});
	}
	
	else{
		if(document.getElementById(href)){
			$(id).css('display','block');
		}
		else{
		$("._content").prepend('<div id="'+href+'" class="_pages"></div>');
		$.ajax({
			url: "page/"+href+".html", 
			success: function(result){        	
        		$(id).html(result);
				}
			});
		}
	}	
}
function PhoneButton(){
	 $('#menuBar').click(function(){
            $('._menu').animate({left:'0'});
            })
	 $('._menu').click(function(){
	 		$('._menu').animate({left:'-100%'});
	 })
}
function ResetInput(input){
	$(input).on('focus',function(){
		$(this).val('');
		return;
	})
}
function EnterSubmit(ele){
	$(window).unbind('keydown').keydown(function(e){
		if(e.which==13){
			e.preventDefault();
			$(ele).click();
		}
	})
}
function checkData(str){
		var regExp=/[^0-9a-zA-Z]/;
		return regExp.test(str);
	}
function CheckInput(ele,addition){
	$(ele).on('change keyup',function(){
		console.log('323');
		var str=$(this).val();
		var display=$(this).parent().next().children();
		if(str=='')
			display.text('未輸入');
		else if(checkData(str))
			display.text('請輸入英文或數字');
		else{
			if(addition)addition();			
			else display.text('✔');
		}
	})
}
function AjaxPost(route,data,success,error){
	console.log('AjaxPost');
	$.ajax({
			type:"POST",
			url:ip+route,
			data:data,
			success:function(res){
				if(success)success(res);
			},
			error:function(res){
				if(error)error(res);
			}
		}).done(function(){
			console.log('POST done');
		})
	}
function block(){
	$('#block_you').css('display','block');
}
function close_block(){
	$('#block_you').css('display','none');
}