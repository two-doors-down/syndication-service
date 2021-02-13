import { Request } from 'express';
import { createStory, getAllStories, getStory } from '../db/Story';

export function get( req: Request ) {
	const id = parseInt( req.params.id, 10 );
	return getStory( id );
}

export function getAll() {
	return getAllStories();
}

export function post ( req: Request ) {
	const { canonical_url, guid, title } = req.body;

	return createStory( { canonical_url, guid, title } );
}
