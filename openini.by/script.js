/* http://openini.by/parket/boen/fashion-new-2014.html */

var catalog = $('#catalog');
var last_element = $('#catalog li').eq(-2);
var first_element = $('#catalog li').eq(1);
var scroll_correction = 0;
var top_arrow_hidden = 1;

var scroll_offset = 0;

function set_bottom_scroller_pos()
{
		var top_pos = (catalog.offset().top + catalog.height() + 6) + 'px';

		$('#scroller_down').css({top: top_pos });
};

function resize_catalog()
{
	if ( ($(".slide_text").position().top - 110) <= (catalog.position().top + catalog.height()))
	{

		var new_height = Math.floor( ($(".slide_text").position().top-110) / 23);
		// alert(new_height);
		//$('#catalog').height(($(".slide_text").position().top)-110);
		$('#catalog').height(new_height * 23);
		show_bottom_arrow();
	}
	else
	{
		$('#catalog').css('height', 'auto');
		hide_bottom_arrow();
	}
	set_bottom_scroller_pos();
	scroll_correction = $('#catalog').height() % 23;

};

function scroll_up()
{
	if(first_element.position().top == catalog.offset().top)
	{
		hide_top_arrow();
		top_arrow_hidden = 1;
	}

		scroll_offset--;

	show_bottom_arrow();
};

function scroll_down()
{

	if(last_element.position().top == (catalog.offset().top + catalog.height() - 23))
	{
		hide_bottom_arrow();
	}

		scroll_offset++;


	show_top_arrow();
};


function check_arrows()
{
	if(first_element.position().top == catalog.offset().top)
	{

		hide_top_arrow();
	};

	if(last_element.position().top == (catalog.offset().top + catalog.height() - 23))
	{
		hide_bottom_arrow();
	};

};

function hide_top_arrow()
{
	$('.arrow_up').fadeOut('fast');
};

function show_top_arrow()
{
	$('.arrow_up').fadeIn('fast');
};

function hide_bottom_arrow()
{
	$('.arrow_down').fadeOut('fast');
};

function show_bottom_arrow()
{
	$('.arrow_down').fadeIn('fast');
};

function image_label() {
	$('#slider .slide span').each(function(k, v){
	    var left = $(v).parent().find('img').width() + 333 - $(v).width();
		if ( $(document).width() <= $(this).width()+left ) {
			$(v).css('left', $(window).width() - $(this).width() - 12);
		} else {
			$(v).css('left', left);
		}
	});
}

$(document).ready(function () {
    image_label();
//Slider
	$('#slider').before('<div id="spager">').cycle({
		fx:     'fade',
		slideExpr: 'div.slide',
		speed:  1000,
		timeout: 0,
		autostopCount: 0,
		pause: 1,
		pager: '#spager'
	}).after('</div>');


	$('.details, .details_list').mouseleave(function() {
		$('.over img').removeClass('visible');
		$('#title').html('&nbsp;');
		$('#title1').html('&nbsp;');
	});

	if (($.browser.msie) && ($.browser.version == '9.0')) {
		$('body').addClass('ie9');
	}
	var mouseisdown = false;

	$('.arrow_up').mousedown(function(event) {
jQuery('#catalog').scrollTo({top:'-=23px', left:'0'}, 200,{onAfter:function(){ scroll_up();} });
	});

	 $('.arrow_down').mousedown(function(event) {
jQuery('#catalog').scrollTo({top:'+=23px', left:'0'}, 200, {onAfter:function(){ scroll_down();} } );
	});

	//** Anton 12.07.2013  */
	$('.breadcrumbs .link').on('click', function(){
		var speed = 600;
	  var content = $(this).parents('body').find('#content_section');
		var that    = this;
		if ( !$('div:not(:hidden)', content).length ) {
			$('div[data-section="'+$(this).data('section')+'"]', content).fadeToggle(speed);
		} else {
			if ( $(this).data('section') == $('div[data-section]:not(:hidden)', content).data('section') ) {
				$('div[data-section]', content).fadeOut(speed);
			} else {
				$('div[data-section]', content).fadeOut(speed, function(){
					$('div[data-section="'+$(that).data('section')+'"]', content).fadeIn(speed);
				});
			}
		}
	});

	$('#content_section .close.section').on('click', function(){
		$('.breadcrumbs .link[data-section="'+$(this).parent().data('section')+'"]').trigger('click');
	});

	$('#spager a, div.slider_arrow').on('click', function(){
		image_label();
	});
});

	$(window).load(function(){
	image_label();
		resize_catalog();
		var top = $('#catalog').offset().top - 17;
		$('#scroller_top').css({top: top});
		if(window.location.hash != '') {scroll_offset = window.location.hash.substring(1);}

			$('#catalog').css('visibility','visible').hide().fadeIn('slow');
//	jQuery('#catalog').scrollTo($( '#' + a), 0, {onAfter:function(){	check_arrows();} });
jQuery('#catalog').scrollTo('+=' + (scroll_offset )* 23 + 'px', 0, {onAfter:function(){	check_arrows();} });
	//$('li[id^="left"] > a').mousedown(function(){	alert(1);});
	$('li[id^="left"] > a').live("click", function(){
		var old_link = $(this).attr('href');

	$(this).attr('href', old_link + '#' + scroll_offset); });
    });

    $(window).resize(function(){
		resize_catalog();
		check_arrows();
		image_label();
		//var top = $('#catalog').offset().top + $('#catalog').height()+13;
		//$('#scroller_down').css({top: top});

    });

