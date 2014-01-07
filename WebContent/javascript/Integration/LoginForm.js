
LoginForm = Ext.extend(Ext.form.FormPanel, {
	id:'Login Form',
	border : false,
	bodyStyle: 'padding:15px',
	defaultType: 'textfield',
	labelAlign : 'right',
	labelWidth : 100,
	defaults: {
        width: 200,
        msgTarget: 'side'
    },
    monitorValid:true,
    initComponent:function() {
		var config = {
			items:[
				{id:'user',fieldLabel:'User Name',name:'user',allowBlank:false, enableKeyEvents:true, listeners:{keypress:function(field, evt){if(evt.getKey() == evt.ENTER) this.submit_click();}, scope:this}},
				{fieldLabel:'Password',name:'pass',allowBlank:false,inputType:'password', enableKeyEvents:true, listeners:{keypress:function(field, evt){if(evt.getKey() == evt.ENTER) this.submit_click();}, scope:this}},
				{id:'errorLabel', xtype:'label'}
				
			],
			buttons:[
				{formBind:true,text: 'Submit',scope:this,handler:this.submit_click}
			]
			         
        };
        
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		
		LoginForm.superclass.initComponent.apply(this, arguments);
		
		this.addEvents('LoginSuccess', 'LoginFailure');
	},
	onRender:function() {
		LoginForm.superclass.onRender.apply(this, arguments);
		this.getForm().waitMsgTarget = this.getEl();
	},
	submit_click:function(){
		
		if(!this.getForm().isValid())
			return;
		
		var obj = this;
		var form = this.getForm().submit({
			url:'login.do',
			success: function(form, action) {
				obj.fireEvent('LoginSuccess');
		    },
		    failure:function(form, action){
		    	if(!action.result)
		    	{
		    		Ext.getCmp('errorLabel').setText('404 Not Found');
		    		//obj.fireEvent('LoginFailure', '404 Not Found');
		    	}
		    	else
		    	{
		    		Ext.getCmp('errorLabel').setText(action.result.message);
		    	}
		    }
		});
	}
	
});

Ext.reg('LoginForm', LoginForm);

LoginWidget = Ext.extend(Ext.Window, {
	title:'Login',
	width:400,
	modal:true,
	closable:false,
	initComponent:function() {
		var config = {
			layout:'form',
			items : {xtype:'LoginForm'}
        }
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		LoginWidget.superclass.initComponent.apply(this, arguments);
		this.form = this.items.get(0); 
		this.form.on('LoginSuccess', function(){ this.fireEvent('LoginSuccess'); }, this);
		this.form.on('LoginFailure', function(msg){ this.fireEvent('LoginFailure', msg); }, this);
	}
});