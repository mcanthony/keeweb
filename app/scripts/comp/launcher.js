'use strict';

var Backbone = require('backbone');
var Launcher;

if (window.process && window.process.versions && window.process.versions.electron) {
    Launcher = {
        name: 'electron',
        version: window.process.versions.electron,
        req: window.require,
        remReq: function(mod) {
            return this.req('remote').require(mod);
        },
        openLink: function(href) {
            this.req('shell').openExternal(href);
        },
        devTools: true,
        openDevTools: function() {
            this.req('remote').getCurrentWindow().openDevTools();
        },
        getSaveFileName: function(defaultPath, cb) {
            if (defaultPath) {
                var homePath = this.remReq('app').getPath('userDesktop');
                defaultPath = this.req('path').join(homePath, defaultPath);
            }
            this.remReq('dialog').showSaveDialog({
                title: 'Save Passwords Database',
                defaultPath: defaultPath,
                filters: [{ name: 'KeePass files', extensions: ['kdbx'] }]
            }, cb);
        },
        writeFile: function(path, data) {
            this.req('fs').writeFileSync(path, new window.Buffer(data));
        },
        readFile: function(path) {
            return new Uint8Array(this.req('fs').readFileSync(path));
        },
        fileExists: function(path) {
            return this.req('fs').existsSync(path);
        },
        exit: function() {
            Launcher.exitRequested = true;
            this.remReq('app').quit();
        }
    };
    window.launcherOpen = function(path) {
        Backbone.trigger('launcher-open-file', path);
    };
    if (window.launcherOpenedFile) {
        Backbone.trigger('launcher-open-file', window.launcherOpenedFile);
        delete window.launcherOpenedFile;
    }
}

module.exports = Launcher;
