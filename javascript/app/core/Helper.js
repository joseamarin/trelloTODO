define(function () {
    return {
		"buildHttpQuery" : function( object ) {
			var str = [];

			for ( var property in object ) {
				if ( object.hasOwnProperty( property ) ) {
					str.push(
                        encodeURIComponent( property )
                        + "="
                        + encodeURIComponent( object[ property ] )
                    );
				}
			}

			return str.join( "&" );
		}
    };
});
