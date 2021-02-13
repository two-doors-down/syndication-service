import 'reflect-metadata';
import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import { get, getAll, post } from './controllers/stories';
import { getErrorContext } from './errors';

const app = express();

app.use( bodyParser.json() );

// Wrapper for async middleware to catch and return JSON. Nest response in data
// property.
function wrap ( fn: ( req: Request, res: Response, next: NextFunction ) => Promise<any> ) {
	return function ( req: Request, res: Response, next: NextFunction ) {
		fn( req, res, next )
			.then( data => res.status( 200 ).json( { data } ) )
			.catch( next );
	}
}

app.get( '/', ( _: Request, res: Response ) => {
	res.send( '👋' );
} );

// Story endpoints
app.get( '/stories', wrap( getAll ) );
app.get( '/stories/:id(\\d+)', wrap( get ) );
app.post( '/stories', wrap( post ) );

app.use( ( err: Error, _: Request, res: Response, __: NextFunction ) => {
	const error = getErrorContext( err );

	if ( '1' !== process.env.SWALLOW_ERRORS ) {
		console.error( err );
	}

	res.status( error.code ).json( { error } );
} );

export default app;
