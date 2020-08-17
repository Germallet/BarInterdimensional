export interface CanalDiscord {
    TieneId(id: string): boolean;
    EsMismoCanal(canal: CanalDiscord): boolean;
}