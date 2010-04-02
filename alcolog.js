function AlcoLog(logs){
    this.logs = logs;
    this.makeDOM();
};

AlcoLog.prototype.makeHTML = function(){
    return[
        '<div class="alcolog">',
            '<table>',
                '<tr>',
                    '<td>',
                        '<input type="text" class="datepicker" />',
                        '<select class="drinkpicker" >',
                            '<option disabled>Выберите напиток</option>',
                            '<option value="Пиво">Пиво</option>',
                            '<option selected value="Вино">Вино</option>',
                            '<option value="Водка">Водка</option>',
                        '</select>',
                        '<input type="text" class="volumepicker" size="5" maxlength="5" /> мл.&nbsp;',
                        '<input type="button" value="Submit" class="submit" />',
                    '</td>',
                '</tr>',
                '<tr>',
                    '<td>',
                        '<div class="commit"></div>',
                    '</td>',
                '</tr>',
            '</table>',
        '</div>'
    ].join('');
};

AlcoLog.prototype.makeDOM = function(){
    this.elem = $(this.makeHTML()).appendTo('body');
    var _this = this;
    $.each({
        datepicker: '.datepicker',
        drinkpicker: '.drinkpicker',
        volumepicker: '.volumepicker',
        submit: '.submit',
        commit: '.commit'
    }, function(k, v){
        _this[k] = _this.elem.find(v);
    });

    this.datepicker.datepicker({dateFormat: 'dd.mm.yy', autoSize: true, firstDay: 1});


    this.volumepicker.keypress(function(event){
        return keyDownNumber(event);
    });

    this.submit.click(function(){
        var currentDate = _this.datepicker.val(),
            currentDrink = _this.drinkpicker.val(),
            currentVolume = _this.volumepicker.val();
        if (!_this.logs[currentDate]) {
            _this.logs[currentDate] = {};
        };
        if (!_this.logs[currentDate][currentDrink]) {
            _this.logs[currentDate][currentDrink] = + currentVolume;
        } else {
            _this.logs[currentDate][currentDrink] += + currentVolume;
        };

        $(this).attr('disabled', 'disabled').animate({disabled: ''}, 1000);
        _this.commit.text('Учтено: ' + currentDate + ' / ' + currentDrink + ' / ' + currentVolume + 'мл.').show();
        setTimeout(function(){ _this.commit.fadeOut() }, 3000);
    });

};

function keyDownNumber(e){  //цельнотянуто с http://www.gotdotnet.ru/forums/4/47901/
    var key = (typeof e.charCode == 'undefined' ? e.keyCode : e.charCode);
    if (e.ctrlKey || e.altKey || key < 58) return true;
    else return false;
};
