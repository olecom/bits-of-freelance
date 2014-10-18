/* http://alfaservis.by/ */
$(function(){
        //Добавляем нашу форму к элементу <body> (естественно, добавить можно к любому, не принципиально)
        $('.form').append('[[ddGetChunk? &name=`feedbackForm`]]');

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

        $(function () {
        $("#select-1").selectbox({
            effect: "fade"
            ,onClose: function (inst) {
            $("#myForm").removeClass("selectopen")
        }
            ,onOpen: function (inst) {
            $("#myForm").addClass("selectopen")
        }
        });
        $("#select-2").selectbox({
            effect: "fade"
            ,onClose: function (inst) {
            $("#myForm").removeClass("selectopen")
        }
            ,onOpen: function (inst) {
            $("#myForm").addClass("selectopen")
        }
        });
        $("#select-3").selectbox({
            effect: "fade"
            ,onClose: function (inst) {
            $("#myForm").removeClass("selectopen")
        }
            ,onOpen: function (inst) {
            $("#myForm").addClass("selectopen")
        }
        });
        });
});
