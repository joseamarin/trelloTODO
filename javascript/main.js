/* CURRENTLY IN: javascript/main.js */

(function() {

    const key = 'XXXXXXXXXXXXXXXXXXXXXXXXXX';
    const baseURL = 'https://api.trello.com';
    const url = 'https://trello.com';
    const version = '1';
    const getTokenBtn = document.querySelector('.js-get-token');
    const modalContainer = document.querySelector('.modal-container');
    const modal = document.querySelector('.ui.modal');
    const input = document.querySelector('.js-token-input');
    const storage = window.localStorage;
    const boardContainer = document.querySelector('.js-boards');
    const addBoardBtn = document.querySelector('.js-add-board');
    input.value = '';

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

    const tokenModal = () => {
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
            if (e.keyCode === 13) validateToken();  
        });
    };

    const validateToken = () => {
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

    // authorize a web client using the GET route: https://trello.com/1/authorize
    // for now users need to copy their token manually 
    getTokenBtn.addEventListener('click', () => {
        makeApiRoute('authorize').then((e) => {
            alert('A new tab will open, copy the access token then paste it here');
            window.open(e);
            tokenModal();
            // $('.ui.modal')
            //     .modal('show');
        });
    });


    makeApiRoute('members', 'me', 'boards').then((data) => {
        if ('localStorage' in window && window['localStorage'] !== null) {
            ajax.GET(data).then((data) => {
                console.log(data)
                renderBoard(data).then((data) => {
                }); 
            });
        };
    });

    const makeEl = elName => { return document.createElement(elName) };

    const renderBoard = () => {
        return new Promise((resolve, reject) => {
            makeApiRoute('member', 'me', 'boards').then((boards) => {
                ajax.GET(boards).then((boards) => {
                    boards.forEach((boardName) => {
                        const div = makeEl('div');
                        const list = makeEl('ul');
                        const listItem = makeEl('li');
                        const boardTile = makeEl('a');
                        const boardTileFade = makeEl('span');
                        const boardTileFadeDetails = makeEl('span');
                        div.classList.add('column');
                        list.classList.add('board-list');
                        listItem.classList.add('board-list-item');
                        boardTile.classList.add('board-tile');
                        boardTileFade.classList.add('board-tile-fade');
                        boardTileFadeDetails.classList.add('board-tile-fade-details');
                        boardContainer.appendChild(div);
                        div.appendChild(list);
                        list.appendChild(listItem);
                        listItem.appendChild(boardTile);
                        boardTile.appendChild(boardTileFade);
                        boardTile.appendChild(boardTileFadeDetails);
                        boardTileFadeDetails.innerHTML = `<span>${boardName.name}</span>`;
                    });
                });
            });
        }); 
    };

    const displayMember = (userObj) => {
        return new Promise((resolve, reject) => {
            const header = document.querySelector('.js-header');  
            const anchor = makeEl('a');
            const member = makeEl('span'); 
            anchor.classList.add('item');
            member.classList.add('member');
            header.appendChild(anchor);
            anchor.appendChild(member);
            anchor.setAttribute('title', `${userObj.fullName} ${(userObj.username)}`);
            member.innerHTML = `<span class="member-initials">${userObj.initials}</span>`;
        }); 
    };

    makeApiRoute('member', 'me').then((userData) => {
        ajax.GET(userData).then((userData) => {
            console.log(userData)
            displayMember(userData).then((userData) => {
            });
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

    addBoardBtn.addEventListener('click', (e) => { 
        makeBoardData('trelloTODO4').then((data) => {
            makeBoard(data).then((newBoard) => {
                ajax.POST(newBoard).then((newBoard) => {
                    console.log(newBoard); 
                }); 
            });
        });
    });

    // makePostData('testing function call to make a card', listId, 'card description goes here', 'bottom', '2018-02-09').then((data) => {
    //     makeCard(data).then((card) => {
    //         ajax.POST(card).then((card) => {
    //         }).catch((e) => {
    //             console.log(e);
    //         }); 
    //     });
    // });

})();
