import * as discord from 'discord.js';
import * as Canvas from 'canvas';
import { ClienteDiscord } from './ClienteDiscord';

export class ImagenAdjuntaDiscord {
    private readonly canvas: Canvas.Canvas;

	public constructor(ancho: number, alto: number) {
        this.canvas = Canvas.createCanvas(ancho, alto);
       
        //Estable Fuente Default
        const ctx = this.canvas.getContext('2d');
        ctx.font = '60px sans-serif';
	    ctx.fillStyle = '#ffffff';
	}

    // Ver que hacen
    // ctx.strokeStyle = '#74037b';
	// ctx.strokeRect(0, 0, canvas.width, canvas.height);
    // Problemas con textos muy largos

    public async CargarFondo(direccion: string) {
        const background = await Canvas.loadImage(direccion);
        const ctx = this.canvas.getContext('2d');
	    ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
    }

    public async CargarImagen(direccion: string, x: number, y: number, ancho: number, alto: number) {
        const image = await Canvas.loadImage(direccion);
        const ctx = this.canvas.getContext('2d');
	    ctx.drawImage(image, x, y, ancho, alto);
    }
    
    public ArmarCirculo(x: number, y: number, radio: number) { //Probarla
        const ctx = this.canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(x, y, radio, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
    }

    public EstablecerFuente(fuente: string, estilo: string) { // Ver Fuentes y Estilos
        const ctx = this.canvas.getContext('2d');
        ctx.font = fuente;
	    ctx.fillStyle = estilo;
    }

    public AgregarTexto(texto: string, x: number, y: number) {
        const ctx = this.canvas.getContext('2d');
        ctx.fillText(texto, x, y);
    }
    
    public Obtener(): discord.MessageAttachment {
        return new discord.MessageAttachment(this.canvas.toBuffer());
    }
}