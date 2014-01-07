LinkSVNForm = Ext.extend(Ext.form.FormPanel, {
	bodyStyle: 'padding:15px',
	defaultType: 'textfield',
	labelAlign : 'right',
	labelWidth : 100,
	defaults: {
        width: 300,
        msgTarget: 'side'
    },
    monitorValid:true,
    initComponent: function() {
        this.items = [
            {
	        	fieldLabel:'SVN Manager', 
	        	name:'Manager',
	        	value:'http://140.124.181.153/SVNManager'
            },
            {
            	xtype:'combo',
            	typeAhead: true,
                triggerAction: 'all',
                lazyRender:true,
                mode: 'remote',
                allowBlank:false,
                store: new Ext.data.Store({
                    id: 0,
    	        	url:'svnManager.do',
    	        	reader:new Ext.data.JsonReader({
    	        		root: 'Settings',
                        fields: [
                            'Url',
                            'Path'
                        ]
    	        	})
                    
                }),
                valueField: 'Path',
                displayField: 'Url',
	        	fieldLabel:'Repository', 
	        	name:'Repository',
	        	listeners:{
            		beforequery: function(qe){
            			qe.combo.getStore().baseParams.url = this.getForm().findField('Manager').getValue() + '/main.py/get_config';
		                delete qe.combo.lastQuery;
		            },
            		scope:this
            	},
            	editable:false
            },
            {
	        	fieldLabel:'Username', 
	        	name:'Username',
	        	value:'lisber'
            },
            {
	        	fieldLabel:'Password', 
	        	name:'Password',
	        	value:'qaz123',
	        	inputType:'password'
            }
        ];
        this.buttons = [
		    {
		    	formBind:true,
		    	text: 'Submit',
		    	scope:this,
		    	handler:this.submit_click
		    }
		];
        LinkSVNForm.superclass.initComponent.call(this);
        this.addEvents('LinkSuccess');
    },
    submit_click:function()
    {
    	var values = this.getForm().getValues();
    	this.fireEvent('LinkSuccess', values['Manager'], values['Repository'], this.getForm().findField('Repository').getValue(), values['Username'], values['Password']);
    }
});

Ext.reg('LinkSVNForm', LinkSVNForm);

LinkSVNWidget = Ext.extend(Ext.Window, {
	title:'Link SVN',
	width:500,
	modal:true,
	closable:true,
	initComponent: function() {
	    this.items = [
	        {
	        	xtype:'LinkSVNForm',
	        	ref:'linkSVNForm'
	        }
	    ];
	    
	    LinkSVNWidget.superclass.initComponent.call(this);

	    this.addEvents('LinkSuccess');
	    this.linkSVNForm.on('LinkSuccess', function(manager, repository, location, username, password){ this.fireEvent('LinkSuccess', manager, repository, location, username, password); }, this);
	}
});