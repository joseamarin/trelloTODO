describe( 'Unit Tests for TrelloAPI' , function () {
    it( 'can attempt to authenticate with trello' , function () {
        const container = require( '../app/core/trelloTODOContainer' );

        const api = container.makeTrelloApi();

        const promise = api.authenticate( 'aefafawf' , 'eafef' );

        expect( promise.constructor.name ).toEqual( 'Promise' );
    } );
} );
