import * as discord from 'discord.js';
import * as Canvas from 'canvas';

export class ImagenAdjuntaDiscord {
	private readonly canvas: Canvas.Canvas;

	public constructor(ancho: number, alto: number) {
		this.canvas = Canvas.createCanvas(ancho, alto);

		//Fuente Default
		const ctx = this.canvas.getContext('2d');
		ctx.font = '45px Comic Sans MS';
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'black';
	}

	public Obtener(): discord.MessageAttachment {
		return new discord.MessageAttachment(this.canvas.toBuffer());
	}

	public async CargarFondo(direccion: string): Promise<void> {
		const background = await Canvas.loadImage(direccion);
		const ctx = this.canvas.getContext('2d');
		ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
	}

	public async CargarImagen(direccion: string, x: number, y: number, ancho: number, alto: number): Promise<void> {
		const image = await Canvas.loadImage(direccion);
		const ctx = this.canvas.getContext('2d');
		ctx.drawImage(image, x, y, ancho, alto);
	}

	public AgregarTexto(texto: string, x: number, y: number): void {
		const ctx = this.canvas.getContext('2d');
		ctx.fillText(texto, x, y);
		ctx.strokeText(texto, x, y);
	}

	public EstablecerFuente(fuente: string, tamaño: number): void {
		const ctx = this.canvas.getContext('2d');
		ctx.font = `${tamaño}px ${fuente}`;
	}

	public EstablecerColor(Relleno: string, Borde: string): void {
		const ctx = this.canvas.getContext('2d');
		ctx.fillStyle = Relleno;
		ctx.strokeStyle = Borde;
	}
}

/*
public ArmarCirculo(x: number, y: number, radio: number): void {
	//Probarla
	const ctx = this.canvas.getContext('2d');
	ctx.beginPath();
	ctx.arc(x, y, radio, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
}*/
