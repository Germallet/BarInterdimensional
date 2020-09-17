export class Diccionario<K, V> extends Map<K, V> {
	public get(key: K): V {
		const valor: V = super.get(key);
		if (valor == undefined) throw new Error(`No existe el elemento (id: ${key})`);
		return valor;
	}
}
