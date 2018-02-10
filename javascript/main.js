/* CURRENTLY IN: javascript/main.js */

(function() {

    const key = 'XXXXXXXXXXXXXXXXXXXXXXXXXX';
    const baseURL = 'https://api.trello.com';
    const url = 'https://trello.com';
    const version = '1';
    const boardId = 'XXXXXXXXXXXXXXXXXXXXXXXXXX';
    const listId = 'XXXXXXXXXXXXXXXXXXXXXXXXXX'; 
    const getTokenBtn = document.querySelector('.js-get-token');
    const modalContainer = document.querySelector('.modal-container');
    const modal = document.querySelector('.ui.modal');
	const input = document.querySelector('.js-token-input');
    const storage = window.localStorage;
    const boardContainer = document.querySelector('.js-boards');
    input.value = '';

    const getToken = (url) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest(); 
            xhr.open('GET', url);
			xhr.onload = () => {
				resolve(xhr.responseText);
			}; 
			xhr.onerror = (err) => {
				reject(err);
			};
			xhr.send();
        }); 
    };

    const makeGETEndpoint = (...args) => {
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
                route = `${url}/${version}${endpoint}?&name=${name}&response_type=${responseType}&scope=${scope}&key=${key}`;   
                getToken(route).then((endpoint) => {
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
        makeGETEndpoint('authorize').then((e) => {
            alert('A new tab will open, copy the access token then paste it here');
            window.open(e);
            tokenModal();
            // $('.ui.modal')
            //     .modal('show');
        });
    });

    const GET = (url) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = () => {
				const isReqReady = xhr.readyState === XMLHttpRequest.DONE;
				const isReqDone = xhr.status === 200;

				if (isReqReady && isReqDone) {
					resolve(JSON.parse(xhr.responseText));
				};
			};
            xhr.open('GET', url)
            xhr.send();
        }); 
    }; 

	const POST = (url, data) => {
    	return new Promise((resolve, reject) => {
		    const xhr = new XMLHttpRequest();
			xhr.open('POST', url);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = () => {
                console.log(xhr.responseText)
				const data = JSON.parse(xhr.responseText);
				resolve(data)
			}; 
			xhr.onerror = (err) => {
				reject(err)
			};
			xhr.send(JSON.stringify(data));
		});
	};

    makeGETEndpoint('lists', listId, 'cards').then((data) => {
        if ('localStorage' in window && window['localStorage'] !== null) {
            GET(data).then((data) => {
                console.log(data) 
                displayBoard(data).then((data) => {
                }); 
            });
        };
    });

    const makeEl = elName => {return document.createElement(elName);};

    const displayBoard = () => {
        return new Promise((resolve, reject) => {
            makeGETEndpoint('member', 'me', 'boards').then((boards) => {
                GET(boards).then((boards) => {
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

    const  makeCard = (data) => {
        return new Promise((resolve, reject) => {
            let route = `${baseURL}/${version}/cards?`;
            const keys = Object.keys(data);
            let counter = 0;
            for (prop in data) {
                route += `&${keys[counter]}=${data[prop]}`;
                counter ++;
            };
            route += `&key=${key}&token=${token}`;
            resolve(route);
        });
    };

    // makePostData('testing function call to make a card', listId, 'card description goes here', 'bottom', '2018-02-09').then((data) => {
    //     makeCard(data).then((card) => {
    //         POST(card).then((card) => {
    //         }).catch((e) => {
    //             console.log(e);
    //         }); 
    //     });
    // });
    
})();
