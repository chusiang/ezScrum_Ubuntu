ezScrum.review.FilesTreePanel = Ext.extend(Ext.Panel, {
	initComponent : function() {
		var config = {
			items: {
				items:[{
			    	ref		: '../FilesTree',
			    	xtype	: 'treepanel',
			    	autoScroll	: true,
			    	height	: '100%',
			    	layout	: 'anchor',
			    	root	: {
			            nodeType: 'async',
			            text	: '/',
			            draggable: false,
			            id		: '/'
			        },
			        loader: new Ext.tree.TreeLoader({
			        	dataUrl:'getFolderList.do',
			        	listeners:{
			        		beforeload:function(tree, node) {
			        			this.FilesTree.getLoader().baseParams.manager = this.manager;
			        			this.FilesTree.getLoader().baseParams.repository = this.repository;
			        			this.FilesTree.getLoader().baseParams.path = node.id;
			        			this.FilesTree.getLoader().baseParams.username = this.username;
			        			this.FilesTree.getLoader().baseParams.password = this.password;
			        		},
			        		scope:this
			        	}
			    	}),
			    	listeners:{
			    		dblclick : function(node, evt) {
			    			if (node.attributes['cls'] == 'file') {
			    				this.renderSourceCodeToContent(node);
			    			}
			    		},
			    		scope:this
			    	}
				}]
			}
	    }
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ezScrum.review.FilesTreePanel.superclass.initComponent.apply(this, arguments);
		
		this.FilesTree.Owner = this;
	},
	setProperty: function(manager, repository, location, username, password) {
		this.manager = manager;
		this.repository = repository;
		this.username = username;
		this.password = password;
		
		this.FilesTree.getRootNode().setText(this.repository);
		this.FilesTree.getRootNode().setId(this.repository);
		this.FilesTree.getRootNode().reload();
	},
	renderSourceCodeToContent: function(node) {
		var tabpanel_obj = Ext.getCmp('ezScrumReviewContentPanel');
		var tab_id = 'Tab_' + node.id;
		var showTabPanel = tabpanel_obj.getItem(tab_id);
		
		if (showTabPanel) {
			showTabPanel.show();
		} else {
			tabpanel_obj.add({
				id		: tab_id,
				url		: 'getFileSourceCode.do',
				title	: node.text,
				closable: true,
				xtype	: 'SourceCodePanel',
				manager	: this.manager,
				username: this.username,
				password: this.password,
				path	: node.id				
			}).show();
		}
	}
});
Ext.reg('FilesTreePanel', ezScrum.review.FilesTreePanel);