var path = require("path");
var fs = require("fs");
/**
 * GET /files
 * Get files
 */
exports.getAllFiles = function(req, res) {
    var glob = require("glob")
    // options is optional
    glob("uploads/*", {mark: true}, function (er, files) {
        var filesInfos = [];
        files.forEach(function(file, index, arr) {
            var file_obj = {
                    "name": path.basename(file),
                    "path": file,
                    "extension": path.extname(file),
                    "mdate": "",
                    "cdate": "",
                    "isDirectory": fs.lstatSync(file).isDirectory(),
                    "size": getFilesizeInBytes(file)
                };
            filesInfos.push(file_obj);
        })
        res.json(filesInfos);
    });
};

/**
 * GET /files/:filename
 * Get files
 */
exports.postTodo = function(req, res, next) {

};

/**
 * GET /files/:directory
 * Get files of all
 */
exports.getFilesByDirectory = function(req, res) {
    var directory = req.params.directory;
    var glob = require("glob")
    // options is optional
    glob("uploads/**/*"+directory+"*", {mark: true}, function (er, files) {

        files.forEach(function(file, index, arr) {
            console.log(path.basename(file));
        })
        res.json(files);
    });
};

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats["size"];
    return fileSizeInBytes;
}

function getFileModificationDate(filename) {

}

function getFileCreationDate(filename) {

}