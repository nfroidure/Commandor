// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define(['src/Commandor'], function(Commandor) {
// START: Module logic start

	// Helpers
	function mouse(element,options) {
		options=options||{};
		var event = document.createEvent('MouseEvent');
		event.initMouseEvent(options.type||'click',
			'false' === options.canBubble ? false : true,
			'false' === options.cancelable ? false : true,
			options.view||window,
			options.detail||1,
			options.screenX||0, options.screenY||0,
			options.clientX||0, options.clientY||0,
			!!options.ctrlKey, !!options.altKey,
			!!options.shiftKey, !!options.metaKey,
			options.button||0,
			options.relatedTarget||element);
		element.dispatchEvent(event);
	}

	function click(element,options) {
		options=options||{};
		options.type='mousedown';
		mouse(element, options);
		options.type='click';
		mouse(element, options);
		options.type='mouseup';
		mouse(element, options);
	}

	function tactile(element,options) {
		options=options||{};
		var event = document.createEvent('UIEvent');
		event.initUIEvent(options.type, true, true);
		event.view = options.view||window;
		event.altKey = !!options.altKey;
		event.ctrlKey = !!options.ctrlKey;
		event.shiftKey = !!options.shiftKey;
		event.metaKey = !!options.metaKey;
		element.dispatchEvent(event);
	}

	function touch(element,options) {
		options=options||{};
		options.type='touchstart';
		tactile(element, options);
		options.type='touchend';
		tactile(element, options);
	}

	function keyboard(element,options) {
		options=options||{};
		var event = document.createEvent('KeyboardEvent');
		// Defaults
		options.ctrlKey = options.ctrlKey|false
		options.altKey = options.altKey|false
		options.shiftKey = options.shiftKey|false
		options.metaKey = options.metaKey|false;
		// Chromium Hack
		Object.defineProperty(event, 'keyCode', {
			get : function() {
				return options.keyCode|0;
			}
		});
		Object.defineProperty(event, 'which', {
			get : function() {
				return options.keyCode|0;
			}
		});
		Object.defineProperty(event, 'ctrlKey', {
			get : function() {
				return options.ctrlKey;
			}
		});
		event[typeof event.initKeyboardEvent !== 'undefined'
			? "initKeyboardEvent" : "initKeyEvent"](options.type,
			'false' === options.canBubble ? false : true,
			'false' === options.cancelable ? false : true,
			options.view||window, options.char|'',
			options.charCode|0, options.keyCode|0,
			options.location|0, options.modifier|'',
			options.repeat|false, options.locale|'');
		event.keyCodeVal=options.keyCode|0;
		event.ctrlKey=options.ctrlKey;
		event.shiftKey=options.shiftKey|false;
		event.altKey=options.altKey|false;
		element.dispatchEvent(event);
	}

	function type(element,options) {
		options=options||{};
		options.type='keydown';
		keyboard(element, options);
		options.type='keyup';
		keyboard(element, options);
	}

	// Tests
	describe('Link commands should work', function(){

		var div=document.createElement('div');
		var cmdMgr=new Commandor(div);
		var runResult=null;
		function testCommand() {
			var n=runResult&&runResult.n||0;
			runResult=Array.prototype.slice.call(arguments,0);
			runResult.n=++n;
		}
		cmdMgr.suscribe('test',testCommand);
		var a=document.createElement('a');
		a.setAttribute('href','app:test?param1=val1&param2=val2');
		var span=document.createElement('span');
		span.appendChild(document.createTextNode('test'));
		a.appendChild(span);
		div.appendChild(a);
		document.body.appendChild(div);

		it('when clicking a link', function() {
			runResult=null;
			click(a);
			if(null===runResult) {
				throw 'Not well executed';
			}
			if('val1'!==runResult[1].param1
				||'val2'!==runResult[1].param2) {
				throw 'Bad params !';
			}
		});

		if(!!('ontouchstart' in window)) {
			it('when touching a link', function() {
				runResult=null;
				touch(a);
				if(null===runResult) {
					throw 'Not well executed';
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
			keyboard(a,{type:'keyup',keyCode:13});
			if(null===runResult) {
				throw 'Not well executed';
			}
			if('val1'!==runResult[1].param1
				||'val2'!==runResult[1].param2) {
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
