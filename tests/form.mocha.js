// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define(['src/Commandor','tests/helper.karma'], function(Commandor,hlp) {
// START: Module logic start

	// Tests
	describe('Submit forms should work', function(){

		var div=document.createElement('div');
		div.innerHTML='<form action="app:test?param1=val1&param2=val2">'
			+'<input type="submit" formaction="app:test?param3=val3&param4=val4" />'
			+'<input type="submit" />'
			+'</form>';
		var cmdMgr=new Commandor(div);
		var runResult=null;
		function testCommand() {
			console.log('Runned.');
			var n=runResult&&runResult.n||0;
			runResult=Array.prototype.slice.call(arguments,0);
			runResult.n=++n;
		}
		cmdMgr.suscribe('test',testCommand);
		document.body.appendChild(div);
		var submitButton=document.querySelectorAll('input[type="submit"]')[1];
		var actionButton=document.querySelector('input[type="submit"]');
		
		// Simple submit button
		it('when clicking a submit button', function() {
			runResult=null;
			if(!!('onmsgesturechange' in window)) {
				hlp.point(submitButton);
			} else {
				hlp.click(submitButton);
			}
			if(null===runResult) {
				throw 'Not well executed';
			}
			if('val1'!==runResult[1].param1
				||'val2'!==runResult[1].param2) {
				throw 'Bad params !';
			}
		});

		if(!!('ontouchstart' in window)) {
			it('when touching a submit button', function() {
				runResult=null;
				hlp.touch(submitButton);
				if(null===runResult) {
					throw 'Not well executed';
				}
				if('val1'!==runResult[1].param1
					||'val2'!==runResult[1].param2) {
					throw 'Bad params !';
				}
			});
		}

		it('when pressing enter key on a submit button', function() {
			runResult=null;
			submitButton.focus();
			hlp.type(submitButton,{type:'keyup',keyCode:13});
			if(null===runResult) {
				throw 'Not well executed';
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
				hlp.point(actionButton);
			} else {
				hlp.click(actionButton);
			}
			if(null===runResult) {
				throw 'Not well executed';
			}
			if('val3'!==runResult[1].param3
				||'val4'!==runResult[1].param4) {
				throw 'Bad params !';
			}
		});

		if(!!('ontouchstart' in window)) {
			it('when touching a submit button with formaction', function() {
				runResult=null;
				hlp.touch(actionButton);
				if(null===runResult) {
					throw 'Not well executed';
				}
				if('val3'!==runResult[1].param3
					||'val4'!==runResult[1].param4) {
					throw 'Bad params !';
				}
			});
		}

		it('when pressing enter key on a submit button with formaction', function() {
			runResult=null;
			submitButton.focus();
			hlp.type(actionButton,{type:'keyup',keyCode:13});
			if(null===runResult) {
				throw 'Not well executed';
			}
			if('val3'!==runResult[1].param3
				||'val4'!==runResult[1].param4) {
				throw 'Bad params !';
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
