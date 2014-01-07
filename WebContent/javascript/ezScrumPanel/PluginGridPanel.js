var PluginRecord = Ext.data.Record.create([
	'Name'
]);

var PluginReader = new Ext.data.XmlReader({
	record: 'Plugin',
	idPath : 'Name'
}, PluginRecord);

var PluginGridProxyStore = new Ext.data.Store({
	fields:[
		{name : 'Name'}
	],
	reader	: PluginReader,
	proxy	: new Ext.ux.data.PagingMemoryProxy()
});

var PluginColumnModel = new Ext.grid.ColumnModel({
	columns: [
 	     {dataIndex: 'Name',header: 'Name', width: 150}	            	          
 	]
});

ezScrum.PluginGrid = Ext.extend(Ext.grid.GridPanel, {
	id		: 'Plugin_Management_Grid_Panel',
	title	: 'Plugin List',
	url		: 'getInstalledPluginList',
	border	: false,
	frame	: false,
	bodyStyle	:'width:100%',
	autoWidth	: true,
	stripeRows	: true,
	store	: PluginGridProxyStore,
	colModel	: PluginColumnModel,
	viewConfig: {
        forceFit: true
    },
    sm		: new Ext.grid.RowSelectionModel({
    	singleSelect: true
    }),
    initComponent : function() {
    	var config = {
			tbar: [
			    {id: 'PluginManagement_addPluginBtn', ref: '../PluginManagement_addPluginBtn_refID', disabled:false, text:'Add Plugin', icon:'images/add3.png', scope: this
			    	 ,handler: function() { 
			    		 			var addPluginFileWindow = new ezScrum.window.AddPluginFileWindow(); 
			    		 			addPluginFileWindow.attachFile(this);
			    		 	   } 
			    },
				{id: 'PluginManagement_removePluginBtn', ref: '../PluginManagement_removePluginBtn_refID', disabled:true, text:'Remove Plugin', icon:'images/drop2.png', handler: this.checkRemovePlugin }
			   
			],
		    bbar : new Ext.PagingToolbar({
				pageSize	: 15,
				store		: this.getStore(),
				displayInfo	: true,
				displayMsg	: 'Displaying topics {0} - {1} of {2}',
				emptyMsg	: "No topics to display"
			})
		}
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
    	ezScrum.PluginGrid.superclass.initComponent.apply(this, arguments);
		
		this.getSelectionModel().on({
			'selectionchange': {
				scope:	this,
				buffer:10, fn:function() {
					var selected = this.getSelectionModel().getCount()==1;
					if (selected) {
						this.PluginManagement_removePluginBtn_refID.setDisabled(false);
					}
				}
			}
		});
	},       
	loadDataModel: function() {
		ManagementMainLoadMaskShow();
		Ext.Ajax.request({
			scope	: this,
			url		: this.url,
			success : function(response) { 
				this.getStore().proxy.data = response;
				this.getStore().proxy.reload = true;// assert reload is true
				this.getStore().load({params:{start:0, limit:15}});
				
				ManagementMainLoadMaskHide();
			},
			failure : function() {
				Ext.example.msg('Server Error', 'Sorry, the connection is failure.');
			}
		});
	},
	checkRemovePlugin: function() {
		Ext.MessageBox.confirm('Remove Plugin', 'Are you sure to remove the plugin?', 
			function(btn) {
				var obj = Ext.getCmp('Plugin_Management_Grid_Panel');
				if (btn == 'yes') {
					var record = obj.getSelectionModel().getSelected();
					Ext.Ajax.request({
						url		: 'removePlugin',
						params	: { pluginName: record.data['Name'] },
						success	: function(response) {
							if(eval(response)) {
								obj.notify_RemovePlugin("true", record);
							} else {
								obj.notify_RemovePlugin("false", record);
							}
						}
					});
				}
			}
		);
	},
	notify_AddPlugin: function(success) {
		var title = "Add Plugin";
		if (success) {
			this.loadDataModel();
			Ext.example.msg(title, "Success.");
		} else {
			Ext.example.msg(title, "Sorry, please try again.");
		}
	},
	notify_RemovePlugin: function(success) {
		var title = "Remove Plugin";
		if (success) {
			this.loadDataModel();
			Ext.example.msg(title, "Success.");
		} else {
			Ext.example.msg(title, "Sorry, please try again.");
		}
	}
});

Ext.reg('Management_PluginGrid', ezScrum.PluginGrid);