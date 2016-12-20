'use strict'
let fs = require('fs')
let util = require('../common/util')
let dataDir = __dirname + '/../data/'

// 列表页
exports.listPage = (req, res, next) => {
    res.render('index')
}

// 获取 mock列表 数据
exports.getMockList = (req, res, next) => {
    fs.readdir(dataDir, function(err, files) {
        if (err) {
            res.json({ code: 1, error: '查询数据异常' })
            throw err
        }
        let newFiles = []
        files.forEach((item, index) => {
            if (item !== '.svn' && item !== '.DS_Store') {
                newFiles.push(decodeURIComponent(item))
            }
        })
        res.json({ code: 0, error: 'success', data: newFiles })
    })
}

// 添加一条 mock 数据
exports.addMock = (req, res, next) => {
    let params = req.body
    let url = params.url
    let content = params.content
    if (!url || !content) {
        res.json({
            code: 1,
            message: '缺少必要入参'
        });
        return
    }
    if (!util.isJSON(content)) {
        res.json({
            code: 1,
            message: '请提交标准的JSON格式'
        });
        return
    }
    fs.writeFile(dataDir + encodeURIComponent(url), content, function(err) {
        if (err) throw err;
        res.json({
            code: 0,
            message: 'success'
        });
    });
}

// 请求一条 mock 数据
exports.getMock = (req, res, next) => {
    let fileName = req.query.url
    let filePath = dataDir + encodeURIComponent(fileName)
    fs.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, 'utf8', function(err, data) {
                if (err) throw err
                res.json({ code: 0, message: 'success', data: JSON.parse(data) })
            })
        } else {
            res.status(404).json({ code: 1, error: '没有该条mock数据' });
        }
    })
}

// api mock 数据
exports.apiMock = (req, res, next) => {
    let fileName = req.url.substr(5).split('?')[0]
    let filePath = dataDir + encodeURIComponent(fileName)
    fs.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, 'utf8', function(err, data) {
                if (err) throw err
                res.json(JSON.parse(data))
            });
        } else {
            res.status(404).json({ code: 1, error: '没有该条mock数据' });
        }
    })
}

// 删除一条 mock 数据
exports.deleteMock = (req, res, next) => {
    let fileName = req.body.url
    let filePath = dataDir + encodeURIComponent(fileName)
    fs.exists(filePath, function(exists) {
        if (exists) {
            fs.unlink(filePath, function(err) {
                if (err) throw err;
                res.json({ code: 0, message: 'success' });
            });
        } else {
            res.status(404).json({ code: 1, message: '没有该条mock数据' });
        }
    })
}

// 请求项目列表
exports.getProjectList = (req, res, next) => {
    fs.readdir(dataDir, function(err, files) {
        if (err) {
            res.json({ code: 1, error: '查询项目列表异常' })
            throw err
        }
        let data = []
        files.forEach((item, index) => {
            if (fs.statSync(dataDir + item).isDirectory()) {
                data.push(decodeURIComponent(item))
            }
        })
        res.json({ code: 0, error: 'success', data: data })
    })
}

// 添加一个项目
exports.addProject = (req, res, next) => {
    let name = req.body.name
    let path = dataDir + encodeURIComponent(name)
    fs.exists(path, function(exists) {
        if (!exists) {
            fs.mkdir(path, '0777', function(err) {
                if (err) throw err
                res.json({ code: 0, message: 'success' });
            })
        } else {
            res.json({ code: 1, message: '该项目名已经被占用' });
        }
    })
}
