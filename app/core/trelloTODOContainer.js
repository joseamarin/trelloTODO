'use strict'
;(function () {
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
                this.getAuthQueryString( key , token )
            );
        } ,
        "getAuthQueryString" : function ( key , token ) {
            const url = 'https://trello.com/';
            const version = '1';
            const endpoint = '/authorize';

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
        const ajaxClient = require( '../../javascript/AjaxClient' );
        const helper = require( '../../javascript/Helper' );

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

    module.exports = trelloTODOContainer;
})();
