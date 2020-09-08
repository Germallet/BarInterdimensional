import * as Discord from '#discord-api';

export class MockCanalDeVoz extends Discord.CanalDeVoz {
	private readonly id: string;

	public constructor(id: string) {
		super(null);
		this.id = id;
	}

	public ObtenerId(): string {
		return this.id;
	}
}
