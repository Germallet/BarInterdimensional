import { GestorDeMundos } from "./GestorDeMundos";
import { GestorDeUsuarios } from "./GestorDeUsuarios";

export class Universo {
    private static readonly mundos: GestorDeMundos = new GestorDeMundos();
    private static readonly usuarios: GestorDeUsuarios = new GestorDeUsuarios();
    
    public static Mundos(): GestorDeMundos {
        return this.mundos;
    }

    public static Usuarios(): GestorDeUsuarios {
        return this.usuarios;
    }
}