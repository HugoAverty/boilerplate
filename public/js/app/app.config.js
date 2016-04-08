app
    .config(['owmProvider', function(owmProvider) {
        owmProvider
            .setApiKey('c96cb65f1ab1c8fbb8a4e8de57ec10b0')
            .useMetric()
            .setLanguage('fr');
    }])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    });