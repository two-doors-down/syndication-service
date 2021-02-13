import {
	createConnection,
	Connection,
	ConnectionOptions,
} from 'typeorm';
import Author from './Author';
import Story from './Story';

// NOTE: For ease of configuration, hardcoding some defaults that match
// docker-compose.yml. Would normally reach for dotenv here but trying to keep
// things simple.
const database = process.env.MYSQL_DATABASE || 'test';
const host = process.env.MYSQL_HOST || 'localhost';
const password = process.env.MYSQL_PASSWORD || '';
const port = parseInt( process.env.MYSQL_PORT || '' ) || 3306;
const username = process.env.MYSQL_USER || 'root';

const options: ConnectionOptions = {
	database,
	entities: [
		Author,
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

export default async function connect ( overrides = {} ): Promise<Connection> {
	return await createConnection( { ...options, ...overrides } )
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
