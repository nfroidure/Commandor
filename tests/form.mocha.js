var Commandor = (
	'undefined' === typeof window.Commandor ?
	require('./Commandor') :
	window.Commandor
);

// Tests
describe('Submit forms should work', function(){

	var div=document.createElement('div');
	div.innerHTML='<form action="app:formtest?param1=val1&param2=val2">'
		+'<input type="submit" formaction="app:formtest?param3=val3&param4=val4" />'
		+'<input type="submit" />'
		+'</form>';
	var cmdMgr=new Commandor(div);
	var runResult=null;
	function testCommand() {
	var n=runResult&&runResult.n?runResult.n:0;
		runResult=Array.prototype.slice.call(arguments,0);
		runResult.n=++n;
	}
	cmdMgr.suscribe('formtest',testCommand);
	document.body.appendChild(div);
	var submitButton=div.getElementsByTagName('input')[1];
	var actionButton=div.getElementsByTagName('input')[0];

	// Simple submit button
	it('when clicking a submit button', function() {
		runResult=null;
		if(effroi.pointers.isConnected()) {
			effroi.pointers.point(submitButton);
		} else {
			effroi.mouse.click(submitButton);
		}
		if(null===runResult) {
			throw 'Not well executed';
		}
		if(1!==runResult.n) {
			throw 'Runned to many times ('+runResult.n+'/1).';
		}
		if('val1'!==runResult[1].param1
			||'val2'!==runResult[1].param2) {
			throw 'Bad params !';
		}
	});

	if(effroi.tactile.isConnected()) {
		it('when touching a submit button', function() {
			runResult=null;
			effroi.tactile.touch(submitButton);
			if(null===runResult) {
				throw 'Not well executed';
			}
			if(1!==runResult.n) {
				throw 'Runned to many times ('+runResult.n+'/1).';
			}
			if('val1'!==runResult[1].param1
				||'val2'!==runResult[1].param2) {
				throw 'Bad params !';
			}
		});
	}

	it('when pressing enter key on a submit button', function() {
		runResult=null;
		effroi.keyboard.focus(submitButton);
		effroi.keyboard.hit(effroi.keyboard.ENTER);
		if(null===runResult) {
			throw 'Not well executed';
		}
		if(1!==runResult.n) {
			throw 'Runned to many times ('+runResult.n+'/1).';
		}
		if('val1'!==runResult[1].param1
			||'val2'!==runResult[1].param2) {
			throw 'Bad params !';
		}
	});

	// Submit button with formaction
	it('when clicking a submit button with formaction', function() {
		runResult=null;
		if(!!('onmsgesturechange' in window)) {
			effroi.pointers.point(actionButton);
		} else {
			effroi.mouse.click(actionButton);
		}
		if(null===runResult) {
			throw 'Not well executed';
		}
		if(1!==runResult.n) {
			throw 'Runned to many times ('+runResult.n+'/1).';
		}
		if('val3'!==runResult[1].param3
			||'val4'!==runResult[1].param4) {
			throw 'Bad params !';
		}
	});

	if(!!('ontouchstart' in window)) {
		it('when touching a submit button with formaction', function() {
			runResult=null;
			effroi.tactile.touch(actionButton);
			if(null===runResult) {
				throw 'Not well executed';
			}
			if(1!==runResult.n) {
				throw 'Runned to many times ('+runResult.n+'/1).';
			}
			if('val3'!==runResult[1].param3
				||'val4'!==runResult[1].param4) {
				throw 'Bad params !';
			}
		});
	}

	it('when pressing enter key on a submit button with formaction', function() {
		runResult=null;
		effroi.keyboard.focus(actionButton);
		effroi.keyboard.hit(effroi.keyboard.ENTER);
		if(null===runResult) {
			throw 'Not well executed';
		}
		if(1!==runResult.n) {
			throw 'Runned to many times ('+runResult.n+'/1).';
		}
		if('val3'!==runResult[1].param3
			||'val4'!==runResult[1].param4) {
			throw 'Bad params !';
		}
	});

	it('until it is disposed', function() {
		cmdMgr.dispose();
	});

});
