function submitOrder (){

    $.ajax({
      url: "sendorderform.php",
      type: "post",
      data: $('#feedbackOrderForm').serialize(),
      success: function(){
        resp = $.parseJSON(arguments[2].responseText);
        if (resp.error == 1) {
            $("#error_message").html(resp.message);
        }else {
            $('#feedbackOrderForm').slideToggle();
            $('.calc_value:first').val(0).keyup();

            if ($('#orderSendedMessage').css('display')=='none')
            $('#orderSendedMessage').html(resp.message).slideToggle();
        }
      },
      error:function(){
        //вывести сообщение о недоступности сервера или еще чего
        $("#error_message").html("Заказ не может быть отправлен, попробуйте позже");
      }
    });

}

function getOrderNumber() {
    $.ajax({
      url: "getordernumder.php",
      type: "post",
      data: "",
      success: function(){
            $('#txt_order_num').html(arguments[2].responseText);
            $('#order_number').val(arguments[2].responseText);
      },
      error:function(){
      }
    });
}

function declensionPages(count) {
  var res_count = count*1;
  var res_text="";
  var ser_text="";
   if(res_count %10 > 1 && res_count %10<5) {res_text= "а"; ser_text="о";}
   if(res_count%10 > 4 || res_count%10==0) {res_text= "ов"; ser_text="о";}
   if(res_count%100>10 && res_count%100<20) {res_text= "ов"; ser_text="о";}
   return "Найден"+ser_text+" "+res_count+" товар"+res_text;
}

function ajaxPagination() {
    $('#pagination a').click(function(event) {
                    event.preventDefault();
                    page = $(this).attr( 'href' ).split('?')[1].split('=')[1];
                    $('#filter_paginator').val(page);
                    onGetAjaxContent();
    });
}

function onGetAjaxContent() {
    $.ajax({
      url: "ajaxdata.html",
      type: "post",
      data: $('#filter_form').serializeArray(),
      success: function(){
            $('.search-results').empty();
            $('.search-results').css('display','none');
            $('.search-results').append(arguments[2].responseText).fadeIn('normal');
            ajaxPagination();
                        $('#resource_counter').text(declensionPages($('#total_pages_search').val()));
                        if ($('input:checkbox:checked').length==0) {
                        $('#resource_counter').hide();
                        $('.clear').hide();
                        }
      },
      error:function(){
        //ничего не делаем
        $('.search-results').fadeIn('normal');
      },
      beforeSend: function() {
        $('.search-results').fadeOut('normal');
      }
    });
}

//** On ready */
$(function() {
    $('.clear').hide();
    $(".top-line").sticky({topSpacing:40});
    $("#navigation").sticky({topSpacing:30});

    filterSetup()

    //** Calculator toggling */
    $('.calculator .switch').on('click', function(){
        $(this).parent().toggleClass('opened').find('.controls').slideToggle('fast');
    });

    //** Order form */
    $('#order .open-form, #order .cancel').on('click', function(){
        if($('#order_number').val()=='') getOrderNumber();
    });
    $('#order .open-form').on('click', function(){
        $('#order .pre-form').fadeToggle('fast', function(){
            $('#order form').fadeToggle();
        });
    });
    $('#order .cancel').on('click', function(){
        $('#order form').fadeToggle('fast', function(){
            $('#order .pre-form').fadeToggle();
        });
    });

    //** Placeholder functions */
    $('input[type="text"],textarea').each(function(k, v){
        var that = $(v);
        that.data("text", that.attr('placeholder'))
        .focus(function() {
            var $el = $(this);
            if (this.value == $el.data("text")) {
                this.value = "";
                $(this).css('color','#000');
            }
        })
        .blur(function() {
            if (this.value == "") {
                this.value = $(this).data("text");
                $(this).css('color','#888');
            } else {
                $(this).css('color','#000');
            }
        }).val(that.data("text")).css('color','#888');
        that.removeAttr('placeholder');
    });

    //** Scrolling function */
    $('a.scrollto').click(function(e){
        $(this).parents('ul').find('li').removeClass('active');
        $(this).parent().addClass('active');
        $('html,body').scrollTo(this.hash, this.hash, {gap:{y:-117}});
        e.preventDefault();
    });

    $('html,body').scrollTo(window.location.hash, window.location.hash, {gap:{y:-117}});

    //** Scroll top */
    $('.top-line').click(function(){
        $('html,body').scrollTo(0, 0, {gap:{y:-117}});
    });

});

function filterSetup(){
    var fltr = $('#filter')
        ,fd ,i ,l ,r = false
        ,lps

    if(!fltr.length) return

    fltr.find('.filter-item').removeClass('checked').find('input[type="checkbox"]').attr('checked', false);

    lps = window.location.pathname.substr(1,3)
    fd = decodeURIComponent(document.cookie).split(';')
    for(i = 0; i < fd.length; i++){
        l = fd[i]
        if((1 == l.indexOf('filter[') && (lps == l.slice(-3)))){
            if(!r) r = true
            fltr.find('.filter-item input[name="'+l.substr(1, l.length-5)+'"]')
                .click()
                .attr('checked', true)
                .parent()
                    .toggleClass('checked')
        }
    }
    if(r){// there are some filters in memory, load content
        onGetAjaxContent()
        $('#resource_counter').show()
        $('.clear').show()
    }

    fltr.find('.filter-item').on('click', function(){// on Toggle filter
        $(this).toggleClass('checked').find('input[type="checkbox"]').attr('checked', function(idx, old){
            var a = $(this).attr('name')
            if(old){
                delCookie(a)
            } else {
                document.cookie = encodeURIComponent(a) + '=' + lps
            }
            return this.checked = !old;
        });
        fltr.find('#filter_paginator').val(0);
        onGetAjaxContent();
                $('#resource_counter').show();
                $('.clear').show();
    });

    $('#filter-controls .clear').on('click', function(){// on Clear filter
        fltr.find('.filter-item').removeClass('checked').find('input[type="checkbox"]').attr('checked', false);

        var fd = decodeURIComponent(document.cookie).split(';')
            ,i ,l
        for(i = 0; i < fd.length; i++){
            l = fd[i]
            if(1 == l.indexOf('filter['))
                delCookie(l.substr(1, l.length-5))
        }

        onGetAjaxContent();
                $('#resource_counter').hide();
                $('.clear').hide();
    });
}

function delCookie(name)
{
    document.cookie = encodeURIComponent(name) + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
