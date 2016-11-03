let express = require('express')
let router = express.Router()
let controllers = require('../controllers')

/* 页面 */
router.get('/', controllers.listPage)

// 请求 mock列表 数据
router.get('/getMockList', controllers.getMockList)
// 添加 mock 数据
router.post('/addMock', controllers.addMock)
// 请求 mock 数据
router.get('/getMock', controllers.getMock)
// 删除 mock 数据
router.post('/deleteMock', controllers.deleteMock)

// api mock 数据
router.get(/^\/api\//, controllers.apiMock)
router.post(/^\/api\//, controllers.apiMock)


// 请求项目列表
router.get('/getProjectList', controllers.getProjectList)
// 添加一个项目
router.post('/addProject', controllers.addProject)

module.exports = router
