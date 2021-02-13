import { Request } from 'express';
import { NOT_FOUND } from '../errors';
import Story, { createStory, getAllStories, getStory } from '../db/Story';

/**
 * Get a story by ID.
 * GET /stories/:id
 */
export async function get( req: Request ): Promise<Story> {
	const id = parseInt( req.params.id, 10 );
	const story = await getStory( id );

	if ( ! story ) {
		throw new Error( NOT_FOUND );
	}

	return story;
}

/**
 * Get all stories.
 * GET /stories/
 */
export function getAll(): Promise<Story[]> {
	return getAllStories();
}

/**
 * Create a new story or update an existing one.
 * POST /stories/
 */
export function post ( req: Request ): Promise<Story> {
	const { article: { canonical_url, id: guid, title } } = req.body;

	return createStory( { canonical_url, guid, title } );
}
