import 'reflect-metadata';
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import connect from './db';

const app = express();
const port = process.env.PORT || 3000;

app.use( bodyParser.json() );

app.get( '/', ( req: Request, res: Response ) => {
	res.send( '👋' );
} );

// Wait for database to connect.
connect().then( () => {
	console.log( `Server listening on port ${port}...` );
	app.listen( port );
} );

export default app;
