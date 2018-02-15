window.router = (function() {

    const Main = document.querySelector('#app');

    window.addEventListener("hashchange", function() {
        let locationHash = location.hash;
        if (locationHash.indexOf('#/') === 0) {
            locationHash = locationHash.slice(2);
        }

        const route = locationHash.toLowerCase();

        if (!window.localStorage.getItem('trello_token')) {
            // Compose(Main);
            location.hash = '#/login';
            Main.innerHTML = '';
            views.renderLogin(); 
        }
        else if (window.localStorage.getItem('trello_token') === true) {
            // List(Main);
            location.hash = '#/boards';
        }

    }, false);

    location.hash = '#/boards';

})();
