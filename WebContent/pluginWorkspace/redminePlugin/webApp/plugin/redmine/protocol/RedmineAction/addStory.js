Ext.ns('Plugin.redmine.productBacklogToolBar');

Plugin.redmine.productBacklogToolBar.addStory = function(obj){
	var record = Plugin.redmine.productBacklogToolBar.RedmineIssueWindow.items.get(0).getSelectionModel().getSelected();
	
    var form = new Ext.form.FormPanel({    
        width :300,  
        height : 100,  
        frame : false,   
        autoScroll	  : true,
        bodyStyle     : 'padding:15px',
        border        : false,
        defaultType   : 'textfield',
        labelAlign    : 'right',
        labelWidth    : 100,
        monitorValid  : true,
        defaults      : {
            width     : 500,
            msgTarget : 'side'
        },
        items   : [{
            name       : 'issueID',
            allowBlank : false,
			xtype       : "textfield",
            maxLength  : 128,
            hidden     : true,
            value      : record.data.id
        },{
            fieldLabel : 'Name',
            name       : 'name',
            allowBlank : false,
			xtype       : "textfield",
            maxLength  : 128,
            value      : record.data.name
        }, {
            fieldLabel : 'Value',
            name       : 'value',
			xtype       : "textfield",
            vtype      : 'Number'
        }, {
            fieldLabel : 'Estimation',
            name       : 'estimation',
			xtype       : "textfield",
            vtype      : 'Float'
        }, {
            fieldLabel : 'Importance',
            name       : 'importance',
			xtype       : "textfield",
            vtype      : 'Number'
        }, {
            fieldLabel : 'Notes',
            xtype      : 'textarea',
            name       : 'notes',
            height     : 150,
            value      : record.data.description
        },{
        	fieldLabel : 'How To Demo',
            xtype      : 'textarea',
            name       : 'howToDemo',
            height     : 150 
        }],
        buttons : [{
            formBind : true,
            text     : 'Submit',
            scope    : this,
            disabled : true,
            handler  : function() {
                Ext.Ajax.request({
                    url     : 'plugin/redmine/commitStoryToEzScrumServer',
                    params  : form.getForm().getValues(),
                    success : function(response) {
                    	window.destroy();
                    	Plugin.redmine.productBacklogToolBar.RedmineIssueWindow.items.get(1).fireEvent('loadDataEvent');
                    	Ext.getCmp('productBacklogMasterPanel').loadDataModel();	//	同步更新product backlog. code in ProductBacklogPanel.js
                    },
                    failure : function(response) { 
                    
                    }
                });
            }
        }, {
            text    : 'Cancel',
            scope   : this,
            handler : function() { 
            	window.destroy();
            }
        }]
    });  
    
    var window = new Ext.Window({
    	title       : 'Add Story',
    	layout 		: 'fit',
    	autoScroll	: true,
    	constrain	: true,
    	modal		: true,
    	width		: 700,
    	height		: 550,
    	items       : form
    });
    
    window.show();
};