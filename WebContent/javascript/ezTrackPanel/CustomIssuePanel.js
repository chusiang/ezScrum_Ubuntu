/**
 * 
 */
// the bar menu is used to the dynamic add issue
var barMenu = new Ext.menu.Menu({
	id: 'basicMenu'
}); 
	
// Page size
var customPageSize = 22;

// Ajax Load Data
function customLoadData(option)
{
	Ext.Ajax.request({
		url:'showCustomIssueAction.do',
		success:function(response){
			var loadmask = new Ext.LoadMask(customIssueMasterPanel.getEl(), {msg:"loading info..."});
			loadmask.show();
			
			CustomStore.proxy.data = response;
			CustomStore.proxy.reload = true;
			if(!option)
				CustomStore.load({params:{start:0, limit:customPageSize}});
			else 
				CustomStore.reload();
			
			loadmask.hide();
		}
	});

	Ext.Ajax.request({
		url:'AjaxGetCustomIssueType.do',
		success:function(response){
			var loadmask = new Ext.LoadMask(customIssueMasterPanel.getEl(), {msg:"loading info..."});
			loadmask.show();
			
			var issueCategoryRs = customIssueCategoryReader.readRecords(response.responseXML);
	 		var issueCategoryCount = issueCategoryRs.totalRecords;
	 		for(var i = 0; i < issueCategoryCount; i++){
	 			var categoryRecord = issueCategoryRs.records[i];
	 			var typeId = categoryRecord.data['TypeId'];
	 			var typeName = categoryRecord.data['TypeName'];
	 			/* set issue type bar menu*/
	 			barMenu.add({
				    text: typeName,
					id:   typeId, 
					handler: function(){
						customIssueMasterPanel.addNewCustomIssue(this.id, this.text);
					}
				}); 
	 		}
	 		loadmask.hide();
		}
	});
}

//Create Custom issue Widget
var createCustomIssueWidget = new ezScrum.AddNewCustomIssueWidget({
	listeners:{
		CreateSuccess:function(win, form, response, record){
	 		Ext.getCmp('customIssueGridPanel').addRecord(record);
	 		this.hide();
	 		Ext.example.msg('Create Custom Issue', 'Create Custom Issue Success.');
	 		
		},
		CreateFailure:function(win, form, response, issueId){
			Ext.example.msg('Create Custom Issue', 'Create Custom Issue Failure.');
		}
	}
});

// Edit Custom issue Widget
var editCustomIssueWidget = new ezScrum.EditCustomIssueWidget({
	listeners:{
		LoadSuccess:function(win, form, response, record){
			Ext.example.msg('load Custom Issue', 'Load Custom Issue Success.');
		},
		LoadFailure:function(win, form, response, issue_id){
			Ext.example.msg('Load Custom Issue', 'Load Custom Issue Failure.');
		},
		EditSuccess:function(win, form, response, record){
	 		Ext.getCmp('customIssueGridPanel').updateRecord(record);
	 		this.hide();
	 		Ext.example.msg('Edit Custom Issue', 'Edit Custom Issue Success.');
		},
		EditFailure:function(win, form, response, issue_id){
			Ext.example.msg('Edit Custom Issue', 'Edit Custom Issue Failure.');
		}
	}
});

//delete Custom issue Widget
var deleteCustomIssueWidget = new ezScrum.DeleteCustomIssueWidget({
	listeners:{
		DeleteSuccess: function(win, response, issueID){
			Ext.getCmp('customIssueGridPanel').deleteRecord(issueID);
			this.hide();
			Ext.example.msg('Delete Custom Issue', 'Delete Custom Issue Success.');
		},
		DeleteFailure: function(win, form, response, issue_id){
			Ext.example.msg('Delete Custom Issue', 'Delete Custom Issue Failure.');
		}
	}
});

//transform Widget
var transformWidget = new ezScrum.TransformCustomIssueWidget({
	listeners:{
		TransformSuccess: function(win, form, response, record){
			Ext.getCmp('customIssueGridPanel').updateRecord(record);
			this.hide();
			Ext.example.msg('Transform To A Story', 'Transform Success.');
		},
		ImplicationFailure: function(win, form, response){
			Ext.example.msg('Transform To A Story', 'Implication ID can not find');
		},
		TransformFailure: function(win, form, response){
			Ext.example.msg('Transform To A Story', 'Transform Failure');
		}
	}
});

var transformToUnplannedItemWidget = new ezScrum.TransformToUnplannedItemWidget({
	listeners:{
		TransformSuccess: function(win, form, response, record){
			Ext.getCmp('customIssueGridPanel').updateRecord(record);
			this.hide();
			Ext.example.msg('Transform To A Unplanned Item', 'Transform Success.');
		},
		ImplicationFailure: function(win, form, response){
			Ext.example.msg('Transform To A Unplanned Item', 'Implication ID can not find');
		},
		TransformFailure: function(win, form, response){
			Ext.example.msg('Transform To A Unplanned Item', 'Transform Failure');
		}
	}
});

// Add Comment Widget
var addCommentWidget = new ezScrum.AddCommentWidget({
	listeners:{
		AddSuccess:function(win, form, response, record){
	 		Ext.getCmp('customIssueGridPanel').updateRecord(record);
	 		this.hide();
	 		Ext.example.msg('Add Comment', 'Add Comment Success.');
	 		
		},
		AddFailure:function(win, form, response, issueId){
			Ext.example.msg('Add Comment', 'Add Comment Failure.');
		}
	}
});

//Product Backlog Panel
var CustomIssueGridPanel = new ezScrum.IssueGridPanel({
	id : 'customIssueGridPanel',
	store: CustomStore,
    plugins: [IssueGridPanelFilter, CustomIssueExpander],
    colModel: CustomCreateColModel(),
    updateRecord:function(record)
    {
    	var id = record.data['Id'];
		var data = this.getStore().getById(id);
    	var index = this.getStore().indexOf(data);
    	var expand = CustomIssueExpander.isExpand(index);
    	data.data = record.data;
    	// 暫時使用這種方法強迫Store更新資料
    	data.commit(true);
    	this.getStore().afterCommit(data);
    	if(expand)
    		CustomIssueExpander.expandRow(index);
    	this.getSelectionModel().selectRow(index);
 		this.getView().focusRow(index);
    	this.getStore().proxy.updateRecord(record);
    },
    bbar:new Ext.PagingToolbar({
			customPageSize: customPageSize,
			store: CustomStore,
			displayInfo: true,
			displayMsg: 'Displaying topics {0} - {1} of {2}',
			emptyMsg: "No topics to display"
	})
});

// master panel
var customIssueMasterPanel = new Ext.Panel({
	title:'Custom Issue',
	id:'customIssueMasterPanel',
	layout:'fit',
	entryPoint : 'CustomIssue',
	//Add new Custom Issue
	addNewCustomIssue: function(typeId, typeName){
		createCustomIssueWidget.setTitle('Add New '+typeName);
		createCustomIssueWidget.showWidget(typeId, typeName);
	},
	notify_AttachFile: function(success, record, msg) {
		AttachFile_Window.hide();
		
		if(success) {
			Ext.example.msg('Attach File', 'Attach File Success.');
			CustomIssueGridPanel.updateRecord(record);
		}else{
			Ext.example.msg('Attach File', msg);
		}
	},
	// edit custom issue
	editCustomIssue: function(typeId, typeName){
		var issueID = Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected().data['Id'];
		editCustomIssueWidget.loadEditStory(issueID);
	},
	// delete  custom issue
	deleteCustomIssue: function(){
		var issueID = Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected().data['Id'];
		deleteCustomIssueWidget.deleteCustomIssue(issueID);
	},
	// Delete attach file action
	deleteAttachFile:function(file_Id, issue_Id)
	{
		Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function(btn){
			if(btn == 'yes')
			{
				Ext.Ajax.request(
				{
					url : 'ajaxDeleteFile.do',
					success : function(response)
					{
						var rs = jsonCustomIssueReader.read(response);
						if(rs.totalRecords == 1)
						{
							CustomIssueGridPanel.updateRecord(rs.records[0]);
							Ext.example.msg('Delete File', 'Delete File Success.');
						}
						else
							Ext.example.msg('Delete File', 'Delete File Failure.');
					},
					failure : function(response)
					{
						Ext.example.msg('Delete File', 'Delete File Failure.');
					},
					params : {fileId:file_Id, issueId:issue_Id, entryPoint: 'CustomIssue'}
				});
			}
		});
	},
	//決定不處理custom Issue的選項
	DoNotHaveToDealCustomIssue: function(){
		var issueID = Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected().data['Id'];
		Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function(btn){
			if(btn == 'yes')
			{
				Ext.Ajax.request(
				{
					url : 'ajaxDoNotHaveToDealCustomIssue.do',
					params : {issueId: issueID},
					success : function(response){
						var rs = jsonCustomIssueReader.read(response);
						if(rs.totalRecords == 1){
							CustomIssueGridPanel.updateRecord(rs.records[0]);
							Ext.example.msg('Handled File', 'Handled File Success.');
						}
						else{
							Ext.example.msg('Handled File', 'Handled File Failure.');
						}
					},
					failure : function(response){
						Ext.example.msg('Handled File', 'Handled File Failure.');
					}
				});
			}
		});
	},
	// transform custom issue to story
	transformCustomIssue: function(){
		var issueID = Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected().data['Id'];
		transformWidget.showWidget(issueID);
	},
	transformToUnplanned: function(){
		var sprintID = -1;
		Ext.Ajax.request({
			url:'showUnplannedItem2.do',
			params:{ SprintID:""},
			success:function(response){
				var rs = CustomSprintStore.loadData(response.responseXML);
				sprintID = CustomSprintStore.getAt(0).get('Id');
				if(sprintID == -1){
					Ext.example.msg('Transform To A Unplanned Item', 'This time is out of sprint.');
				}			
				else{
					var issueID = Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected().data['Id'];
					transformToUnplannedItemWidget.showWidget(issueID, sprintID);
				}
			},
			failure:function(response){
				Ext.example.msg('Handled File', 'Handled File Failure.');
			}
		});
	},
	addComment:function()
	{
		if(Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected() != null)
		{
			var id = Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected().data['Id'];
			addCommentWidget.showWidget1(id);
		}
		
	},
	// Show history action
	showHistory:function()
	{
		if(Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected() != null)
		{
			var id = Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected().data['Id'];
			var widget = new ezScrum.ShowHistoryWidget();
			widget.show();
		}
	},
	attachFile:function()
	{
		if(Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected() != null)
		{
			var id = Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected().data['Id'];
			AttachFile_Window.attachFile(this, id);
		}
	},
	tbar: [
		{id:'AddIssueBtn', text:'Add Custom Issue', icon:'images/add3.png', 
			menu: barMenu
		},
		{id:'editCustomIssueBtn',disabled:true, text:'Edit Custom Issue', icon:'images/edit.png',handler:function(){customIssueMasterPanel.editCustomIssue();}},
		{id:'deleteCustomIssueBtn',disabled:true, text:'Delete Custom Issue', icon:'images/delete.png', handler:function(){customIssueMasterPanel.deleteCustomIssue();}},
		{id:'handleBtn',disabled:true, text:'Issue Triage', icon:'images/folder_out.png', 
			menu: { 
				items:[{
					text:'Do not have to handle',
					handler:function(){customIssueMasterPanel.DoNotHaveToDealCustomIssue();}
				},
				{	
					text: 'Transform - Create',
					menu: {
						items:[
						{
							text:'Transform - Create  a story',
							handler:function(){customIssueMasterPanel.transformCustomIssue();}
						},
						{
							text:'Transform - Create a unplanned item ',
							handler:function(){customIssueMasterPanel.transformToUnplanned();}
						}]
					}
				}]
			}				
		},
		{id:'addCommentBtn', disabled:true, text:'Add Comment', icon:'images/chatadd_16.png', handler:function(){customIssueMasterPanel.addComment();}},
		{id:'showHistoryBtn', disabled:true, text:'Show History', icon:'images/history.png', handler: function(){document.location.href  = "./showIssueHistory.do?issueID="+Ext.getCmp('customIssueGridPanel').getSelectionModel().getSelected().data['Id']+"&type=product";}},
		{id:'attachFileBtn', disabled:true, text:'Attach File', icon:'images/paperclip.png', handler:function(){customIssueMasterPanel.attachFile();}}
	],bbar: [
		'->',
		{text:'Reload', icon:'images/refresh.png', handler: function(){
			customLoadData(true);
		}},
		{text:'Clean Filters', icon:'images/clear2.png', handler:function(){
			
			IssueGridPanelFilter.clearFilters();
		}},
		{text:'Expand All', icon:'images/folder_out.png', handler:function(){
			
			CustomIssueExpander.expandAll();
		}},
		{text:'Collapse All', icon:'images/folder_into.png', handler:function(){
			
			CustomIssueExpander.collapseAll();
		}}
	],
	items : [CustomIssueGridPanel],
	selectionChange: function()
	{
		var single = CustomIssueGridPanel.getSelectionModel().getCount() == 1;
		if(single) {
			this.getTopToolbar().get('editCustomIssueBtn').setDisabled(false);
			this.getTopToolbar().get('deleteCustomIssueBtn').setDisabled(false);
			this.getTopToolbar().get('handleBtn').setDisabled(false);
			this.getTopToolbar().get('addCommentBtn').setDisabled(false);
			this.getTopToolbar().get('attachFileBtn').setDisabled(false);
			
			// 原本就還沒做對應的 window，只有切換頁面純粹顯示 data 
//			this.getTopToolbar().get('showHistoryBtn').setDisabled(false);
		} else {
			this.getTopToolbar().get('editCustomIssueBtn').setDisabled(true);
			this.getTopToolbar().get('deleteCustomIssueBtn').setDisabled(true);
			this.getTopToolbar().get('handleBtn').setDisabled(true);
			this.getTopToolbar().get('addCommentBtn').setDisabled(true);
			this.getTopToolbar().get('attachFileBtn').setDisabled(true);
			//this.getTopToolbar().get('showHistoryBtn').disable();
			//this.getTopToolbar().get('attachFileBtn').disable();
		}
	},
	loadDataModel:function(){
		customLoadData(false);
	},
	listeners: {
    	show: function() {
    		this.loadDataModel();
    	}
    }
});

CustomIssueGridPanel.getSelectionModel().on({'selectionchange':{buffer:10, fn:function(){customIssueMasterPanel.selectionChange();}}});