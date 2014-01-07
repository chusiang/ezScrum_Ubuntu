Ext.ns('ezScrum');

//Page size
var scrumPageSize = 23;

function scrumLoadData(option)
{
	// 測試期間 先mark起來
	Ext.Ajax.request({
		url:'showScrumIssueAction.do',
		success:function(response){
			var loadmask = new Ext.LoadMask(ScrumIssueMasterPanel.getEl(), {msg:"loading info..."});
			loadmask.show();
			
			ScrumStore.proxy.data = response;
			ScrumStore.proxy.reload = true;
			if(!option)
				ScrumStore.load({params:{start:0, limit:scrumPageSize}});
			else 
				ScrumStore.reload();
			
			loadmask.hide();
		}
	});
	
	Ext.Ajax.request({
		url:'AjaxGetTagList.do',
		success:function(response){
			var loadmask = new Ext.LoadMask(ScrumIssueMasterPanel.getEl(), {msg:"loading info..."});
			loadmask.show();
			
			var tagRs = tagReader.readRecords(response.responseXML);
	 		var tagCount = tagRs.totalRecords;
			
			//Ext.getCmp('tagMenu').menu.removeAll();
			var tagMenu = [];
			for(var j = 0; j < tagCount; j++)
			{
				var tagRecord = tagRs.records[j];
				//Ext.getCmp('tagMenu').menu.add({tagId:tagRecord.data['Id'],text:tagRecord.data['Name'], xtype:'menucheckitem', hideOnClick:false});
				tagMenu.push(tagRecord.data['Name']);
			}
					
			IssueGridPanelFilter.addFilter({type: 'tag',dataIndex: 'Tag',options: tagMenu});
			
			loadmask.hide();
		}
	});
}


// Product Backlog Panel
var ScrumIssueGridPanel = new ezScrum.IssueGridPanel({
	id : 'scrumIssueGridPanel',
	store: ScrumStore,
    plugins: [IssueGridPanelFilter, ScrumIssueExpander],
    colModel: ScrumCreateColModel(),
    updateRecord:function(record)
    {
    	var id = record.data['Id'];
		var data = this.getStore().getById(id);
    	var index = this.getStore().indexOf(data);
    	var expand = ScrumIssueExpander.isExpand(index);
    	data.data = record.data;
    	// 暫時使用這種方法強迫Store更新資料
    	data.commit(true);
    	this.getStore().afterCommit(data);
    	if(expand)
    		ScrumIssueExpander.expandRow(index);
    	this.getSelectionModel().selectRow(index);
 		this.getView().focusRow(index);
    	this.getStore().proxy.updateRecord(record);
    },
    bbar:new Ext.PagingToolbar({
		scrumPageSize: scrumPageSize,
		store: ScrumStore,
		displayInfo: true,
		displayMsg: 'Displaying topics {0} - {1} of {2}',
		emptyMsg: "No topics to display"
	})
});

var ScrumIssueMasterPanel = new Ext.Panel({
	title:'Scrum Issue',
	id:'scrumIssueMasterPanel',
	layout:'fit',

	// Show history action
	showHistory:function()
	{
		if(Ext.getCmp('scrumIssueGridPanel').getSelectionModel().getSelected() != null)
		{
			var id = Ext.getCmp('scrumIssueGridPanel').getSelectionModel().getSelected().data['Id'];
			var widget = new ezScrum.ShowHistoryWidget();
			widget.show();
		}
	},
	itemClick:function(baseItem, e)
	{
		if(baseItem.checked == false)
		{
			Ext.Ajax.request(
			{
				url : 'AjaxAddStoryTag.do',
				success : function(response)
				{
					var rs = jsonScrumIssueReader.read(response);
					if(rs.totalRecords == 1)
						scrumProductBacklogWidget.updateRecord(rs.records[0]);
				},
				params : {storyId:Ext.getCmp('scrumIssueGridPanel').getSelectionModel().getSelected().data['Id'], tagId:baseItem.tagId}
			});
		}
		else 
		{
			Ext.Ajax.request(
			{
				url : 'AjaxRemoveStoryTag.do',
				success : function(response)
				{
					var rs = jsonScrumIssueReader.read(response);
					if(rs.totalRecords == 1)
						scrumProductBacklogWidget.updateRecord(rs.records[0]);
				},
				params : {storyId:Ext.getCmp('scrumIssueGridPanel').getSelectionModel().getSelected().data['Id'], tagId:baseItem.tagId}
			});
		}

	},
	bbar: [
		'->',
		{text:'Reload', icon:'images/refresh.png', handler: function(){
			scrumLoadData(true);
		}},
		{text:'Clean Filters', icon:'images/clear2.png', handler:function(){
			
			IssueGridPanelFilter.clearFilters();
		}},
		{text:'Expand All', icon:'images/folder_out.png', handler:function(){
			
			ScrumIssueExpander.expandAll();
		}},
		{text:'Collapse All', icon:'images/folder_into.png', handler:function(){
			
			ScrumIssueExpander.collapseAll();
		}}
	],
	items : [ScrumIssueGridPanel],
	selectionChange:function()
	{
		var single = ScrumIssueGridPanel.getSelectionModel().getCount()==1;
	},
	loadDataModel:function(){
		scrumLoadData(false);
	},
	listeners: {
    	show: function() {
    		this.loadDataModel();
    	}
	}
});

ScrumIssueGridPanel.getSelectionModel().on({'selectionchange':{buffer:10, fn:function(){ScrumIssueMasterPanel.selectionChange();}}});