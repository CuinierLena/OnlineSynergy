var rss_url = "http://feeds2.feedburner.com/LeJournalduGeek";
var rss_num="8";
var m_entries;
var newstext = "";

(function($){

    $( document ).ready(function() {
        //alert( "Ready" );
        startTime();
        initrss();
    });
    
    /***** Plus Besoin - Remplacer par SetInterval *****/
    // $("#reload_img").click(function() {
    //     //alert( rss_url );
    //     initrss();
    // });

})(jQuery);

// parsing of results by google
function parse(context, data) {
    var container = document.getElementById(context);
    container.innerHTML = '';
    // creating list of elements
    var mainList = document.createElement('ul');

    // also creating its childs (subitems)
    var entries = data.feed.entries;
    m_entries = entries;
    for (var i=0; i<entries.length; i++) {
        var listItem = document.createElement('li');
        var title = entries[i].title;
        var contentSnippet = entries[i].contentSnippet;
        var contentSnippetText = document.createTextNode(contentSnippet);

        var link = document.createElement('a');
        link.setAttribute('href', entries[i].link);
        link.setAttribute('target','_blank');
        var text = document.createTextNode("< "+title+" >");
        link.appendChild(text);

        // add link to list item
        listItem.appendChild(link);

        var desc = document.createElement('p');
        desc.appendChild(contentSnippetText);

        // add description to list item
        listItem.appendChild(desc);

        // adding list item to main list
        mainList.appendChild(listItem);
        
        newstext += "-\t"+title+"\t-";
        
        var space = $("<span></span>").text("-----");
        space.addClass("space");
        var separator = $("<span></span>").text(" - ");
        separator.addClass("separator");
        $( "#news_text" ).append(space);
        $( "#news_text" ).append(link);
        $( "#news_text" ).append(space);
    }
    //container.appendChild(mainList);
}

function initrss()
{
    var selector = "rss";
        var url = encodeURIComponent(rss_url);
        var googUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+rss_num+'&q='+url+'&callback=parse&context='+selector;
        
        var script = document.createElement('script');
        script.setAttribute('type','text/javascript');
        script.setAttribute('charset','utf-8');
        script.setAttribute('src',googUrl);
        $( "#rss" ).empty();
        $( "#rss" ).append(script);
        
        $( "#news_text" ).empty();
}

function startTime()
{
    setInterval(updateTime, 1000);
    updateTime();
}
function updateTime()
{
    var d = new Date();
    document.getElementById("hour_text").innerHTML = pad2(d.getHours()) + ":" + pad2(d.getMinutes());
}
function pad2(number) {
    return (number < 10 ? '0' : '') + number
}

function change_rss(){
    rss_url = document.getElementById("input_rss").value;
}