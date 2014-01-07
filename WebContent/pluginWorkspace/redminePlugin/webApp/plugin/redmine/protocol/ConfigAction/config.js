Ext.ns('Plugin.redmine.config');

//variable list
Plugin.redmine.config.saveBtnHandler;//save btn handler
Plugin.redmine.config.saveBtn;//save btn
Plugin.redmine.config.redmineUrlTextField;//redmine url textField
Plugin.redmine.config.redmineAccessKeyTextField;//redmine accessKey textField
Plugin.redmine.config.RedminePlugin;//redmine plugin

Plugin.redmine.config.saveBtnHandler = function(btn) {
	
	var redmineUrl      = Plugin.redmine.config.redmineUrlTextField.getValue();
	var redmineAccessKey  = Plugin.redmine.config.redmineAccessKeyTextField.getValue();
	
	Ext.Ajax.request({
		scope	: this,
		url		: 'plugin/redmine/config/savePluginConfig',
		params: {
			redmineUrl      : redmineUrl, 
			redmineAccessKey  : redmineAccessKey
		}, 
		success : function(response) { 
			Ext.example.msg('', 'plugin information is saved');
		},
		failure : function() {
			Ext.example.msg('Server Error', 'Sorry, the connection is failure.');
		}
	});
};

Plugin.redmine.config.redmineUrlTextField = new Ext.form.TextField({//redmine url textField
  fieldLabel:'Redmine Url',
  name      :'RedmineUrl',
  anchor    : '50%',
  allowBlank:false,
  maxLength  : 128
});

Plugin.redmine.config.redmineUrlTextField.on('valid',function(){
	if( Plugin.redmine.config.redmineAccessKeyTextField.isValid() ){
		Plugin.redmine.config.saveBtn.enable();
	}
});

Plugin.redmine.config.redmineUrlTextField.on('invalid',function(){
	Plugin.redmine.config.saveBtn.disable();
});


Plugin.redmine.config.redmineAccessKeyTextField = new Ext.form.TextField({//redmine url textField
  fieldLabel:'Redmine Access Key',
  name      :'RedmineAccessKey',
  anchor    : '50%',
  inputType: 'password', 
  allowBlank:false,
  maxLength  : 128
});

Plugin.redmine.config.redmineAccessKeyTextField.on('valid',function(){
	if( Plugin.redmine.config.redmineUrlTextField.isValid() ){
		Plugin.redmine.config.saveBtn.enable();	
	}
});

Plugin.redmine.config.redmineAccessKeyTextField.on('invalid',function(){
	Plugin.redmine.config.saveBtn.disable();
});

Plugin.redmine.config.saveBtn = new Ext.Button({
	 text:'save redmine plugin setting',
	 handler : Plugin.redmine.config.saveBtnHandler
});

Plugin.redmine.config.saveBtn.on('render',function(){
	if(Plugin.redmine.config.redmineUrlTextField.isValid() && Plugin.redmine.config.redmineAccessKeyTextField.isValid()){
		Plugin.redmine.config.saveBtn.enable();
	}else{
		Plugin.redmine.config.saveBtn.disable();
	}
});

Plugin.redmine.config.RedminePlugin = Ext.extend(Ext.util.Observable,{    
	init:function(cmp){
		this.hostCmp = cmp;
		this.hostCmp.on('render', this.onRender, this, {delay:200});
		this.on({
			'show':function(){
				Ext.Ajax.request({
					scope	: this,
					url		: 'plugin/redmine/config/getPluginConfig',
					success : function(response) { 
						var json = eval ("(" + response.responseText + ")");
						Plugin.redmine.config.redmineUrlTextField.setValue( json.redmineUrl );
						Plugin.redmine.config.redmineAccessKeyTextField.setValue( json.redmineAccessKey );
					},
					failure : function() {
						Ext.example.msg('Server Error', 'Sorry, the connection is failure.');
					}
				});
			}
		});
	},
	
	onRender: function(){
		this.hostCmp.add(  
			     Plugin.redmine.config.redmineUrlTextField,
				 Plugin.redmine.config.redmineAccessKeyTextField,
				 Plugin.redmine.config.saveBtn
		);
		this.hostCmp.doLayout();
	}
});

Ext.preg('redminePlugin', Plugin.redmine.config.RedminePlugin);