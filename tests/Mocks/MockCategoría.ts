import * as Discord from '#discord-api';

export class MockCategoría extends Discord.Categoría {
	private readonly id: string;

	public constructor(id: string) {
		super(null);
		this.id = id;
	}

	public ObtenerId(): string {
		return this.id;
	}
}
