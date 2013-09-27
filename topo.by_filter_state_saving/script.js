$(document).ready(function() {

  /**
   * Tables <
   */

  $("table").each(function () {
    $(this).find("tr:odd").addClass("odd");
  });

  /**
   * Tables >
   */

  $(".item-list ul.pager li.pager-item:last").addClass("last-child");

  /**
   * Exhibitions list <
   */

  $(".b-view-exhibitions .b-views-attachment .b-views-header a").toggle(function () {
    $(this).parent().parent().parent().find(".b-views-content").show();
    return false;
  }, function () {
    $(this).parent().parent().parent().find(".b-views-content").hide();
    return false;
  });

  $(".btn-submit").click(function () {

    $("form").submit();
    return false;
  });

  /**
   * Exhibitions list >
   */

/*   $(".b-order-table-number label").each(function () {
    if($(this).find("input").attr("checked") == true) $(this).addClass("checked");
  });

  $(".b-order-table-number label input").change(function () {
    if($(this).attr("checked") == true) $(this).parent().addClass("checked");
  }); */

  $(".b-order-table-number label input:checked").parent().addClass("checked");

  $(".b-order-table-number label input").change(function () {
    $(this).parent().parent().find("label").removeClass("checked");
    newId = $(this).attr("id");
    $("label." + newId).addClass("checked");
  });

  /**
   * .b-filter_brands-more span
   */

  $(".b-filter_brands li:gt(4)").not('.b-filter_brands-more').hide();
  if($(".b-filter_brands li:not('.b-filter_brands-more')").length < 5) $('.b-filter_brands-more').hide();
  //if($(".b-filter_brands li").length < 5) $('.b-filter_brands-more').hide();


  $(".b-filter_brands-more span").toggle(function () {
    $(this).text('Свернуть');
    $(".b-filter_brands li:gt(4)").show();
  }, function () {
    $(this).text('Eще');
    $(".b-filter_brands li:gt(4)").not('.b-filter_brands-more').hide();
  });

  if($(".b-filter_brands li input:checked").length > 0) {
    $(".b-filter_brands li:gt(4)").show();
    $(".b-filter_brands-more span").text('Свернуть');
  }

  /**
   * .b-filter_brands-more span
   */

  /**
   * Brand slider <
   */

  promoSwitcher = setInterval(promoSwitcher, 5000);


/*   $(".b-promo").hover(function () {
    clearInterval(promoSwitcher);
  }); */

  $(".b-promo-switcher a").click(function () {
    $(".b-promo-switcher li").removeClass("active");
    $(this).parent().addClass("active");
    dest = $(this).attr('id').slice(5);
    $(".b-promo-container .active").animate({opacity: 0}, 500, function () {
      $(this).removeClass("active");
      $(".b-promo-" + dest).css({opacity: 0}).addClass("active").animate({opacity: 1}, 500);
    });
    return false;
  });

  $(".b-promo-switcher ul").css({opacity: 0.5});

  /**
   * Brand slider >
   */

  /**
   * Disable submit button while requre fields are empty <
   */

  if($(".b-body-content form").length) {
    checkForm();
    $(".b-body-content .form-item .form-text, .b-body-content .form-item textarea").keyup(function () {
      checkForm();
    });
  }

  /**
   * Disable submit button while requre fields are empty >
   */

  /**
   * Placeholder <
   */

    $("form#search-block-form input[type=text]").addClass("greyer").focus(function () {
        var searchFieldValue = $(this).attr("value");
        if (searchFieldValue == 'Поиск') {
            $(this).attr("value", "").removeClass("greyer");
        }
    });

    $("form#search-block-form input[type=text]").blur(function () {
        var searchFieldValue = $(this).attr("value");
        if (!searchFieldValue) {
            $(this).attr("value", "Поиск").addClass("greyer");
        }
    });

  /**
   * Placeholder >
   */

if ( "/" == window.location.pathname)
    document.cookie = "url=; path=/"; //ole: mem reset

  /**
   * Catalog <
   */

  mode = 'samples';
type = $(".b-catalog-body").attr('type');
var a, m;
 country  = new Array();
 category  = new Array();
 sex       = new Array();
 //sex       = new Array('male', 'female');
if (type == "female") {
m = decodeURIComponent(document.cookie).match(/categoryfemale=([^&]+)/);
if (m != null) { //ole: mem
    a = m[1].split(/,/)
    if (a.length > 0)
        category = a;
} else { country.push("1") ;}
m = decodeURIComponent(document.cookie).match(/countryfemale=([^&]+)/);
if (m != null) {
    a = m[1].split(/,/)
    if (a.length > 0) {
        country = a;
    }  else { country.push("7"); country.push("8"); }
} else { country.push("7"); country.push("8"); }

} else
if (type == "male") {
m = decodeURIComponent(document.cookie).match(/categorymale=([^&]+)/);
if (m != null) { //ole: mem
    a = m[1].split(/,/)
    if (a.length > 0)
        category = a;
} else { country.push("1") ;}

m = decodeURIComponent(document.cookie).match(/countrymale=([^&]+)/);
if (m != null) {
    a = m[1].split(/,/)
    if (a.length > 0) {
        country = a;
    } else { country.push("7"); country.push("8"); }
} else { country.push("7"); country.push("8"); }
} else {
if (type == "available") {
m = decodeURIComponent(document.cookie).match(/categoryavailable=([^&]+)/);
if (m != null) { //ole: mem
    a = m[1].split(/,/)
    if (a.length > 0) {
        category = a;
    } else { category.push("1") ;}
} else { category.push("1") ;}
m = decodeURIComponent(document.cookie).match(/countryavailable=([^&]+)/);
if (m != null) {
    a = m[1].split(/,/)
    if (a.length > 0) {
        country = a;
    } else { country.push("7"); country.push("8"); }
} else { country.push("7"); country.push("8"); }

m = decodeURIComponent(document.cookie).match(/sexavailable=([^&]+)/);
if (m != null) {
    a = m[1].split(/,/)
    if (a.length > 0) {
        sex = a;
    } else { sex.push('male'); sex.push('female'); }
} else { sex.push('male'); sex.push('female'); }
}
}
  brand     = new Array();
  years     = new Array();
  page      = 0;

//console.log("coo:" +decodeURIComponent(document.cookie));

  $(".b-filter_categories input").each(function () {
/*m = decodeURIComponent(document.cookie).match(/categorymale=([^&]+)/);
if (m != null) { //ole: mem
}*/
$(this).removeAttr("checked");
if(0<category.length) { // ole: mem
 for(var i=0; i<category.length; i++)
  if(category[i] == $(this).val()) {
    $(this).attr('checked','checked');
    break;
 }
} else {
  	if ($(this).attr("checked")) {
      category.push($(this).val());
    } else {
      for(var i=0; i<category.length; i++) {
        if(category[i] == $(this).val()) category.splice(i, 1);
      }
    }
}
    catalogGet();
  });

  $(".b-filter_countries input").each(function () {
$(this).removeAttr("checked"); //ole:remove std val
if(0<country.length) { // ole: mem
 for(var i=0; i<country.length; i++)
  if(country[i] == $(this).val()) {
    $(this).attr('checked','checked');
    break;
 }
} else {
    if ($(this).attr("checked")) {
      country.push($(this).val());
    } else {
      for(var i=0; i<country.length; i++) {
        if(country[i] == $(this).val()) country.splice(i, 1);
      }
    }
}
    catalogGet();
  });

  $(".b-filter_sex input").each(function () {
$(this).removeAttr("checked"); //ole:remove std val
if(0<sex.length) { // ole: mem
 for(var i=0; i<sex.length; i++)
  if(sex[i] == $(this).val()) {
    $(this).attr('checked','checked');
    break;
 }
} else {
    if ($(this).attr("checked")) {
      sex.push($(this).val());
    } else {
      for(var i=0; i<sex.length; i++) {
        if(sex[i] == $(this).val()) sex.splice(i, 1);
      }
    }
}
    catalogGet();
  });


  $(".b-filter_categories input").click(function () {
    if ($(this).attr("checked")) {
      category.push($(this).val());
    } else {
      for(var i=0; i<category.length; i++) {
        if(category[i] == $(this).val()) category.splice(i, 1);
      }
    }

    if (0 == category.length) { //ole: category default -- 1
        category.push("1");

  $(".b-filter_categories input").each(function () {
/*m = decodeURIComponent(document.cookie).match(/categorymale=([^&]+)/);
if (m != null) { //ole: mem
}*/
$(this).removeAttr("checked");
if(0<category.length) { // ole: mem
 for(var i=0; i<category.length; i++)
  if(category[i] == $(this).val()) {
    $(this).attr('checked','checked');
    break;
 }
} else {
  	if ($(this).attr("checked")) {
      category.push($(this).val());
    } else {
      for(var i=0; i<category.length; i++) {
        if(category[i] == $(this).val()) category.splice(i, 1);
      }
    }
}
    });
    }
    catalogGet(0);
  });

  $(".b-filter_sex input").click(function () {
    if ($(this).attr("checked")) {
      sex.push($(this).val());
    } else {
      for(var i=0; i<sex.length; i++) {
        if(sex[i] == $(this).val()) sex.splice(i, 1);
      }
    }

    if (0 == sex.length) { //ole: sex default -- full set
        sex.push('male'); sex.push('female');
  $(".b-filter_sex input").each(function () {
$(this).removeAttr("checked"); //ole:remove std val
if(0<sex.length) { // ole: mem
 for(var i=0; i<sex.length; i++)
  if(sex[i] == $(this).val()) {
    $(this).attr('checked','checked');
    break;
 }
} else {
    if ($(this).attr("checked")) {
      sex.push($(this).val());
    } else {
      for(var i=0; i<sex.length; i++) {
        if(sex[i] == $(this).val()) sex.splice(i, 1);
      }
    }
}
    });
    }
    catalogGet(0);
  });

  $(".b-filter_countries input").click(function () {
    if ($(this).attr("checked")) {
      country.push($(this).val());
    } else {
      for(var i=0; i<country.length; i++) {
        if(country[i] == $(this).val()) country.splice(i, 1);
      }
    }
      if (0 == country.length) { //ole: country default -- full set
        country.push("7"); country.push("8");

  $(".b-filter_countries input").each(function () {
$(this).removeAttr("checked");
if(0<country.length) { // ole: mem
 for(var i=0; i<country.length; i++)
  if(country[i] == $(this).val()) {
    $(this).attr('checked','checked');
    break;
 }
} else {
    if ($(this).attr("checked")) {
      country.push($(this).val());
    } else {
      for(var i=0; i<country.length; i++) {
        if(country[i] == $(this).val()) country.splice(i, 1);
      }
    }
}
      });

      }

    catalogGet(0);
  });

  $(".b-filter_brands input").click(function () {
    if ($(this).attr("checked")) {
      brand.push($(this).val());
    } else {
      for(var i=0; i<brand.length; i++) {
        if(brand[i] == $(this).val()) brand.splice(i, 1);
      }
    }
    catalogGet();
  });

  $(".b-filter_years input").click(function () {
    if ($(this).attr("checked")) {
      years.push($(this).val());
    } else {
      for(var i=0; i<years.length; i++) {
        if(years[i] == $(this).val()) years.splice(i, 1);
      }
    }
    catalogGet();
  });

  $(".b-catalog-header-articles a").click(function () {
    currentMode = $(this).attr("mode");

    if (currentMode == 'articles') {
      mode = 'samples';
      $(".b-catalog-header-articles a").attr('mode', mode).html('список артикулов');
    }
    if (currentMode == 'samples') {
      mode = 'articles';
      $(".b-catalog-header-articles a").attr('mode', mode).html('образцы');
    }
    catalogGet();
    return false;
  });
/*
  if (parseInt($(".b-pager li.pager-previous a").attr('page')) < 0) $(".b-pager li.pager-previous a").addClass("unclick");
 */
/*   $(".b-pager a").not(".unclick").click(function () {
     $(".b-pager li").removeClass("pager-current");
    $(this).parent().addClass("pager-current");

    page = parseInt($(this).attr('page'));

    $(".b-pager li.pager-previous a").attr("page", (page - 1));
    $(".b-pager li.pager-next a").attr("page", (page + 1));

    if (parseInt($(".b-pager li.pager-previous a").attr('page')) < 0) $(".b-pager li.pager-previous").addClass("unclick");
      else $(".b-pager li.pager-previous a").removeClass("unclick").css({opacity: 1});


    catalogGet();
    return false;
  }); */

  $(".unclick").css({opacity: 0}).click(function () {
    return false;
  });


  /**
   * Basket counter <
   */

  $(".b-counter-minus, .b-counter-plus").click(function () {
    counterResult = $(this).parent().find(".b-counter-result");
    url = $(this).attr('href');
    $.ajax({
      url: url,
      success: function(data) {
        counterResult.html(data);
      }
    });
    return false;
  });

/*   $(".b-counter-minus").click(function () {
    startValue  = parseInt($(this).parent().find(".b-counter-result").text());
    increment   = parseInt($(this).parent().find(".b-counter-result").attr('basevalue'));
    newValue = startValue - increment;
    if(newValue < increment) newValue = increment;
    $(this).parent().find(".b-counter-result").html(newValue);
    $(this).parent().find(".b-counter-hidden").attr("value", newValue);
    return false;
  });

  $(".b-counter-plus").click(function () {
    startValue  = parseInt($(this).parent().find(".b-counter-result").text());
    increment   = parseInt($(this).parent().find(".b-counter-result").attr('basevalue'));
    newValue = startValue + increment;
    $(this).parent().find(".b-counter-result").html(newValue);
    $(this).parent().find(".b-counter-hidden").attr("value", newValue);
    return false;
  }); */

  /**
   * Basket counter >
   */

  /**
   * Pager <
   */

  hidePagerItems();


  /**
   * Pager >
   */

  /**
   * Catalog >
   */

  $(".w-order-form .b-form-item input").each(function () {
    if ($(this).val()) $(this).parent().find("span").css({top: '-10000px'});
  });

  $(".w-order-form .b-form-item input").keypress(function () {
    $(this).find("+ span").css({top: '-10000px'});
  });

  $(".w-order-form .b-form-item input").blur(function () {
    if(!$(this).val()) $(this).parent().find("span").css({top: '2px'});
  });

  $(".btn-delete").hover(function () {
    $(this).parent().parent().parent().find("p").animate({opacity: 0.2}, 200);
  }, function () {
    $(this).parent().parent().parent().find("p").animate({opacity: 1}, 200);
  });

  $(".btn-order").click(function () {
    if ($(this).hasClass("btn-order")) {
      $(this).html("...")
      url = $(this).attr('href');
      $.ajax({
        url: url,
        success: function(data) {
          $(".btn-order").removeClass("btn-order").html("Уже в корзине").attr("title", "Уже в корзине").attr("href", "/order");
        }
      });
      return false;
    }
  });


  $(".btn-cancel").click(function () {
    $("article .b-item input").attr("checked", "").parent().find(".b-item_teaser-text").removeClass("checked");
    url = $(this).attr('href');
    $.ajax({
      url: url,
      success: function(data) {

      }
    });
    return false;
  });



  $(".b-bulk-buttons").css({display: 'none'});
  if($(".b-item_teaser input:checked").length > 0) {
    $(".b-bulk-buttons").css({display: 'block'});
  }
  $(".b-item_teaser input").click(function () {
    if($(".b-item_teaser input:checked").length > 0) {
      $(".b-bulk-buttons").css({display: 'block'});
    } else {
      $(".b-bulk-buttons").css({display: 'none'});
    }
  });

});
/**
 * Promo Block Switcher <
 */

function hidePagerItems() {
  pagerLength = $(".b-pager .pager-item").length;
  $(".b-pager .b-pager-hellip").css({opacity: 0});
  if (pagerLength <= 9) return false;

  currentPage = parseInt($(".b-pager .pager-current a").html());

  if (currentPage < 2) {
    $(".b-pager .b-pager-hellip_begin").css({opacity: 0});
    $(".b-pager .b-pager-hellip_end").css({opacity: 1});
  } else {
    if (currentPage > (pagerLength - 1)) {
      $(".b-pager .b-pager-hellip_begin").css({opacity: 1});
      $(".b-pager .b-pager-hellip_end").css({opacity: 0});
    } else {
      $(".b-pager .b-pager-hellip_begin").css({opacity: 1});
      $(".b-pager .b-pager-hellip_end").css({opacity: 1});
    }
  }

  if (currentPage <= 5) {
    $(".b-pager .pager-item").show();
    $(".b-pager .pager-item:gt(8)").hide();
    $(".b-pager .pager-item").removeClass("last-child");
    $(".b-pager .pager-item:eq(8)").addClass("last-child");
  } else {
    if (currentPage > (pagerLength - 5)) {
      $(".b-pager .pager-item").show();
      $(".b-pager .pager-item:lt(" + (pagerLength - 9) + ")").hide();
      $(".b-pager .pager-item").removeClass("last-child");
      $(".b-pager .pager-item:eq(" + (pagerLength - 1) + ")").addClass("last-child");
    } else {
      $(".b-pager .pager-item").show();
      $(".b-pager .pager-item:lt(" + (currentPage - 5) + ")").hide();
      $(".b-pager .pager-item:gt(" + (currentPage + 3) + ")").hide();
      $(".b-pager .pager-item:eq(" + (currentPage + 3) + ")").addClass("last-child");
    }
  }

  //type = $(".b-catalog-body").attr('type');
//  $(".b-pager .pager-item a").attr('onClick', 'catalogGet(1);return !false;');
  $(".b-pager-hellip_next").attr('onClick', 'catalogGet(' + currentPage + '); return false;');
  $(".b-pager-hellip_next").attr('page', currentPage);
  $(".b-pager-hellip_next").attr('href', '/catalogue/' + type + '/' + currentPage);

  $(".b-pager-hellip_previous").attr('onClick', 'catalogGet(' + (currentPage - 2) + '); return false;');
  $(".b-pager-hellip_previous").attr('page', (currentPage - 2));
  $(".b-pager-hellip_previous").attr('href', '/catalogue/' + type + '/' + (currentPage - 2));

  return false;
}

function catalogGet(pageNumber) {
/*   if (action != 'pager') {
    page = 0;
    $(".b-pager li").removeClass("pager-current");
    $(".b-pager li.pager-item:eq(0)").addClass("pager-current");
  } */

    if ($("article").hasClass("loading"))
        return; //ole: one time load
var page = 0;
if(typeof pageNumber !== "undefined") {
page = pageNumber;
/*
console.log("path:" + window.location.pathname);
m = window.location.pathname.match(/[/]([\d]*)$/);
console.log("m: " + m[1]);

if (m != null) {
    page = parseInt(m[1]);
    if (pageNumber != page) page = pageNumber;
}
console.log("coo:" +decodeURIComponent(document.cookie));
*/
} else {
//var u = window.location.pathname.match(/[/]([\d]*)$/);

if ("male"==type) {

m = decodeURIComponent(document.cookie).match(/pagemale=([\d]+)/);
if (m != null /*&& u != null*/) {
//	u = parseInt(u[1]);
    page = parseInt(m[1]);
//console.log("page:" + page);
    //if (u != page) page = u;
}

} else {
m = decodeURIComponent(document.cookie).match(/pagefemale=([\d]+)/);
if (m != null /*&& u != null*/) {
//	u = parseInt(u[1]);
    page = parseInt(m[1]);
//console.log("page:" + page);
    //if (u != page) page = u;
}
}

}

/*
var page = 0;
console.log("pageNumber = " + pageNumber);
if(typeof pageNumber === "undefined") {
var u = window.location.path.match(/[/]([\d]*)$/);
if (u != null) {
m = decodeURIComponent(document.cookie).match(/[/]([^/]*)[?]/);
if (m != null) {
    page = parseInt(u[1]);
    if (page <> parseInt(m[1]))


}
}
} else if(pageNumber >= 0) page = pageNumber;

    else {
if ( "/" == window.location.pathname)
var m = decodeURIComponent(document.cookie).match(/[/]([^/]*)[?]/);

/*
    console.log("m = " + m);

*/
//}
//}

  $("article").addClass("loading");
  $('.b-catalog-body').html("");

  type = $('.b-catalog-body').attr('type');
  url = 'catalogue/' + type + '/' + page +'?mode=' + mode + '&sex=' + sex + '&type=' + type + '&category=' + category + '&country=' + country + '&brand=' + brand + '&years=' + years;

document.cookie = "category"+type+"="+encodeURIComponent(category+"&"+"page"+type+"="+page)+"; path=/";
document.cookie = "country"+type+"="+encodeURIComponent(country+"&"+"page"+type+"="+page)+"; path=/";
document.cookie = "sex"+type+"="+encodeURIComponent(sex+"&"+"page"+type+"="+page)+"; path=/";

//console.log("coo: " + decodeURIComponent(document.cookie));
/*console.log("country = " + country + "; c = " + category);*/

  $.ajax({
    url: url,
    success: function(data) {
      $('.b-catalog-body').html(data);
      var count = $(".b-catalog-body-total").attr('count'),
total = $(".b-catalog-body-total").attr('total'),
pagerCount = Math.ceil(total/count);

      $(".b-catalog-header-pager-count").html(count);
      $(".b-catalog-header-pager-total").html(total);

      if (mode == 'samples') {
        $(".b-pager").show();
      }
      if (mode == 'articles') {
        $(".b-pager").hide();
        $(".b-catalog-header-pager-count").html($(".b-catalog-header-pager-total").html());
      }

      if (pagerCount < 2) $(".b-pager").hide();
        else $(".b-pager").show();

      $(".b-pager li.pager-item").show().removeClass("last-child");
      $(".b-pager li.pager-item:gt(" + (pagerCount - 1) + ")").hide();
      $(".b-pager li.pager-item:eq(" + (pagerCount - 1) + ")").addClass("last-child");
      hidePagerItems();

      $("article").removeClass("loading");
    }
  });
}

function promoSwitcher() {
  $(".b-promo-container .active").animate({opacity: 0}, 500, function () {
    $(this).removeClass("active");
    if (!$(this).hasClass('last')) {
      $(this).find("+.b-promo-item").css({opacity: 0}).addClass("active").animate({opacity: 1}, 500);
      dest = $(this).find("+.b-promo-item").attr("id").slice(5);
    } else {
      $(".b-promo-container .b-promo-item:eq(0)").css({opacity: 0}).addClass("active").animate({opacity: 1}, 500);
      dest = '1';
    }
    $(".b-promo-switcher li").removeClass("active");
    $(".b-promo-switcher li a#link-" + dest).parent().addClass("active");
  });
}
/**
 * Brands slider <
 */


function brandsSlider() {
  brands = $(".b-brands");
  brandsContainer = $(".b-brands-container");
  brandsContainerPosition = parseInt(brandsContainer.css('left').slice(0,-2));
  delta = 150;
  brandsImages =  brandsContainer.find(".b-brand").length;
  brandsWidth = delta * brandsImages;
  brandsContainer.css({ width: brandsWidth + 'px' });

  if ((brandsWidth + brandsContainerPosition + 1) > brandsWidth) {
    newLeft = brandsContainerPosition - delta*6;
    brandsContainer.animate({ opacity: 0 }, 500, function () {
      brandsContainer.css({left: newLeft});
      brandsContainer.animate({ opacity: 1 }, 500);
    });
  } else {
    brandsContainer.animate({ opacity: 0 }, 500, function () {
      brandsContainer.css({left: 0});
      brandsContainer.animate({ opacity: 1 }, 500);
    });
  }
}

/**
 * Check if all require fields are filled <
 */

function checkForm() {
  isDisabled = false;
  $(".b-body-content form").find(".form-item").each(function () {
    if ($(this).find(".form-text").hasClass("required")) {
      if (!$(this).find(".form-text").val()) {
        isDisabled = true;
      }
    }
    if ($(this).find("textarea").hasClass("required")) {
      if (!$(this).find("textarea").val()) {
        isDisabled = true;
      }
    }
  });
  if (isDisabled) $(".b-body-content form .form-submit").attr("disabled", true);
    else $(".b-body-content form .form-submit").attr("disabled", false);
}


function addPending(nid, chckbx, catalogType) {

  isChecked = chckbx.attr('checked');
  if (isChecked == true) {
    var cancelLabel = 'Заказано';
    if (catalogType == 1) cancelLabel = 'Забронировано';
    chckbx.parent().find(".b-item_teaser-text").addClass("checked").text(cancelLabel);
    url = '/order/pending/' + nid;
    $.ajax({
      url: url,
      success: function(data) {

      }
    });
  } else {
    spanLabel = 'Заказать';
    if (catalogType == 1) spanLabel = 'Забронировать';
    chckbx.parent().find(".b-item_teaser-text").removeClass("checked").text(spanLabel);
    url = '/order/pending/delete/' + nid;
    $.ajax({
      url: url,
      success: function(data) {

      }
    });
  }

  if($(".b-item_teaser input:checked").length > 0) {
    $(".b-bulk-buttons").css({display: 'block'});
  }
  $(".b-item_teaser input").click(function () {
    if($(".b-item_teaser input:checked").length > 0) {
      $(".b-bulk-buttons").css({display: 'block'});
    } else {
      $(".b-bulk-buttons").css({display: 'none'});
    }
  });


}