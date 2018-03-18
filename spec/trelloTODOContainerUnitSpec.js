describe( 'Unit Tests for App Container' , function () {
    it( "can make TrelloApiSingleton" , function () {
        const container = require( '../app/core/trelloTODOContainer' );

        const api = container.makeTrelloApi();
        const anotherApi = container.makeTrelloApi();

        expect(api).toEqual( anotherApi );
    } );
} );
