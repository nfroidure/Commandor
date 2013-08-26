// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define(['src/Commandor','tests/helper.karma'], function(Commandor,hlp) {
// START: Module logic start

	// Tests
	describe('Link commands should work', function(){

		var div=document.createElement('div');
		var cmdMgr=new Commandor(div);
		var runResult=null;
		function testCommand() {
		var n=runResult&&runResult.n?runResult.n:0;
			runResult=Array.prototype.slice.call(arguments,0);
			runResult.n=++n;
		}
		cmdMgr.suscribe('commandtest',testCommand);
		var a=document.createElement('a');
		a.setAttribute('href','app:commandtest?param1=val1&param2=val2');
		var span=document.createElement('span');
		span.appendChild(document.createTextNode('test'));
		a.appendChild(span);
		div.appendChild(a);
		document.body.appendChild(div);

		it('when clicking a link', function() {
			runResult=null;
			if(!!('onmsgesturechange' in window)) {
				hlp.point(a);
			} else {
				hlp.click(a);
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

		if(!!('ontouchstart' in window)) {
			it('when touching a link', function() {
				runResult=null;
				hlp.touch(a);
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

		it('when pressing enter key on a link', function() {
			runResult=null;
			a.focus();
			hlp.type(a,{keyCode:13});
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

		it('until it is disposed', function() {
			cmdMgr.dispose();
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
