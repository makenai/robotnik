var exec = require('child_process').exec;

var node = exec('node --version', function(error, stdout, srderr) {
    if (error !== null) {
        throw new Error('Robotnik preinstall error: ' + error);
        process.exit(1);
    }

    var version = stdout;
    console.info('robotnik preinstall, node check. Node Version is: %s', version);

    var maj_version_number = parseInt(version[1]);
    if (maj_version_number < 5) {
        console.error('robotnik preinstall error: Node version is too early. Please use node 5.x');
        process.exit(1);
    } else {
        console.log('robotnik preinstall check node OK');
        process.exit(0);
    }
});



