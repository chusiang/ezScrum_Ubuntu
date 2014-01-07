ezScrum.review.IssueCodeReviewLeftSidePanel = new Ext.Panel({
	region		: 'west',		// Left Side
	
	id			: 'ezScrumIssueCodeReviewLeftSidePanel',
	title		: '<font size="3">Files Source Tree</font>',
	collapsible	: true,
	animCollapse: true,
	split		: true,	
	width		: '25%',
	items		: [{ xtype : 'IssueFilesTreePanel', ref: 'IssueFilesTreePanel_refID' }]
});


ezScrum.review.IssueCodeReviewContentPanel = new Ext.TabPanel({
	region		: 'center',		// Right Side
	
	id			: 'ezScrumIssueCodeReviewContentPanel',
	enableTabScroll	: true,
	resetAllPanel: function() {
		this.removeAll();
	}
});


ezScrum.review.IssueCodeReviewMainPanel = Ext.extend(Ext.Panel, {
	id		: 'ezScrumIssueCodeReviewMainPanel',
	layout	: 'border',
	height	: 700,
	initComponent: function() {
        this.items = [
			ezScrum.review.IssueCodeReviewLeftSidePanel,
			ezScrum.review.IssueCodeReviewContentPanel
        ];
        
        ezScrum.review.IssueCodeReviewMainPanel.superclass.initComponent.call(this);
        
		this.IssueCodeReviewLeftSideFilesTreePanel_refID = this.items.items[0];
		this.IssueCodeReviewContentPanel_refID = this.items.items[1];
    },
    setRepositoryPath: function(issueID, SVNManager, Repository_Root, Revision, UserName, Password) {
    	this.IssueCodeReviewLeftSideFilesTreePanel_refID.IssueFilesTreePanel_refID.setRepositoryInfo(issueID, SVNManager, Repository_Root, Revision, UserName, Password);
    }
});
Ext.reg('IssueCodeReviewMainPanel', ezScrum.review.IssueCodeReviewMainPanel);


ezScrum.window.IssueCodeReviewSourceWindow = Ext.extend(ezScrum.layout.Window, {
	title	: 'ezScrum Code Review System',
	width	: 900,
	resizable: false,
	initComponent: function() {
	    this.items = [{
	        xtype	: 'IssueCodeReviewMainPanel',
	        ref		: 'IssueCodeReviewMainPanel_refID'
	    }];
	    
	    ezScrum.window.IssueCodeReviewSourceWindow.superclass.initComponent.call(this);
	},
	showTheWindow: function(issueID, SVNManager, Repository_Root, Revision, UserName, Password) {
		this.IssueCodeReviewMainPanel_refID.IssueCodeReviewContentPanel_refID.resetAllPanel();
		this.IssueCodeReviewMainPanel_refID.setRepositoryPath(issueID, SVNManager, Repository_Root, Revision, UserName, Password);
		this.show();
	}
});

var IssueCodeReviewWindow = new ezScrum.window.IssueCodeReviewSourceWindow();