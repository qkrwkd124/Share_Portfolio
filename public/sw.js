self.addEventListener('push',function(event){
    var title = 'ttt';
    var body = 'push message';
    event.waitUntil(
        self.registrtion.showNotification(title,{
            body: body,
        })
    );
});