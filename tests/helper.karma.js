// AMD + Global: r.js compatible
// Use START + END markers to keep module content only
(function(root,define){ define([], function() {
// START: Module logic start

	// Generic event
	function event(element,options) {
		options=options||{};
		var event = document.createEvent('Event');
		event.initEvent(options.type,
			'false' === options.canBubble ? false : true,
			'false' === options.cancelable ? false : true);
		element.dispatchEvent(event);
	}

	// Mouse interactions
	function mouse(element,options) {
		var event;
		options=options||{};
		options.button=options.button||1;
		options.view=options.view||window;
		options.altKey = !!options.altKey;
		options.ctrlKey = !!options.ctrlKey;
		options.shiftKey = !!options.shiftKey;
		options.metaKey = !!options.metaKey;
		try {
			event = new MouseEvent('click', {
				'view': window,
				'bubbles': options.canBubble ? false : true,
				'cancelable': options.cancelable ? false : true
		  });
			event.altKey = options.altKey;
			event.ctrlKey = options.ctrlKey;
			event.shiftKey = options.shiftKey;
			event.metaKey = options.metaKey;
		} catch(e) {
			event = document.createEvent('MouseEvent');
			event.initMouseEvent(options.type||'click',
				'false' === options.canBubble ? false : true,
				'false' === options.cancelable ? false : true,
				options.view,
				options.detail||1,
				options.screenX||0, options.screenY||0,
				options.clientX||0, options.clientY||0,
				options.ctrlKey, options.altKey,
				options.shiftKey, options.metaKey,
				options.button,
				options.relatedTarget||element);
		}
		// Chromium Hack
		Object.defineProperty(event, 'which', {
			get : function() {
				return options.button;
			}
		});
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

	// Pointer interactions
	function pointer(element,options) {
		options=options||{};
		var event = document.createEvent('MSPointerEvent');
		event.initPointerEvent(options.type,
			'false' === options.canBubble ? false : true,
			'false' === options.cancelable ? false : true,
			options.view||window,
			options.detail||1,
			options.screenX||0, options.screenY||0,
			options.clientX||0, options.clientY||0,
			!!options.ctrlKey, !!options.altKey,
			!!options.shiftKey, !!options.metaKey,
			options.button|1, options.relatedTarget||element,
			options.offsetX||0, options.offsetY||0,
			options.width||1, options.height||1,
			options.pressure||255, options.rotation||0,
			options.tiltX||0, options.tiltY||0,
			options.pointerId||1, options.pointerType||'mouse',
			options.hwTimestamp||Date.now(), options.isPrimary||true);
		element.dispatchEvent(event);
	}

	function point(element,options) {
		options=options||{};
		options.type='MSPointerDown';
		pointer(element,options);
		options.type='MSPointerUp';
		pointer(element,options);
	}

	// Tactile interactions
	function tactile(element,options) {
		options=options||{};
		var event = document.createEvent('UIEvent');
		event.initUIEvent(options.type,
			'false' === options.canBubble ? false : true,
			'false' === options.cancelable ? false : true,
			options.view||window,
			options.detail||1);
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

	// Keyboard interactions
	function keyboard(element,options) {
		options=options||{};
		var event = document.createEvent('KeyboardEvent');
		// Defaults
		options.ctrlKey = options.ctrlKey|false
		options.altKey = options.altKey|false
		options.shiftKey = options.shiftKey|false
		options.metaKey = options.metaKey|false;
		options.keyCode = options.keyCode|0;
		options.charCode = options.charCode|0;
		event[typeof event.initKeyboardEvent !== 'undefined'
			? "initKeyboardEvent" : "initKeyEvent"](options.type,
			'false' === options.canBubble ? false : true,
			'false' === options.cancelable ? false : true,
			options.view||window, String.fromCharCode(options.charCode),
			options.charCode, options.keyCode,
			options.location|0, options.modifier|'',
			options.repeat|false, options.locale|'');
		event.ctrlKey=options.ctrlKey;
		event.shiftKey=options.shiftKey;
		event.altKey=options.altKey;
		event.metaKey=options.metaKey;
		// Chromium Hack
		try {
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
			Object.defineProperty(event, 'charCode', {
				get : function() {
					return options.charCode|'';
				}
			});
			Object.defineProperty(event, 'char', {
				get : function() {
					return String.fromCharCode(options.charCode);
				}
			});
			Object.defineProperty(event, 'ctrlKey', {
				get : function() {
					return options.ctrlKey;
				}
			});
		} catch(e) {
		
		}
		element.dispatchEvent(event);
	}

	function type(element,options) {
		options=options||{};
		options.type='keydown';
		keyboard(element, options);
		if(options.keyCode&&String.fromCharCode(options.keyCode)
			&&('TEXTAREA'===element.nodeName
			||('INPUT'===element.nodeName&&element.hasAttribute('type')
				&&'text'===element.getAttribute('type')))) {
			element.value+=String.fromCharCode(options.keyCode);
		}
		options.type='keyup';
		keyboard(element, options);
		options.type='keypress';
		keyboard(element, options);
	}

	var EventSimulator = {
		event:event,
		mouse:mouse,
		pointer:pointer,
		point:point,
		click:click,
		tactile:tactile,
		touch:touch,
		keyboard:keyboard,
		type:type,
	};

// END: Module logic end

	return EventSimulator;

});})(this,typeof define === 'function' && define.amd ? define : function (name, deps, factory) {
	var root=this;
	if(typeof name === 'object') {
		factory=deps; deps=name; name='EventSimulator';
	}
	this[name.substring(name.lastIndexOf('/')+1)]=factory.apply(this, deps.map(function(dep){
		return root[dep.substring(dep.lastIndexOf('/')+1)];
	}));
}.bind(this));
