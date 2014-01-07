<%@ page contentType="text/html; charset=utf-8"%>

<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean"%>
<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html"%>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic"%>
<%@ taglib uri="http://struts.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

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
	
	<script type="text/javascript" src="javascript/KanbanWidget/Common.js"></script>
	<script type="text/javascript" src="javascript/AjaxWidget/CommonFormVTypes.js"></script>
	<script type="text/javascript" src="javascript/KanbanWidget/CreateWorkItemWidget.js"></script>
	<script type="text/javascript" src="javascript/KanbanWidget/EditWorkItemWidget.js"></script>
	<script type="text/javascript" src="javascript/KanbanWidget/DeleteWorkItemWidget.js"></script>
	<script type="text/javascript" src="javascript/KanbanWidget/DropRelationWidget.js"></script>
	<script type="text/javascript" src="javascript/KanbanWidget/AttachFileWidget.js"></script>
	
	<script type="text/javascript" src="javascript/AjaxWidget/ManageTagWidget.js"></script>
	<script type="text/javascript" src="javascript/AjaxWidget/Message.js"></script>

	<link rel="stylesheet" type="text/css" href="javascript/ux/gridfilters/css/GridFilters.css" />
    <link rel="stylesheet" type="text/css" href="javascript/ux/gridfilters/css/RangeMenu.css" />
    <link rel="stylesheet" type="text/css" href="javascript/ux/css/RowEditor.css" />
    <link rel="stylesheet" type="text/css" href="javascript/ux/fileuploadfield/css/fileuploadfield.css"/>
    <link rel="stylesheet" type="text/css" href="css/Message.css"/>

	<script type="text/javascript" src="javascript/AjaxAction/edit_tag.js"></script>
<script type="text/javascript">
	
	Ext.ns('ezScrum');
	
	function getBasicInfo(){
        /* 取得 Handler 資料 */
		Ext.Ajax.request({
			url:'getAddWorkItemInfo.do',
			success:function(response){
				typeStoreForCreate.loadData(response.responseXML);
				priorityStoreForCreate.loadData(response.responseXML);
				handlerStoreForCreate.loadData(response.responseXML);
				typeStoreForEdit.loadData(response.responseXML);
				workstateStoreForEdit.loadData(response.responseXML);
				priorityStoreForEdit.loadData(response.responseXML);
				handlerStoreForEdit.loadData(response.responseXML);
			}
		});
    }
	
	var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.XTemplate(
            '<br><tpl if="Size"><p><b>Size:</b><br /> {Size:nl2br}</p></tpl>',
            '<tpl if="WorkState"><p><b>WorkState:</b><br /> {WorkState:nl2br}</p></tpl>',
            '<tpl if="Deadline"><p><b>Deadline:</b><br /> {Deadline:nl2br}</p></tpl>',
            '<tpl if="Description"><p><b>Description:</b><br /> {Description:nl2br}</p></tpl>',
            '<tpl for="AttachFileList"><p><b>Attach Files:</b><br /><a href="{DownloadPath}" target="_blank">{FileName}</a> <tpl if="this.hasPermission()">[<a href="#" onclick="Ext.getCmp(\'BacklogWidget\').deleteAttachFile({FileId}, {IssueId}); return false;">Delete</a>]</tpl><br /></tpl>',
            '<br />',{
            hasPermission:function()
            {
            	return Ext.getCmp('BacklogWidget').editWorkItemPermission;
            }}
        ),
        enableCaching :false
    });

    var createColModel = function () {
        var columns = [expander,
		            {dataIndex: 'Id',header: 'Id', width: 50,filterable: true,renderer: function(value, metaData, record, rowIndex, colIndex, store){var link = "<a href=\"" + record.data['Link'] + "\" target=\"_blank\">" + value + "</a>"; return link;}},
		            {dataIndex: 'Type',header: 'Type', width: 50},
		            {dataIndex: 'Name',header: 'Name', width: 300,renderer: function(value, metaData, record, rowIndex, colIndex, store){if(record.data['Attach'] == 'true') return "<image src = \"./images/paperclip.png\" />" + value; return value}},
		            {dataIndex: 'Priority',header: 'Priority', width: 70},
		            {dataIndex: 'Status',header: 'Status', width: 70}
		        ];

        return new Ext.grid.ColumnModel({
            columns: columns,
            defaults: {
                sortable: true
            }
        });
    };
    
	var createTaskColModel = function () {
        var columns = [
		            {dataIndex: 'Id',header: 'Id', width: 50,filterable: true,renderer: function(value, metaData, record, rowIndex, colIndex, store){var link = "<a href=\"" + record.data['Link'] + "\" target=\"_blank\">" + value + "</a>"; return link;}},
		            {dataIndex: 'Type',header: 'Type', width: 50},
		            {dataIndex: 'Name',header: 'Name', width: 300,renderer: function(value, metaData, record, rowIndex, colIndex, store){if(record.data['Attach'] == 'true') return "<image src = \"./images/paperclip.png\" />" + value; return value}},
		            {dataIndex: 'Size',header: 'Size', width: 50},
		            {dataIndex: 'Description',header: 'Description', width: 140}
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
		
		/* 取得 KanbanBacklog 頁面所需資料 */
		function LoadData(option)
		{
			/* 取得 WorkItem 資料 */
			Ext.Ajax.request({
				url:'showKanbanBacklogAction.do',
				success:function(response){
					// 取得 IssueTypeID (Type:WorkItem)
					issueTypeStore.loadData(Ext.decode(response.responseText));
					// 將 IssueTypeID 存入 Input
	    			document.getElementById("typeID").value = issueTypeStore.getAt(0).get('Id');
				
					store.proxy.data = response;
					store.proxy.reload = true;
					if(!option)
						store.load({params:{start:0, limit:pageSize}});
					else 
						store.reload();
					
					// 取得  Priority + Handler 選項
					getBasicInfo();
				}
			});
			/* 取得 Kanban Backlog 權限資料 */
			Ext.Ajax.request({
				url:'AjaxGetKBGPermission.do',
				success:function(response){
					var permissionRs = KBGPermissionReader.readRecords(response.responseXML);
			 		var permissionCount = permissionRs.totalRecords;
			 		for(var i = 0; i < permissionCount; i++)
			 		{
			 			var permissionRecord = permissionRs.records[i];
						masterWidget.loadPermission(permissionRecord.data['ImportWorkItem'], permissionRecord.data['AddWorkItem'],permissionRecord.data['EditWorkItem'],
										permissionRecord.data['DeleteWorkItem'],permissionRecord.data['CreateRelation'],permissionRecord.data['DropRelation'],"true");
			 		}
				}
			});
		}
		
		// Page size
		var pageSize = 25;
		
		// Create WorkItem Widget
		var createWorkItemWidget = new ezScrum.AddNewWorkItemWidget({
			listeners:{
				CreateSuccess:function(win, form, response, record){
			 		Ext.getCmp('gridPanel').addRecord(record);
			 		this.hide();
			 		Ext.example.msg('Create WorkItem', 'Create WorkItem Success.');
			 		
				},
				CreateFailure:function(win, form, response, issueId){
					Ext.example.msg('Create WorkItem', 'Create WorkItem Failure.');
				}
			}
		});
		
		// Edit WorkItem Widget
		var editWorkItemWidget = new ezScrum.EditWorkItemWidget({
			listeners:{
				LoadSuccess:function(win, form, response, record){
					// Load WorkItem Success
				},
				LoadFailure:function(win, form, response, issueId){
					Ext.example.msg('Load WorkItem', 'Load WorkItem Failure.');
				},
				EditSuccess:function(win, form, record, workitemType){
					Ext.getCmp('gridPanel').updateRecord(record);
					this.hide();
					Ext.example.msg('Edit WorkItem', 'Edit WorkItem Success.');
					
				},
				EditFailure:function(win, form, response, issueId){
					Ext.example.msg('Edit WorkItem', 'Edit WorkItem Failure.');
				}
			}
		});
		
		// Delete WorkItem Widget
		var deleteWorkItemWidget = new ezScrum.DeleteWorkItemWidget({
			listeners:{
				DeleteSuccess:function(win, response, issueId){
					Ext.getCmp('gridPanel').deleteRecord(issueId);
					this.hide();
					Ext.example.msg('Delete WorkItem', 'Delete WorkItem Success.');
				},
				DeleteFailure:function(win, response, issueId){
					Ext.example.msg('Delete WorkItem', 'Delete WorkItem Failure.');
				}
			}
		});
		
		// Drop WorkItem Relation
		var dropRelationWidget = new ezScrum.DropRelationWidget({
			listeners:{
				DropSuccess:function(win, response, issueId){
					// Drop Relation Success
					var record = Ext.getCmp('relationGridPanel').getStore().getById(issueId);
		    		Ext.getCmp('relationGridPanel').getStore().remove(record);
					this.hide();
					Ext.example.msg('Drop Relation', 'Drop Relation Success.');
				},
				DropFailure:function(win, response, issueId){
					Ext.example.msg('Drop Relation', 'Drop Relation Failure.');
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
	        	type: 'tag',
	        	dataIndex: 'Tag',
	        	options: ['new', 'closed']
	        }]
	    });
	    
	    // create the Data Store
	    var issueTypeStore = new Ext.data.Store({
			fields:[
				{name : 'Id', sortType:'asInt'}
			],
			reader:jsonIssueTypeReader
		});
		
		// Data store
		var store = new Ext.data.Store({
			fields:[
				{name:'Id', type:'int'},
				{name:'Link'},
				{name:'Name'},
				{name:'Type'},
				{name : 'Status'},
				{name : 'Priority'},
				{name : 'Size'},
				{name : 'Handler'},
				{name : 'Deadline'},
				{name : 'Description'},
				{name : 'Tag'},
				{name : 'Attach'}
			],
			reader:jsonWorkItemReader,
			url:'showKanbanBacklogAction.do',
			proxy: new Ext.ux.data.PagingMemoryProxy(null,filters),
			remoteSort : true
		});
		
		// Data store
		var taskStore = new Ext.data.Store({
			fields:[
				{name:'Id', type:'int'},
				{name:'Link'},
				{name:'Name'},
				{name:'Type'},
				{name : 'Size'},
				{name : 'Description'}
			],
			reader:workItemReader
		});
		 
		/* Relation Widget */
		var relationWidget = new Ext.grid.GridPanel({
			id : 'relationGridPanel',
			region : 'center',
			store: taskStore,
	        viewConfig: {
	            forceFit:true
	        },
		    colModel: createTaskColModel(),
		    sm: new Ext.grid.RowSelectionModel({
		    	singleSelect:true
		    }),
		    stripeRows: true,
		    frame: true,
		    height: 200,
		    addRecord:function(record)
		    {
		    	// 將新增的 Issue 新增至 Relation Widget
		    	this.getStore().insert(0, record);
		    	var id = record.data['Id'];
		    	var index = this.getStore().indexOfId(id);
		    	this.getSelectionModel().selectRow(index);
		 		this.getView().focusRow(index);
		    }
		});
		
		/* Detail Widget(for Task) */
		var detailWidget = new Ext.Panel({
			id:'DetailWidget',
			title : 'WorkItem Relation',
			layout:'border',
			region : 'south',
			collapsible : true,
			height : 200,
			// Drop Relation action
			dropRelation:function()
			{
				if(Ext.getCmp('relationGridPanel').getSelectionModel().getSelected() != null)
				{
					var desid = Ext.getCmp('relationGridPanel').getSelectionModel().getSelected().data['Id'];
					var srcId = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					dropRelationWidget.dropRelation(srcId, desid);
				}
			},
			tbar: [
			],bbar: [
			],
			items : [relationWidget]
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
		    	singleSelect:true,
		    	listeners:{
			    	// 選項改變則 request 該 Issue 的資料
			    	rowselect:function(rowSelectionModel, rowIndex, record){
			    		detailWidget.setTitle('User Story #' + record.data['Id'] + ' - ' + record.data['Name']);
			    		// 取得該 Issue 底下所關聯的 Task 資料
						Ext.Ajax.request({
							url:'getRelationByWorkItemID.do?issueID=' + record.data['Id'],
							success:function(response){
								taskStore.removeAll();
					 			taskStore.loadData(response.responseXML);
							},
							failure:function(){
								alert('Failure');
							}
						});
						relationWidget.doLayout();
			    	}
				}
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
			title : 'Kanban Backlog',
			region : 'center',
			importStoryPermission: false,
			addWorkItemPermission:false,
			editWorkItemPermission:false,
			deleteWorkItemPermission:false,
			createRelationPermission:false,
			dropRelationPermission:false,
			showStoryPermission:false,
			tagStoryPermission:false,
			// Add workitem action
			addWorkItem:function()
			{
				// 傳入 IssueTypeID
				createWorkItemWidget.showWidget(document.getElementById("typeID").value, "User Story");
			},
			// Edit workitem action
			editWorkItem:function()
			{
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null)
				{
					var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					editWorkItemWidget.loadEditWorkItem(id, document.getElementById("typeID").value);
				}
			},
			// Delete WorkItem action
			deleteWorkItem:function()
			{
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null)
				{
					var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					deleteWorkItemWidget.deleteWorkItem(id);
				}
			},
			// Assign Relation action
			assignRelation:function()
			{
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null)
				{
					var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					document.location.href  = "<html:rewrite action='/showAssignRelation' />?issueID=" + id;
				}
			},
			// Delete file action
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
								var rs = jsonWorkItemReader.read(response);
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
			tbar: [
				{id:'addWorkItemBtn', disabled:true, text:'Add WorkItem', icon:'images/add3.png', handler: function(){masterWidget.addWorkItem();}},
				{id:'editWorkItemBtn', disabled:true, text:'Edit WorkItem', icon:'images/edit.png', handler:function(){masterWidget.editWorkItem();}},
				{id:'deleteWorkItemBtn', disabled:true, text:'Delete WorkItem', icon:'images/delete.png', handler: function(){masterWidget.deleteWorkItem();}},
				{id:'attachFileBtn', disabled:true, text:'Attach File', icon:'images/paperclip.png', handler:function(){masterWidget.attachFile();}},
				{id:'excelWorkItemBtn', disabled:true, text:'Import / Export WorkItem', icon:'images/excel.png', 
					menu: { 
						items:[{
							text:'Import WorkItem',
							handler:function(){document.location.href  = "./showImportWorkItems.do";},
							icon:'images/import.png'
						},{
							text:'Export WorkItem',
							handler:function(){window.open("<html:rewrite action='/exportWorkItems' />");}, 
							icon:'images/export.png'
						}]}
				}
			],
			items : [productBacklogWidget],
			workitemSelectionChange:function()
			{
				var single = productBacklogWidget.getSelectionModel().getCount()==1;
				if(single)
				{
					this.getTopToolbar().get('editWorkItemBtn').setDisabled(!this.editWorkItemPermission);					
					this.getTopToolbar().get('deleteWorkItemBtn').setDisabled(!this.deleteWorkItemPermission);
					this.getTopToolbar().get('attachFileBtn').setDisabled(!this.editWorkItemPermission);
				}
				else
				{
					this.getTopToolbar().get('editWorkItemBtn').disable();
					this.getTopToolbar().get('deleteWorkItemBtn').disable();
					this.getTopToolbar().get('attachFileBtn').disable();
				}
				
			},
			loadPermission:function(importStoryPermission, addWorkItemPermission, editWorkItemPermission, deleteWorkItemPermission, createRelationPermission, dropRelationPermission, tagStoryPermission, showStoryPermission)
			{
				this.importStoryPermission = importStoryPermission == "true";
				this.addWorkItemPermission = addWorkItemPermission == "true";
				this.editWorkItemPermission = editWorkItemPermission == "true";
				this.deleteWorkItemPermission = deleteWorkItemPermission == "true";

				if(this.addWorkItemPermission){
					this.getTopToolbar().get('addWorkItemBtn').enable();
					this.getTopToolbar().get('excelWorkItemBtn').enable();
				}
			}
		});
		
		// workitem 資料列選擇改變事件
		productBacklogWidget.getSelectionModel().on({'selectionchange':{buffer:10, fn:function(){masterWidget.workitemSelectionChange();}}});
		
		var contentWidget = new Ext.Panel({
			height: 600,
			layout : 'border',
			renderTo: Ext.get("content"),
			items : [masterWidget, detailWidget]
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

<input type="hidden" value="" id="typeID" name="typeID">
<div id = "content">
</div>
<div id="SideShowItem" style="display:none;">showKanbanBacklog</div>