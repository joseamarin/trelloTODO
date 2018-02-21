window.views = (function() {

    const renderLoginPage = () => {
        const html = `
<div class="ui vertical masthead center aligned segment">
    <div class="ui center aligned container">
        <div class="ui compact large secondary centered pointing menu">
            <a class="item todo--white">
                <span class="trello-logo"></span> TODO
            </a>
        </div>
    </div>
</div>
<div class="ui equal width grid">
    <div class="column">
        <div class="ui segment">
            <button class="ui primary button js-get-token">Get Token</button>
        </div>
    </div>
    <div class="eight wide column">
        <div class="ui segment">
Already a Trello member<i class="arrow left icon"></i>
            <h1>Welcome to Trello TODO</h1>
<i class="arrow right icon"></i>Need a Trello account to get a token
        </div>
    </div>
    <div class="column">
        <div class="ui segment">
            <a href="https://trello.com/signup?returnUrl=%2F" target="_blank">
            <button class="ui positive button">Sign Up</button>
            </a>
        </div>
    </div>
</div>
<div class="modal-container">
    <div class="ui modal js-fade fade-in is-paused">
        <div class="header">Token please</div>
        <div class="ui fluid action input">
            <input type="text" placeholder="Enter Token..." class="js-token-input">
        </div>
    </div>
</div>
        `;
        return html;
    };

    const renderBoardsPage = () => {
        const html = `
<div class="ui borderless attached stackable small menu">
    <div class="ui container custom-icons js-header">
        <a class="item todo--white">
            <span class="trello-logo"></span> TODO
        </a>
        <a class="item js-add-board" title="Add a trello todo board">
            <div class="icon-box js-add-board">
                <i class="plus icon js-add-board"></i>
            </div>
        </a>
        <a class="item">
            <div class="icon-box">
                <i class="info icon"></i>
            </div>
        </a>
    </div>
</div>
<br/>
<div class="ui grid container board-header">
    <h3><i class="user outline icon"></i>Your Boards</h3>
</div>
<div class="ui four column doubling stackable grid container js-boards"></div>
        `; 
        return html;
    };

    return {
        renderLoginPage, 
        renderBoardsPage, 
    };
     
})();
