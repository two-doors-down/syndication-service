export const INVALID_REQUEST = 'Invalid request';
export const NOT_FOUND = 'Resource not found';

export function getErrorContext( err: Error ) {
	console.error( err.name, err.message );

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
