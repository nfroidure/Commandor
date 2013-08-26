// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define(['src/Commandor','tests/helper.karma'], function(Commandor,hlp) {
// START: Module logic start


	
	// Creating markup
	var div=document.createElement('div');
	div.innerHTML='<form action="app:inputtest?param1=val1&param2=val2" data-change="app:inputtest?param5=val5&param6=val6">'
		+'<input type="text" name="text" />'
		+'<textarea></textarea>'
		+'<select><option value="A">A</option><option value="B">B</option></select>'
		+'<input type="checkbox" value="C" />'
		+'</form>';
	var cmdMgr=new Commandor(div);
	var runResult=null;
	function testCommand() {
		var n=runResult&&runResult.n?runResult.n:0;
		runResult=Array.prototype.slice.call(arguments,0);
		runResult.n=++n;
	}
	cmdMgr.suscribe('inputtest',testCommand);
	document.body.appendChild(div);

	var textInput=div.getElementsByTagName('input')[0];
	var textarea=div.getElementsByTagName('textarea')[0];
	var selectInput=div.getElementsByTagName('select')[0];
	var checkboxInput=div.getElementsByTagName('input')[1];

	// Tests
	describe('Text inputs should fire form change command', function(){

		it('when typing content in', function() {
			runResult=null;
			textInput.focus();
			hlp.type(textInput,{charCode:65, keyCode:65});
			hlp.event(textInput,{type:'input'});
			hlp.type(textInput,{charCode:65, keyCode:65});
			hlp.event(textInput,{type:'input'});
			selectInput.focus();
			hlp.event(textInput,{type:'change'});
			if(null===runResult) {
				throw 'Not well executed';
			}
			if(1!==runResult.n) {
				throw 'Runned to many times ('+runResult.n+'/1).';
			}
			if('val5'!==runResult[1].param5
				||'val6'!==runResult[1].param6) {
				throw 'Bad params !';
			}
		});

	});

	describe('Textareas should fire form change command', function(){

		it('when typing content in', function() {
			runResult=null;
			textInput.focus();
			hlp.type(textarea,{charCode:65, keyCode:65});
			hlp.event(textarea,{type:'input'});
			hlp.type(textarea,{charCode:65, keyCode:65});
			hlp.event(textarea,{type:'input'});
			selectInput.focus();
			hlp.event(textarea,{type:'change'});
			if(null===runResult) {
				throw 'Not well executed';
			}
			if(1!==runResult.n) {
				throw 'Runned to many times ('+runResult.n+'/1).';
			}
			if('val5'!==runResult[1].param5
				||'val6'!==runResult[1].param6) {
				throw 'Bad params !';
			}
		});

	});

	describe('Selects should fire form change command', function(){

		it('when selecting another item', function() {
			runResult=null;
			selectInput.focus();
			selectInput.value='B';
			checkboxInput.focus();
			hlp.event(textarea,{type:'select'});
			if(null===runResult) {
				throw 'Not well executed';
			}
			if(1!==runResult.n) {
				throw 'Runned to many times ('+runResult.n+'/1).';
			}
			if('val5'!==runResult[1].param5
				||'val6'!==runResult[1].param6) {
				throw 'Bad params !';
			}
		});

	});

	describe('Checkboxes should fire form change command', function(){

		it('when changing their state to checked', function() {
			runResult=null;
			checkboxInput.focus();
			hlp.click(checkboxInput);
			textInput.focus();
			if(null===runResult) {
				throw 'Not well executed';
			}
			if(1!==runResult.n) {
				throw 'Runned to many times ('+runResult.n+'/1).';
			}
			if('val5'!==runResult[1].param5
				||'val6'!==runResult[1].param6) {
				throw 'Bad params !';
			}
			if(!checkboxInput.checked) {
				throw 'Checkbox isn\'t checked';
			}
		});

		it('when changing their state to unchecked', function() {
			runResult=null;
			checkboxInput.focus();
			hlp.click(checkboxInput);
			textInput.focus();
			if(null===runResult) {
				throw 'Not well executed';
			}
			if(1!==runResult.n) {
				throw 'Runned to many times ('+runResult.n+'/1).';
			}
			if('val5'!==runResult[1].param5
				||'val6'!==runResult[1].param6) {
				throw 'Bad params !';
			}
			if(checkboxInput.checked) {
				throw 'Checkbox is still checked';
			}
		});

		it('until it is disposed', function() {
			cmdMgr.dispose();
		});

	});

	describe('Disposed text inputs should not work', function() {

		it('when suscribing commands', function() {
			try {
				cmdMgr.suscribe('test', function() { console.log('')});
				throw Error('Suscribing disposed cmdMgr did not send an error.');
			} catch(e) {
				if('Suscribing dispose cmdMgr did not send an error.'===e.message) {
					throw e;
				}
			}
		});

		it('when unsuscribing commands', function() {
			try {
				cmdMgr.unsuscribe('test', function() { console.log('')});
				throw Error('Unsuscribing disposed cmdMgr did not send an error.');
			} catch(e) {
				if('Unsuscribing dispose cmdMgr did not send an error.'===e.message) {
					throw e;
				}
			}
		});

		it('when executing commands', function() {
			try {
				cmdMgr.executeCommand({}, 'test', textInput);
				throw Error('Suscribing disposed cmdMgr did not send an error.');
			} catch(e) {
				if('Suscribing dispose cmdMgr did not send an error.'===e.message) {
					throw e;
				}
			}
		});

	});

// END: Module logic end

	return Commandor;

});})(this,typeof define === 'function' && define.amd ? define : function (name, deps, factory) {
	var root=this;
	if(typeof name === 'object') {
		factory=deps; deps=name; name='_tests';
	}
	factory.apply(this, deps.map(function(dep){
		return root[dep.substring(dep.lastIndexOf('/')+1)];
	}));
}.bind(this));
