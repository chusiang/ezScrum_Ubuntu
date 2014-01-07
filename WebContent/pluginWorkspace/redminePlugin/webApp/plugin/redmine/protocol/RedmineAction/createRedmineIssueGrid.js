Ext.ns('Plugin.redmine.productBacklogToolBar');

Plugin.redmine.productBacklogToolBar.createRedmineIssueGrid = function(){
	resolveIssue = function(){
		var record = redmineIssueGrid.getSelectionModel().getSelected();
		function showResult(btn,text){
		    if( btn == 'yes'){
				var myMask = new Ext.LoadMask(redmineIssueGrid.getEl(), {
				    msg: 'loading...',
				    removeMask: true
				});
				myMask.show();
				var issueID ='';
				if( record != undefined ){
					issueID = record.data.id;
				}
				
		    	Ext.Ajax.request({
		      	    loadMask: true,
		      	    url: 'plugin/redmine/changeRedmineIssueStatus',
		      	    params: {
		      	    	issueID : issueID
		      	    },
		      	    success: function(resp) {
		      	    	//update redmine issue grid
		      	    	myMask.hide();
		      	    	redmineIssueGrid.fireEvent('loadDataEvent');
		      	   } 
		      	});
		    }
		};
		
		Ext.MessageBox.confirm('Confirm', 'issue will be resolved, are you sure?', showResult );
	};
	
	function renderAddStoryIcon(val) {
	    return '<img src='+'pluginWorkspace/redminePlugin/resource/add.png'+' onClick=Plugin.redmine.productBacklogToolBar.addStory() >';
	}

	function renderEditIssueStatusIcon(val) {
	    return val + '<img src='+'pluginWorkspace/redminePlugin/resource/edit.png'+' onClick=resolveIssue() >';
	}
	
    var redmineIssueColumnModel = new Ext.grid.ColumnModel([
        {
   	        header: 'id',
   	        dataIndex: 'id',
   	        width: 70
   	    },
        {
	        header: 'Issue Name',
	        dataIndex: 'name',
	        width: 700
	    },
	    {
	        header: 'Description',
	        dataIndex: 'description',
	        width: 700
	    },
	    {
	        header: 'Status',
	        dataIndex: 'statusName',
	        width: 700,
	        renderer:renderEditIssueStatusIcon
	    },
	    {
	        header: 'Tracker',
	        dataIndex: 'tracker',
	        width: 700
	    },
	    {
	        header: 'story operation',
	        dataIndex: '',
	        renderer:renderAddStoryIcon,
	        width: 500
	    }
	]);
    
    var redmineIssueRecord = Ext.data.Record.create([
        {name: 'id', mapping: 'id'},     // "mapping" property not needed if it's the same as "name"
        {name: 'name',mapping: 'name'},                // This field will use "occupation" as the mapping.
        {name: 'description',mapping: 'description'}, 
        {name: 'statusName',mapping: 'statusName'}, 
        {name: 'tracker',mapping: 'tracker'}, 
    ]);
    
    var redmineIssueReader = new Ext.data.JsonReader({
        totalProperty: "results",    // The property which contains the number of returned records (optional)
        root: "rows",                // The property which contains an Array of record objects
        id: "id"                     // The property within the record object that provides an ID for the record (optional)
    }, redmineIssueRecord);
                                        
	var redmineIssueStore = new Ext.data.Store({
        proxy: new Ext.ux.data.PagingMemoryProxy(),
	    reader: redmineIssueReader
	});
	
    var redmineIssueGrid = new Ext.grid.GridPanel({
	    renderTo: Ext.getBody(),
	    autoHeight:true,
	    loadMask:true,
	    store: redmineIssueStore,
	    cm: redmineIssueColumnModel,
	    sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
	    viewConfig: {
	        forceFit: true
	    },
	    title: "redmine issue",
	    loadMask: true,
	    frame: false,
	    bbar: new Ext.PagingToolbar({
            pageSize: 15,
            store: redmineIssueStore,
            displayInfo: true
        })
	});
    
    return redmineIssueGrid;
};