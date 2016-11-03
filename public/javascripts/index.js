var vm = new Vue({
    el: '#app',
    data: {
        projectList: [],
        currentProject: '',
        newProjectName: '',
        url: '',
        content: '',
        mockList: [1,2]
    },
    created: function () {
        this.currentProject = location.hash.length > 0 ? location.hash.substr(1) : ''
        this.getProjectList()
        this.getMockList()
    },
    methods: {
        getProjectList: function () {
            $.get('/getProjectList', {}, function(result) {
                if (result.code === 0) {
                    vm.projectList = result.data
                } else {
                    layer.msg(result.message, {icon: 2});
                }
            })
        },
        addProject: function () {
            var data = { name: this.newProjectName }
            $.post('/addProject', data, function(result) {
                if (result.code === 0) {
                    layer.msg('添加项目成功', {icon: 1});
                    vm.getProjectList()
                    vm.newProjectName = ''
                } else {
                    layer.msg(result.message, {icon: 2});
                }
            })
        },
        selectProject: function (item) {
            this.currentProject = item
            location.hash = item
        },
        getMockList: function () {
            let data = { project: this.currentProject }
            $.get('/getMockList', data, function(result) {
                if (result.code === 0) {
                    vm.mockList = result.data
                } else {
                    layer.msg(result.message, {icon: 2});
                }
            })
        },
        clear: function () {
            vm.url = ''
            vm.content = ''
        },
        modifyMock: function (url) {
            var data = { url: url, project: this.currentProject }
            $.get('/getMock', data, function(result) {
                if (result.code === 0) {
                    vm.url = url
                    vm.content = JSON.stringify(result.data, null, '\t')
                } else {
                    layer.msg(result.message, {icon: 2});
                }
            })
        },
        deleteMock: function (url) {
            var data = { url: url, project: this.currentProject }
            $.post('/deleteMock', data, function(result) {
                if (result.code === 0) {
                    vm.getMockList()
                    layer.msg('删除成功', {icon: 1});
                } else {
                    layer.msg(result.message, {icon: 2});
                }
            })
        },
        writeContent: function (event) {
            if (event.key === 'Tab') {
                event.preventDefault()
                var $this = $('#addContent')
                var _this = $this[0]
                var start = _this.selectionStart;
                var end = _this.selectionEnd;
                var value = $this.val();
                $this.val(value.substring(0, start) + "\t" + value.substring(end));
                _this.selectionStart = _this.selectionEnd = start + 1;
            }
        },
        submitMock: function () {
            var data = {
                project: this.currentProject,
                url: this.url,
                content: this.content
            }
            $.post('/addMock', data, function(result) {
                if (result.code === 0) {
                    vm.getMockList()
                    layer.msg('提交成功', {icon: 1});
                } else {
                    layer.msg(result.message, {icon: 2});
                }
            })
        }
    }
})