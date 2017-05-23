$('._loading').css('display','block')
	AjaxPost(
		'article/article',
		'',
		function(res){
			$.map(res,function(article){
				$('#articleArea').prepend('<p><span class="atitle">'+article.Title+
					'<br></span>'+
					'<span class="popular">人氣:'+article.Popular+
					'</span><span class="author">'+article.Username+'<br>'+
					article.Date.toString().substr(0,10)+
					'</span></p>');
				$('#articleArea').find('p').first()
					.attr('title',article.Title)
					.attr('date',article.Date)
					.attr('author',article.Username)
					.attr('id',article._id)
					$('._loading').css('display','none')
			})
			
			$('#articleArea').find('p').click(function(){
				_goback='article';
				_articleObj.title=$(this).attr('title'),
				_articleObj.author=$(this).attr('author'),
				_articleObj.date=$(this).attr('date'),
				_articleObj.id=$(this).attr('id');
				location.href='#singleArticle';
				})
			}
		)