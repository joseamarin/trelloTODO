;(function () {
    module.exports = {
		"buildHttpQuery" : function( object ) {
			var str = [];

			for ( var p in object ) {
				if (obj.hasOwnProperty(p)) {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			}

			return str.join( "&" );
		}
    };
});
