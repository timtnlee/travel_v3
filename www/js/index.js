//var ip='http://127.0.0.1:3000/';
var ip='http://192.168.1.45:3000/';
function setIp(){
	var confirm=window.confirm('local host?');
	if(confirm)ip='http://127.0.0.1:3000/';
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
	$('#welcomeOption').text(text);
	$('#welcomeOption').unbind().click(function(){
		func();
	})	
}
function HeaderButton(target){
	var href=target.attr('href'),
		reload=target.attr('reload'),
		option=target.attr('optional');
	$('._content').find('._pages').css('display','none');
	$('._content').find('._pages').find('input').attr('disabled',true).unbind();
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
		$(id).find('input').attr('disabled',false);
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
function CheckInput(ele){
	$(ele).on('keyup',function(){
		console.log('323');
		var str=$(this).val();
		var display=$(this).next().next();
		if(str=='')
			display.text('未輸入');
		else if(checkData(str))
			display.text('請輸入英文或數字');
		else{
			display.text('✔');
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
