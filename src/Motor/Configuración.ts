import { ServidorDiscord } from "./DiscordAPI/ServidorDiscord";
import { CategoríaDiscord } from "./DiscordAPI/CategoríaDiscord";
import { Mundo } from "./Mundo";
import { Nodo } from "./Nodo";
import sxml = require("sxml");
import XML = sxml.XML;
import XMLList = sxml.XMLList;

export class Configuración {
    private readonly xml: XML;
    private nodos: Array<Nodo> = new Array<Nodo>();

    public constructor(contenido: string) {
        this.xml = new XML(contenido);
    }
    
    public async CrearNodos(mundo: Mundo, servidor: ServidorDiscord, categoría: CategoríaDiscord): Promise<Array<Nodo>>
    {
        const xmlNodos: XMLList = this.xml.get("nodos").at(0).get("nodo");
        const nodos: Array<[string, Nodo]> = new Array<[string, Nodo]>();

        for (let nodoXml of xmlNodos)
        {
            const nodo: Nodo = new Nodo(nodoXml.getProperty('nombre'), mundo);
            nodos.push([nodoXml.getProperty('id'), nodo]);
        }
        await Promise.all(nodos.map(nodo => nodo[1].Generar(servidor, categoría)));

        const promesas = new Array<Promise<void>>();
        for (let nodoXml of xmlNodos)
        {
            if (nodoXml.get("adyacentes").at(0).size() == 0)
                continue;
            const nodo: Nodo = nodos.find(tupla => tupla[0] == nodoXml.getProperty('id'))[1];
            const adyacentes: XMLList = nodoXml.get("adyacentes").at(0).get("adyacente");

            for (const adyacente of adyacentes)
                promesas.push(nodo.AgregarAdyacente(nodos.find(tupla => tupla[0] == adyacente.getProperty('id'))[1]));
        }
        await Promise.all(promesas);
    
        return nodos.map(tupla => tupla[1]);
    }
}