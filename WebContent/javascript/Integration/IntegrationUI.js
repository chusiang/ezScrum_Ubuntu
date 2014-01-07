
IntegrationUI = Ext.extend(Ext.Viewport, {
	layout:'border',
    initComponent: function() {
        this.items = [
			{
				xtype:'tabpanel',
				region:'center', 
				activeTab: 0,
				ref:'mainPanel',
				items:[
					{ref:'../projectInfo', title:'Project Infomation'}
				]
			},{
				collapsible: true,
				collapseMode:'mini',
				animCollapse:false,
				animate: false,
				hideCollapseTool:true,
				id:'sidebar',
				ref:'sidebar',
				region: 'west',
				xtype:'treepanel',
				width:200,
				rootVisible:false,
				lines:false,
				split: true,
				root: {
					nodeType: 'async',
		            id: 'root',
		            text: 'Root',
		            expanded:true,
		            children:[
		                {
		                	text:'Product Backlog',
		                	id:'ProductBacklog',
		                	expanded:true,
		                	iconCls:'None',
		                	cls:'forum-ct',
		                	children:[
		                	    {
		                	    	cls:'forum',
				                	iconCls:'icon-forum',
		                	    	text:'Show Product Backlog', 
			    			    	leaf:true
		                	    }, 
			    			    {
		                	    	cls:'forum',
				                	iconCls:'icon-forum',
			    			    	text:'Team Query',
			    			    	id:'TeamQuery',
			    			    	expanded:true,
			    			    	children:[

			    			    	]
			    			    }/*, 
			    			    {
			    			    	cls:'forum',
				                	iconCls:'icon-forum',
			    			    	text:'Personal Query', 
			    			    	leaf:true
			    			    }*/
		                	]
		                },
		                {
		                	text:'Commit Log',
		                	id:'CommitLog',
		                	expanded:true,
		                	iconCls:'None',
		                	cls:'forum-ct',
		                	children:[
		                	    {
		                	    	cls:'forum',
				                	iconCls:'icon-forum',
			    			    	id:'CommitTreeHistory',
			    			    	text:'Show Commit History', 
			    			    	leaf:true
			    			    },
			    			    {
			    			    	cls:'forum',
				                	iconCls:'icon-forum',
			    			    	id:'CommitTreeSetting',
			    			    	text:'SVN Setting', 
			    			    	leaf:true
			    			    }
		                	]
		                },
		                {
		                	text:'Build Result',
		                	id:'BuildResult',
		                	expanded:true,
		                	iconCls:'None',
		                	cls:'forum-ct',
		                	children:[
		                	    {
		                	    	cls:'forum',
				                	iconCls:'icon-forum',
			    			    	id:'BuildHistory',
			    			    	text:'Show Build History', 
			    			    	leaf:true
		                	    }
		                	]
		                }
		            ]
		        },
		        
		        autoScroll: true
			},
			{
				region:'north', 
				bbar:[
				    {
				    	text:'ezScrum Issue Tracking Integration',
				    	xtype:'label'
				    },
					'->',
					{
						text:'Change Project',
						ref:'../../changeProjectBtn'
					}, 
					{
						text:'Logout',
						ref:'../../logoutBtn'
					}
				]
			}
        ];
        
        IntegrationUI.superclass.initComponent.call(this);
    }
});