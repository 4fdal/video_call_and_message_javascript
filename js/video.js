(function(){
    window.addEventListener('load', function(e){
        var video = document.getElementById('myvideo');
        var vendorUrl = window.URL || window.webkitURL;
        navigator.getMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        navigator.getMedia({ video: true, audio: true }, function (stream) {

            // video
            var peer = new SimplePeer({
                initiator: location.hash === '#server',
                trickle: false,
                stream: stream
            })

            peer.on('signal', function (data) {
                data = JSON.stringify(data);
                data = encode(data);
                document.getElementById('myId').value = data ;
            });

            document.getElementById('connect').addEventListener('click', function(e){
                var otherId = document.getElementById('otherId').value ;
                otherId = decode(otherId) ;
                peer.signal(otherId);
            });

            peer.on('stream', function(stream){
                video.srcObject = stream;
                video.onloadedmetadata = function (e) {
                    video.play();
                };
            })

            // message 
            peer.on('data', function(data){
                document.getElementById('msg').textContent += data+"\n"
            })

            document.getElementById('send').addEventListener('click', function(e){
                var myMsg = document.getElementById('myMsg').value ;
                document.getElementById('msg').textContent += "My Message : " + myMsg +" \n" ;
                peer.send("Other Message : "+myMsg);
            })
            
        }, function (err) {
            console.error(err);
        });
    })

    function encode(data) {
        var encode = CryptoJS.AES.encrypt(data, "encrypt");
        return encode;
    }

    function decode(data) {
        var decode = CryptoJS.AES.decrypt(data, "encrypt").toString(CryptoJS.enc.Utf8)
        return decode;
    }
})();