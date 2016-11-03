let fs = require('fs')
let util = require('../common/util')
let dataDir = __dirname + '/../data/'

// 列表页
exports.listPage = (req, res, next) => {
    res.render('index')
}

// 获取 mock列表 数据
exports.getMockList = (req, res, next) => {
    let project = req.query.project
    fs.readdir(dataDir + encodeURIComponent(project), function(err, files) {
        if (err) {
            res.json({ code: 1, error: '查询数据异常' })
            throw err
        }
        files.forEach((item, index) => {
            files[index] = decodeURIComponent(item)
        })
        res.json({ code: 0, error: 'success', data: files })
    })
}

// 添加一条 mock 数据
exports.addMock = (req, res, next) => {
    let params = req.body
    let url = params.url
    let content = params.content
    let project = params.project
    if (!url || !content || !project) {
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
    fs.writeFile(dataDir + encodeURIComponent(project) + '/' + encodeURIComponent(url), content, function(err) {
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
    let project = req.query.project
    let filePath = dataDir + encodeURIComponent(project) + '/' + encodeURIComponent(fileName)
    fs.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, 'utf8', function(err, data) {
                if (err) throw err
                res.json({ code: 0, message: 'success', data: JSON.parse(data) })
            })
        } else {
            res.json({ code: 1, error: '没有该条mock数据' });
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
            res.json({ code: 1, error: '没有该条mock数据' });
        }
    })
}

// 删除一条 mock 数据
exports.deleteMock = (req, res, next) => {
    let fileName = req.body.url
    let project = req.body.project
    let filePath = dataDir + encodeURIComponent(project) + '/' + encodeURIComponent(fileName)
    fs.exists(filePath, function(exists) {
        if (exists) {
            fs.unlink(filePath, function(err) {
                if (err) throw err;
                res.json({ code: 0, message: 'success' });
            });
        } else {
            res.json({ code: 1, message: '没有该条mock数据' });
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
            fs.mkdir(path, 0777, function(err) {
                if (err) throw err
                res.json({ code: 0, message: 'success' });
            })
        } else {
            res.json({ code: 1, message: '该项目名已经被占用' });
        }
    })
}
