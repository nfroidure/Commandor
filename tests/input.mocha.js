var assert = chai.assert;

describe('Forms', function() {

	var div;
	var textInput;
	var textarea;
	var selectInput;
	var checkboxInput;

	beforeEach(function() {
		div = document.createElement('div');
		div.innerHTML =
			'<form action="app:inputtest?param1=val1&param2=val2"' +
			' data-change="app:inputtest?param5=val5&param6=val6">' +
			'<input type="text" name="text" />' +
			'<textarea></textarea>' +
			'<select><option value="A">A</option><option value="B">B</option></select>' +
			'<input type="checkbox" value="C" />' +
			'</form>';
		document.body.appendChild(div);
		textInput = div.getElementsByTagName('input')[0];
		textarea = div.getElementsByTagName('textarea')[0];
		selectInput = div.getElementsByTagName('select')[0];
		checkboxInput = div.getElementsByTagName('input')[1];

		cmdMgr = new Commandor(div);
	});

	afterEach(function() {
		cmdMgr.dispose();
		document.body.removeChild(div);
	});

	describe('text inputs', function() {

		it('should fire form change command when typing content in', function() {
	    var callback = sinon.spy();
			cmdMgr.suscribe('inputtest', callback);

			effroi.keyboard.focus(textInput);
			effroi.keyboard.hit('A', 'A');
			effroi.keyboard.focus(selectInput);

			assert(callback.calledOnce, 'Callback called once');
			assert.equal(callback.getCall(0).args[1].param5, 'val5');
			assert.equal(callback.getCall(0).args[1].param6, 'val6');

		});

	});
/*
	describe('textareas', function(){

		it('should fire form change command when typing content in', function() {
	    var callback = sinon.spy();
			cmdMgr.suscribe('inputtest', callback);

			effroi.keyboard.focus(textInput);
			effroi.keyboard.hit('A', 'A');
			effroi.keyboard.focus(selectInput);

			assert(callback.calledOnce, 'Callback called once');
			assert.equal(callback.getCall(0).args[1].param5, 'val5');
			assert.equal(callback.getCall(0).args[1].param6, 'val6');
		});

	});*/

	describe('selects', function(){

		it('should fire form change command when selecting another item', function() {
	    var callback = sinon.spy();
			cmdMgr.suscribe('inputtest', callback);

			effroi.keyboard.focus(selectInput);
			selectInput.value='B';
			effroi.keyboard.focus(checkboxInput);

			assert(callback.calledOnce, 'Callback called once');
			assert.equal(callback.getCall(0).args[1].param5, 'val5');
			assert.equal(callback.getCall(0).args[1].param6, 'val6');
		});

	});

	describe('Checkboxes should fire form change command', function(){

		it('when changing their state to checked', function() {
	    var callback = sinon.spy();
			cmdMgr.suscribe('inputtest', callback);

			effroi.keyboard.focus(checkboxInput);
			effroi.mouse.click(checkboxInput);
			effroi.keyboard.focus(textInput);

			assert(callback.calledOnce, 'Callback called once');
			assert.equal(callback.getCall(0).args[1].param5, 'val5');
			assert.equal(callback.getCall(0).args[1].param6, 'val6');
			assert(checkboxInput.checked, 'Checkbox was checked');

		});

		it('when changing their state to unchecked', function() {
	    var callback = sinon.spy();
			cmdMgr.suscribe('inputtest', callback);

			effroi.keyboard.focus(checkboxInput);
			effroi.mouse.click(checkboxInput);
			effroi.keyboard.focus(textInput);


			assert(callback.calledOnce, 'Callback called once');
			assert.equal(callback.getCall(0).args[1].param5, 'val5');
			assert.equal(callback.getCall(0).args[1].param6, 'val6');
			assert(checkboxInput.checked, 'Checkbox is still checked');

		});

	});

});
