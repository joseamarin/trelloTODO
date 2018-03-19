define( [ 'AjaxClient' , 'app/core/Helper'] , function ( ajaxClient , helper ) {
    /**
     * Trello API Client
     */
    function TrelloAPI ( ajax , helper ) {
        this.ajax = ajax;
        this.helper = helper;

        this.protocol = 'https://';
        this.authUrl = 'trello.com/';
        this.apiUrl = 'api.trello.com/';
        this.version = '1';

        this.authEndpoint = '/authorize';
        this.userEndpoint = '/member/me';
        this.boardEndpoint = this.userEndpoint + '/boards';

        this.key;
        this.token;
    }

    TrelloAPI.prototype = {
        "authenticate" : function () {
            return this.ajax.get(
                this.getAuthUrl()
                + '?'
                + this.getAuthQueryString()
            );
        } ,
        "getBoards" : function () {
            return this.ajax.get(
                this.getBoardUrl()
                + '?'
                + this.getCredentialQueryString()
            );
        } ,
        "getUserDetails" : function () {
            return this.ajax.get(
                this.getUserUrl()
                + '?'
                + this.getCredentialQueryString()
            );
        } ,
        "setKey" : function ( key ) {
            this.key = key;
        } ,
        "setToken" : function ( token ) {
            this.token = token;
        } ,
        "getAuthUrl" : function () {
            return this.protocol
                + this.authUrl
                + this.version
                + this.authEndpoint;
        } ,
        "getAuthQueryString" : function () {
            const fields = {
                expiration : 'never' ,
                name : 'trelloTodo' ,
                response_type : 'token' ,
                scope : 'read,write' ,
                key : this.key ,
                token : this.token
            };

            return this.helper.buildHttpQuery( fields );
        } ,
        "getCredentialQueryString" : function () {
            const fields = {
                key : this.key ,
                token : this.token
            };

            return this.helper.buildHttpQuery( fields );
        } ,
        "getApiUrl" : function () {
            return this.protocol + this.apiUrl + this.version;
        } ,
        "getBoardUrl" : function () {
            return this.getApiUrl() + this.boardEndpoint;
        },
        "getUserUrl" : function () {
            return this.getApiUrl() + this.userEndpoint;
        }
    };

    /**
     * Trello API Singleton Factory
     */
    var trelloApiInstance;

    function createSingletonTrelloApiInstance ( key , token ) {
        trelloApiInstance = new TrelloAPI( ajaxClient , helper );
        trelloApiInstance.setKey( key );
        trelloApiInstance.setToken( token );

        return trelloApiInstance;
    }

    function makeTrelloApi ( key , token ) {
        if ( !trelloApiInstance ) {
            return createSingletonTrelloApiInstance( key , token );
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
