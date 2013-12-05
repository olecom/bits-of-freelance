$(document).ready(function() {

    setSelectedFilters();

    //ole: submit on every filter checkbox change (autofilter)
    // `form id="filterform"`
    //  `input id="disc" name="sales" value="1" class="checkbox"`
    //
    $('#filterform .checkbox').on('change', function (e) {
        submitFiltersForm();
    });

    $('#select').on('change', function (e) {
        $('input[name=orderBy]').val($(this).val());

        submitFiltersForm();
    });

    // ole: fix pagination without filter values in URL from backend
    var path = window.location.pathname
        ,form = $('#filterform')
        ,fget = form.serialize()

    $(".navigator_block a").each(function(){
        var el = $(this)
           ,href = el.attr("href")//catalog/apparel.html?orderBy=&cat_start=12
        el.attr("href", href.replace(/.*cat_start/, path + '?' + fget + '&cat_start'))
    })
    //ole: use cached `form`
    form.on('submit', function (e) {
        e.preventDefault();
        submitFiltersForm();
    })

    $('#showAll').on('click', function (e) {
        e.preventDefault();

        if ($('input[name=show]').attr('checked')) {
            $('input[name=show]').attr('checked', false);
        } else {
            $('input[name=show]').attr('checked', true);
        }

        submitFiltersForm();
    });

});

function setSelectedFilters() {
    var uri = new Uri(decodeURIComponent(window.location.href).replace(/\+/g,' ')),
        c = {checked: "checked"},
        s = {selected: "selected"},
        arr = array_unique(getUrlVars());

    var k = $('#filterform');

    for (var i = 0; i < arr.length; i++) {
        n = uri.getQueryParamValues(arr[i]);
        for (var b = 0; b < n.length; b++) {
         k.find('input[name="'+arr[i]+'"]:[type="checkbox"]:[value="'+n[b]+'"]').attr(c);
         k.find('input[name="'+arr[i]+'"]:[type="radio"]:[value="'+n[b]+'"]').attr(c);
        }
    }

    if (uri.getQueryParamValue('show') === 'all') {
        $('#showAll').text('Постранично');
    }

    $('input[name=orderBy]').val(uri.getQueryParamValue('orderBy') || '');

}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}

function array_unique( array ) {
    var p, i, j;
    for(i = array.length; i;){
        for(p = --i; p > 0;){
            if(array[i] === array[--p]){
                for(j = p; --p && array[i] === array[p];);
                i -= array.splice(p + 1, j - p).length;
            }
        }
    }
    return array;
}

function submitFiltersForm() {
    var form = $('#filterform')

    /*ole: fix FF and IE not clearing all checkboxes, by leaving this extra param
    * var orderBy = $('input[name=orderBy]').val();
    * if (!orderBy) {
    *     $('input[name=orderBy]').remove();
    * }
    */

    form.off('submit');
    form.submit();
}
