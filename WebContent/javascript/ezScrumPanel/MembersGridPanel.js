Ext.ns('ezScrum');
Ext.ns('ezScrum.window');

ezScrum.MembersGrid = Ext.extend(Ext.grid.GridPanel, {
	id		: 'Members_Page_Panel',
	url		: 'getProjectMembers.do',
	title	: 'Project Members List',
	border	: false,
	bodyStyle	:'width:100%',
	autoWidth	: true,
	autoHeight	: true,
	stripeRows	: true,
	store	: MemberStore,
	colModel	: MemberColumnModel,
	viewConfig: {
        forceFit: true
    },
    
    initComponent : function() {
		 var config = {
		    /* 不對外開放
			tbar: [
		 		{id:'Member_addMemberBtn', disabled:true, text:'Add Member', icon:'images/add3.png', handler: function(){ Ext.getCmp('Members_Page_Panel').addMember(); } },
		 		{id:'Member_deleteMemberBtn', disabled:true, text:'Delete Member', icon:'images/delete.png', handler: function(){ Ext.getCmp('Members_Page_Panel').deleteMember(); } }
		 	]*/
		}
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ezScrum.ProductBacklogPage.superclass.initComponent.apply(this, arguments);
		
	},
	
	addMember: function() {
		AddMember_Widget.showWindow();
	},
	
	deleteMember: function() {

	},    
    
	loadDataModel: function() {
		MainLoadMaskShow();
		
		var obj = this;
		Ext.Ajax.request({
			url: obj.url,
			success : function(response) {
				MainLoadMaskHide(response);
				MemberStore.loadData(response.responseXML);
			},
			failure : function() {
				Ext.example.msg('Server Error', 'Sorry, the connection is failure.');
			}
		});
	}
});

Ext.reg('MembersGrid', ezScrum.MembersGrid);


