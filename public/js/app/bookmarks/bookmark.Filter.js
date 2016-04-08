
app.filter("favicon", function() {
    var provider = "http://grabicon.com/icon?domain=%s&size=32";

    return function(url) {
        return provider.replace(/%s/g, url);
    }
});