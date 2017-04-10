
var ip='http://127.0.0.1:3000/';
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
	var option=$('._loginOption');
	option.each(function(){
		var first=$(this).find('a').first(),
		last=$(this).find('a').last();
		if(localStorage.logined=='no'){
			console.log('未登入');
			last.css('display','none');
		}
		else{
			console.log('已登入');
			first.css('display','none');
		}
	})	
}
function welcomeOption(text,func){//can only be used in reload pages
	$('#welcomeOption').text(text);
	$('#welcomeOption').unbind().click(function(){
		func();
	})	
}
function HeaderButton(href,reload){
	$('._content').find('._pages').css('display','none');
	$('._content').find('._pages').find('input').attr('disabled',true).unbind();
	$('._reloadPages').remove();
	var id='#'+href;
	console.log(href);	
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
	$(window).keyup(function(e){
		if(event.which==13){
			$(ele).click();
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
