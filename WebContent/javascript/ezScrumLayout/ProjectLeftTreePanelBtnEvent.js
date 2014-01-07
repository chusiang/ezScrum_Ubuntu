Ext.ns('ezScrum');

ezScrum.ProjectLeftPanel.Event = Ext.extend(ezScrum.ProjectLeftPanel, {
	Page_Index : 0, 
	initComponent: function() {

		ezScrum.ProjectLeftPanel.Event.superclass.initComponent.call(this);
    },
    listeners: {
		click: function(node, event) {
			var obj = this;
			
			if (node.leaf) {
				obj.fireTheEvent(node);			// check which node is, and trigger the mapping event
				obj.notify_Main_Content();
			}
		},
		render: function(){//左邊欄生成後立即將每個頁面中的每個widget註冊監聽session是否過期的事件
			listenSessionForLeftTreeAllWidget();
		}
	},
	fireTheEvent: function(node) {
		var obj = this;
		
		checkUserSession();//在按下其他頁選項時 檢查session是否存在
		
		if (node.parentNode.id == "ProjectConfig") {
			// project configuration event
			obj.event_ProjectConfig(node);
		} else if (node.parentNode.id == "ProjectMgt") {
			// project management event
			obj.event_ProjectMgt(node);
		} else if (node.parentNode.id == "PracticeGuide") {
			// Practice Guide event
			obj.event_PracticeGuide(node);
		} else if (node.parentNode.id == "ezTrackInfo") {
			// ezTrack information event
			obj.event_ezTrack(node);
		} else if (node.parentNode.id == "itsconfig") {
			// ITS configuration event
			obj.event_ITSConfig(node);
		}else if (node.parentNode.id == "pluginConfig"){
			//Plugin configuration
			obj.event_PluginConfig(node);
		}
	},
	event_ProjectConfig: function(node) {
		if (node.id == "ModifyConfigUrl") {
			this.Page_Index = 1;
		} else if (node.id == "MembersUrl") {
			this.Page_Index = 2;
		} else {
			// default is Summary page
			this.Page_Index = 0;
		}
	},
	event_ProjectMgt: function(node) {
		if (node.id == "ProductBacklogUrl") {
			this.Page_Index = 3;
		} else if (node.id == "ReleasePlanUrl") {
			this.Page_Index = 4;
		} else if (node.id == "SprintPlanUrl") {
			this.Page_Index = 5;
		} else if (node.id == "SprintBaclogUrl") {
			this.Page_Index = 6;
		} else if (node.id == "TaskBoardUrl") {
			this.Page_Index = 7;
		} else if (node.id == "RetrospectiveUrl") {
			this.Page_Index = 8;
		} else if (node.id == "UnplannedUrl") {
			this.Page_Index = 9;
		} else if (node.id == "ScrumReportUrl") {
			this.Page_Index = 10;
		} else {
			this.Page_Index = 0;
		}
	},
	event_PracticeGuide: function(node) {
		if (node.id == "DoDUrl") {
			// Page_Index do not change
			// show another page to display DoD Info
			window.open('showIssueDetail.do');
		} else if (node.id == "CodeReviewUrl") {
			// Page_Index do not change
			// show another page to display Code Review Info
			window.open('showCodeReview.do');
		} else {
			// nothing
			return;
		}
	},
	event_ezTrack: function(node) {
		if (node.id == "ViewIssuesUrl") {
			this.Page_Index = 11;
		} else if (node.id == "ManageIssueTypeUrl") {
			this.Page_Index = 12;
		} else if (node.id == "ezTrackReportUrl") {
			this.Page_Index = 13;
		} else {
			this.Page_Index = 0;
		}
	},
	event_ITSConfig: function(node) {
		if (node.id == "ITSmodifyUrl") {
			this.Page_Index = 14;
		} else {
			this.Page_Index = 0;
		}
	},
	event_PluginConfig: function(node){
		if(node.id == "PluginUrl"){
			this.Page_Index = 15;
		}
	},
	notify_Main_Content: function() {
		Ext.getCmp('content_panel').layout.setActiveItem(this.Page_Index);
	}
});