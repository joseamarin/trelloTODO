/* CURRENTLY IN: javascript/main.js */

(function() {

    const key = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
	const token = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // token expires daily TODO automate token generation somehow?
    const baseURL = 'https://api.trello.com';
    const url = 'https://trello.com';
    const version = '1';
    const boardId = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    const listId = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; 
    const getTokenBtn = document.querySelector('.js-get-token');
    const modal = document.querySelector('.ui.modal');


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
            let route = `${baseURL}/${version}${endpoint}?key=${key}&token=${token}`;
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
        const modalContainer = document.querySelector('.modal-container');
        body.classList.add('dimmable', 'dimmed');
        modalContainer.classList.add('ui', 'dimmer', 'modals', 'page', 'transition', 'visible', 'active');
        modal.classList.add('active', 'mini');
        body.addEventListener('keydown', (e) => {
            if (e.keyCode ===  27) {
                modalContainer.classList.remove('ui', 'dimmer', 'modals', 'page', 'transition', 'visible', 'active');
                modal.classList.remove('active');
            }; 
        });
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
        GET(data).then((data) => {
            console.log(data) 
        }).catch((e) => {
            console.log(e); 
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
