window.views = (function() {

    const renderLogin = () => {
        document.getElementById('app').innerHTML = `

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
            1
        </div>
    </div>
    <div class="eight wide column">
        <div class="ui segment">
<i class="arrow left icon"></i>
            Welcome to Trello TODO
<i class="arrow right icon"></i>
        </div>
    </div>
    <div class="column">
        <div class="ui segment">
            3
        </div>
    </div>
</div>

        `;
    };

    return {
        renderLogin, 
    };
   //https://trello.com/signup?returnUrl=%2F  
})();
