mergeInto(LibraryManager.library, {

    CameraRequest: function () {
        var constraints = { audio: false, video: { width: 640, height: 480 } };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (mediaStream) {
                var video = document.querySelector('video');
                video.srcObject = mediaStream;
                video.onloadedmetadata = function (e) {
                    video.play();
                };
            })
            .catch(function (err) { console.log(err.name + ": " + err.message); });
    },
});
