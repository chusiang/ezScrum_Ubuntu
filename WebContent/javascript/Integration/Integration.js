
Integration = Ext.extend(IntegrationUI, {
	id:'ddd',
	constructor : function(config){
		config = config || {};
		this.initProjectId = config.projectId;
		this.initIssueId = config.issueId;
		Integration.superclass.constructor.call(this);
	},
	
    initComponent: function() {
		Integration.superclass.initComponent.call(this);
		
		this.loginWidget = new LoginWidget();
		this.logTpl = new Ext.XTemplate('<tpl for=".">==================\r\nRevision: {Revision}\r\n\r\n','Author: {Author}\r\n\r\n','Log: \r\n{Log}\r\n\r\n','Files: \r\n{Files}\r\n\r\n','Change Time: {ChangeTime}\r\n\r\n</tpl>');
		//this.selectProjectWidget = new SelectProjectWidget();
		
		/* 
		 * status init > Login()
		 * status selectProject > SelectProject()
		 * status done
		 */
		this.status = 'init';
		
		this.Login();

		this.logoutBtn.on('click', this.Logout, this);
		this.changeProjectBtn.on('click', this.ShowSelectProjectWidget, this);
		this.sidebar.on('click', this.sidebar_click, this);

    },
    
    sidebar_click:function(node, evt)
    {
    	
    	if(node.text == "Show Product Backlog")
    		this.ShowQueryResult(node, evt);
    	else if(node.text == "Show Commit History")
    		this.ShowCommitLogList(node, evt);
    	else if(node.text == "SVN Setting")
    		this.ShowSvnSettingWidget(node, evt);
    	else if(node.text == "Show Build History")
    		this.ShowBuildResultList(node, evt);
    	else if(node.id == "CreateTeamQueryAction")
    		this.CreateTeamQueryAction(node, evt);
    	else if(node.attributes['Type'] == 'TeamQuery')
    		this.ShowQueryResult(node, evt);
    	else
    		evt.stopEvent();
    },
    
    CreateTeamQueryAction:function(node, evt)
    {
    	tab = this.mainPanel.add({
			xtype:'QueryPanel',
			title:'Create Team Query',
			id:'CreateTeamQueryPanel',
			layout:'border',
			closable:true,
		});
    	
    	tab.on('CreateSuccess', function(){this.loadTeamQuery(); this.mainPanel.remove('CreateTeamQueryPanel');}, this);
    	
    	tab.show();
    },
    
    ShowBuildResultList:function(node, evt){

    	
		var tab = this.mainPanel.get('BuildResultTab');

		if(!tab)
		{
			tab = this.mainPanel.add({
				xtype:'BuildResultPanel',
				title:'Build Result',
				layout:'border',
				closable:true,
				id:'BuildResultTab'
			});
		}
	
		tab.show();
    },
    
    ShowSvnSettingWidget:function(node, evt)
    {
    	var obj = this;
    	var widget = new LinkSVNWidget({
    		listeners:{
    			LinkSuccess:function(manager, repository, location, username, password)
    			{
    				var tab = obj.mainPanel.add({
    					xtype:'SvnConfigPanel',
    					title:'SVN Setting',
    					closable:true,
    					id:'SVNSetting',
    					manager:manager,
    					repository:repository,
    					location:location,
    					username:username,
    					password:password,
    					layout:'fit',
    					parent:obj
    				});
    				tab.show();
    				this.close();
    			}
    		}
    	});
    	
    	widget.show();
    	evt.stopEvent();
    },
    
    Logout: function()
	{
		var rem = [];
		this.mainPanel.items.each(function(i){rem.push(i);});
		for(var i = 1; i < rem.length; i++)
		{
			this.mainPanel.remove(rem[i]);
		}
		var obj = this;
		Ext.Ajax.request({
			url:'logout.do',
			success:function(response){
				obj.Login();
			}
		});
	},
	
    ShowIssueDetail:function ShowIssueDetail(issueId)
	{
		if(!issueId)
			return ;

		tabId = "Issue"+issueId;
		var tab = this.mainPanel.get(tabId);
		if(!tab)
		{
			tab = this.mainPanel.add({title:"Loading...", id:tabId, closable:true, layout:'vbox'});
		}
		else
		{
			tab.show();
			return ;
		}
		tab.show();
		var obj = this;
		Ext.Ajax.request({
			url:'getIssueDetail.do',
			success:function(response){
				
				
				var json = Ext.util.JSON.decode(response.responseText);

				if(json.success == false)
				{
					alert(json.message);
					return ;
				}		
				var title = json.Issue.Category + " ID: " + json.Issue.Id;		
				tab.setTitle(title);	
				if(json.Issue.Category == "Story")
				{
					//storyTpl.overwrite(tab.body, json);
					var storyForm = new StoryFormPanel();
					tab.add(storyForm);
					storyForm.getForm().setValues(json.Issue);
					var box = storyForm.getForm().findField('CommitLogs');
					box.setValue(obj.logTpl.applyTemplate(json.Issue.CommitLogs));
					tab.doLayout();
				}
				else if(json.Issue.Category == "Task")
				{
					//taskTpl.overwrite(tab.body, json);
					var taskForm = new TaskFormPanel();
					tab.add(taskForm);
					taskForm.getForm().setValues(json.Issue);
					var box = taskForm.CommitLogPanel;
					box.setCommitLog(json.Issue.CommitLogs);
					tab.doLayout();
				}
			},
			params:{issueId:issueId}
		});
	},
	
	ShowLoginForm: function()
	{
		var obj = this;
		var loginWidget = new LoginWidget({
			listeners:{
				LoginSuccess:function(){
					this.close();
					obj.SelectProject(obj.initProjectId);
				},
				LoginFailure:function(msg){
					alert(msg);
				}
			}
		});
		
		loginWidget.show();
	},
	
	Login:function()
	{
		Ext.Ajax.request({
			url:'isLogin.do',
			success:function(response){
				var jsonRes = Ext.util.JSON.decode(response.responseText);
				if(jsonRes.success == true)
				{
					this.SelectProject(this.initProjectId);
				}
				else
				{
					this.ShowLoginForm();
				}
			},
			scope:this
		});
	},
	
	ShowSelectProjectWidget: function()
	{
		var obj = this;
		var selectProjectForm = new SelectProjectWidget({
			listeners:{
				SelectProject:function(projectId)
				{
					obj.SelectProject(projectId);
					this.hide();
					//obj.init();
				}
			}
		});
		selectProjectForm.show();
	},
	
	SelectProject:function(projectId)
	{
		var obj = this;
		if(!projectId || projectId == "")
		{
			Ext.Ajax.request({
				url:'isSelectProject.do',
				success:function(response){
					var json = Ext.util.JSON.decode(response.responseText);
					if(json.success == false)
					{
						obj.ShowSelectProjectWidget();
						return ;
					}
					obj.init();
				},
				params:{project:projectId}
			});
			
			return ;
		}
		Ext.Ajax.request({
			url:'selectProject.do',
			success:function(response){
				var json = Ext.util.JSON.decode(response.responseText);
				if(json.success == false)
				{
					alert(json.message);
					return ;
				}
				obj.init();
				var rem = [];
				obj.mainPanel.items.each(function(i){rem.push(i);});
				for(var i = 1; i < rem.length; i++)
				{
					obj.mainPanel.remove(rem[i]);
				}
				
				obj.ShowIssueDetail(obj.initIssueId);
				obj.initIssueId = "";

				
				
			},
			params:{project:projectId}
		});
	},
	
	ShowCommitLogList:function (node, evt)
	{
		var obj = this;
		var tab = obj.mainPanel.get('CommitTab');
		
		if(!tab)
		{
			tab = obj.mainPanel.add({id:'CommitTab', title:'Commit Logs', xtype:'CommitLogPanel', closable:true, autoScroll:true});
		}
		else
		{
			tab.reloadData();
		}
		tab.show();

	},
	
	ShowQueryResult:function (node, evt)
	{
		var id = node.attributes['queryId'] || "-1";
		evt.stopEvent();
		var obj = this;
		var colMode = new Ext.grid.ColumnModel({
			defaults : {width: 120, sortable: true},
			columns : [
				{id:'Id', header:'Id', dataIndex:'Id'},
				{id:'Name', header:'Name', dataIndex:'Name'},
				{id:'Status', header:'Status', dataIndex:'Status'}
			]
		});
		var url = 'getIssueByQuery.do?queryId=' + id;
		var store = new Ext.data.JsonStore({
			url:url,
			autoLoad:true,
			root:'Issues',
			idProperty:'Id',
			fields: ['Id', 'Name', 'Status']
		});

		var grid = new Ext.grid.GridPanel({
			cm:colMode,
			store:store,
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			listeners:{
				rowdblclick:function(grid, index, evt)
				{
					var issueId = grid.getStore().getAt(index).data['Id'];
					obj.ShowIssueDetail(issueId);
				}
			},
			viewConfig: {
		        forceFit: true
			}
		});

		var tab = this.mainPanel.get('QueryTab');
		if(!tab)
		{
			tab = this.mainPanel.add({
				title:'Query Result',
				layout:'fit',
				closable:true,
				id:'QueryTab',
				items:[grid]
			});
		}
		else
		{
			tab.removeAll();
			tab.add(grid);
			tab.doLayout();
		}
		
		tab.show();
	},
	
	init:function()
	{
		this.loadTeamQuery();
		this.loadProjectInfo();
	},
	
	loadProjectInfo:function()
	{
		Ext.Ajax.request({
			url:'getBuildSummary.do',
			success:function(response){
				//alert(response.responseText);
				var tpl = new Ext.XTemplate(
				    '<tpl for="BuildResults">', '<p><div style="width:16px;height:16px;display:block;float:left;" class="{.:this.image()}" ></div>Build:{Id}, Total Test: {TotalTest}, Pass: {PassTest}, Failed: {FailedTest} Coverage: {LineCoverage}, {BuildTime}</p>', '</tpl>', '<image src="getBuildReport.do" width="560" height="420" />'
				);
				tpl.image = function(data)
				{
					if(data.BuildResult && data.TestResult)
						return "buildSuccess";
					else if(data.BuildResult)
						return "testFailed";
					return "buildFailed";
				};
				tpl.overwrite(this.projectInfo.body, Ext.decode(response.responseText));
			},
			scope:this
			
		});
	},
	
	loadTeamQuery:function()
	{
		var teamQuery = this.searchNode(this.sidebar.getRootNode(), 'id', 'TeamQuery', true);
		this.removeChilds(teamQuery);
		Ext.Ajax.request({
			url:'getTeamQuery.do',
			success:function(response){this.loadTeamQueryData(teamQuery, response)},
			scope:this
		});
	},
	
	loadTeamQueryData:function(node, data)
	{
		
		var obj = Ext.decode(data.responseText);
		var queries = obj.TeamQuery;
		for(var i = 0; i < queries.length; i++)
		{
			node.appendChild({
				text:queries[i].Name,
				queryId:queries[i].Id,
				cls:'forum',
            	iconCls:'component_view',
		    	leaf:true,
		    	Type:'TeamQuery'
			});
		}
		
		node.appendChild({
	    	cls:'forum',
        	iconCls:'component_add',
	    	id:'CreateTeamQueryAction',
	    	text:'Create Team Query', 
	    	removeable:false,
	    	leaf:true
	    });
		
		node.expand();
	},
	
	// private use
	removeChilds:function(node)
	{
		var n;
	    while((n = node.firstChild)){
	    	node.removeChild(n, false);
	    }
	},
	
	// private use
	searchNode:function(node, attribute, value, deep)
	{
		var childs = node.childNodes;
		for(var i = 0; i < childs.length; i++)
		{
			if(childs[i].attributes[attribute] == value)
				return childs[i];
			else if (deep)
			{
				var res = this.searchNode(childs[i], attribute, value, deep);
				if(res != null)
					return res;
			}
		}
		return null;
	}, 
	
	showImpact:function(impact)
	{
		var obj = this;
		var colMode = new Ext.grid.ColumnModel({
			defaults : {width: 120, sortable: true},
			columns : [
				{id:'Id', header:'Id', dataIndex:'Id'},
				{id:'Name', header:'Name', dataIndex:'Name'},
				{id:'Status', header:'Status', dataIndex:'Status'}
			]
		});
		var url = 'getIssueByImpact.do';
		var store = new Ext.data.JsonStore({
			url:url,
			baseParams:{impact:impact},
			autoLoad:true,
			root:'Issues',
			idProperty:'Id',
			fields: ['Id', 'Name', 'Status']
		});

		var grid = new Ext.grid.GridPanel({
			cm:colMode,
			store:store,
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			listeners:{
				rowdblclick:function(grid, index, evt)
				{
					var issueId = grid.getStore().getAt(index).data['Id'];
					obj.ShowIssueDetail(issueId);
				}
			},
			viewConfig: {
		        forceFit: true
			}
		});

		var tab = this.mainPanel.get('ImpactTab');
		if(!tab)
		{
			tab = this.mainPanel.add({
				title:'Impact Result',
				layout:'fit',
				closable:true,
				id:'ImpactTab',
				items:[grid]
			});
		}
		else
		{
			tab.removeAll();
			tab.add(grid);
			tab.doLayout();
		}
		
		tab.show();
	}
});