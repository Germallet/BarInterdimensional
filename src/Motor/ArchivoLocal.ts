import fs from 'fs'
import path from 'path'

export class ArchivoLocal {
    public Leer(dirección: string): string {
        return fs.readFileSync(path.resolve(__dirname, dirección), 'utf8');
    }
}