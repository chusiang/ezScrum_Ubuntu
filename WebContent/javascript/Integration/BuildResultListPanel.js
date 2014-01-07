BuildResultListPanel = Ext.extend(Ext.grid.GridPanel, {
	initComponent:function() {
	
		var colMode = new Ext.grid.ColumnModel({
			defaults : {width: 120, sortable: true},
			columns : [
				{id:'Id', header:'Id', dataIndex:'Id'},
				{id:'BuildResult', header:'Build Result', dataIndex:'BuildResult'},
				{id:'BuildTime', header:'Build Time', dataIndex:'BuildTime'}
			]
		});

		var store = new Ext.data.JsonStore({
			autoDestroy: true,
			url:'getBuildResultList.do',
			autoLoad:true,
			root:'BuildResults',
			fields: ['Id', 'BuildResult', 'BuildMessage', 'HasTestResult', 'TestResult', 'TestMessage', 'HasCoverageResult', 'ClassCoverage', 'MethodCoverage', 'BlockCoverage', 'LineCoverage', 'BuildTime']
		});
	
		var config = {
			cm:colMode,
			store:store,
			viewConfig: {
				forceFit:true
			}
	    }
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		BuildResultListPanel.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('BuildResultListPanel', BuildResultListPanel);

BuildResultDetailPanel = Ext.extend(Ext.Panel, {
	initComponent:function() {
		var config = {

	    }
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		BuildResultDetailPanel.superclass.initComponent.apply(this, arguments);
	},
	LoadDetail:function (grid, rowIndex, evt){
		var bookTplMarkup = [
     		'Build Result: {BuildResult}<br />',
     		'<tpl if="BuildResult == false">Error Message: {BuildMessage:nl2br}<br /></tpl>',
     		'<tpl if="HasTestResult == true">Test Result: {TestResult}<br /></tpl>',
     		'<tpl if="TestResult == false">Test Result: {TestMessage:nl2br}<br /></tpl>',
     		'<tpl if="HasCoverageResult == true">Class Coverage: {ClassCoverage}<br />Method Coverage: {MethodCoverage}<br />Block Coverage: {BlockCoverage}<br />Line Coverage: {LineCoverage}<br /></tpl>',
     		'Build Time: {BuildTime}',
     	];
     	var bookTpl = new Ext.XTemplate(bookTplMarkup);
     	bookTpl.overwrite(this.body, grid.getStore().getAt(rowIndex).data);
	}
});

Ext.reg('BuildResultDetailPanel', BuildResultDetailPanel);

BuildResultPanel = Ext.extend(Ext.Panel, {
	initComponent:function() {
		var config = {
			items:[
			    {
			    	ref:'BuildResultListPanel',
			    	xtype:'BuildResultListPanel',
			    	region:'center'
			    },
			    {
			    	ref:'BuildResultDetailPanel',
			    	xtype:'BuildResultDetailPanel',
			    	region:'south',
			    	split:true,
			    	height:400
			    }
			]
	    }
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		BuildResultPanel.superclass.initComponent.apply(this, arguments);
		this.BuildResultListPanel.on('rowclick', this.BuildResultDetailPanel.LoadDetail, this.BuildResultDetailPanel);
	}
});

Ext.reg('BuildResultPanel', BuildResultPanel);