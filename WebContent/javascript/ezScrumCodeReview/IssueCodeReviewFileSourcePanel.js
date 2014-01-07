ezScrum.review.IssueFilesTreePanel = Ext.extend(Ext.Panel, {
	revision	: -1,
	issueID		: -1,
	manager		: '',
	username	: '',
	password	: '',
	repository_root: '',
	
	initComponent : function() {
		var config = {
			items: {
				items:[{
			    	ref		: '../IssueFilesTree',
			    	xtype	: 'treepanel',
			    	rootVisible	: true,
			    	autoScroll	: true,
			    	height	: '100%',
			    	layout	: 'anchor',
			    	root	: {
			            nodeType: 'async',
			            text	: 'Files',
			            draggable: false,
			            id		: '/'
			        },
			        loader: new Ext.tree.TreeLoader({
			        	dataUrl		: 'getIssueFileSourceTree.do',
			        	listeners	: {
			        		beforeload	: function(tree, node) {
			        			this.IssueFilesTree.getLoader().baseParams.Revision = this.revision;
			        			this.IssueFilesTree.getLoader().baseParams.Repository_Url = this.repository_root;
			        		},
			        		scope: this
			        	}
			    	}),
			    	listeners:{
			    		dblclick : function(node, evt) {
		    				this.renderSourceCodeToContent(node);
			    		},
			    		scope:this
			    	}
				}]
			}
	    }
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ezScrum.review.IssueFilesTreePanel.superclass.initComponent.apply(this, arguments);
	},
	renderSourceCodeToContent: function(node) {
		var tabpanel_obj = Ext.getCmp('ezScrumIssueCodeReviewContentPanel');
		var tab_id = 'IssueCodeReviewTab_' + node.id;
		var showTabPanel = tabpanel_obj.getItem(tab_id);
		
		if (showTabPanel) {
			showTabPanel.show();
		} else {
			tabpanel_obj.add({
				id		: tab_id,
				url		: 'getIssueFileSourceCode.do',
				title	: node.text,
				closable: true,
				xtype	: 'SourceCodePanel',
				manager	: this.manager,
				username: this.username,
				password: this.password,
				path	: node.id,
				revision: this.revision,
				issueID	: this.issueID,
				repos_root: this.repository_root
			}).show();
		}
	},
	setRepositoryInfo: function(issueID, mgr, root, rev, uname, upwd) {
		this.issueID = issueID;
		this.manager = mgr;
		this.repository_root = root;
		this.revision = rev;
		this.username = uname;
		this.password = upwd;
		
		this.IssueFilesTree.getRootNode().reload();
	}
});
Ext.reg('IssueFilesTreePanel', ezScrum.review.IssueFilesTreePanel);