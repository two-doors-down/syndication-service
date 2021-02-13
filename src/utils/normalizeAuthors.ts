import Author from '../db/Author';

export default function normalizeAuthors( authors?: Author[] ) {
	if ( ! authors || ! authors.length ) {
		return [];
	}

	return authors
		.filter( author => author.id && author.slug )
		.map( ( { id, slug } ) => ( { id: parseInt( `${id}` ), slug } ) )
		.sort( ( a, b ) => {
			if ( a.id < b.id ) {
				return -1;
			}

			if ( a.id > b.id ) {
				return 1;
			}

			return 0;
		} );
}
