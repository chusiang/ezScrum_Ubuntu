// 負責以Form的方式顯示 Sprint 的詳細資料
var ModifyReleasePlanWindow = new ezScrum.AddNewReleaseWidget({
	listeners: {
		Success: function(obj, response, values) {
			// reload tree data
			Ext.getCmp('ReleasePlan_ReleaseTree').reloadTreeData();
			
			// reset Story List
			Ext.getCmp('ReleasePlan_StoryGrid').resetData();
		}
	}
});

// Delete 的 widget
var DeleteReleasePlanWindow = new ezScrum.DeleteReleaseWidget({
	listeners: {
		DeleteSuccess: function (obj, response) {
			// reload tree data
			Ext.getCmp('ReleasePlan_ReleaseTree').reloadTreeData();
			
			// reset Story List
			Ext.getCmp('ReleasePlan_StoryGrid').resetData();
		}
	}
});

// Drop Story Widget
var ReleasePlan_DropStoryWindow = new ezScrum.DropStoryWidget({
	id	: 'ReleasePlan_DropStory',
	listeners : {
		DropSuccess : function(win, response, issueId) {
			var record = releaseStoryStore.getById(issueId);
			releaseStoryStore.remove(record);
			
			this.hide();
		}
	}
});

var dropStoryFromReleaseWidget = new ezScrum.DropStoryFromReleaseWidget({
	listeners : {
		DropStorySuccess : function(win, response, issueId) {
			var record = releaseStoryStore.getById(issueId);
			releaseStoryStore.remove(record);
			
			this.hide();
		}
	}
});

ezScrum.ReleasePlan_MasterPanel = Ext.extend(Ext.Panel, {
	id		: 'releasePlanMasterPanel',
	layout	: 'border',
	frame	: false,
	border	: false,
	initComponent: function() {
		var config = {
			items : [{
				ref		: 'ReleasePlan_ReleaseTreePanel_ID',
				xtype	: 'ReleasePlan_ReleasePanel'
			}, {
				ref		: 'ReleasePlan_StoryPanel_ID',
				xtype	: 'Release_StoryPanel'
			}],
			tbar: [{
				id: 'releaseAction',
				xtype: 'buttongroup',
				columns: 3,
				title: '<u><b>Release Action</b></u>',
				items: [{
					id: 'ReleasePlan_addReleaseBtn',
					text: 'New Release Plan',
					icon: 'images/add3.png',
					handler: function () {
						ModifyReleasePlanWindow.resetForm();
						ModifyReleasePlanWindow.loadIDForNewRelease();
						ModifyReleasePlanWindow.showWidget('Create Release');
					}
				}, {
					id: 'ReleasePlan_EditReleaseBtn',
					disabled: true,
					text: 'Edit Release Plan',
					icon: 'images/edit.png',
					handler: function () {
						var selectedNode = Ext.getCmp('ReleasePlan_ReleaseTree').getSelectionModel().getSelectedNode();
						ModifyReleasePlanWindow.resetForm();
						var releaseID = ModifyReleasePlanWindow.loadData(selectedNode);
						ModifyReleasePlanWindow.showWidget('Edit Release #' + releaseID);
					}
				}, {
					id: 'ReleasePlan_DeReleaseBtn',
					disabled: true,
					text: 'Delete Release Plan',
					icon: 'images/delete.png',
					handler: function () {
						var selectedNode = Ext.getCmp('ReleasePlan_ReleaseTree').getSelectionModel().getSelectedNode();
						DeleteReleasePlanWindow.deleteRelease(selectedNode);		
					}
				}, {
					id: 'ReleasePlan_showReleaseBacklogBtn',
					disabled: true,
					text: 'Show Release Backlog',
					icon: 'images/clipboard.png',
					handler: function () {
						var selectedNode = Ext.getCmp('ReleasePlan_ReleaseTree').getSelectionModel().getSelectedNode();
						var releaseID = selectedNode.attributes['ID'];
						var releaseTitle = 'Release #' + releaseID + ': ' + selectedNode.attributes['Name'];
						ShowReleaseBacklog_Window.showWindow(releaseID, releaseTitle);
					}
				}, {
					id: 'ReleasePlan_showPritableBtn',
					disabled: true,
					text: 'Show Printable Release',
					icon: 'images/text.png',
					handler: function () {
						var selectedNode = Ext.getCmp('ReleasePlan_ReleaseTree').getSelectionModel().getSelectedNode();
						var releaseID = selectedNode.attributes['ID'];
						openURLWithCheckSession("showPrintReleaseInformation.do?showtask=true&releaseID=" + releaseID);
					}
				}]
			}, {
				id: 'sprintAction',
				xtype: 'buttongroup',
				columns: 1,
				title: '<u><b>Sprint Action</b></u>',
				items: [{
					id: 'ReleasePlan_addSprintBtn',            
					text: 'New Sprint',
					icon: 'images/add3.png',
					handler: function () {
						SprintPlan_Window.showTheWindow_Add(Ext.getCmp('releasePlanMasterPanel'));
					}
				}, {
					id: 'ReleasePlan_editSprintBtn',
					disabled: true,
					text: 'Edit Sprint',
					icon: 'images/edit.png',
					handler: function () {
						var record = Ext.getCmp('ReleasePlan_ReleaseTree').getSelectionModel().getSelectedNode();
						SprintPlan_Window.showTheWindow_Edit(Ext.getCmp('releasePlanMasterPanel'), record.attributes['ID']);
					}
				}]
			}, {
				id: 'storyAction',
				xtype: 'buttongroup',
				columns: 2,
				title: '<u><b>Story Action</b></u>',
				items: [{
					id: 'ReleasePlan_addExStoryBtn',
					disabled: true,
					text: 'Add Existed Story',
					icon: 'images/add.gif',
					handler: function () {
						var selectedNode = Ext.getCmp('ReleasePlan_ReleaseTree').getSelectionModel().getSelectedNode();
						var id = selectedNode.attributes['ID'];
						var type = selectedNode.attributes['Type'];
						if(type == "Release") {
							AddExistedStory_Window.showTheWindow_Release(Ext.getCmp('releasePlanMasterPanel'), id);
						}
					}
				}, {
					id: 'ReleasePlan_MoveStoryBtn',
					disabled: true,
					text: 'Move Story',
					icon: 'images/arrow_right.png',
					handler: function () {
						var selectedNode = Ext.getCmp('ReleasePlan_StoryGrid').getSelectionModel().getSelected();
						// 取出 Story 的 Issue ID 與 Sprint ID
						var issueID = selectedNode.get('Id');
						var sprintID = selectedNode.get('Sprint');
						var releaseID = selectedNode.get('Release');
						
						MoveStory_Window.showTheWindow_MoveStory(Ext.getCmp('releasePlanMasterPanel'), issueID , sprintID , releaseID);
					}
				}, {
					id: 'ReleasePlan_DropStoryBtn',
					disabled: true,
					text: 'Drop Story',
					icon: 'images/drop2.png',
					handler: function () {
						var selectedNode = Ext.getCmp('ReleasePlan_ReleaseTree').getSelectionModel().getSelectedNode();
						var type = selectedNode.attributes['Type'];
						var type_id = selectedNode.attributes['ID'];
						var sel = Ext.getCmp('ReleasePlan_StoryGrid').getSelectionModel().getSelected();
						if (type == "Release") {
							dropStoryFromReleaseWidget.dropStory(sel.id, type_id);
						} else {
							ReleasePlan_DropStoryWindow.dropStory(sel.id, type_id);
						}
					}
				}]
			}]
		}
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ezScrum.ReleasePlan_MasterPanel.superclass.initComponent.apply(this, arguments);
	},
	loadDataModel: function() {
		Ext.getCmp('ReleasePlan_ReleaseTree').reloadTreeData();
	},
	notify_CreateSprint: function(success) {
		var title = 'Add New Sprint';
		if (success) {
			SprintPlan_Window.hide();
			Ext.example.msg(title, "Success.");
			
			Ext.getCmp('ReleasePlan_ReleaseTree').reloadTreeData();
		} else {
			Ext.example.msg(title, "Sorry, please try again.");
		}
	},
	notify_EditSprint: function(success) {
		var title = 'Edit Sprint';
		if (success) {
			SprintPlan_Window.hide();
			Ext.example.msg(title, "Success.");

			Ext.getCmp('ReleasePlan_ReleaseTree').reloadTreeData();
		} else {
			Ext.example.msg(title, "Sorry, please try again.");
		}
	},
	notify_AddExistedStorySuccess: function() {
    	AddExistedStory_Window.hide();
    	Ext.example.msg("Add Existed Stories", "Success.");
    	
    	Ext.getCmp('ReleasePlan_ReleaseTree').reloadTreeData();
    },
    notify_MoveSuccess: function(response) {
    	MoveStory_Window.hide();
    	Ext.example.msg("Move Story", "Success.");
    	
    	var selectedNode = this.ReleasePlan_ReleaseTreePanel_ID.getSelectionModel().getSelectedNode();
    	this.ReleasePlan_StoryPanel_ID.loadData(selectedNode);
    }
});
Ext.reg('ReleasePlanPage', ezScrum.ReleasePlan_MasterPanel);