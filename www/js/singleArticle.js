Message($('.message_input'),$('.message_btn'),'message',_articleObj.id,'singleArticle')
	block();
	AjaxPost('article/single_article',{id:_articleObj.id},function(res){
					//console.log(res);
					var content=res[0].Article,
						message=res[0].Message
					console.log(message)
					$('#title').text(_articleObj.title);
					$('#date').text(_articleObj.date.substr(0,10));
					$('#author').text('author: '+_articleObj.author);
					$('#content').html(content);
					$.map(message,function(mes){
						$('.message_area').prepend('<p><span>'+
							'</span><small>'+mes.name+' '+
							mes.date.toString().substring(0,10)+'</small></p>').find('span').text(mes.message)
					})
					close_block()
				})		