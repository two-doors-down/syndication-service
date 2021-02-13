import {
		Column,
		Entity,
		Index,
		PrimaryGeneratedColumn,
		getRepository,
} from 'typeorm';

@Entity()
@Index( [ 'slug' ], { unique: true } )
export default class Author {
		@PrimaryGeneratedColumn()
		id: number;

		@Column( 'varchar', { length: 255 } )
		slug: string;
}

export async function createOrUpdateAuthor( authorInput: Author ): Promise<Author> {
	const repository = getRepository( Author );
	const author = await getAuthor( authorInput.id ) || new Author();

	if ( author.id === authorInput.id && author.slug === authorInput.slug ) {
		return author;
	}

	repository.merge( author, authorInput );

	return repository.save( author );
}

export function getAuthor( id: number ): Promise<Author | undefined> {
	return getRepository( Author ).findOne( id );
}
