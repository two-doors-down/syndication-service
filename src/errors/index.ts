export const INVALID_REQUEST = 'Invalid request';
export const NOT_FOUND = 'Resource not found';

export function getErrorContext( err: Error ) {
	// 🤔 Probably a better / typed way to inspect errors from TypeORM.
	if ( 'QueryFailedError' === err.name ) {
		if ( err.message.includes( 'ER_DUP_ENTRY' ) ) {
			return {
				code: 409,
				message: 'Resource already exists',
			};
		}

		return {
			code: 500,
			message: 'Unknown database error',
		};
	}

	switch ( err.message ) {
		case INVALID_REQUEST:
			return {
				code: 400,
				message: INVALID_REQUEST,
			};

		case NOT_FOUND:
			return {
				code: 404,
				message: NOT_FOUND,
			};
	}

	return {
		code: 500,
		message: 'Unknown error', // Shield internal error messages
	};
}
