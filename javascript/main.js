/* CURRENTLY IN: javascript/main.js */

(function() {

    const key = 'XXXXXXXXXXXXXXXXXXXXXXXXXX';
    const baseURL = 'https://api.trello.com';
    const url = 'https://trello.com';
    const version = '1';
    const storage = window.localStorage;

    if (!storage.getItem('trello_token') || location.hash === '#/boards') location.hash = '#/login';

    /**
     * TrelloAPI is a refactoring of makeApiRoute
     */
    const container = require( '../app/core/trelloTODOContainer' );
    const trelloApi = container.makeTrelloApi();
    const token = storage.getItem('trello_token');

    const makeApiRoute = (...args) => {
        return new Promise((resolve, reject) => {
            let endpoint = '';
            for (let i = 0; i < args.length; i++) {
                endpoint += `/${args[i]}`;
            };
            let route = `${baseURL}/${version}${endpoint}?key=${key}&token=${storage.getItem('trello_token')}`;
            if (endpoint === '/authorize') {
                const name = 'trelloTodo';
                const responseType = 'token';
                const scope = 'read,write';
                const expiration = 'never';
                route = `${url}/${version}${endpoint}?expiration=${expiration}&name=${name}&response_type=${responseType}&scope=${scope}&key=${key}`;
                ajax.GET(route).then((endpoint) => {
                });
            };
            resolve(route);
        });
    };

    const tokenModal = (getTokenBtn, modalContainer, modal, input) => {
        getTokenBtn.addEventListener('click', () => {
            modal.classList.add('ui', 'modal');
        });
        const body = document.querySelector('body');
        body.classList.add('dimmable', 'dimmed');
        modalContainer.classList.add('ui', 'dimmer', 'modals', 'page', 'transition', 'visible', 'active');
        modal.classList.add('active', 'mini');
        body.addEventListener('keydown', (e) => {
            if (e.keyCode ===  27) {
                modalContainer.classList.remove('ui', 'dimmer', 'modals', 'page', 'transition', 'visible', 'active');
                modal.classList.remove('active');
            };
        });
        input.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) validateToken(modalContainer, modal, input);
        });
    };

    const validateToken = (modalContainer, modal, input) => {
        let userToken = '';
        if (input.value.trim() === "") {
            alert('Please input a value!');
            return;
        };
        userToken = input.value;
        storage.setItem('trello_token', userToken);
        modalContainer.classList.remove('ui', 'dimmer', 'modals', 'page', 'transition', 'visible', 'active');
        modal.classList.remove('active');
        location.reload(); // temp using a page reload
    };

    document.querySelector('#app').addEventListener('click', event => {
        if (event.target.classList.contains('js-get-token', 'js-token-input', 'modal-container', 'ui.modal')) {
            const getTokenBtn = document.querySelector('.js-get-token');
            const modalContainer = document.querySelector('.modal-container');
            const modal = document.querySelector('.ui.modal');
            const input = document.querySelector('.js-token-input');
            input.value = '';
            //makeApiRoute('authorize').then((e) => {

            trelloApi.authenticate( key , token ).then( function ( redirect ){
                alert('A new tab will open, copy the access token then paste it here');
                window.open( redirect );
                tokenModal(getTokenBtn, modalContainer, modal, input);
            });
        };
    });

    makeApiRoute('members', 'me', 'boards').then((data) => {
        if ('localStorage' in window && window['localStorage'] !== null) {
            ajax.GET(data).then((data) => {
                console.log(data);
                const obj = data.map((i) => {
                    return [i.name, i.id];
                }).reduce(function(acc, cur, i) {
                    acc[i] = cur;
                    return acc;
                }, {});
                console.log(obj)
                storage.setItem(obj[0][0], obj[0][1])
                renderBoard(data);
            });
        };
    });

    const makeEl = elName => { return document.createElement(elName) };

    const renderBoard = () => {
        makeApiRoute('member', 'me', 'boards').then((boards) => {
            ajax.GET(boards).then((boards) => {
                boards.forEach((boardName) => {
                    if ( /trelloTODO\d+/g.test(boardName.name) ) {
                        const boardContainer = document.querySelector('.js-boards');
                        const div = makeEl('div');
                        const list = makeEl('ul');
                        const listItem = makeEl('li');
                        const boardTile = makeEl('a');
                        div.classList.add('column');
                        list.classList.add('board-list');
                        listItem.classList.add('board-list-item');
                        boardTile.classList.add('board-tile');
                        boardContainer.appendChild(div);
                        div.appendChild(list);
                        list.appendChild(listItem);
                        listItem.appendChild(boardTile);
                        boardTile.innerHTML = `<span class="board-name">${boardName.name}</span>`;
                    };
                });
            });
        });
    };

    const displayMember = (userObj) => {
            const header = document.querySelector('.js-header');
            const anchor = makeEl('a');
            const member = makeEl('span');
            anchor.classList.add('item');
            member.classList.add('member');
            header.appendChild(anchor);
            anchor.appendChild(member);
            anchor.setAttribute('title', `${userObj.fullName} ${(userObj.username)}`);
            member.innerHTML = `<span class="member-initials">${userObj.initials}</span>`;
    };

    makeApiRoute('member', 'me').then((userData) => {
        ajax.GET(userData).then((userData) => {
            displayMember(userData);
        });
    });

    //  TODO add replace functionality for url ASCII symbols e.g. : //
    const makePostData = (name, idList, desc, pos, due, url, keepFromSource = 'all') => {
        return new Promise((resolve, reject) => {
            if (!name || !idList) throw new Error('This is a required parameter!');
            const card = {
                name,
                idList,
                desc,
                pos,
                due,
                url,
                keepFromSource
            };
            for (prop in card) {
                if (typeof card[prop] === 'undefined') delete card[prop];
                if (!card[prop]) break;
                card[prop] = card[prop].replace(/ /g, '%20');
            };
            resolve(card);
        });
    };

    const makeCard = (data) => {
        return new Promise((resolve, reject) => {
            let route = `${baseURL}/${version}/cards?`;
            const keys = Object.keys(data);
            let counter = 0;
            for (prop in data) {
                route += `&${keys[counter]}=${data[prop]}`;
                counter ++;
            };
            route += `&key=${key}&token=${storage.getItem('trello_token')}`;
            resolve(route);
        });
    };

    const makeBoardData = (name, prefs_background = 'red') => {
        return new Promise((resolve, reject) => {
            if (!name) throw new Error('This is a required parameter!');
            const board = { name, prefs_background };
            for (prop in board) {
                if (typeof board[prop] === 'undefined') delete board[prop];
                if (!board[prop]) break;
                board[prop] = board[prop].replace(/ /g, '%20');
            };
            resolve(board);
        });
    };

    const makeBoard = (data) => {
        return new Promise((resolve, reject) => {
            let route = `${baseURL}/${version}/boards?`;
            const keys = Object.keys(data);
            let counter = 0;
            for (prop in data) {
                route += `&${keys[counter]}=${data[prop]}`;
                counter ++;
            };
            route += `&key=${key}&token=${storage.getItem('trello_token')}`;
            resolve(route);
        });
    };

    document.querySelector('#app').addEventListener('click', event => {
        if (event.target.classList.contains('js-add-board')) {
            const addBoardBtn = document.querySelector('.js-add-board');
            makeApiRoute('member', 'me', 'boards').then((route) =>{
                ajax.GET(route).then((boards) => {
                    if (boards.length === 0) {
                        makeBoardData('trelloTODO1').then((data) => {
                            makeBoard(data).then((newBoard) => {
                                ajax.POST(newBoard).then((newBoard) => {
                                    location.reload(); // temp should add eventListener to watch then re-render just the cards or make one more card element
                                });
                            });
                        });
                    }
                    for (let i = 0; i < boards.length; i++) {
                        if (boards[i].name.match(/trelloTODO\d+/g)) {
                            console.log(boards[i].name.match(/trelloTODO\d+/g))
                        }
                    }
                    const boardNumberPlusOne = Number(boards.slice(-1)[0].name.slice(-1)) +1;
                    const boardNameMinusNumber = boards.slice(-1)[0].name.slice(0, -1);
                    const newTODO = boardNameMinusNumber + boardNumberPlusOne;
                    if (parseInt(newTODO.slice(-2), 10) === 10) {
                        alert('already at 10 boards')
                        return;
                    }
                    makeBoardData(newTODO).then((data) => {
                        makeBoard(data).then((newBoard) => {
                            ajax.POST(newBoard).then((newBoard) => {
                                location.reload(); // temp should add eventListener to watch then re-render just the cards or make one more card element
                            });
                        });
                    });
                });
            });
        };
    });
/*
    // delete all boards
    makeApiRoute('members', 'me', 'boards').then((route) => {
        ajax.GET(route).then((boards) => {
            for (let i = 0; i < boards.length; i++) {
                makeApiRoute('boards', boards[i].id).then((deletedBoardRoute) => {
                    console.log(deletedBoardRoute)
                    ajax.DELETE(deletedBoardRoute).then((deletedBoard) => {
                        console.log(deletedBoard);
                    });
                });
            }
        });
    });
*/
/*
    makePostData('testing function call to make a card', listId, 'card description goes here', 'bottom', '2018-02-09').then((data) => {
        makeCard(data).then((card) => {
            ajax.POST(card).then((card) => {
            }).catch((e) => {
                console.log(e);
            });
        });
    });
*/
})();
