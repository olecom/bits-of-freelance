$(document).ready(function() {

    setSelectedFilters();

    $('#select').on('change', function (e) {
        $('input[name=orderBy]').val($(this).val());

        submitFiltersForm();
    });

    $('#filterform').on('submit', function (e) {
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
    var uri = new Uri(decodeURIComponent(window.location.href).replace(/\+/g,' ')),
        form = $('#filterform'),
        orderBy = $('input[name=orderBy]').val();

    if (!orderBy) {
        $('input[name=orderBy]').remove();
    }

    form.off('submit');
    form.submit();
}