app.controller('coverCheckCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', 'ngDialog', 'utils', 'SweetAlert', 'api', 'loadDataService', function($scope, $rootScope, $state, $stateParams, $localStorage, ngDialog, utils, SweetAlert, api, loadDataService) {
    $rootScope.app.coverCheck = {};
    // $scope.menus = {
    //     // id: "bookremark-menu",
    //     title: "封面审核",
    //     list: [{
    //         name: "待处理",
    //         sref: "app.coverCheck.list({uiStatus: ''})",
    //         api: "/Backstage/contentAudit/book?result=2",
    //         status: "",
    //         default: true,
    //         active: 'active'
    //     },{
    //         name: "已通过",
    //         sref: "app.coverCheck.list({uiStatus: 'pass'})",
    //         api: "/Backstage/contentAudit/book?result=0",
    //         status: "pass"
    //     }]
    // };
    $rootScope.app.coverCheck.batch = 'checkCover-pass';
}]);
//北极圈
app.controller('coverCheckListCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', 'ngDialog', 'utils', 'SweetAlert', 'api', 'loadDataService', function($scope, $rootScope, $state, $stateParams, $localStorage, ngDialog, utils, SweetAlert, api, loadDataService) {
    $scope.pages = {
        title: "",
        tabs:  {
            state: 'app.coverCheck.list',
            list: [{
                name: "待处理",
                sref: "app.coverCheck.list({uiStatus: ''})",
                api: "/Backstage/contentAudit/book?result=2",
                status: "",
                default: true,
                active: 'active'
                // method: "post"
            },{
                name: "已通过",
                sref: "app.coverCheck.list({uiStatus: 'pass'})",
                api: "/Backstage/contentAudit/book?result=0",
                status: "pass"
            }],

            querys: [{
                value: 'bid',
                key: "书籍ID"
            },{
                value: 'name',
                key: "书籍名称"
            }],
            batch: $rootScope.app.coverCheck.batch
        }
    };
    var parmas = {
        data: $scope.pages,
        status: $stateParams.uiStatus
    };

    loadDataService.api = utils.setApi(parmas);
    $scope.url ={};
    $scope.url = loadDataService.api;
    // angular.forEach($scope.pages.tabs.list, function(list, index){
    //     for(var i in loadDataService.api){
    //         if(loadDataService.api[i]==$scope.pages.tabs.list[0].api){
    //             $scope.url.audit ='0';
    //         }
    //     }
    // })
    $scope.passItem = function(item,list){
        var bid = utils.filterData('bid', item);
        $scope.item = item;
        $scope.list = list;
        var config = {};
        SweetAlert.swal({
            title: "确认通过这个封面的审核",
            text: "",
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#27c24c",
            confirmButtonText: "通过",
            cancelButtonText: "取消",
            closeOnConfirm: false,
        }, function(isConfirm) {
            if (isConfirm) {
                config.url = '/Backstage/contentAudit';
                config.params = {
                    bid: item.bid,
                    type:'1',
                    result:'0',
                    admin: $scope.admin,
                    id: $scope.item.id

                };
                api.ajaxPost(config).then(function(result) {
                    var resp = result.data;
                    if (resp.success) {
                        utils.batchDelete(item, list);
                        SweetAlert.close();
                    };
                });
            }
        });
    };
    // $scope.deleteItem = function (item, list) {
    //     var bid = utils.filterData('bid', item);
    //     var blkid = utils.filterData('blkid', item);
    //
    // };

    $scope.bulkItem = function(item, list,black,admin) {
        var config={};
        $scope.audit = $stateParams.audit || '';
        $rootScope.item = item;
        $rootScope.list = list;
        $rootScope.admin = admin;
        console.log(admin);
        var id = utils.filterData('id', item);
        console.log(id);
        config = {},
            temp = {};
        if(black ==='0'){
            temp.title = '审核通过',
                temp.text = '确定将这些书籍封面改为通过吗？？',
                temp.color = '#27c24c'
        }else if(black === '1'){
            // temp.title = '审核不通过',
            temp.title = '确定删除这几项吗？',
                temp.color = '#f05050'
        }
        SweetAlert.swal({
            title: temp.title,
            text: temp.text,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: temp.color,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false,
        }, function(isConfirm) {
            if (isConfirm) {
                config.url = '/Backstage/contentAudit';
                config.params = {
                    id: id,
                    audit: black,
                    type:'1',
                    result:'0',
                    admin: $scope.admin
                }
                api.ajaxPost(config).then(function(result) {
                    var resp = result.data;
                    if (resp.success) {
                        utils.batchDelete(item, list);
                        SweetAlert.close();
                    }
                });
            }
        });
    }
    $scope.deleteItem = function(item,list,admin) {
        $rootScope.app.coverCheck.item = item;
        $rootScope.app.coverCheck.list = list;
        $rootScope.app.coverCheck.admin = admin;
        console.log(admin);
        var dialog = ngDialog.open({
            template: '/web/src/tpl/checkImg/coverCheck.list.dialog.html',
            className: 'ngdialog-theme-default ngdialog-lg',
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            controller: 'deleteImageCtrl',
            controllerAs: 'coverCheckListCtrl',
        });
    }
}]);

app.controller('deleteImageCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', 'ngDialog','utils','SweetAlert', 'api', 'loadDataService',  function($scope, $rootScope, $state, $stateParams, $localStorage, ngDialog, utils, SweetAlert, api, loadDataService) {
    $scope.item = $rootScope.app.coverCheck.item;
    $scope.list = $rootScope.app.coverCheck.list;
    $scope.admin = $rootScope.app.coverCheck.admin;
    $scope.ok = function(item,admin){
        console.log(item);
        console.log($scope.admin);
        var config = {};
        config.url = '/Backstage/contentAudit';
        config.params = {
            admin: $scope.admin,
            id: $scope.item.id,
            type: '0'
        }
        api.ajaxPost(config).then(function(result) {
            var resp = result.data;
            if (resp.success) {
                utils.batchDelete( $scope.item,$scope.list);
                ngDialog.close();
            }
        });
    }
    $scope.cancel = function () {
        ngDialog.close();
        // angular.copy($scope.duplicate, $scope.item);
        // $scope.duplicate = null;
    }
}]);