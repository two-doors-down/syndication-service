import {
		Column,
		Entity,
		Index,
		PrimaryGeneratedColumn,
		getRepository,
} from 'typeorm';

@Entity()
@Index( [ 'guid', 'canonical_url' ], { unique: true } )
export default class Story {
		@PrimaryGeneratedColumn()
		id: number;

		@Column( 'varchar', { length: 60 } )
		guid: string;

		@Column( 'varchar', { length: 255 } )
		canonical_url: string;

		@Column( 'text' )
		title: string;
}

export function getAllStories() {
	const repository = getRepository( Story );

	return repository.find();
}

export async function getStory( id: number ) {
	const repository = getRepository( Story );
	return await repository.findOne( id );
}
