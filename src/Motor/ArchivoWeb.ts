import * as WebRequest from 'web-request';

export class ArchivoWeb {
	public async Leer(url: string): Promise<string> {
		return (await WebRequest.get(url)).content;
	}
}
