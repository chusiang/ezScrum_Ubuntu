<%@ page contentType="text/html; charset=utf-8"%>

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
	<script type="text/javascript" src="javascript/AjaxWidget/CommonFormVTypes.js"></script>
	<script type="text/javascript" src="javascript/AjaxWidget/Message.js"></script>	
	<script type="text/javascript" src="javascript/CustomWidget/Common.js"></script>
	<script type="text/javascript" src="javascript/CustomWidget/CreateIssueReportBackWidget.js"></script>
	<script type="text/javascript" src="javascript/CustomWidget/AddCommentWidget.js"></script>
	<script type="text/javascript" src="javascript/ezScrumLayout/ezScrumLayoutSupport.js"></script>
	<script type="text/javascript" src="javascript/ezScrumSharedComponent/AttachFileWindow.js"></script>	
			
	<link rel="stylesheet" type="text/css" href="javascript/ux/gridfilters/css/GridFilters.css" />
    <link rel="stylesheet" type="text/css" href="javascript/ux/gridfilters/css/RangeMenu.css" />
    <link rel="stylesheet" type="text/css" href="javascript/ux/css/RowEditor.css" />
    <link rel="stylesheet" type="text/css" href="javascript/ux/fileuploadfield/css/fileuploadfield.css"/>
    <link rel="stylesheet" type="text/css" href="css/Message.css"/>
    

<script type="text/javascript">
	Ext.ns('ezScrum');
	
	function viewIssue(path){
		window.open(path)
	}
	
	//expander
	var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.XTemplate(
            '<br><p><b>Name:</b><br /> {Name:nl2br}</p>',
            '<tpl if="Description"><p><b>Description:</b><br /> {Description:nl2br}</p></tpl>',
            
            '<tpl for="AttachFileList"><p><b>Attach Files:</b><br /><a href="{DownloadPath}" target="_blank">{FileName}</a> <tpl if="this.hasPermission()"></tpl><br /></tpl>',
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
        	options: ['New', 'Closed']
        }]
    });    

	//the model of column
    var createColModel = function () {
        var columns = [expander,
		            {dataIndex: 'Id',header: 'Id', width: 30,filterable: true,renderer: function(value, metaData, record, rowIndex, colIndex, store){var link = "<a href=\"#\" onclick = \"javascript:viewIssue('"+record.data['Link'].toString()+"')\" >" + value + "</a>"; return link;}},
		            {dataIndex: 'ProjectName',header: 'Project Name', width: 70},
		            {dataIndex: 'Handled',header: 'Handled', width: 30},
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
			{name : 'ProjectName'},
			{name : 'Link'},
			{name : 'Handled'},
			{name : 'Name'},
			{name : 'Status'},
			{name : 'Priority'},
			{name : 'Handler'},
			{name : 'Description'},
			{name : 'Attach'},
			{name : 'Category'}
		],
		reader: jsonCustomIssueReader,
		url:'ajaxShowReportIssues.do',
		proxy: new Ext.ux.data.PagingMemoryProxy(null,filters),
		remoteSort : true,
		//預設ID由大排到小
		sortInfo: {
	        field: 'Id',
	        direction: 'DESC'
    	}
		
	});
	
	// the bar menu is used to the dynamic add issue 	
	var barMenu = new Ext.menu.Menu({
		id: 'basicMenu'
	}); 
		
	// Page size
	var pageSize = 25;
	
	// report a new issues
	var IssueReportWidget = new ezScrum.ShowIssueReportBackWidget({
		listeners	: {
				CreateSuccess	: function() {
					this.hide();
					Ext.MessageBox.alert('Report Issue Success', 'Thanks for report a custom issue.');
					//reload
					Ext.Ajax.request({
						url:'ajaxShowReportIssues.do',
						success:function(response){
							store.proxy.data = response;
							store.proxy.reload = true;
							store.reload();
						}
					});

			},
				CreateFailure	: function() {
				Ext.MessageBox.alert('Report Issue Failure', 'Sorry, report a custom issue failure. Please try latter.');
			},
				ShowSuccess		: function() {
				this.show();
			},
				ShowFailure		: function() {
				Ext.MessageBox.alert('Report Issue Failure', 'Sorry, there is no project can report it.');
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

	/* Grid View */
	Ext.onReady(function() {
		Ext.QuickTips.init();

		function LoadData(option){
			//讀取回報的issue
			Ext.Ajax.request({
				url:'ajaxShowReportIssues.do',
				success:function(response){
					store.proxy.data = response;
					store.proxy.reload = true;
					if(!option)
						store.load({params:{start:0, limit:pageSize}});
					else 
						store.reload();
				}
			});
			//讀取存在哪些project 並加入至filter
			Ext.Ajax.request({
				url			: 'AjaxShowIssueReportBack.do',
				success		: function(response) {
					var result = ProjectReader.read(response);
					var projectMenu = [];
					var count = result.totalRecords;
					for(var i = 0; i< count; i++){
						var record = result.records[i];
						projectMenu.push(record.data['Name']);
					}
					filters.addFilter({type: 'list', dataIndex: 'ProjectName', options: projectMenu});
				}
			});
		/*
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
			*/
		}
		
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
				// enable the attachBtn 
				masterWidget.selectionChange();
				
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
			entryPoint : 'ReportIssues',
			//report a Issue
			reportIssue: function(){
				IssueReportWidget.showWidget();
			},
			//Add Comment
			addComment: function(){
				var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
				var projectName = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['ProjectName'];
				addCommentWidget.showWidget(id, projectName);
			},
			attachFile:function()
			{
				if(Ext.getCmp('gridPanel').getSelectionModel().getSelected() != null) {
					var id = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['Id'];
					var projectName = Ext.getCmp('gridPanel').getSelectionModel().getSelected().data['ProjectName'];
					
					AttachFile_Window.attachFile_External(masterWidget, id, projectName);
				}
			},
			notify_AttachFile: function(success, record, msg) {
				AttachFile_Window.hide();
				
				if(success) {
					Ext.example.msg('Attach File', 'Attach File Success.');
					productBacklogWidget.updateRecord(record);
				}else{
					Ext.example.msg('Attach File', msg);
				}
			},
			tbar: [
				{id:'excelStoryBtn', text:'Add Issue', icon:'images/add3.png', handler:function(){masterWidget.reportIssue();}},
				{id:'addCommentBtn', disabled:false, text:'Add Comment', icon:'images/chatadd_16.png', handler:function(){masterWidget.addComment();}},
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
			
			selectionChange:function()
			{
				this.getTopToolbar().get('attachFileBtn').enable();
			}
		});
		
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
<div id = "content">
</div>
