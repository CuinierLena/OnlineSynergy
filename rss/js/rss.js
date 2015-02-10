var container= null;


// initialization function
function init(selector) {
    container = document.getElementById(selector);
    // getting necessary variables
    var rssUrl = container.getAttribute('rss_url');
    var num = container.getAttribute('rss_num');

    // creating temp scripts which will help us to transform XML (RSS) to JSON
    var url = encodeURIComponent(rssUrl);
    var googUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+num+'&q='+url+'&callback=parse&context='+selector;

    var script = document.createElement('script');
    script.setAttribute('type','text/javascript');
    script.setAttribute('charset','utf-8');
    script.setAttribute('src',googUrl);
    container.appendChild(script);
}


// parsing of results by google
function parse(context, data) {
    var container = document.getElementById(context);
    container.innerHTML = '';

    // creating list of elements
    var mainList = document.createElement('ul');

    // also creating its childs (subitems)
    var entries = data.feed.entries;
    for (var i=0; i<entries.length; i++) {
        var listItem = document.createElement('li');
        var title = entries[i].title;
        var contentSnippet = entries[i].contentSnippet;
        var contentSnippetText = document.createTextNode(contentSnippet);

        var link = document.createElement('a');
        link.setAttribute('href', entries[i].link);
        link.setAttribute('target','_blank');
        var text = document.createTextNode(title);
        link.appendChild(text);

        // add link to list item
        listItem.appendChild(link);

        var desc = document.createElement('p');
        desc.appendChild(contentSnippetText);

        // add description to list item
        listItem.appendChild(desc);

        // adding list item to main list
        mainList.appendChild(listItem);
    }
    container.appendChild(mainList);
}

window.onload = function () {
    init('rss');
}   