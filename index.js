let count = 0;
const noop = () => {};

class ManageSideEffects {
	constructor() {
		this.sideEffects = [];
	}

	/**
	 * @param {Function} sideEffect
	 * @param {string} id
	 */
	add(sideEffect, id = `sideEffect${count++}`) {
		if (typeof sideEffect !== 'function') {
			throw new TypeError('Expected a function.');
		}
		const sideEffectResult = sideEffect();
		const cleanup =
			typeof sideEffectResult === 'function' ? sideEffectResult : noop;

		this.sideEffects.push({
			id,
			cleanup
		});
	}

	/**
	 * @param  {string} id
	 */
	remove(id) {
		if (typeof id !== 'string') {
			throw new TypeError('Expected an side effect ID.');
		}

		const sideEffectExists = this.sideEffects.some(
			({ id: currentId }) => id === currentId
		);
		if (!sideEffectExists) {
			throw new Error(`No side effect with ID "${id}".`);
		}

		this.sideEffects
			.map((sideEffect) => {
				const { id: currentId, cleanup } = sideEffect;
				if (currentId === id) {
					cleanup();
					return null;
				}
				return sideEffect;
			})
			.filter((sideEffect) => {
				return sideEffect !== null;
			});
	}

	removeAll() {
		this.sideEffects.forEach(({ cleanup }) => {
			cleanup();
		});

		this.sideEffects = [];
	}
}

export default () => {
	const instance = new ManageSideEffects();
	const api = {
		add: instance.add.bind(instance),
		remove: instance.remove.bind(instance),
		removeAll: instance.removeAll.bind(instance)
	};
	return api;
};
