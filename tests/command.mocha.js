// Helpers
function fire(evtName, element) {
			var event = new Event(evtName);
			element.dispatchEvent(event);
}

// Tests
define(['src/Commandor'], function(Commandor) {

	describe('Commands should be executed', function(){

		var div=document.createElement('div');
		var cmdMgr=new Commandor(div);
		var ran=0;
		function testCommand() {
			ran++;
		}
		cmdMgr.suscribe('test',testCommand);
		var a=document.createElement('a');
		a.setAttribute('href','app:test?param1=val1&param2=val2');
		var span=document.createElement('span');
		span.appendChild(document.createTextNode('test'));
		a.appendChild(span);
		document.body.appendChild(div);

		it("on click", function() {

			fire('mousedown',a);
			//fire('click',a);
			fire('mouseup',a);
			if(1===ran)
				throw 'Not well executed';

		});

		it("on touch", function() {
			fire('touchstart',a);
			fire('touchend',a);
			if(2===ran)
				throw 'Not well executed';
		});

		it("on enter", function() {
				throw 'Not well executed';
		});

	});

});
