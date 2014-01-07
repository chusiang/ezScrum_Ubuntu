Ext.ns('Plugin.redmine.productBacklogToolBar');
Plugin.redmine.productBacklogToolBar.createEzScrumStoryGrid = function(){
	
    var ezScrumStoryColumnModel = new Ext.grid.ColumnModel([
        {
   	        header: 'id',
   	        dataIndex: 'id',
   	        width: 70
   	    },
        {
	        header: 'Story name',
	        dataIndex: 'name',
	        width: 700
	    },
	    {
	        header: 'value',
	        dataIndex: 'value',
	        width: 700
	    },
	    {
	        header: 'estimation',
	        dataIndex: 'estimation',
	        width: 700
	    },
	    {
	        header: 'importance',
	        dataIndex: 'importance',
	        width: 700
	    },
	    {
	        header: 'Note',
	        dataIndex: 'notes',
	        width: 700
	    },
	    {
	        header: 'Status',
	        dataIndex: 'status',
	        width: 700
	    },
	    {
	        header: 'Tag',
	        dataIndex: 'tag',
	        width: 700
	    }
	]);
    
    var ezScrumStoryRecord = Ext.data.Record.create([
        {name: 'id', mapping: 'id'},     // "mapping" property not needed if it's the same as "name"
        {name: 'name',mapping: 'name'},                // This field will use "occupation" as the mapping.
        {name: 'notes',mapping: 'notes'}, 
        {name: 'value',mapping: 'value'},
        {name: 'estimation',mapping: 'estimation'}, 
        {name: 'importance',mapping: 'importance'}, 
        {name: 'status',mapping: 'status'}, 
        {name: 'tag',mapping: 'tag'}
    ]);
    
    var ezScrumStoryReader = new Ext.data.JsonReader({
        totalProperty: "results",    // The property which contains the number of returned records (optional)
        root: "rows",                // The property which contains an Array of record objects
        id: "id"                     // The property within the record object that provides an ID for the record (optional)
    }, ezScrumStoryRecord);
                                        
	var ezScrumStoryStore = new Ext.data.Store({
        proxy: new Ext.ux.data.PagingMemoryProxy(),
	    reader: ezScrumStoryReader
	});
	
    var ezScrumStoryGrid = new Ext.grid.GridPanel({
	    renderTo: Ext.getBody(),
	    loadMask:true,
	    store: ezScrumStoryStore,
	    height		: 300,
	    cm: ezScrumStoryColumnModel,
	    sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
	    viewConfig: {
	        forceFit: true
	    },
	    title: "ezScrum story",
	    loadMask: true,
	    frame: false,
	    bbar: new Ext.PagingToolbar({
            pageSize: 15,
            store: ezScrumStoryStore,
            displayInfo: true
        })
	});
    return ezScrumStoryGrid ;
};