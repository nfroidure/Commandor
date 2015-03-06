var Commandor = (
	'undefined' === typeof window.Commandor ?
	require('./Commandor') :
	window.Commandor
);

// Prepraring tests
var div = document.createElement('div');
var cmdMgr = new Commandor(div);
var runResult = null;
function testCommand() {
	var n=runResult&&runResult.n?runResult.n:0;
		runResult=Array.prototype.slice.call(arguments,0);
		runResult.n=++n;
}

// Suscribing an object
var appObject={
	'test':testCommand,
	'test2':testCommand,
	'testThis':function() {
		if(this!==testThis) {
			throw 'This is not corresponding to the parent object !';
		}
	},
	'testobj':{testprop1:'prop1',testprop2:'prop2'},
};

cmdMgr.suscribe('App',appObject);

// Adding markup
var a=document.createElement('a');
a.setAttribute('href','app:App/test?param1=val1&param2=val2');
var span=document.createElement('span');
span.appendChild(document.createTextNode('test'));
a.appendChild(span);
div.appendChild(a);
var a2=document.createElement('a');
a2.setAttribute('href','app:App/test2?param3=val3&param4=val4');
span=document.createElement('span');
span.appendChild(document.createTextNode('test'));
a2.appendChild(span);
div.appendChild(a2);
document.body.appendChild(div);

// Tests
describe('Link 1 command should work', function(){

	it('when clicking on the link', function() {
		runResult=null;
		if(effroi.pointers.isConnected()) {
			effroi.pointers.point(a.firstChild);
		} else {
			effroi.mouse.click(a.firstChild);
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

});

describe('Link 2 command should work', function(){

	it('when clicking on the link', function() {
		runResult=null;
		if(effroi.pointers.isConnected()) {
			effroi.pointers.point(a2.firstChild);
		} else {
			effroi.mouse.click(a2.firstChild);
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

});

describe('cmdMgr', function(){

	it('should set this to parent object', function() {
		cmdMgr.executeCommand({}, 'App/testThis', {});
	});

	it('should not change external objects 1', function() {
		try {
			cmdMgr.suscribe('App/test3', function(){});
			throw Error('Suscribing on an external object did not send an error.');
		} catch(e) {
			if('Cannot suscribe commands on an external object.'!==e.message) {
				throw e;
			}
		}
	});

	it('should not change external objects 2', function() {
		try {
			cmdMgr.suscribe('App/test3/test/test',function(){});
			throw Error('Suscribing on an external object did not send an error.');
		} catch(e) {
			if('Cannot suscribe commands on an external object.'!==e.message) {
				throw e;
			}
		}
	});

	it('should not change external objects 3', function() {
		try {
			cmdMgr.unsuscribe('App/test2',function(){});
			throw Error('Unsuscribing on an external object did not send an error.');
		} catch(e) {
			if('Cannot unsuscribe commands of an external object.'!==e.message) {
				throw e.message;
			}
		}
	});

	it('should be disposable', function() {
		cmdMgr.dispose();
	});

});
