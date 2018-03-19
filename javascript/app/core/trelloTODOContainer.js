define( [ 'AjaxClient' , 'app/core/Helper'] , function ( ajaxClient , helper ) {
    /**
     * Trello API Client
     */
    function TrelloAPI ( ajax , helper ) {
        this.ajax = ajax;
        this.helper = helper;
    }

    TrelloAPI.prototype = {
        "authenticate" : function ( key , token ) {
            return this.ajax.get(
                this.getAuthUrl() ,
                this.getAuthQueryString( key , token )
            );
        } ,
        "getAuthUrl" : function () {
            const url = 'https://trello.com/';
            const version = '1';
            const endpoint = '/authorize';

            return url + version + endpoint;
        } ,
        "getAuthQueryString" : function ( key , token ) {
            const fields = {
                expiration : 'never' ,
                name : 'trelloTodo' ,
                response_type : 'token' ,
                scope : 'read,write' ,
                key : key ,
                token : token
            };

            return this.helper.buildHttpQuery( fields );
        }
    };

    /**
     * Trello API Singleton Factory
     */
    var trelloApiInstance;

    function createSingletonTrelloApiInstance () {
        trelloApiInstance = new TrelloAPI( ajaxClient , helper );

        return trelloApiInstance;
    }

    function makeTrelloApi () {
        if ( !trelloApiInstance ) {
            return createSingletonTrelloApiInstance();
        }

        return trelloApiInstance;
    }

    /**
     * trelloTODOContainer Public Interface
     */
    const trelloTODOContainer =  {
        "makeTrelloApi" : makeTrelloApi
    };

    return trelloTODOContainer;
});
