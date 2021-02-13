import 'reflect-metadata';
import app from './app';
import connect from './db';

const port = process.env.PORT || 3000;

// Wait for database to connect. Doing this separately from the app definition
// for easier testing.
connect().then( () => {
	console.log( `Server listening on port ${port}...` );
	app.listen( port );
} );

export default app;
