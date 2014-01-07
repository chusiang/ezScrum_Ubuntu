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
	<script type="text/javascript" src="javascript/ux/BufferView.js"></script>
	<script type="text/javascript" src="javascript/ux/RowExpander.js"></script>
	<script type="text/javascript" src="javascript/ux/RowEditor.js"></script>
	<script type="text/javascript" src="javascript/ux/PagingMemoryProxy.js"></script>
	<script type="text/javascript" src="javascript/ux/fileuploadfield/FileUploadField.js"></script>
	
	<script type="text/javascript" src="javascript/AjaxWidget/Common.js"></script>
	<script type="text/javascript" src="javascript/AjaxWidget/Message.js"></script>	
	
	<script type="text/javascript" src="javascript/CustomWidget/Common.js"></script>
	<script type="text/javascript" src="javascript/AjaxWidget/CommonFormVTypes.js"></script>
	<script type="text/javascript" src="javascript/CustomWidget/CreateCustomIssueWidget.js"></script>
	<script type="text/javascript" src="javascript/CustomWidget/EditCustomIssueWidget.js"></script>
	<script type="text/javascript" src="javascript/CustomWidget/DeleteCustomIssueWidget.js"></script>
	<script type="text/javascript" src="javascript/CustomWidget/TransformToStoryWidget.js"></script>
	<script type="text/javascript" src="javascript/CustomWidget/TransformToUnplannedItemWidget.js"></script>
	<script type="text/javascript" src="javascript/CustomWidget/AttachFileWidget.js"></script>		
	<script type="text/javascript" src="javascript/CustomWidget/AddCommentWidget.js"></script>

	<link rel="stylesheet" type="text/css" href="javascript/ux/gridfilters/css/GridFilters.css" />
    <link rel="stylesheet" type="text/css" href="javascript/ux/gridfilters/css/RangeMenu.css" />
    <link rel="stylesheet" type="text/css" href="javascript/ux/css/RowEditor.css" />
    <link rel="stylesheet" type="text/css" href="javascript/ux/fileuploadfield/css/fileuploadfield.css"/>
    <link rel="stylesheet" type="text/css" href="css/Message.css"/>
    

<script type="text/javascript">
	
	Ext.ns('ezScrum');
	
	var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.XTemplate(
            '<br><p><b>Name:</b><br /> {Name:nl2br}</p>',
            '<tpl if="Description"><p><b>Description:</b><br /> {Description:nl2br}</p></tpl>',
            '<tpl for="AttachFileList"><p><b>Attach Files:</b><br /><a href="{DownloadPath}" target="_blank">{FileName}</a> <tpl if="this.hasPermission()">[<a href="#" onclick="Ext.getCmp(\'BacklogWidget\').deleteAttachFile({FileId}, {IssueId}); return false;">Delete</a>]</tpl><br /></tpl>',
            '<tpl if="Comment"><p><b>Comment:</b><br /> {Comment:nl2br}</p></tpl>',
            '<br />',{
            hasPermission:function(){
            	return true;
            }}
        ),
        enableCaching :false
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
        }]
    });    

	//the model of column
    var createColModel = function () {
        var columns = [expander,
		            {dataIndex: 'Id',header: 'Id', width: 30,filterable: true,renderer: function(value, metaData, record, rowIndex, colIndex, store){var link = "<a href=\"" + record.data['Link'] + "\" target=\"_blank\">" + value + "</a>"; return link;}},
		            {dataIndex: 'Handled',header: 'Handled'},
		            {dataIndex: 'Name',header: 'Name', width: 300,renderer: function(value, metaData, record, rowIndex, colIndex, store){if(record.data['Attach'] == 'true') return "<image src = \"./images/paperclip.png\" />" + value; return value}},
		            {dataIndex: 'Category',header: 'Category', width: 70},
		            {dataIndex: 'Status',header: 'Status', width: 70},
		            {dataIndex: 'Priority',header: 'Priority', width: 70}
		        ];

        return new Ext.grid.ColumnModel({
            columns: columns,
            defaults: {
                sortable: true
            }
        });
    };

	// Data store
	var store = new Ext.data.Store({
		fields:[
			{name : 'Id', type:'int'},
			{name : 'Link'},
			{name : 'Handled'},
			{name : 'Name'},
			{name : 'Status'},
			{name : 'Priority'},
			{name : 'Handler'},
			{name : 'Description'},
			{name : 'Attach'},
			{name : 'Category'},
			{name : 'Comment'}
		],
		reader: jsonCustomIssueReader,
		url:'showCustomIssueAction.do',
		proxy: new Ext.ux.data.PagingMemoryProxy(null,filters),
		remoteSort : true,
		//預設ID由大排到小
		sortInfo: {
	        field: 'Id',
	        direction: 'DESC'
    	}
	});
	
		// create the Data Store
    var thisSprintStore = new Ext.data.Store({
		fields:[
			{name : 'Id', sortType:'asInt'},
			{name : 'Name'}
		],
		reader: SprintReader
	});
		 
	// the bar menu is used to the dynamic add issue 	
	var barMenu = new Ext.menu.Menu({
		id: 'basicMenu'
	}); 
		
	// Page size
	var pageSize = 25;
	

	/* Grid View */
	Ext.onReady(function() {
		Ext.QuickTips.init();
		
		function LoadData(option)
		{
			Ext.Ajax.request({
				url:'showCustomIssueAction.do',
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
			 		}
				}
			});

			Ext.Ajax.request({
				url:'AjaxGetCustomIssueType.do',
				success:function(response){
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
    							masterWidget.addNewCustomIssue(this.id, this.text);
    						}
						}); 
			 		}
				}
			});
			
		}

		
		// Create Custom issue Widget
		var createCustomIssueWidget = new ezScrum.AddNewCustomIssueWidget({
			listeners:{
				CreateSuccess:function(win, form, response, record){
			 		Ext.getCmp('gridPanel').addRecord(record);
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
			 		Ext.getCmp('gridPanel').updateRecord(record);
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
					Ext.getCmp('gridPanel').deleteRecord(issueID);
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
					Ext.getCmp('gridPanel').updateRecord(record);
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
					Ext.getCmp('gridPanel').updateRecord(record);
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
		//attach file Widget
		var attachFileWidget = new ezScrum.AttachFileWidget({
			listeners:{
				AttachSuccess: function(win, form, response, record){
					Ext.getCmp('gridPanel').updateRecord(record);
					this.hide();
					Ext.example.msg('Attach File', 'Attach File Success.');
				},
				AttachFailure: function(win, form, response, msg){
					Ext.example.msg('Attach File', msg);
				}
			}
		});
		
		// Add Comment Widget
		var addCommentWidget = new ezScrum.AddCommentWidget({
			listeners:{
				AddSuccess:function(win, form, response, record){
			 		Ext.getCmp('gridPanel').updateRecord(record);
			 		this.hide();
			 		Ext.example.msg('Add Comment', 'Add Comment Success.');
			 		
				},
				AddFailure:function(win, form, response, issueId){
					Ext.example.msg('Add Comment', 'Add Comment Failure.');
				}
			}
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
			//Add new Custom Issue
			addNewCustomIssue: function(typeId, typeName){
				createCustomIssueWidget.setTitle('Add New '+typeName);
				createCustomIssueWidget.showWidget(typeId, typeName);
			},	
			// edit custom issue
			editCustomIssue: function(typeId, typeName){
				var issueID = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
				editCustomIssueWidget.loadEditStory(issueID);
			},
			// delete  custom issue
			deleteCustomIssue: function(){
				var issueID = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
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
							params : {fileId:file_Id, issueId:issue_Id, entryPoint: 'CustomIssue'}
						});
					}
				});
			},
			//決定不處理custom Issue的選項
			DoNotHaveToDealCustomIssue: function(){
				var issueID = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
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
									productBacklogWidget.updateRecord(rs.records[0]);
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
				var issueID = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
				transformWidget.showWidget(issueID);
			},
			transformToUnplanned: function(){
				var sprintID = -1;
				Ext.Ajax.request({
					url:'showUnplannedItem2.do',
					params:{ SprintID:""},
					success:function(response){
						var rs = thisSprintStore.loadData(response.responseXML);
						sprintID = thisSprintStore.getAt(0).get('Id');
						if(sprintID == -1){
							Ext.example.msg('Transform To A Unplanned Item', 'This time is out of sprint.');
						}			
						else{
							var issueID = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
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
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null)
				{
					var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					addCommentWidget.showWidget1(id);
				}
				
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
			attachFile:function()
			{
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null)
				{
					var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					attachFileWidget.attachFile1(id);
				}
				
			},
			itemClick:function(baseItem, e)
			{
				if(baseItem.checked == false)
				{
					
				}
				else 
				{
				}

			},
			tbar: [
				{id:'AddIssueBtn', text:'Add Custom Issue', icon:'images/add3.png', 
					menu: barMenu
				},
				{id:'editCustomIssueBtn',disabled:true, text:'Edit Custom Issue', icon:'images/edit.png',handler:function(){masterWidget.editCustomIssue();}},
				{id:'deleteCustomIssueBtn',disabled:true, text:'Delete Custom Issue', icon:'images/delete.png', handler:function(){masterWidget.deleteCustomIssue();}},
				{id:'handleBtn',disabled:true, text:'Issue Triage', icon:'images/folder_out.png', 
					menu: { 
						items:[{
							text:'Do not have to handle',
							handler:function(){masterWidget.DoNotHaveToDealCustomIssue();}
						},
						{	
							text: 'Transform - Create',
							menu: {
								items:[
								{
									text:'Transform - Create  a story',
									handler:function(){masterWidget.transformCustomIssue();}
								},
								{
									text:'Transform - Create a unplanned item ',
									handler:function(){masterWidget.transformToUnplanned();}
								}]
							}
						}]
					}				
				},
				{id:'addCommentBtn', disabled:true, text:'Add Comment', icon:'images/chatadd_16.png', handler:function(){masterWidget.addComment();}},
				{id:'showHistoryBtn', disabled:true, text:'Show History', icon:'images/history.png', handler: function(){document.location.href  = "./showIssueHistory.do?issueID="+Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id']+"&type=product";}},
				{id:'attachFileBtn', disabled:true, text:'Attach File', icon:'images/paperclip.png', handler:function(){masterWidget.attachFile();}}
				
			],bbar: [
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
			selectionChange: function()
			{
				var single = productBacklogWidget.getSelectionModel().getCount() == 1;
				if(single) {
					this.getTopToolbar().get('editCustomIssueBtn').setDisabled(false);
					this.getTopToolbar().get('deleteCustomIssueBtn').setDisabled(false);
					this.getTopToolbar().get('handleBtn').setDisabled(false);
					this.getTopToolbar().get('addCommentBtn').setDisabled(false);
					this.getTopToolbar().get('attachFileBtn').setDisabled(false);
					//this.getTopToolbar().get('attachFileBtn').setDisabled(!this.editStoryPermission);
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
			loadPermission:function(importStoryPermission, addStoryPermission, editStoryPermission, deleteStoryPermission, showStoryPermission)
			{
				this.importStoryPermission = importStoryPermission == "true";
				this.addStoryPermission = addStoryPermission == "true";
				this.editStoryPermission = editStoryPermission == "true";
				this.deleteStoryPermission = deleteStoryPermission == "true";
				this.showStoryPermission = showStoryPermission == "true";
				if(this.importStoryPermission)
					this.getTopToolbar().get('excelStoryBtn').enable();
				if(this.addStoryPermission)
					this.getTopToolbar().get('addStoryBtn').enable();
			}
		});
		
		productBacklogWidget.getSelectionModel().on({'selectionchange':{buffer:10, fn:function(){masterWidget.selectionChange();}}});
		
		var contentWidget = new Ext.Panel({
			height: 600,
			layout : 'border',
			renderTo: Ext.get("content"),
			items : [masterWidget]
		});

		//call the load data method 
		LoadData(false);
	});
</script>

<div id = "content"></div>
