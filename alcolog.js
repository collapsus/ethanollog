function AlcoLog(logs, drinks){
    this.logs = logs;
    this.drinks = drinks;
    this.makeDOM();
}

AlcoLog.prototype.makeHTML = function(){
    return [
        '<form class="alcolog">',
            '<table>',
                '<tr>',
                    '<td>',
                        '<input type="text" class="datepicker" />',
                        '<select class="drinkpicker" >',
                            this.makeOptions(this.drinks),
                        '</select>',
                        '<input type="text" class="percent" readonly size="2" maxlength="2" /> %&nbsp;',
                        '<input type="text" class="volumepicker" size="5" maxlength="5" /> мл.&nbsp;',
                        '<input type="submit" value="Выпито!" class="submit" disabled="disabled"/>',
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
        '</form>'
    ].join('');
};

AlcoLog.prototype.makeOptions = function(values){
    var res = '<option selected="selected" disabled="disabled" value="">Выберите напиток</option>';
    $.each(values, function(k, v){
        res += '<option value="' + k + '">' + k + '</option>';
    });
    return res;
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

    this.datepicker.datepicker({dateFormat: 'dd.mm.yy', autoSize: true, firstDay: 1}).datepicker('setDate', '0');

    function disableSubmit() {
        _this.submit
            .attr('disabled',
                _this.datepicker.val() &&
                _this.drinkpicker.val() &&
                _this.percent.val() &&
                _this.volumepicker.val() ? '' : 'disabled');
    }

    function showDate(date) {
        var log = _this.logs[date];
        if (log) {
            var res = '<div style="font-weight: bold">' + date + '</div>';
            $.each(log.byName, function(k, v){
                res += '<div>' + k +  ' (~' + _this.drinks[k] + '%): ' + v + 'мл.</div>'
            });
            res += '<div>Всего чистого алкоголя за день: ' + log.totalDayAlcohol + 'мл.</div>';
            _this.history.html(res).show();
        }
    }

    this.drinkpicker.change(function(){
        _this.percent.val(_this.drinks[$(this).val()]);
        disableSubmit();
    });

    this.volumepicker
        .keypress(function(e){ return e.ctrlKey || e.altKey || e.charCode < 58 })
        .keyup(disableSubmit);

    this.datepicker.change(function(){
        disableSubmit();
        showDate(_this.datepicker.val());
    });

    this.elem.submit(function(){
        var date = _this.datepicker.val(),
            drink = _this.drinkpicker.val(),
            volume = + _this.volumepicker.val(),
            percent = + _this.percent.val(),
            log = _this.logs[date] ||
                (_this.logs[date] = {
                    'totalDayAlcohol': 0,
                    'byName': {}
                });

        log.byName[drink] = (log[drink] || 0) + volume;

        log.totalDayAlcohol += volume * percent / 100;

        _this.volumepicker.val('');
        _this.drinkpicker.val('');
        _this.percent.val('');
        disableSubmit();

        showDate(date);

        _this.commit.text('Учтено: ' + date + ' / ' + drink + '('+ percent + '%) / ' + volume + 'мл.').show();
        setTimeout(function(){ _this.commit.fadeOut('slow', function(){}) }, 3000);

        return false;
    });
};
