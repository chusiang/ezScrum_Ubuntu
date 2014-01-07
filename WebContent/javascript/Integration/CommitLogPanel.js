CommitLogPanel = Ext.extend(Ext.Panel, {
	initComponent:function() {
		//var config = {
		//	
	    //};
		this.url = 'getCommitList.do';
		//Ext.apply(this, Ext.apply(this.initialConfig, config));
		CommitLogPanel.superclass.initComponent.apply(this, arguments);
		this.loadData();
	},
	reloadData:function()
	{
		this.removeAll();
		this.loadData();
	},
	loadData:function()
	{
		Ext.Ajax.request({
			url:this.url,
			scope:this,
			success:this.loadDataSuccess
		});
	},
	loadDataSuccess:function(response, opt)
	{
		var obj = Ext.decode(response.responseText);
		this.displayData(obj);
	},
	displayData:function(data)
	{
		var logs = data.Logs;
		for(var i = 0; i < logs.length; i++)
		{
			var log = logs[i];
			var title = "Revision:" + log.Revision + "...by " + log.Author;
			var commitLog = log.Log;
			var fileList = log.Files;
			var fieldSet = new Ext.form.FieldSet(
				{
					title: title,
					collapsible: true,
					columnWidth: 0.5,
					layout:'form',
					labelAlign: 'right',
					items :[
					    {
					    	xtype:'textarea',
					    	readOnly:true,
					    	anchor:'80%',
					    	value:commitLog,
    		                fieldLabel: 'Log'
    		            }, {
    		            	xtype:'textarea',
    		            	readOnly:true,
    		            	anchor:'80%',
    		            	value:fileList,
    		                fieldLabel: 'Changed Files'
    		            }
		            ]
				}
			);
			this.add(fieldSet);
			this.doLayout();
		}
	}
});

Ext.reg('CommitLogPanel', CommitLogPanel);