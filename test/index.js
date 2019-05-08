import assert from 'assert';
import sinon from 'sinon';
import fn from '../index';

before(function() {
	window.fixture.load('/test/fixtures/index.html');
});

after(function() {
	window.fixture.cleanup();
});

it('should add side effect', function() {
	const instance = fn();
	const spy = sinon.spy();
	const event = new CustomEvent('becky');

	instance.add(() => {
		const handler = spy;
		window.addEventListener('becky', handler);
		return () => {
			window.removeEventListener('becky', handler);
		};
	});

	window.dispatchEvent(event);
	window.dispatchEvent(event);
	instance.removeAll();
	window.dispatchEvent(event);

	assert.equal(spy.callCount, 2);
});

it('should add side effect without cleanup function', function() {
	const instance = fn();
	const spy = sinon.spy();
	const event = new CustomEvent('becky');

	const cleanup = () => {
		window.removeEventListener('becky', spy);
	};

	instance.add(() => {
		window.addEventListener('becky', spy);
	});

	window.dispatchEvent(event);
	window.dispatchEvent(event);
	instance.removeAll();
	window.dispatchEvent(event);
	cleanup();

	assert.equal(spy.callCount, 3);
});

it('should remove side effect by ID', function() {
	const instance = fn();
	const spy = sinon.spy();
	const event = new CustomEvent('becky');

	instance.add(() => {
		const handler = spy;
		window.addEventListener('becky', handler);
		return () => {
			window.removeEventListener('becky', handler);
		};
	}, 'becky');

	window.dispatchEvent(event);
	window.dispatchEvent(event);
	instance.remove('becky');
	window.dispatchEvent(event);

	assert.equal(spy.callCount, 2);
});

it('should remove all side effects', function() {
	const instance = fn();
	const spy = sinon.spy();
	const event = new CustomEvent('becky');

	instance.add(() => {
		const handler = spy;
		window.addEventListener('becky', handler);
		return () => {
			window.removeEventListener('becky', handler);
		};
	});

	window.dispatchEvent(event);
	window.dispatchEvent(event);
	instance.removeAll();
	window.dispatchEvent(event);

	assert.equal(spy.callCount, 2);
});

it('should throw if side effect is not provided when adding new side effect', function() {
	const instance = fn();

	assert.throws(() => {
		instance.add();
	}, /Expected a function./);
});

it('should throw if side effect ID is not provided when removing single side effect', function() {
	const instance = fn();

	assert.throws(() => {
		instance.remove();
	}, /Expected an side effect ID./);
});
