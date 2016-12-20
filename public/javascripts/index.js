var vm = new Vue({
    el: '#app',
    data: {
        url: '',
        content: '',
        mockList: [],
        totalPage: 0
    },
    created: function () {
        this.getMockList()
    },
    methods: {
        getMockList: function () {
            $.get('/getMockList', {}, function(result) {
                if (result.code === 0) {
                    vm.mockList = result.data
                    vm.totalPage = result.data.length
                } else {
                    layer.msg(result.message, {icon: 2});
                }
            })
        },
        clear: function () {
            vm.url = ''
            vm.content = '{"responseCode": "000000", "responseMsg": "成功"}'
        },
        modifyMock: function (url) {
            var data = { url: url }
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
            var data = { url: url }
            layer.confirm('确认是否需要删除？', {icon: 3, title:'提示'}, function(index){
                $.post('/deleteMock', data, function(result) {
                    if (result.code === 0) {
                        vm.getMockList()
                        layer.msg('删除成功', {icon: 1});
                    } else {
                        layer.msg(result.message, {icon: 2});
                    }
                })
                layer.close(index);
            });
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