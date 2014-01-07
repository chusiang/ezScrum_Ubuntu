Ext.ns('ezScrum');

/*
 * Show Mask
 */

function showMask(targetId, msg) {
    new Ext.LoadMask(Ext.get(targetId), {
        msg: msg
    }).show();
}

/*
 * hide Mask
 */

function hideMask(targetId) {
    new Ext.LoadMask(Ext.get(targetId)).hide();
} /* 儲存 Sprint 資料 */
var sprintComboStore = new Ext.data.Store({
    id: 0,
    fields: [{
        name: 'Id',
        type: 'int'
    },
    {
        name: 'Name'
    },
    {
        name: 'Start'
    },
    {
        name: 'Goal'
    }],
    reader: sprintForComboReader
});

/*
 * 提供給Release List的欄位內容
 */
var releaseColumns = [{
    header: 'ID',
    dataIndex: 'ID',
    width: 150,
    align: 'center'
},
{
    header: 'Name',
    dataIndex: 'Name',
    width: 250,
    align: 'left'
},
{
    header: 'Start Date',
    width: 150,
    dataIndex: 'StartDate',
    align: 'center'
},
{
    header: 'End Date',
    width: 150,
    dataIndex: 'EndDate',
    align: 'center'
},
{
    header: 'Description',
    width: 250,
    dataIndex: 'Description',
    align: 'center'
}];

/*
 * {name : 'Id', type:'int'}, {name : 'Link'}, {name : 'Name'}, {name :
 * 'Importance', type:'int'}, {name : 'Estimation', type:'float'}, {name :
 * 'Status'}, {name : 'Release'}, {name : 'Sprint'}, {name : 'Notes'}, {name :
 * 'HowToDemo'}, {name : 'Tag'}
 */
var createStoryCloumns = function () {
    var columns = [{
        dataIndex: 'Id',
        renderer: function (value, metaData, record, rowIndex, colIndex, store) {
            return "<a href=\"" + record.data['Link'] + "\" target=\"_blank\">" + value + "</a>";
        },
        header: 'ID',
        width: 50
    },
    {
        dataIndex: 'Name',
        header: 'Story Name',
        width: 400
    }, {
        dataIndex: 'Value',
        header: 'Value',
        width: 90
    },
    {
        dataIndex: 'Estimation',
        header: 'Estimation',
        width: 90
    },
    {
        dataIndex: 'Importance',
        header: 'Importance',
        width: 90
    },
    {
        dataIndex: 'Status',
        header: 'Status',
        width: 90
    },
    {
        // hidden : true,
        dataIndex: 'Release',
        header: 'Release Id',
        width: 90
    },
    {
        dataIndex: 'Sprint',
        header: 'Sprint Id',
        width: 90
    },
    {
        dataIndex: 'Tag',
        header: 'Tag',
        width: 90
    }];

    return new Ext.grid.ColumnModel({
        columns: columns,
        defaults: {
            sortable: true
        }
    });
};

/*-----------------------------------------------------------
 *   Story的儲存結構
 -------------------------------------------------------------*/
var storyStore = new Ext.data.Store({
    autoDestroy: true,
    fields: [{
        name: 'Id',
        type: 'int'
    },
    {
        name: 'Link'
    },
    {
        name: 'Name'
    },{
        name: 'Value',
        type: 'int'
    },
    {
        name: 'Importance',
        type: 'int'
    },
    {
        name: 'Estimation',
        type: 'float'
    },
    {
        name: 'Status'
    },
    {
        name: 'Release'
    },
    {
        name: 'Sprint'
    },
    {
        name: 'Notes'
    },
    {
        name: 'HowToDemo'
    },
    {
        name: 'Tag'
    }],
    reader: myReader
});

// 負責以Form的方式顯示Sprint的詳細資料
var ReleaseWidget = new ezScrum.AddNewReleaseWidget();
// Delete的widget
var deleteWidget = new ezScrum.DeleteReleaseWidget();
// Drop Story Widget
var dropStoryWidget = new ezScrum.DropStoryWidget({
    listeners: {
        DropSuccess: function (win, response, issueId) {
            // Drop Story Success
            // tree.loader.load(tree.getRootNode());
	        var record = storyStore.getById(issueId);
	        storyStore.remove(record);
            this.hide();
            storyMaster.setTitle('Story List');
        },
        DropFailure: function (win, response, issueId) {
            // Drop Story Error
        }
    }
});
var dropStoryFromReleaseWidget = new ezScrum.DropStoryFromReleaseWidget({
    listeners: {
        DropStorySuccess: function (win, response, issueId) {
            // Drop Story Success
            // tree.loader.load(tree.getRootNode());
            this.hide();
            var del = storyStore.getById(issueId);
            storyStore.remove(del);
            storyMaster.setTitle('Story List');
        },
        DropStoryFailure: function (win, response, issueId) {
            // Drop Story Error
        }
    }
});

/*
var dropSprintWidget = new ezScrum.DropSprintFromReleaseWidget({
    listeners: {
        DropSprintSuccess: function (win, response, sprintId) {
            // Drop Sprint Success
            // reload
            tree.loader.load(tree.getRootNode());
            this.hide();
            storyStore.removeAll();
            storyMaster.setTitle('Story List');
        },
        DropSprintFailure: function (win, response, sprintId) {
            // Drop Sprint Error
        }
    }
});
*/

ezScrum.Storypannel = Ext.extend(Ext.grid.GridPanel, {
    title: 'Story List',
    store: storyStore,
    height: 200,
    colModel: createStoryCloumns()
});

ezScrum.Treepannel = Ext.extend(Ext.ux.tree.TreeGrid, {
    id: 'TreePannel',
    initComponent: function () {
        // this.collapseAll();
        // 當有修改或新增Release的時候就需要更新
        var treeObj = this;
        ReleaseWidget.on('Success', function (obj, response, values) {
            // reload
            treeObj.loader.load(treeObj.getRootNode());
            storyStore.removeAll();
            storyMaster.setTitle('Story List');
            // hideMask('mainMaster');
        });
        ReleaseWidget.on('Failure', function (obj, response, values) {

        });
        // 有刪除Release的時候就需要更新
        deleteWidget.on('DeleteSuccess', function (obj, response) {
            // reload
            treeObj.loader.load(treeObj.getRootNode());
            storyStore.removeAll();
            storyMaster.setTitle('Story List');
            hideMask('mainMaster');
        });

        ezScrum.Treepannel.superclass.initComponent.apply(this, arguments);
    }
});

var tree = new ezScrum.Treepannel({
    title: 'Release & Sprint List',
    frame: true,
    region: 'center',
    margins: '5 0 0 2',
    enableSort: false,
    enableHdMenu: false,
    columns: releaseColumns,
    dataUrl: 'showReleasePlan2.do',
    singleExpand: true
    // new Ext.ux.tree.TreeGridLoader(),
});

// tree.collapse(true);
var storyMaster = new ezScrum.Storypannel({
    collapsible: true,
    split: true,
    region: 'south',
    margins: '5 2 0 0',
    height: 200,
    sm: new Ext.grid.RowSelectionModel({
        singleSelect: true
    }),
    loadData: function (selectedNode) {
		
		/*-----------------------------------------------------------
		*	如果什麼東西都沒有選擇的話，那麼就把所有的Button功能給關掉
		-------------------------------------------------------------*/
        if (selectedNode == null) {
            Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('EditReleaseBtn').disable();
            Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('DeReleaseBtn').disable();
            Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('DropStoryBtn').disable();
            Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('MoveStoryBtn').disable();
            Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('addExStoryBtn').disable();
            Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('showReleaseBacklogBtn').disable();
            Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('showPritableBtn').disable();
            Ext.getCmp('mainMaster').getTopToolbar().get('sprintAction').get('editSprintBtn').disable();
            Ext.getCmp('mainMaster').getTopToolbar().get('sprintAction').get('addSprintBtn').enable();
        } else {
        	
    	/*-----------------------------------------------------------
    	*	如果有選擇Release或者是Sprint的情況下
    	-------------------------------------------------------------*/
            var type = selectedNode.attributes['Type'];
            var id = selectedNode.attributes['ID'];
            if (type == "Release") {
                if (RPEditRelease) Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('EditReleaseBtn').enable();
                if (RPDeleteRelease) Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('DeReleaseBtn').enable();
                if (RPAddStory) Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('addExStoryBtn').enable();
                if (RPShowReleaseBacklog) Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('showReleaseBacklogBtn').enable();
                if (RPShowPrintableRelease) Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('showPritableBtn').enable();

                Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('DropStoryBtn').disable();
                Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('MoveStoryBtn').disable();
                Ext.getCmp('mainMaster').getTopToolbar().get('sprintAction').get('editSprintBtn').disable();
                showMask('mainMaster', "Loading...");
                Ext.Ajax.request({
                    url: 'AjaxShowStoryfromRelease.do?Rid=' + id,
                    success: function (response) {
                    	// check action permission
                        ConfirmWidget.loadData(response);
                        if (ConfirmWidget.confirmAction()) {
	                        // 計算此Sprint的Story Point
	                        storyStore.loadData(response.responseXML);
	
	                        var point = 0;
	                        storyStore.each(function (rec) {
	                            point += (rec.get('Estimation') - 0);
	                        });
	                        var goal = selectedNode.attributes['Name'];
	                        // 改變Story List的title顯示Sprint的名稱與ID
	                        storyMaster.setTitle('Release' + id + ': ' + goal + '\t\t[Story Point:' + point + ']');
                        }
                        hideMask('mainMaster');
                    }
                });
            } else {
                Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('addExStoryBtn').disable();
                Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('EditReleaseBtn').disable();
                Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('DeReleaseBtn').disable();
                Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('DropStoryBtn').disable();
                Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('MoveStoryBtn').disable();
                Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('showReleaseBacklogBtn').disable();
                Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('showPritableBtn').disable();
                Ext.getCmp('mainMaster').getTopToolbar().get('sprintAction').get('editSprintBtn').enable();             
                showMask('mainMaster', "Loading...");
                Ext.Ajax.request({
                    url: 'AjaxShowStoryfromSprint.do?Sid=' + id,
                    success: function (response) {
                    	// check action permission
                        ConfirmWidget.loadData(response);
                        if (ConfirmWidget.confirmAction()) {
	                        // 計算此Sprint的Story Point
	                        storyStore.loadData(response.responseXML);
	
	                        var point = 0;
	                        storyStore.each(function (rec) {
	                            point += (rec.get('Estimation') - 0);
	                        });
	                        var goal = selectedNode.attributes['Name'];
	                        // 改變Story List的title顯示Sprint的名稱與ID
	                        storyMaster.setTitle('Sprint' + id + ': ' + goal + '\t\t[Story Point:' + point + ']');
                        }
                        hideMask('mainMaster');
                    }
                });
            }
        }

    }
});

tree.getSelectionModel().on({
    'selectionchange': {
        buffer: 25,
        fn: function () {
            var selectedNode = tree.getSelectionModel().getSelectedNode();
            storyMaster.loadData(selectedNode);
        }
    }
});

storyMaster.getSelectionModel().on({
    selectionchange: {
        buffer: 10,
        fn: function (sm) {
            var sel = null;
            sel = sm.getSelections();
            if (RPDropStory) {
                if (sel[0] == null || storyMaster.getSelectionModel().getSelected().data["Status"] == "closed") 
                {
                	Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('DropStoryBtn').disable();
                	Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('MoveStoryBtn').disable();
                }
                else 
                {
                	Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('DropStoryBtn').enable();
                	Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('MoveStoryBtn').enable();
                }
            } else {
                Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('DropStoryBtn').disable();
                Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('MoveStoryBtn').disable();
            }
            //檢查story是否有附屬在某個sprint下，如果沒有就是直接附屬在release下的story就要檢查該release是否已經結束，如果已經結束則不能對story做任何操作
            if( sel[0] != null && storyMaster.getSelectionModel().getSelected().data["Sprint"] == "None")
            {
            	var today = new Date();
            	var releaseEndDate = Date.parseDate(tree.getSelectionModel().getSelectedNode().attributes["EndDate"] , 'Y/m/d');
            	if( releaseEndDate >= today ) {
            		Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('DropStoryBtn').enable();
                	Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('MoveStoryBtn').enable();
            	}else{
            		Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('DropStoryBtn').disable();
                	Ext.getCmp('mainMaster').getTopToolbar().get('storyAction').get('MoveStoryBtn').disable();
            	}
            }
        }
    }
});

// Edit Sprint Widget
var detailWin = new ezScrum.ShowSprintDetailWin({
	listeners:{
		Success:function(obj, response, values) {
		
			this.hide();
			Ext.example.msg('Edit Sprint', 'Edit Sprint Success.');
			
			// Update Release Plan Widget
			var treeObj = Ext.getCmp('TreePannel');
			treeObj.loader.load(treeObj.getRootNode());
		},
		Failure:function(obj, response, values) {
		
			this.hide();
			alert('Edit Sprint Failure.');
		}
	}
});

/*
 * Access Release Plan permission
 */
var RPAddRelease = "false";
var RPEditRelease = "false";
var RPDeleteRelease = "false";
var RPDropSprint = "false";
var RPDropStory = "false";
var RPAddStory = "false";
var RPAddSprint = "false";
var RPShowReleaseBacklog = "false";
var RPShowPrintableRelease = "false";

/*
 * 當網頁讀取完畢之後，開始進行初始化的動作
 */
Ext.onReady(function () {
    Ext.QuickTips.init();

    /* 建立 Move Story Widget */
    var moveStoryWidget = new ezScrum.MoveStoreWidget({
        listeners: {
            MoveSuccess: function (issueId) {
                // Move Story Success
                var record = storyMaster.getStore().getById(issueId);
               
                this.hide();

	           //變更目前 Sprint 的點數
                var point = 0;
                storyStore.each(function (rec) {
                    point += (rec.get('Estimation') - 0);
                });
                
                var selectedNode = tree.getSelectionModel().getSelectedNode();
                var goal = selectedNode.attributes['Name'];
                var id = selectedNode.attributes['ID'];
                var type = selectedNode.attributes['Type'];
                
                /*-----------------------------------------------------------
                *	依照Release或Sprint改變顯示的Story List的Title
                -------------------------------------------------------------*/
                if(type == "Release")
                {
                	Ext.Ajax.request({
                        url: 'AjaxShowStoryfromRelease.do?Rid=' + id,
                        success: function (response) {
                        	// check action permission
                            ConfirmWidget.loadData(response);
                            if (ConfirmWidget.confirmAction()) {
	                            // 計算此Sprint的Story Point
	                            storyStore.loadData(response.responseXML);
	
	                            var point = 0;
	                            storyStore.each(function (rec) {
	                                point += (rec.get('Estimation') - 0);
	                            });
	                            var goal = selectedNode.attributes['Name'];
	                            // 改變Story List的title顯示Sprint的名稱與ID
	                            storyMaster.setTitle('Release' + id + ': ' + goal + '\t\t[Story Point:' + point + ']');
                            }
                            hideMask('mainMaster');
                        }
                    });
                }
                else
                {
                	 // 改變Story List的title顯示Sprint的名稱與ID
                    storyMaster.setTitle('Sprint' + id + ': ' + goal + '\t\t[Story Point:' + point + ']');
                    storyMaster.getStore().remove(record);
                }
                hideMask('mainMaster');
                
            },
            MoveFailure: function (issueId) {
            	this.hide();
                //Ext.example.msg('Move Story', 'Move Story Failure.');
            }
        }
    });
    
    var mainMaster = new Ext.Panel({
        id: 'mainMaster',
        height: 600,
        layout: 'border',
        tbar: [{
            id: 'releaseAction',
            xtype: 'buttongroup',
            columns: 3,
            title: '<u><b>Release Action</b></u>',
            items: [{
                id: 'addReleaseBtn',
                disabled: true,
                text: 'New Release Plan',
                icon: 'images/add3.png',
                handler: function () {
                    ReleaseWidget.resetForm();
                    ReleaseWidget.loadIDForNewRelease();
                    ReleaseWidget.showWidget('Create Release');
                }
            },
            {
                id: 'EditReleaseBtn',
                disabled: true,
                text: 'Edit Release Plan',
                icon: 'images/edit.png',
                handler: function () {
                    var selectedNode = tree.getSelectionModel().getSelectedNode();
                    ReleaseWidget.resetForm();
                    ReleaseWidget.loadData(selectedNode);
                    ReleaseWidget.showWidget('Edit Release');
                }
            },
            {
                id: 'DeReleaseBtn',
                disabled: true,
                text: 'Delete Release Plan',
                icon: 'images/delete.png',
                handler: function () {
                    var selectedNode = tree.getSelectionModel().getSelectedNode();
                    deleteWidget.deleteRelease(selectedNode);
                }
            },
            {
                id: 'showReleaseBacklogBtn',
                disabled: true,
                text: 'Show Release Backlog',
                icon: 'images/clipboard.png',
                handler: function () {
                    var selectedNode = tree.getSelectionModel().getSelectedNode();
                    var releaseID = selectedNode.attributes['ID'];
                    document.location.href = "showReleaseBacklog.do?releaseID=" + releaseID;
                }
            },
            {
	            id: 'showPritableBtn',
	            disabled: true,
	            text: 'Show Printable Release',
	            icon: 'images/text.png',
		            handler: function () {
		                var selectedNode = tree.getSelectionModel().getSelectedNode();
		                var releaseID = selectedNode.attributes['ID'];
		                window.open("showPrintReleaseInformation.do?showtask=true&releaseID=" + releaseID);
		            }
	        }]
        },
        {
            id: 'sprintAction',
            xtype: 'buttongroup',
            columns: 1,
            title: '<u><b>Sprint Action</b></u>',
            items: [
			{
                id: 'addSprintBtn',             
                text: 'New Sprint',
                icon: 'images/add3.png',
                handler: function () {
                	
                	Ext.Ajax.request({
                        url : 'showAllSprintForSprintPlan.do',
                        success : function(response) {
                        	// check action permission
                            ConfirmWidget.loadData(response);
                            if (ConfirmWidget.confirmAction()) {
	                            sprintStore.loadData(response.responseXML);
	                            sprintStore.sort('Id','DESC');
	                            var lastData = sprintStore.getAt(0);
	                            detailWin.resetForm();
			                    detailWin.loadDataForNewSprint(lastData);
			                    detailWin.showWidget('Create Sprint');
			                    detailWin.setIsCreate(true);
                            }
                        }
                    });
                }
            },
            {
                id: 'editSprintBtn',
                disabled: true,
                text: 'Edit Sprint',
                icon: 'images/edit.png',
                handler: function () {
                	// Get Selected Sprint Data
                    var selectedNode = tree.getSelectionModel().getSelectedNode();
                    var sprintID = selectedNode.attributes['ID'];
					
					detailWin.autoLoadData(sprintID);
					detailWin.showWidget('Edit Sprint');
					detailWin.setIsCreate(false);
                }
            }]
        },
        {
            id: 'storyAction',
            xtype: 'buttongroup',
            columns: 2,
            title: '<u><b>Story Action</b></u>',
            items: [{
                id: 'addExStoryBtn',
                disabled: true,
                text: 'Add Existed Story',
                icon: 'images/add.gif',
                handler: function () {
                    var selectedNode = tree.getSelectionModel().getSelectedNode();
                    var id = selectedNode.attributes['ID'];
                    var type = selectedNode.attributes['Type'];
                    if(type == "Release")
                    {
                    	document.location.href = "showExistedStory.do?releaseID=" + id;
                    }
                }
            },
            {
                id: 'MoveStoryBtn',
                disabled: true,
                text: 'Move Story',
                icon: 'images/arrow_right.png',
                handler: function () {
                    var selectedNode = storyMaster.getSelectionModel().getSelected();
                    //取出Story的Issue ID 與 Sprint ID
                    var issueID = selectedNode.get('Id');
                    var sprintID = selectedNode.get('Sprint');
                    var releaseID = selectedNode.get('Release');
                    moveStoryWidget.moveStory(
                    issueID , sprintID , releaseID);
                }
            },
            {
                id: 'DropStoryBtn',
                disabled: true,
                text: 'Drop Story',
                icon: 'images/drop2.png',
                handler: function () {
                    var selectedNode = tree.getSelectionModel().getSelectedNode();
                    var type = selectedNode.attributes['Type'];
                    var type_id = selectedNode.attributes['ID'];
                    var sel = storyMaster.getSelectionModel().getSelected();
                    if (type == "Release") {
                        dropStoryFromReleaseWidget.dropStory(
                        sel.id, type_id);
                    } else {
                        dropStoryWidget.dropStory(
                        sel.id, type_id);
                    }
                }
            }]
        }],
        items: [tree, storyMaster],
        loadPermission: function () {
            if (RPAddRelease) Ext.getCmp('mainMaster').getTopToolbar().get('releaseAction').get('addReleaseBtn').enable();
        }
    });
    mainMaster.render('Release-Plan');

    // 設定permission的值
    Ext.Ajax.request({
        url: 'AjaxGetRPPermission.do',
        success: function (response) {
            var RPPermission = RPPermissionReader.readRecords(response.responseXML);
            var permissionCount = RPPermission.totalRecords;
            for (var i = 0; i < permissionCount; i++) {
                var permissionRecord = RPPermission.records[i];
                RPAddRelease = permissionRecord.data['AddRelease'];
                RPEditRelease = permissionRecord.data['EditRelease'];
                RPDeleteRelease = permissionRecord.data['DeleteRelease'];
                RPDropSprint = permissionRecord.data['DropSprint'];
                RPDropStory = permissionRecord.data['DropStory'];
                RPAddStory = permissionRecord.data['AddStory'];
                RPAddSprint = permissionRecord.data['AddSprint'];
                RPShowReleaseBacklog = permissionRecord.data['ShowReleaseBacklog'];
                RPShowPrintableRelease = permissionRecord.data['ShowPrintableRelease'];
                mainMaster.loadPermission();
            }

        }
    }); /* 取得 Sprint 資料 */
    Ext.Ajax.request({
        url: 'getAddNewRetrospectiveInfo.do',
        success: function (response) {
            sprintComboStore.loadData(response.responseXML);
        }
    });
});