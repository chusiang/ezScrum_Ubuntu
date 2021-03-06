<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>

<link rel="stylesheet" type="text/css" href="css/ext/css/ext-all.css" />
<script type="text/javascript" src="javascript/ext-base.js"></script>
<script type="text/javascript" src="javascript/ext-all-debug.js"></script>
<script type="text/javascript" src="javascript/ux/gridfilters/menu/RangeMenu.js"></script>
<script type="text/javascript" src="javascript/ux/gridfilters/menu/ListMenu.js"></script>
<script type="text/javascript" src="javascript/ux/gridfilters/GridFilters.js"></script>
<script type="text/javascript" src="javascript/ux/gridfilters/filter/Filter.js"></script>
<script type="text/javascript" src="javascript/ux/gridfilters/filter/StringFilter.js"></script>
<script type="text/javascript" src="javascript/ux/gridfilters/filter/DateFilter.js"></script>
<script type="text/javascript" src="javascript/ux/gridfilters/filter/ListFilter.js"></script>
<script type="text/javascript" src="javascript/ux/gridfilters/filter/NumericFilter.js"></script>
<script type="text/javascript" src="javascript/ux/gridfilters/filter/BooleanFilter.js"></script>
<script type="text/javascript" src="javascript/ux/gridfilters/filter/TagFilter.js"></script>
<script type="text/javascript" src="javascript/ux/BufferView.js"></script>
<script type="text/javascript" src="javascript/ux/RowExpander.js"></script>
<script type="text/javascript" src="javascript/ux/RowEditor.js"></script>
<script type="text/javascript" src="javascript/ux/PagingMemoryProxy.js"></script>
<script type="text/javascript" src="javascript/ux/fileuploadfield/FileUploadField.js"></script>
	
<script type="text/javascript" src="javascript/AjaxWidget/Common.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/CommonFormVTypes.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/CreateStoryWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/EditStoryWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/DeleteStoryWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/ManageTagWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/AttachFileWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/Message.js"></script>

<script type="text/javascript" src="javascript/CustomWidget/Common.js"></script>

<link rel="stylesheet" type="text/css" href="javascript/ux/gridfilters/css/GridFilters.css" />
<link rel="stylesheet" type="text/css" href="javascript/ux/gridfilters/css/RangeMenu.css" />
<link rel="stylesheet" type="text/css" href="javascript/ux/css/RowEditor.css" />
<link rel="stylesheet" type="text/css" href="javascript/ux/fileuploadfield/css/fileuploadfield.css"/>
<link rel="stylesheet" type="text/css" href="css/Message.css"/>

<script type="text/javascript" src="javascript/AjaxAction/edit_tag.js"></script>
<script type="text/javascript">
	
	Ext.ns('ezScrum');
	
	var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.XTemplate(
            '<br><p><b>Name:</b><br /> {Name:nl2br}</p>',
            '<tpl if="Notes"><p><b>Notes:</b><br /> {Notes:nl2br}</p></tpl>',
            '<tpl for="AttachFileList"><p><b>Attach Files:</b><br /><a href="{DownloadPath}" target="_blank">{FileName}</a> <tpl if="this.hasPermission()">[<a href="#" onclick="Ext.getCmp(\'BacklogWidget\').deleteAttachFile({FileId}, {IssueId}); return false;">Delete</a>]</tpl><br /></tpl>',
            '<br />',{
            hasPermission:function()
            {
            	return Ext.getCmp('BacklogWidget').editStoryPermission;
            }}
        ),
        enableCaching :false
    });

    var createColModel = function () {

        var columns = [expander,
		            {dataIndex: 'Id',header: 'Id', width: 50,filterable: true,renderer: function(value, metaData, record, rowIndex, colIndex, store){var link = "<a href=\"" + record.data['Link'] + "\" target=\"_blank\">" + value + "</a>"; return link;}},
		            {dataIndex: 'Name',header: 'Name', width: 300,renderer: function(value, metaData, record, rowIndex, colIndex, store){if(record.data['Attach'] == 'true') return "<image src = \"./images/paperclip.png\" />" + value; return value}},
		            {dataIndex: 'Category',header: 'Category', width: 70},
		            {dataIndex: 'Sprint',header: 'Sprint', width: 70},
		            {dataIndex: 'Status',header: 'Status', width: 70}
		        ];

        return new Ext.grid.ColumnModel({
            columns: columns,
            defaults: {
                sortable: true
            }
        });
    };
	
	
	/* Grid View */
	Ext.onReady(function() {
		Ext.QuickTips.init();
		
		function LoadData(option)
		{
			// 測試期間 先mark起來
			Ext.Ajax.request({
				url:'showScrumIssueAction.do',
				success:function(response){
					store.proxy.data = response;
					store.proxy.reload = true;
					if(!option)
						store.load({params:{start:0, limit:pageSize}});
					else 
						store.reload();
				}
			});
			
			Ext.Ajax.request({
				url:'AjaxGetPBPermission.do',
				success:function(response){
					var permissionRs = permissionReader.readRecords(response.responseXML);
			 		var permissionCount = permissionRs.totalRecords;
			 		for(var i = 0; i < permissionCount; i++)
			 		{
			 			var permissionRecord = permissionRs.records[i];
						masterWidget.loadPermission(permissionRecord.data['ImportStory'], permissionRecord.data['AddStory'],permissionRecord.data['EditStory'],permissionRecord.data['DeleteStory'],permissionRecord.data['TagStory'],permissionRecord.data['ShowStoryHistory'],"true");     
			 		}
				}
			});
			
			Ext.Ajax.request({
				url:'AjaxGetTagList.do',
				success:function(response){
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
							
				 	filters.addFilter({type: 'tag',dataIndex: 'Tag',options: tagMenu});
				}
			});
		}
		
		// Page size
		var pageSize = 25;
		
		// Create Story Widget
		var createStoryWidget = new ezScrum.AddNewStoryWidget({
			listeners:{
				CreateSuccess:function(win, form, response, record){
			 		Ext.getCmp('gridPanel').addRecord(record);
			 		this.hide();
			 		Ext.example.msg('Create Story', 'Create Story Success.');
			 		
				},
				CreateFailure:function(win, form, response, issueId){
					Ext.example.msg('Create Story', 'Create Story Failure.');
				}
			}
		});
		
		// Edit Story Widget
		var editStoryWidget = new ezScrum.EditStoryWidget({
			listeners:{
				LoadSuccess:function(win, form, response, record){
					// Load Story Success
				},
				LoadFailure:function(win, form, response, issueId){
					Ext.example.msg('Load Story', 'Load Story Failure.');
				},
				EditSuccess:function(win, form, response, record){
					Ext.getCmp('gridPanel').updateRecord(record);
					this.hide();
					Ext.example.msg('Edit Story', 'Edit Story Success.');
					
				},
				EditFailure:function(win, form, response, issueId){
					Ext.example.msg('Edit Story', 'Edit Story Failure.');
				}
			}
		});
		
		// Delete Story Widget
		var deleteStoryWidget = new ezScrum.DeleteStoryWidget({
			listeners:{
				DeleteSuccess:function(win, response, issueId){
					Ext.getCmp('gridPanel').deleteRecord(issueId);
					this.hide();
					Ext.example.msg('Delete Story', 'Delete Story Success.');
				},
				DeleteFailure:function(win, response, issueId){
					Ext.example.msg('Delete Story', 'Delete Story Failure.');
				}
			}
		});
		
		// Attach File Widget
		var attachFileWidget = new ezScrum.AttachFileWidget({
			listeners:{
				AttachSuccess:function(win, form, response, record){
					productBacklogWidget.updateRecord(record);
					this.hide();
					Ext.example.msg('Attach File', 'Attach File Success.');
				},
				AttachFailure:function(win, form, response, msg){
					Ext.example.msg('Attach File', msg);
				}
			}
		});
		
		// Filter
		var filters = new Ext.ux.grid.GridFilters({
			local:false,
	        filters: [{
	            type: 'numeric',
	            dataIndex: 'Id'
	        },{
	        	type: 'list',
	        	dataIndex: 'Status',
	        	options: ['new', 'closed']
	        },{
	        	type: 'tag',
	        	dataIndex: 'Tag',
	        	options: ['new', 'closed']
	        }]
	    });    
		
		// Data store
		var store = new Ext.data.Store({
			fields:[
				{name:'Id', type:'int'},
				{name:'Link'},
				{name:'Name'},
				{name : 'Importance', type:'int'},
				{name : 'Estimation', type:'float'},
				{name : 'Status'},
				{name : 'Release'},
				{name : 'Sprint'},
				{name : 'Notes'},
				{name : 'HowToDemo'},
				{name : 'Tag'},
				{name : 'Attach'},
				{name : 'Category'}
			],
			reader:jsonScrumIssueReader,
			url:'showScrumIssueAction.do',
			proxy: new Ext.ux.data.PagingMemoryProxy(null,filters),
			remoteSort : true
		 });
		
		// Porduct Backlog Panel
		var productBacklogWidget = new Ext.grid.GridPanel({
			id : 'gridPanel',
			enableColumnHide : false,
			region : 'center',
			store: store,
	        viewConfig: {
	            forceFit:true
	        },
		    plugins: [filters, expander],
		    colModel: createColModel(),
		    sm: new Ext.grid.RowSelectionModel({
		    	singleSelect:true
		    }),
		    stripeRows: true,
		    frame: true,
		    deleteRecord:function(id)
		    {
		    	var record = this.getStore().getById(id);
		    	this.getStore().remove(record);
		    	this.getStore().proxy.deleteRecord(id);
		    },
		    addRecord:function(record)
		    {
		    	this.getStore().insert(0, record);
		    	var id = record.data['Id'];
		    	var index = this.getStore().indexOfId(id);
		    	this.getSelectionModel().selectRow(index);
		 		this.getView().focusRow(index);
		    	this.getStore().proxy.insertRecord(record);
		    },
		    updateRecord:function(record)
		    {
		    	var id = record.data['Id'];
				var data = this.getStore().getById(id);
		    	var index = this.getStore().indexOf(data);
		    	var expand = expander.isExpand(index);
		    	data.data = record.data;
		    	// 暫時使用這種方法強迫Store更新資料
		    	data.commit(true);
		    	this.getStore().afterCommit(data);
		    	if(expand)
			    	expander.expandRow(index);
		    	this.getSelectionModel().selectRow(index);
		 		this.getView().focusRow(index);
		    	this.getStore().proxy.updateRecord(record);
		    },
		    bbar:new Ext.PagingToolbar({
					pageSize: pageSize,
					store: store,
					displayInfo: true,
					displayMsg: 'Displaying topics {0} - {1} of {2}',
					emptyMsg: "No topics to display"
				})
		});

		productBacklogWidget.getSelectionModel().on({
			selectionchange:{buffer:10, fn:function(sm) {
				var record = null;
				record = sm.getSelections();
				for(var i = 0; i < record.length; i++)
				{
					//alert(record[i].data['Id']);
				}
			}
		}});
		
		/* Main Widget */
		var masterWidget = new Ext.Panel({
			id:'BacklogWidget',
			layout:'border',
			region : 'center',
			importStoryPermission: false,
			addStoryPermission:false,
			editStoryPermission:false,
			deleteStoryPermission:false,
			showStoryPermission:false,
			tagStoryPermission:false,
			// Add story action
			addStory:function()
			{
				createStoryWidget.showWidget();
			},
			// Edit story action
			editStory:function()
			{
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null)
				{
					var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					editStoryWidget.loadEditStory(id);
				}
			},
			// Delete story action
			deleteStory:function()
			{
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null)
				{
					var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					deleteStoryWidget.deleteStory(id);
				}
			},
			// Delete story action
			deleteAttachFile:function(file_Id, issue_Id)
			{

				Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function(btn){
					if(btn === 'yes')
					{
						Ext.Ajax.request(
						{
							url : 'ajaxDeleteFile.do',
							success : function(response)
							{
								var rs = jsonScrumIssueReader.read(response);
								if(rs.totalRecords == 1)
								{
									productBacklogWidget.updateRecord(rs.records[0]);
									Ext.example.msg('Delete File', 'Delete File Success.');
								}
								else
									Ext.example.msg('Delete File', 'Delete File Failure.');
							},
							failure : function(response)
							{
								Ext.example.msg('Delete File', 'Delete File Failure.');
							},
							params : {fileId:file_Id, issueId:issue_Id}
						});
					}
				});


			},
			// Show history action
			showHistory:function()
			{
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null)
				{
					var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					var widget = new ezScrum.ShowHistoryWidget();
					widget.show();
				}
			},
			// Show label menu action
			showTagMenu:function(menu)
			{
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null)
				{
					var tagRaw = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Tag'];
					var tags = tagRaw.split(",");
					menu.items.each(function(){
						this.setChecked(false);
						for(var i = 0; i < tags.length; i++)
						{
							if(tags[i] != "" && this.text == tags[i])
								this.setChecked(true);
						}

					})
				}
			},
			attachFile:function()
			{
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null)
				{
					var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					attachFileWidget.attachFile(id);
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
								productBacklogWidget.updateRecord(rs.records[0]);
						},
						params : {storyId:Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'], tagId:baseItem.tagId}
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
								productBacklogWidget.updateRecord(rs.records[0]);
						},
						params : {storyId:Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'], tagId:baseItem.tagId}
					});
				}

			},
			/*
			tbar: [
				{id:'excelStoryBtn', disabled:true, text:'Import / Export Story', icon:'images/excel.png', 
					menu: { 
						items:[{
							text:'Import Story',
							handler:function(){document.location.href  = "./showImportStories.do";},
							icon:'images/import.png'
						},{
							text:'Export Story',
							handler:function(){window.open("<html:rewrite action='/exportStories' />");}, 
							icon:'images/export.png'
						}]}
				},
				{id:'manageTagBtn', disabled: true, text:'Manage Tag', disabled:true, icon:'images/magic-wand.png', handler:function(){TagWin.show();}},
				{id:'addStoryBtn', disabled:true, text:'Add Story', icon:'images/add3.png', handler: function(){masterWidget.addStory();}},
				{id:'editStoryBtn', disabled:true, text:'Edit Story', icon:'images/edit.png', handler:function(){masterWidget.editStory();}},
				{id:'deleteStoryBtn', disabled:true, text:'Delete Story', icon:'images/delete.png', handler: function(){masterWidget.deleteStory();}},
				{id:'showHistoryBtn', disabled:true, text:'Show History', icon:'images/history.png', handler: function(){document.location.href  = "./showIssueHistory.do?issueID="+Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id']+"&type=product";}},
				{id:'tagMenu', disabled:true, text:'Tag', icon:'images/folder.png',  menu:{items:[], listeners:{itemclick:function(baseItem, e){masterWidget.itemClick(baseItem, e);}, show:function(menu){masterWidget.showTagMenu(menu);}}}},
				{id:'attachFileBtn', disabled:true, text:'Attach File', icon:'images/paperclip.png', handler:function(){masterWidget.attachFile();}}
				
			],*/
			
			bbar: [
				'->',
				{text:'Reload', icon:'images/refresh.png', handler: function(){
					LoadData(true);
				}},
				{text:'Clean Filters', icon:'images/clear2.png', handler:function(){
					
					Ext.getCmp('gridPanel').filters.clearFilters();
				}},
				{text:'Expand All', icon:'images/folder_out.png', handler:function(){
					
					expander.expandAll();
				}},
				{text:'Collapse All', icon:'images/folder_into.png', handler:function(){
					
					expander.collapseAll();
				}}
			],
			items : [productBacklogWidget],
			selectionChange:function()
			{
				var single = productBacklogWidget.getSelectionModel().getCount()==1;
				/*
				if(single)
				{
					this.getTopToolbar().get('editStoryBtn').setDisabled(!this.editStoryPermission);					
					this.getTopToolbar().get('deleteStoryBtn').setDisabled(!this.deleteStoryPermission);
					this.getTopToolbar().get('showHistoryBtn').setDisabled(!this.showStoryPermission);
					this.getTopToolbar().get('tagMenu').setDisabled(!this.tagStoryPermission);
					this.getTopToolbar().get('attachFileBtn').setDisabled(!this.editStoryPermission);
				}
				else
				{
					this.getTopToolbar().get('editStoryBtn').disable();
					this.getTopToolbar().get('deleteStoryBtn').disable();
					this.getTopToolbar().get('showHistoryBtn').disable();
					this.getTopToolbar().get('tagMenu').disable();
					this.getTopToolbar().get('attachFileBtn').disable();
				}
				*/
			},
			loadPermission:function(importStoryPermission, addStoryPermission, editStoryPermission, deleteStoryPermission, tagStoryPermission, showStoryPermission)
			{
				this.importStoryPermission = importStoryPermission == "true";
				this.addStoryPermission = addStoryPermission == "true";
				this.editStoryPermission = editStoryPermission == "true";
				this.deleteStoryPermission = deleteStoryPermission == "true";
				this.tagStoryPermission = tagStoryPermission == "true";
				this.showStoryPermission = showStoryPermission == "true";
				/*
				if(this.importStoryPermission)
					this.getTopToolbar().get('excelStoryBtn').enable();
				if(this.addStoryPermission)
					this.getTopToolbar().get('addStoryBtn').enable();
				if(this.tagStoryPermission)
					this.getTopToolbar().get('manageTagBtn').enable();
				*/
			}
		});
		
		productBacklogWidget.getSelectionModel().on({'selectionchange':{buffer:10, fn:function(){masterWidget.selectionChange();}}});
		
		var contentWidget = new Ext.Panel({
			height: 600,
			layout : 'border',
			renderTo: Ext.get("content"),
			items : [masterWidget]
		});

		LoadData(false);

		TagWin.on({
			hide:function()
			{
				LoadData(true);
			}
		});
		
		
	});
</script>

<div id = "content"></div>
