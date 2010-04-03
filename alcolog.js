function AlcoLog(logs, drinks){
    this.logs = logs;
    this.drinks = drinks;
    this.makeDOM();
};

AlcoLog.prototype.makeHTML = function(){
    var r = [
        '<div class="alcolog">',
            '<table>',
                '<tr>',
                    '<td>',
                        '<input type="text" class="datepicker" />',
                        '<select class="drinkpicker" >',
                            this.makeOptions(this.drinks),
                        '</select>',
                        '<input type="text" class="percent" readonly size="2" maxlength="2" /> %&nbsp;',
                        '<input type="text" class="volumepicker" size="5" maxlength="5" /> мл.&nbsp;',
                        '<input type="button" value="Submit" class="submit" disabled="disabled"/>',
                    '</td>',
                '</tr>',
                '<tr>',
                    '<td>',
                        '<div class="history"></div>',
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
    return r;
};

AlcoLog.prototype.makeOptions = function(values){
    var arr = ['<option selected disabled>Выберите напиток</option>'];
    $.each(values, function(k, v){
        var s = '<option value="' + k + '">' + k + '</option>';
        arr.push(s);
    });
    return arr.join();
};

AlcoLog.prototype.makeDOM = function(){
    this.elem = $(this.makeHTML()).appendTo('body');
    var _this = this;
    $.each({
        datepicker: '.datepicker',
        drinkpicker: '.drinkpicker',
        percent: '.percent',
        volumepicker: '.volumepicker',
        submit: '.submit',
        history: '.history',
        commit: '.commit'
    }, function(k, v){
        _this[k] = _this.elem.find(v);
    });

    this.datepicker.datepicker({dateFormat: 'dd.mm.yy', autoSize: true, firstDay: 1}).datepicker("setDate", '0');

    this.drinkpicker.change(function(){
        _this.percent.val(_this.drinks[$(this).val()]);
        if (($(this).val() != 'Выберите напиток') && (_this.datepicker.val() != '') && (_this.volumepicker.val() != '')) {
            _this.submit.attr('disabled', '');
        } else {
            _this.submit.attr('disabled', 'disabled');
        };
    });

    this.volumepicker.keypress(function(event){
        return keyDownNumber(event);
    });

    this.volumepicker.keyup(function(){
        if (($(this).val() != '') && (_this.datepicker.val() != '') && (_this.percent.val() != '')) {
            _this.submit.attr('disabled', '');
        } else {
            _this.submit.attr('disabled', 'disabled');
        };
    });

    this.datepicker.change(function(){
        if (($(this).val() != '') && (_this.volumepicker.val() != '') && (_this.percent.val() != '')) {
            _this.submit.attr('disabled', '');
        } else {
            _this.submit.attr('disabled', 'disabled');
        };

        var currentDate = _this.datepicker.val();
        $('.historyrec').remove();
        if (_this.logs[currentDate]) {
            $.each(_this.logs[currentDate], function(k, v){
                var name = k == 'totalDayAlcohol' ? 'Всего чистого алкоголя за день' : k;
                $('<div class="historyrec">' + currentDate + ' / ' + name + ': ' + v + 'мл.</div>').appendTo(_this.history);
                _this.history.show();
            });
        };

    });

    this.submit.click(function(){
        var currentDate = _this.datepicker.val(),
            currentDrink = _this.drinkpicker.val(),
            currentVolume = _this.volumepicker.val();
            currentPercent = _this.percent.val();
        if (!_this.logs[currentDate]) {
            _this.logs[currentDate] = {'totalDayAlcohol': 0};
        };
        if (!_this.logs[currentDate][currentDrink]) {
            _this.logs[currentDate][currentDrink] = + currentVolume;
        } else {
            _this.logs[currentDate][currentDrink] += + currentVolume;
        };
        _this.logs[currentDate]['totalDayAlcohol'] += + currentVolume * currentPercent / 100;
        $(this).attr('disabled', 'disabled');
        _this.volumepicker.val('');
        _this.drinkpicker.val('Выберите напиток');
        _this.percent.val('');

            $('.historyrec').remove();
            if (_this.logs[currentDate]) {
                $.each(_this.logs[currentDate], function(k, v){
                    var name = k == 'totalDayAlcohol' ? 'Всего чистого алкоголя за день' : k;
                    $('<div class="historyrec">' + currentDate + ' / ' + name + ': ' + v + 'мл.</div>').appendTo(_this.history);
                    _this.history.show();
                });
            };

        _this.commit.text('Учтено: ' + currentDate + ' / ' + currentDrink + '('+ currentPercent + '%) / ' + currentVolume + 'мл.').show();
        setTimeout(function(){ _this.commit.fadeOut('slow', function(){}) }, 3000);
    });
};


function keyDownNumber(e){  //цельнотянуто с http://www.gotdotnet.ru/forums/4/47901/
    var key = (typeof e.charCode == 'undefined' ? e.keyCode : e.charCode);
    if (e.ctrlKey || e.altKey || key < 58) return true;
    else return false;
};
