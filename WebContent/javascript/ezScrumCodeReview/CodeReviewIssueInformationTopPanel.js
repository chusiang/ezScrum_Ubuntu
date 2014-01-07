ezScrum.review.IssueInformationTopPanel = Ext.extend(Ext.Panel, {
	layout		: 'fit',
	autoscroll	: true,
	initComponent : function() {
		var config = {
			items: [{
				xtype	: 'fieldset',
				title	: 'Issue Info- ID: <a href="./">65</a>',
				collapsible	: false,
				columnWidth	: 0.5,
				layout		:'form',
				labelAlign	: 'right',
				items 	:[{
					xtype	: 'textfield',
			    	readOnly: true,
			    	anchor	: '80%',
			    	value	: 'Issue Name',
	                fieldLabel	: 'Issue Name'
				}, {
					xtype	: 'textfield',
			    	readOnly: true,
			    	anchor	: '80%',
			    	value	: 'Handler',
	                fieldLabel	: 'Handler'
				}, {
					xtype	: 'textfield',
			    	readOnly: true,
			    	anchor	: '80%',
			    	value	: 'true',
	                fieldLabel	: 'Status'
				}]
			}]
	    }
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ezScrum.review.IssueInformationTopPanel.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('IssueInfoTopPanel', ezScrum.review.IssueInformationTopPanel);