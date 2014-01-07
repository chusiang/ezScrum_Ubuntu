<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>

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

<script type="text/javascript" src="javascript/ux/RowExpander.js"></script>
<script type="text/javascript" src="javascript/ux/PagingMemoryProxy.js"></script>

<link rel="stylesheet" type="text/css" href="javascript/ux/gridfilters/css/GridFilters.css" />
<link rel="stylesheet" type="text/css" href="javascript/ux/gridfilters/css/RangeMenu.css" />
<script type="text/javascript" src="javascript/AjaxWidget/Common.js"></script>

<script type="text/javascript" src="javascript/AjaxWidget/Message.js"></script>
<link rel="stylesheet" type="text/css" href="css/Message.css"/>

<script type="text/javascript">
	var param = document.location.href.split('?');
	var from = param[1].split('=');
	var sprintID, releaseID;
	if (from[0] == "sprintID")
		sprintID = from[1];
	else
		releaseID = from[1];
	
	var otherPageSelected = new Array(); 
	
	/* 定義 Story 資料欄位 */
/*	var Story = Ext.data.Record.create([
	   {name:'Id', sortType:'asInt'}, 'Name', {name:'Importance', sortType:'asInt'}, {name:'Estimation', sortType:'asFloat'}, 'Status', 'Notes', 'HowToDemo', {name:'Release', sortType:'asInt'}, {name:'Sprint', sortType:'asInt'}, 'Tag', 'Link'
	]);*/
	
	/* Story Reader */
	/*
	 *	Example Data
	 *
	 *	<Root>
	 *		<ExistingStories>
	 *			<Id>2388</Id>
	 *			<Link>http://140.124.181.123/mantis/view.php?id=2388</Link>
	 *			<Name>As a user, I can create product backlog</Name>
	 *			<Importance>80</Importance>
	 *			<Estimation>1</Estimation>
	 *			<Status>new</Status>
	 *			<Notes>
	 *				1. Name 不可為空
	 *				2. Importance 必輸為數字
	 *			</Notes>
	 *			<HowToDemo>
	 *				1. 選擇新增 Product Backlog
	 *				2. 輸入資料並新增
	 *				3. 顯示新增後的資料
	 *			</HowToDemo>
	 *			<Release>1</Release>
	 *			<Sprint>1</Sprint>
	 *			<Tag>Req</Tag>
	 *		</Story>
	 *		<Story>
	 *			...
	 *		</Sotry>
	 *	</ExistingStories>
	 */
/*	var myReader = new Ext.data.XmlReader({
	   record: 'Story',
	   idPath : 'Id',
	   successProperty: 'Result'
	}, Story);*/
	
	var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<br><p><b>Name:</b><br /> {Name:nl2br}</p>',
            '<p><b>Notes:</b><br /> {Notes:nl2br}</p>',
            '<p><b>How To Demo:</b><br /> {HowToDemo:nl2br}</p><br />'
        )
    });
	
	var createColModel = function () {
        var columns = [expander,checkBoxSelModel,
		            {dataIndex: 'Id',header: 'Id', width: 50,filterable: true,renderer: function(value, metaData, record, rowIndex, colIndex, store){return "<a href=\"" + record.data['Link'] + "\" target=\"_blank\">" + value + "</a>";}},
		            {dataIndex: 'Tag',header: 'Tag', width: 100},
		            {dataIndex: 'Name',header: 'Name', width: 300},
		            {dataIndex: 'Release',header: 'Release', width: 70},
		            {dataIndex: 'Sprint',header: 'Sprint', width: 70},
		            {dataIndex: 'Value',header: 'Value', width: 70},
		            {dataIndex: 'Estimation',header: 'Estimation', width: 70},
		            {dataIndex: 'Importance',header: 'Importance', width: 70},
		            {dataIndex: 'Status',header: 'Status', width: 70}
		        ];

        return new Ext.grid.ColumnModel({
            columns: columns,
            defaults: {
                sortable: true
            }
        });
    };
    
    var checkBoxSelModel = new Ext.grid.CheckboxSelectionModel({
    	id : 'checkBoxs',
    	width : 30,
    	listeners:{
    		selectionchange: function(){
	   			if (this.getCount() > 0 || otherPageSelected.length > 0)
					Ext.getCmp('SelectExistingStoriesWidget').getTopToolbar().get('addStoryBtn').enable();
				else
					Ext.getCmp('SelectExistingStoriesWidget').getTopToolbar().get('addStoryBtn').disable();
    		}
    	}
    });
    
    var filters = new Ext.ux.grid.GridFilters({
		local:true,
        filters: [{
            type: 'numeric',
            dataIndex: 'Id'
        },{
        	type: 'list',
        	dataIndex: 'Status',
        	options: ['new', 'closed']
        }]
    });
    
    var storyStore = new Ext.data.Store({
    	fields:[
			{name : 'Id', type:'int'},
			{name : 'Link'},
			{name : 'Name'},
			{name : 'Value', type:'int'},
			{name : 'Importance', type:'int'},
			{name : 'Estimation', type:'float'},
			{name : 'Status'},
			{name : 'Release'},
			{name : 'Sprint'},
			{name : 'Notes'},
			{name : 'HowToDemo'},
			{name : 'Tag'}
		],
		reader : myReader,
		proxy : new Ext.ux.data.PagingMemoryProxy()
	});
		
    
    function showMask(targetId, msg)
	{
		new Ext.LoadMask(Ext.get(targetId), {msg:msg}).show();
	}
	
	function hideMask(targetId)
	{
		new Ext.LoadMask(Ext.get(targetId), {msg:msg}).hide();
	}
	
	function successFn(response)
	{
		// check action permission
		ConfirmWidget.loadData(response);
		if (ConfirmWidget.confirmAction()) {
		 	storyStore.proxy.data = response;
			storyStore.load({params:{start:0, limit:17}});
		}
	 	hideMask('ExistingStoriesWidget');
	}
	
	function failureFn()
	{
		alert('Failure');
		hideMask('ExistingStoriesWidget');
	}
	
	
	
	Ext.onReady(function() {
		var existingStoriesWidget = new Ext.grid.GridPanel({
			id : 'ExistingStoriesWidget',
			region : 'center',
			store : storyStore,
			viewConfig: {
	            forceFit:true
	        },
			plugins: [filters, expander],
			colModel: createColModel(),
		    selModel: checkBoxSelModel,
		    stripeRows: true,
		    frame: true
		});
		
		
		var masterWidget = new Ext.Panel({
			id:'SelectExistingStoriesWidget',
			layout:'border',
			region : 'center',
			tbar: [
				{id:'addStoryBtn', text:'Add Story', icon:'images/add3.png', disabled:true,
					handler:function(){	
						var selections = otherPageSelected.concat(masterWidget.getSelections());
						
						Ext.Ajax.request({
							url:'addExistedStory.do',
							params: { 
								sprintID: sprintID,
								releaseID: releaseID,
								selects: selections
							},
							success:function(response){
								// check action permission
								ConfirmWidget.loadData(response);
								if (ConfirmWidget.confirmAction()) {
									forward(sprintID);
								}
							},
							failure:failureFn
						});
						
					}
				},
				{id:'backBtn', text:'Back', icon:'images/back_16.gif',
					handler:function(){
						forward(sprintID);
					}
				}
			],bbar: new Ext.PagingToolbar({
	            pageSize: 17,
	            store: storyStore,
	            displayInfo: true,
	            displayMsg: 'Displaying topics {0} - {1} of {2}',
	            emptyMsg: "No topics to display",
	            items:[
	                '-',
	                {text:'Reload', icon:'images/refresh.png', handler: function(){
						showMask('ExistingStoriesWidget', "Loading...");
						
						Ext.Ajax.request({
							url:'showExistedStory2.do',
							params: 
							{
								sprintID: sprintID,
								releaseID: releaseID
							},
							success:successFn,
							failure:failureFn
						});
					}},
					{text:'Clean Filters', icon:'images/clear2.png', handler:function(){
						Ext.getCmp('ExistingStoriesWidget').filters.clearFilters();
					}},
					{text:'Expand All', icon:'images/folder_out.png', handler:function(){
						
						expander.expandAll();
					}},
					{text:'Collapse All', icon:'images/folder_into.png', handler:function(){
						
						expander.collapseAll();
					}}
	            ],
	            listeners: {
					render: function(c){
						c.refresh.hideParent = true;
						c.refresh.hide();
					},
					beforechange: function(){
						var currentPageSelected = masterWidget.getSelections();
						otherPageSelected = otherPageSelected.concat(currentPageSelected);
					},
					change: function(){
						var currentData = new Array();
						var otherData = new Array();
						for (var i = 0; i < otherPageSelected.length; i++)
						{
							var record = storyStore.getById(otherPageSelected[i]);
							if (record)
								currentData.push(record);
							else
								otherData.push(otherPageSelected[i]);
							
						}
						otherPageSelected = otherData;
						if(checkBoxSelModel.grid)
							checkBoxSelModel.selectRecords(currentData);
					}
				}				
	        }),
	        getSelections:function()
	        {
	        	var records = checkBoxSelModel.getSelections();
	        	var data = new Array();
	        	for(var i = 0; i < records.length; i++)
	        	{
	        		data.push(records[i].data['Id']);
	        	}
	        	return data;
	        },
			items : [existingStoriesWidget]
		});
		
		var contentWidget = new Ext.Panel({
			height: 600,
			layout : 'border',
			title : 'Select Exsiting Stories',
			renderTo: Ext.get("content"),
			items : [masterWidget]
		});
		
		showMask('ExistingStoriesWidget', "Loading...");
		Ext.Ajax.request({
			url:'showExistedStory2.do',
			params: 
			{
				sprintID: sprintID,
				releaseID: releaseID
			},
			success:successFn,
			failure:failureFn
		});
	});	
	
	function forward(sprintID)
	{
		if (from[0] == "sprintID")
			document.location.href  = "./showSprintBacklog.do?sprintID=" + sprintID
		else
			document.location.href  = "./showReleasePlan.do"
	}
	
	
</script>
<div id = "content"></div>
<div id="SideShowItem" style="display:none;"><%=session.getAttribute("currentSideItem") %></div>