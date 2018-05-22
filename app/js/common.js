$(function() {
  var amountLoadedComments = 5;

  new Promise(function(resolve){
    getComments(5, 0)
  }).then(function(value){
  })
  $('.comments-list').click(function(e){
    if($(e.target).hasClass('comment-reply')){
      e.preventDefault();
      var target = $(e.target);
      if(!target.hasClass('active')){
        target.parent().after(
          '<div class="comment comment-leave">'+
  								'<div class="comment-reply">'+
  									'<img src="img/reply.png" alt="">'+
  									'Kurt Thompson'+
  								'</div>'+
  								'<div class="comment-cancel">'+
  									'<img src="img/cancel.png" alt="">'+
  									'Cancel'+
  								'</div>'+
  								'<form>'+
  									'<textarea name="message" placeholder="Your Message" required=""></textarea>'+
  									'<input type="submit" class="btn" value="Send">'+
  								'</form>'+
  							'</div>'
        )
        target.addClass('active');
      }
    }else if($(e.target).hasClass('comment-cancel')){
      console.log('cancel;');
      var target = $(e.target);
      if(target.parent().parent().find('.comment-actions .comment-reply').hasClass('active')){
        target.parent().parent().find('.comment-actions .comment-reply').removeClass('active');
        target.parent().parent().find('.comment-leave').remove();
        console.log('dasda')

      }
    }else if($(e.target).is('input[type="submit"]')){
      e.preventDefault();
      target = $(e.target);
      var commentElement = target.closest('.comment[item-id]');
      var  id = commentElement.attr('item-id');
      var message = target.parent().find('textarea').val();
      if(message!=''){
        sendMessage(message, id);
        setTimeout(function(){
          console.log('------')
          var index = commentElement.index();
          updateComment(id, commentElement, index);
        },1000)

      }
    }

  })

  function updateComment(id, commentEl, index){
    $.ajax({
      url: 'http://frontend-test.pingbull.com/pages/oreligr2@gmail.com/comments/'+id,
      type: 'POST',
      dateType: 'json',
      data: {
          _method: 'GET'
      },
      success: function(response){
        console.log(commentEl);
        var comment = generateComment(response);
        $('.comments-list > .comment:nth-child('+index+1+')').replaceWith(comment);
      }
    });
  }

  $('.load-more').click(function(e){
    e.preventDefault();
    moreComments();
  })

  function moreComments(){
    getComments(5, amountLoadedComments, true)
    amountLoadedComments += amountLoadedComments+5;
  }
  function getComments(count, offset, loadMore){
    $.ajax({
      url: 'http://frontend-test.pingbull.com/pages/oreligr2@gmail.com/comments',
      type: 'POST',
      dateType: 'json',
      data: {
          _method: 'GET',
          count: count,
          offset: offset
      },
      success: function(response){
        var html = '';
        console.log(response);
        response.forEach(function(element){

          html += generateComment(element);
        })
        if(loadMore){
          $('.comments-list').append(html);
        }else {
          $('.comments-list').prepend(html);
        }

      }
    });
  }
  function generateComment(element){
    var comment = ''
    commentDate = getCommentDate(element.created_at);
    commentTime = getCommentTime(element.created_at);
      comment = '<div class="comment" item-id="' +element.id +'">'+
                      '<div class="comment-img">'+
                        '<img src="' +element.author.avatar+'" alt="">'+
                      '</div>'+
                      '<div class="comment-description">'+
                      '<div class="comment-author">' +element.author.name+'</div>'+
                      '<div class="comment-date">'+
                      '<img src="img/time.png" alt="">'+
                      '<strong>' +commentDate +'</strong> at <strong>'+commentTime+'</strong>'+
                      '</div>'+
                      '</div>'+
                      '<div class="comment-content">'+
                      '<p>' +element.content +'</p>'+
                      '</div>'+
                      '<div class="comment-actions">'+
                        '<a href="#" class="comment-edit">'+
                          '<img src="img/edit.png" alt="">'+
                          'Edit'+
                        '</a>'+
                        '<a href="#" class="comment-delete">'+
                          '<img src="img/delete.png" alt="">'+
                          'Delete'+
                        '</a>'+
                        '<a href="#" class="comment-reply">'+
                          '<img src="img/reply.png" alt="">'+
                          'Reply'+
                        '</a>'+
                      '</div>';


      if(element.children && element.children.length != 0){
        comment += '<div class="comment-replies">';
        element.children.forEach(function(child){
          commentDate = getCommentDate(child.created_at);
          commentTime = getCommentTime(child.created_at);
          comment +=
          '<div class="comment">'+
            '<div class="comment-img">'+
              '<img src="' +child.author.avatar +'" alt="">'+
            '</div>'+
            '<div class="comment-description">'+
              '<div class="comment-author">Sarah Fleming</div>'+
              '<div class="comment-replied">'+
                '<img src="img/reply.png" alt="">'+
                ''+element.author.name+''+
              '</div>'+
              '<div class="comment-date">'+
                '<img src="img/time.png" alt="">'+
                '<strong>' + commentDate +'</strong> at <strong>' +commentTime +'</strong>'+
              '</div>'+
            '</div>'+
            '<div class="comment-content">'+
              '<p>' +child.content +'</p>'+
            '</div>'+
          '</div>';
        })

      }
      comment += '</div>';
    comment += '</div>';
    return comment;

  }
  function getCommentDate(date){
    newDate = date.split('T');
    return newDate[0];
  }
  function getCommentTime(time){
    newTime = time.split('T')[1].split(':',2);
    console.log(newTime);
    return newTime[0] +':'+ newTime[1];
  }
  $('.form-leave-comment').submit(function(e){
    e.preventDefault();
    var message = $(this).find('textarea[name="message"]').val();
    sendMessage(message);
  })
  function sendMessage(content, parentId){
    if(parentId){
      console.log(parentId);
    }else {
      parentId = null
    }
    $.ajax({
      url: 'http://frontend-test.pingbull.com/pages/oreligr2@gmail.com/comments',
      type: 'POST',
      dateType: 'json',
      data: {
          parent: parentId,
          content: content
      },
      success: function(response){
        console.log('New Comment Added');
        $('.form-leave-comment textarea').val('');
        if(parentId){

        }else {
          getComments(1,0);
        }


      }
    });
  }

});
