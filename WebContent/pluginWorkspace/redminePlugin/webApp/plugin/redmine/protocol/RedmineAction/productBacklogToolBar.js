Ext.ns('Plugin.redmine.productBacklogToolBar');

Plugin.redmine.productBacklogToolBar.redmineBtnHandler = function(btn) {
	var redmineIssueGrid = Plugin.redmine.productBacklogToolBar.createRedmineIssueGrid();
	var ezScrumStoryGrid = Plugin.redmine.productBacklogToolBar.createEzScrumStoryGrid();
	
	redmineIssueGrid.on('cellclick',function(){
		ezScrumStoryGrid.fireEvent('loadDataEvent');
	});
	
	redmineIssueGrid.on('loadDataEvent',function(){
		var obj = this;
		var myMask = new Ext.LoadMask(redmineIssueGrid.getEl(), {
		    msg: 'loading...',
		    removeMask: true
		});
		myMask.show();
		Ext.Ajax.request({
			scope	: this,
			url		: 'plugin/redmine/getRedmineIssues', 
			success : function(response) { 
				obj.store.proxy.data = response;
				obj.store.proxy.reload = true;// assert reload is true
				obj.store.load({params:{start:0, limit:15}});
				myMask.hide();
				ezScrumStoryGrid.fireEvent('loadDataEvent');
			},
			failure : function() {
				Ext.example.msg('Server Error', 'Sorry, the connection is failure.');
			}
		});
	});
	
	ezScrumStoryGrid.on('loadDataEvent',function(){
		var myMask = new Ext.LoadMask(ezScrumStoryGrid.getEl(), {
		    msg: 'loading...',
		    removeMask: true
		});
		myMask.show();
		var obj = this;
		var record = redmineIssueGrid.getSelectionModel().getSelected();
		var issueID ='';
		if( record != undefined ){
			issueID = record.data.id ;
		}
		Ext.Ajax.request({
			scope	: this,
			url		: 'plugin/redmine/getEzScrumStories', 
			params  :{
				issueID : issueID
			},
			success : function(response) { 
				obj.store.proxy.data = response;
				obj.store.proxy.reload = true;// assert reload is true
				obj.store.load({params:{start:0, limit:15}});
				obj.getView().refresh();
				myMask.hide();
	    		
			},
			failure : function() {
				Ext.example.msg('Server Error', 'Sorry, the connection is failure.');
			}
		});
	});
    
    Plugin.redmine.productBacklogToolBar.RedmineIssueWindow = new Ext.Window({
    	items:[redmineIssueGrid,ezScrumStoryGrid],
    	layout 		: 'fit',
    	autoScroll	: true,
    	constrain	: true,
    	width		: 800,
    	autoHeight	: true,
    	modal		: true,
    	listeners:{
    		beforerender:function(){
    			redmineIssueGrid.fireEvent('loadDataEvent');
    		}
    	}
    });
    
    Plugin.redmine.productBacklogToolBar.RedmineIssueWindow.show();

};


Plugin.redmine.productBacklogToolBar.redmineBtnPlugin = Ext.extend(Ext.util.Observable,{
	
	init:function(cmp){
		this.hostCmp = cmp;
		this.hostCmp.on('render', this.onRender, this, {delay:200});
	},
	
	onRender: function(){
		var redmineBtn = new Ext.Button({
		    text    : 'add redmine issue',
		    handler : Plugin.redmine.productBacklogToolBar.redmineBtnHandler
		});
		
		this.hostCmp.add(  
				redmineBtn
		);
		this.hostCmp.doLayout();
	}
});

Ext.preg('redmineBtnPlugin', Plugin.redmine.productBacklogToolBar.redmineBtnPlugin );