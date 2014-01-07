var ViewIssueTabForm = {
	xtype: 'tabpanel',
	activeTab: 0,
	items:[
		ScrumIssueMasterPanel, customIssueMasterPanel
	]		
}

var ViewIssuesPage = new Ext.Panel({
	id			: 'ViewIssues_Page',
    autoScroll	: true,
    layout		: 'fit',
    frame		: false,
    items:[
         ViewIssueTabForm
	]
});
