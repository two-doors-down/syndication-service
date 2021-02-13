import {
		Column,
		Entity,
		Index,
		JoinTable,
		ManyToMany,
		PrimaryGeneratedColumn,
		getRepository,
} from 'typeorm';
import Author, { createOrUpdateAuthor } from './Author';
import normalizeAuthors from '../utils/normalizeAuthors';

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

		@ManyToMany( () => Author, {
			cascade: true,
		} )
		@JoinTable()
		authors: Author[];
}

const findOptions = {
	relations: [ 'authors' ],
};

export async function createOrUpdateStory( storyInput: Partial<Story> ): Promise<Story> {
	const repository = getRepository( Story );
	const story = new Story();

	// Save authors.
	storyInput.authors = await Promise.all(
		normalizeAuthors( storyInput.authors )
			.map( createOrUpdateAuthor )
	);

	repository.merge( story, storyInput );

	return repository.save( story );
}

export function getAllStories(): Promise<Story[]> {
	return getRepository( Story ).find( findOptions );
}

export function getStory( id: number ): Promise<Story | undefined> {
	return getRepository( Story ).findOne( id, findOptions );
}

export function getStoryByGuidOrUrl( args: {
	canonical_url?: string,
	guid?: string,
} ): Promise<Story | undefined> {
	const { canonical_url, guid } = args;

	return getRepository( Story )
		.createQueryBuilder( 'story' )
		.where( 'story.guid = :guid OR story.canonical_url = :canonical_url', { guid, canonical_url } )
		.leftJoinAndSelect( 'story.authors', 'author' )
		.getOne();
}
