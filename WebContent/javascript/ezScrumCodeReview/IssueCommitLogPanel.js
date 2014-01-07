ezScrum.IssueCommitLogGrid = Ext.extend(Ext.grid.GridPanel, {
	id		: 'Issue_CommitLog_GridPanel',
	url		: 'GetIssueCommitLog.do',
	bodyStyle	:'width:100%',
	bodyStyle	:'height:100%',
	layout		: 'fit',
	autoWidth	: true,
	autoHeight	: true,
	stripeRows	: true,
	store		: IssueCommitLogStore,
	colModel	: IssueCommitLogColumnModel,
	plugins		: [ IssueCommitLogExpander ],
	viewConfig: {
        forceFit: true
    },
    sm			: new Ext.grid.RowSelectionModel({
    	singleSelect : true
    }),
	loadData: function(issueID) {
		var mask = new Ext.LoadMask(Ext.getBody());
		mask.show();
		
		Ext.Ajax.request({
			url		: this.url,
			scope	: this,
			params	: {issueID: issueID},
			success	: function(response) { this.loadDataModel(response); },
			failure	: function(response) { /* to be fixed */ }
		});
	},
	loadDataModel: function(response) {
		var result = Ext.util.JSON.decode(response.responseText);
		IssueCommitLogStore.loadData(result.CommitLogs);
		
		IssueCommitLogExpander.expandAll();
		
		var mask = new Ext.LoadMask(Ext.getBody());
		mask.hide();
	}
});
Ext.reg('IssueCommitLogGrid', ezScrum.IssueCommitLogGrid);

ezScrum.IssueCommitLogPanel = Ext.extend(Ext.Panel, {
	autoHeight	: true,
	initComponent: function() {
		var config = {
			items: [{
				xtype	: 'IssueCommitLogGrid',
				ref		: 'IssueCommitLogGrid_refID'
			}],
			tbar: [{
				id		: 'showCurrentRevisionFiles',
				text	: 'Show Files',
				ref		: '../ShowFiles_refID',
				disabled: true,
				scope	: this,
				handler	: function () {
					var record = this.IssueCommitLogGrid_refID.getSelectionModel().getSelected();
					var revision = record.get('Revision');
					IssueLinkWindow.showTheWindow_Revision(revision, this.issueID);
				}
			}, {
				id		: 'showIssueLinkSVNWindow',
				text	: 'LinkSVN',
				ref		: '../ShowIssueLinkSVN_refID',
				disabled: false,
				scope	: this,
				handler	: function() {
					IssueLinkWindow.showTheWindow_Link();
				}
			}]
		}
			
		Ext.apply(this, Ext.apply(this.initialConfig, config));		
		ezScrum.IssueCommitLogPanel.superclass.initComponent.apply(this, arguments);
		
		this.IssueCommitLogGrid_refID.getSelectionModel().on({
			'selectionchange': {
				scope	: this,
				fn 		: function() {
					this.ShowFiles_refID.enable();
				}
			}
		});
	},
	loadData: function(issueID) {
		this.issueID = issueID;
		this.IssueCommitLogGrid_refID.loadData(issueID);
	}
});
Ext.reg('IssueCommitLogPanel', ezScrum.IssueCommitLogPanel);