//ezScrum.review.TopPanel = new Ext.Panel({
//	region		: 'north',		// Top Side
//	
//	id			: 'ezScrumReviewTopPanel',
//	collapsible	: true,
//	animCollapse: true,
//	height		: 100,
//	layout		: 'fit',
//	items		: [{html: 'Top Info, to be continue'}]
//});

ezScrum.review.LeftSidePanel = new Ext.Panel({
	region		: 'west',		// Left Side
	
	id			: 'ezScrumReviewLeftSidePanel',
	title		: '<font size="4">Files Source Tree</font>',
	collapsible	: true,
	animCollapse: true,
	split		: true,	
	width		: '20%',
	items		: [{ ref: 'FilesTreePanel_refID', xtype: 'FilesTreePanel' }]
});

ezScrum.review.ContentPanel = new Ext.TabPanel({
	region		: 'center',		// Right Side
	
	id			: 'ezScrumReviewContentPanel',
	enableTabScroll	: true
});

ezScrum.review.MainUI = Ext.extend(Ext.Viewport, {
	id		: 'ezScrumReviewMainUI',
	title	: 'ezScrum Code Review System',
	layout	: 'border',
	initComponent: function() {
        this.items = [
			ezScrum.review.LeftSidePanel,
//			ezScrum.review.TopPanel,
			ezScrum.review.ContentPanel,
			ezScrum.FooterPanel			// src="javascript/ezScrumPanel/Footer_Panel.js"
        ];
        
        ezScrum.review.MainUI.superclass.initComponent.call(this);
        
		this.LeftSideFilesTreePanel_refID = this.items.items[0];
//		this.setRepositoryPath();		// mark for developing, next line of code should be delete later
		this.LeftSideFilesTreePanel_refID.FilesTreePanel_refID.setProperty("http://140.124.181.153/SVNManager", "http://140.124.181.153/svn/repos/project/trunk/Scrum/src/Test/", "", "taoyu", "taoyu");		// for easily testing
    },
    setRepositoryPath: function() {
    	var MainObj = this;
    	var widget = new LinkSVNWidget({
    		listeners:{
    			LinkSuccess : function(manager, repository, location, username, password) {
    				MainObj.LeftSideFilesTreePanel_refID.FilesTreePanel_refID.setProperty(manager, repository, location, username, password);
    				this.close();
    			}
    		}
    	});
    	widget.show();
    }
});