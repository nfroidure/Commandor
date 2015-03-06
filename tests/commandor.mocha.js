var assert = chai.assert;

describe('Commandor instances', function() {

  var div;
  var cmdMgr;
  var a;
  var span;

  beforeEach(function() {
    div = document.createElement('div');
    a = document.createElement('a');
    a.setAttribute('href','app:commandtest?param1=val1&param2=val2');
    span = document.createElement('span');
    span.appendChild(document.createTextNode('test'));
    a.appendChild(span);
    div.appendChild(a);
    document.body.appendChild(div);

    cmdMgr = new Commandor(div);
  });

  afterEach(function() {
    document.body.removeChild(div);
  });

  describe('disposed', function() {

    it('when suscribing commands', function() {
      var callback = sinon.spy();
      cmdMgr.dispose();
      assert.throws(function() {
        cmdMgr.suscribe('commandtest', callback);
      }, 'Cannot suscribe commands on a disposed Commandor object.');
    });

    it('when unsuscribing commands', function() {
      var callback = sinon.spy();
      cmdMgr.suscribe('commandtest', callback);
      cmdMgr.dispose();
      assert.throws(function() {
        cmdMgr.unsuscribe('commandtest', callback);
      }, 'Cannot unsuscribe commands of a disposed Commandor object.');
    });

    it('when executing commands', function() {
      var callback = sinon.spy();
      cmdMgr.suscribe('commandtest', callback);
      cmdMgr.dispose();
      assert.throws(function() {
        cmdMgr.executeCommand({}, 'commandtest', a);
      }, 'Cannot execute command on a disposed Commandor object.');
    });

  });

});