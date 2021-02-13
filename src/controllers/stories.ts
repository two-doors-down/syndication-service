import { Request } from 'express';
import { INVALID_REQUEST, NOT_FOUND } from '../errors';
import Story, {
	createOrUpdateStory,
	getAllStories,
	getStory,
	getStoryByGuidOrUrl,
} from '../db/Story';

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
export async function post ( req: Request ): Promise<Story> {
	// @TODO: Validate this input first.
	const {
		article: {
			authors,
			canonical_url,
			dek,
			id: guid,
			published_date,
			title,
			word_count,
		},
	} = req.body;

	const storyInput: Partial<Story> = {
		authors,
		canonical_url,
		dek,
		guid,
		published_date,
		title,
		word_count,
	};

	// First check to see if there's already a story matching the id or url.
	const story = await getStoryByGuidOrUrl( storyInput );

	if ( story ) {
		// A story was found, but...
		// "a new id is posted with the same canonical url as an existing record"
		if ( ! ( story.guid === guid && story.canonical_url === canonical_url ) ) {
			throw new Error( INVALID_REQUEST );
		}

		// Set the ID to the database ID so that it will be updated.
		storyInput.id = story.id;
	}

	return createOrUpdateStory( storyInput );
}
