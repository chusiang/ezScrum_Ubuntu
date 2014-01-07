

SelectProjectWidget = Ext.extend(Ext.Window, {
	title:'Select Project',
	width:400,
	height:350,
	modal:true,
	closable:true,
	layout:'border',
	initComponent:function() {
		var config = {
			items:
			{
				region:'center',
				xtype:'listview',
				reserveScrollOffset: true,
				store: new Ext.data.JsonStore({
					url:'getProjectList.do',
					root:'Projects',
					fields:['Name'],
					autoLoad:true
				}),
				columns:[{header:'Project Name', dataIndex:'Name'}],
				emptyText: 'No projects to display',
				listeners:{
					click:function(view, index, ndoe, evt)
					{
						//alert(view.getStore().getAt(index).data['Name']);
						this.fireEvent('SelectProject', view.getStore().getAt(index).data['Name']);
					},
					scope:this
				}
			}
        }
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		SelectProjectWidget.superclass.initComponent.apply(this, arguments);
		this.addEvents('SelectProject');
	}
});