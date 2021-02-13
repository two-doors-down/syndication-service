import {
	createConnection,
	ConnectionOptions,
} from 'typeorm';
import Story from './Story';

const database = process.env.MYSQL_DATABASE;
const host = process.env.MYSQL_HOST;
const password = process.env.MYSQL_PASSWORD;
const port = parseInt( process.env.MYSQL_PORT || '' ) || 3306;
const username = process.env.MYSQL_USER;

const options: ConnectionOptions = {
	database,
	entities: [
		Story,
	],
	host,
	logging: false,
	password,
	port,
	synchronize: true,
	type: 'mysql',
	username,
};

const maxRetries = 15;
let retries = 0;

export default async function connect () {
	await createConnection( options )
		.catch( err => {
			if ( retries < maxRetries ) {
				return new Promise( resolve => {
					// Retry in 2 seconds.
					retries++;
					setTimeout( () => resolve( connect() ), 2000 );
				} );
			}

			console.error( `Giving up after ${retries} retries...` );
			throw err;
		} );
}
