/* http://alfaservis.by/ */
$(function(){
        //Добавляем нашу форму к элементу <body> (естественно, добавить можно к любому, не принципиально)
        $('.form').append('[[ddGetChunk? &name=`feedbackForm`]]');

        var form = $('#myForm'), submit = form.find('input[type=submit]')
           ,inp , sel1, sel2, sel3

        //Применяем плагин $.form к нашей форме и назначаем функцию после отправки
        $('#myForm').ajaxForm(function(reply){
            //У объекта reply будет следующая структура: {status: true, title: '', message: ''}
            alert(reply.title + '\r\n' + reply.message);
        });

        //Ограничиваем вводимые символы для VIN
        $("#vin").bind("keypress", function(event) {
            if (event.which <= 13) return true;
            return /[0-9A-z]/.test(String.fromCharCode(event.which));
        });

        inp = sel1 = sel2 = sel3 = 0

        function check_empty(){
        var el = $(this)

            el.val() && ++inp
        }

        setInterval(function(){
            inp = sel1 + sel2 + sel3
            form.find('input[type=text]').each(check_empty)

            if(8 == inp){// если все
                submit.addClass('all')
            } else {// или
                submit.removeClass('all')
            }
        }, 512);

        //Эффект для селектов
        $("#select-1").selectbox({
            effect: "fade"
            ,onChange: function(v){
                 if(v){
                    sel1 = 1
                    $(".select-1 .sbSelector").removeClass('notvalid')
                 } else {
                    sel1 = 0
                    $(".select-1 .sbSelector").addClass('notvalid')
                 }}
            ,onClose: function (inst) {
                form.removeClass("selectopen")
            }
            ,onOpen: function (inst) {
                form.addClass("selectopen")
            }
        });
        $("#select-2").selectbox({
            effect: "fade"
            ,onChange: function(v){
                 if(v){
                    sel2 = 1
                    $(".select-2 .sbSelector").removeClass('notvalid')
                 } else {
                    sel2 = 0
                    $(".select-2 .sbSelector").addClass('notvalid')
                 }}
            ,onClose: function (inst) {
                form.removeClass("selectopen")
            }
            ,onOpen: function (inst) {
                form.addClass("selectopen")
            }
        });
        $("#select-3").selectbox({
            effect: "fade"
            ,onChange: function(v){
                 if(v){
                    sel3 = 1
                    $(".select-3 .sbSelector").removeClass('notvalid')
                 } else {
                    sel2 = 0
                    $(".select-3 .sbSelector").addClass('notvalid')
                 }}
            ,onClose: function (inst) {
                form.removeClass("selectopen")
            }
            ,onOpen: function (inst) {
                form.addClass("selectopen")
            }
        });

        $(".select-1 .sbSelector").addClass('notvalid')
        $(".select-2 .sbSelector").addClass('notvalid')
        $(".select-3 .sbSelector").addClass('notvalid')
});
