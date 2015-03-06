var assert = chai.assert;

// Tests
describe('Link commands', function() {

	var div;
	var cmdMgr;
	var a;
	var span;

	beforeEach(function() {
		div = document.createElement('div');
		a = document.createElement('a');
		a.setAttribute('href','#commandtest?param1=val1&param2=val2');
		span = document.createElement('span');
		span.appendChild(document.createTextNode('test'));
		a.appendChild(span);
		div.appendChild(a);
		document.body.appendChild(div);

		cmdMgr = new Commandor(div, '#');
	});

	afterEach(function() {
		document.body.removeChild(div);
	});

	describe('should work', function() {

		afterEach(function() {
			cmdMgr.dispose();
		});

		it('when clicking a link', function() {
	    var callback = sinon.spy();
			cmdMgr.suscribe('commandtest', callback);

			if(effroi.pointers.isConnected()) {
				effroi.pointers.touch(a);
			} else {
				effroi.mouse.click(a.firstChild);
			}

			assert(callback.calledOnce, 'Callback called once');
			assert.equal(callback.getCall(0).args[1].param1, 'val1');
			assert.equal(callback.getCall(0).args[1].param2, 'val2');

		});

		if(effroi.tactile.isConnected()) {

			it('when touching a link', function() {

		    var callback = sinon.spy();
				cmdMgr.suscribe('commandtest', callback);

				effroi.tactile.touch(a.firstChild);

				assert(callback.calledOnce, 'Callback called once');
				assert.equal(callback.getCall(0).args[1].param1, 'val1');
				assert.equal(callback.getCall(0).args[1].param2, 'val2');

			});

		}

		it('when pressing enter key on a link', function() {

		    var callback = sinon.spy();
				cmdMgr.suscribe('commandtest', callback);

				effroi.keyboard.focus(a);
				effroi.keyboard.hit(effroi.keyboard.ENTER);

				assert(callback.calledOnce, 'Callback called once');
				assert.equal(callback.getCall(0).args[1].param1, 'val1');
				assert.equal(callback.getCall(0).args[1].param2, 'val2');

		});

	});

	describe('should fail', function() {

		it('when clicking a link while disposed', function() {
	    var callback = sinon.spy();
			cmdMgr.suscribe('commandtest', callback);
			cmdMgr.dispose();

			if(effroi.pointers.isConnected()) {
				effroi.pointers.touch(a);
			} else {
				effroi.mouse.click(a.firstChild);
			}

			assert(!callback.called, 'Callback never called');

		});

		it('when clicking a link while disabled', function() {
	    var callback = sinon.spy();
			cmdMgr.suscribe('commandtest', callback);
			a.setAttribute('disabled', 'disabled');

			if(effroi.pointers.isConnected()) {
				effroi.pointers.touch(a);
			} else {
				effroi.mouse.click(a.firstChild);
			}

			assert(!callback.called, 'Callback never called');
			cmdMgr.dispose();

		});

	});

});
