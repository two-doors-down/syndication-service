import { Server } from 'http';
import supertest from 'supertest';
import { Connection } from 'typeorm';
import app from '../src/app';
import connect from '../src/db';
import Story from '../src/db/Story';
import exampleFromPDF from './__fixtures__/exampleFromPDF.json';
import normalizeAuthors from '../src/utils/normalizeAuthors';

let connection: Connection;
let server: Server;

// Don't mutate the fixture.
const storyInput = JSON.parse( JSON.stringify( exampleFromPDF ) );

const port = process.env.PORT || 3000;
const request = supertest( app );

describe( 'API', () => {
	const { article: { authors, canonical_url, id: guid, title } } = storyInput;
	const expectedResponse: Partial<Story> = {
		authors: normalizeAuthors( authors ),
		canonical_url,
		guid,
		title,
	};

	beforeAll( async () => {
		// Wait for database to connect.
		jest.setTimeout( 30000 );

		connection = await connect( { dropSchema: true } );
		server = app.listen( port );
	} );

	afterAll( () => {
		connection.close();
		server.close();
	} );

	it( 'returns 404 for non-existent endpoints', async () => {
		const endpoints = [
			'/stories/foo',
			'/dogs/',
		];

		for ( const endpoint of endpoints ) {
			const response = await request.get( endpoint );

			expect( response.status ).toEqual( 404 );
			expect( response.body.message ).toBe( undefined );
		}
	} );

	it( 'returns 404 with message for nonexistent story', async () => {
		const response = await request.get( '/stories/1' );

		expect( response.status ).toEqual( 404 );
		expect( response.body.error.message ).toEqual( 'Resource not found' );
	} );

	it( 'returns an empty array when there are no stories', async () => {
		const response = await request.get( '/stories/' );

		expect( response.status ).toEqual( 200 );
		expect( response.body.data ).toEqual( [] );
	} );

	it( 'accepts a story', async () => {
		const response = await request.post( '/stories/' ).send( storyInput );

		expect( response.status ).toEqual( 200 );

		const { body: { data: { id } } } = response;
		Object.assign( expectedResponse, { id } );

		expect( response.body.data ).toEqual( expectedResponse );
	} );

	it( 'returns the created story as a single entity', async () => {
		const response = await request.get( `/stories/${expectedResponse.id}` );

		expect( response.status ).toEqual( 200 );
		expect( response.body.data ).toEqual( expectedResponse );
	} );

	it( 'returns the created story in the collection', async () => {
		const response = await request.get( '/stories/' );

		expect( response.status ).toEqual( 200 );
		expect( response.body.data ).toEqual( [ expectedResponse ] );
	} );

	it( 'updates an existing story if it is reposted', async () => {
		const newTitle = 'UPDATED TITLE';
		Object.assign( storyInput.article, { title: newTitle } );
		Object.assign( expectedResponse, { title: newTitle } );

		const response = await request.post( '/stories/' ).send( storyInput );

		expect( response.status ).toEqual( 200 );
		expect( response.body.data ).toEqual( expectedResponse );
	} );

	it( 'returns the updated story as a single entity', async () => {
		const response = await request.get( `/stories/${expectedResponse.id}` );

		expect( response.status ).toEqual( 200 );
		expect( response.body.data ).toEqual( expectedResponse );
	} );
} );
