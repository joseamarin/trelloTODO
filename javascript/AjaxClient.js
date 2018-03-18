;(function() {
    function makePromise ( type , url , requestData ) {
        return new Promise( ( resolve , reject ) => {
            const request = new XMLHttpRequest();

            request.open( type , url );

            request.onload = () => {
                const data = JSON.parse( request.responseText );

                resolve( data );
            };

            request.onerror = ( error ) => {
                reject( error );
            };

            if ( type === 'GET' ) {
                request.send();
            } else {
                request.send( JSON.stringify( requestData ) );
            }
        } );
    }

    module.exports = {
        "get"       : function ( url ) {
            return makePromise( 'GET' , url );
        } ,
        "post"      : function ( url , data ) {
            return makePromise( 'POST' , url , data );
        } ,
	    "put"       : function ( url , data ) {
            return makePromise( 'PUT' , url , data );
        } ,
	    "delete"    : function ( url , data ) {
            return makePromise( 'DELETE' , url , data );
        }
    };
})();
