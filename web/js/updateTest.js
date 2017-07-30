/**
 * Created by e_jjk on 2017/7/30 0030.
 */


function uploadFile() {
    let files = document.getElementById('up-file').files;
    AWS.config.update({
        accessKeyId: 'AKIAOPNEM3X2HTC5EG6Q',
        secretAccessKey: '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',
        region: 'cn-north-1'
    });
    let s3 = new AWS.S3();
    let prefix = '';
    let bucket = 'wx-mp-chengchuang';
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let blob = new Blob([file]);
        let params = {
            ACL: "public-read",
            Bucket: bucket,
            Key: prefix + files[i].name,
            Body: blob,
            ContentLength: file.size
        };
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                console.log(data);           // successful response
            }
        });
    }
}