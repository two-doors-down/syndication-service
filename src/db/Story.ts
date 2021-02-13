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

export function createOrUpdateStory( storyInput: Partial<Story> ): Promise<Story> {
	const repository = getRepository( Story );

	const story = new Story();
	repository.merge( story, storyInput );

	return repository.save( story );
}

export function getAllStories(): Promise<Story[]> {
	return getRepository( Story ).find();
}

export function getStory( id: number ): Promise<Story | undefined> {
	return getRepository( Story ).findOne( id );
}

export function getStoryByGuidOrUrl( args: {
	canonical_url?: string,
	guid?: string,
} ): Promise<Story | undefined> {
	const { canonical_url, guid } = args;

	return getRepository( Story )
		.createQueryBuilder( 'story' )
		.where( 'story.guid = :guid OR story.canonical_url = :canonical_url', { guid, canonical_url } )
		.getOne();
}
