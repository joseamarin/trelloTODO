window.router = (function() {

    const Main = document.querySelector('#app');

    window.addEventListener("hashchange", function() {
        let locationHash = location.hash;
        if (locationHash.indexOf('#/') === 0) {
            locationHash = locationHash.slice(2);
        }

        const route = locationHash.toLowerCase();

        if (!window.localStorage.getItem('trello_token')) {
            location.hash = '#/login';
            Main.innerHTML = views.renderLoginPage(); 
        }
        else if (window.localStorage.getItem('trello_token')) {
            location.hash = '#/boards';
            Main.innerHTML = views.renderBoardsPage();
        }

    }, false);

    location.hash = '#/boards';

})();
