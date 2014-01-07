ezScrum.IssueLinkSVNForm = Ext.extend(Ext.form.FormPanel, {
	revision	: -1,
	issueID		: -1,
	
	bodyStyle	: 'padding:15px',
	labelAlign	: 'right',
	labelWidth	: 100,
	monitorValid: true,
	defaults: {
		width	: 300
    },
    initComponent: function() {
        this.items = [
			{
				fieldLabel	: 'SVN Manager', 
				name		: 'SVNManager',
				value		: 'http://140.124.181.153/SVNManager',
				xtype		: 'textfield'
			}, {
	        	fieldLabel	: 'SVN Root', 
	        	name		: 'SVNRoot',
	        	value		: 'http://140.124.181.153/svn/ezScrum',
	        	xtype		: 'textfield'
            }, {
	        	fieldLabel	: 'Username', 
	        	name		: 'Username',
	        	value		: 'taoyu',
	        	xtype		: 'textfield'
            }, {
	        	fieldLabel	: 'Password', 
	        	name		: 'Password',
	        	value		: 'taoyu',
	        	inputType	: 'password',
	        	xtype		: 'textfield'
            }, {
            	fieldLabel	: 'Save Info',
            	name		: 'SaveInfo',
            	checked		: true,
            	xtype		: 'checkbox'
            }
        ];
        
        this.buttons = [{
	    	formBind	: true,
	    	text		: 'Submit',
	    	scope		: this,
	    	handler		: this.submit_click
        }];
        
        ezScrum.IssueLinkSVNForm.superclass.initComponent.call(this);
        
        this.addEvents('LinkSuccess');
    },
    submit_click	: function() {
    	// 檢驗此 repository url 是否正確, 尚未實做 
//        	Ext.Ajax.request({
//			url		: 'isLoginSVN.do',
//			success	: function(response){ obj.onSuccess(response);},
//			failure	: function(response){obj.onFailure(response);},
//			params	: { this.getForm().getValues() }
//		});
    	
    	this.submit_success();
    },
    submit_success	: function() {
    	this.fireEvent('LinkSuccess', this.issueID, 
    								  this.getForm().findField('SVNManager').getValue(),
    								  this.getForm().findField('SVNRoot').getValue(),
    								  this.revision, this.getForm().findField('Username').getValue(),
    								  this.getForm().findField('Password').getValue(),
    								  this.getForm().findField('SaveInfo').getValue());
    }
});
Ext.reg('IssueLinkSVNForm', ezScrum.IssueLinkSVNForm);

ezScrum.window.IssueLinkSVNWindow = Ext.extend(ezScrum.layout.Window, {
	isLogin	: false,
	isSaveInfo: false,
	
	title	: 'Issue Link SVN',
	width	: 500,
	initComponent: function() {
	    this.items = [{
	        xtype	: 'IssueLinkSVNForm',
	        ref		: 'IssueLinkSVNForm_refID'
	    }];
	    
	    ezScrum.window.IssueLinkSVNWindow.superclass.initComponent.call(this);
	    
	    var obj = this;
	    this.IssueLinkSVNForm_refID.on('LinkSuccess', function(issueID, SVNMgr, repository_root, revision, username, password, saveInfo) {
	    	obj.isSaveInfo = eval(saveInfo);
	    	obj.isLogin = eval(saveInfo);	// changed to login success or not
	    	obj.hide();
	    	
	    	if (obj.IssueLinkSVNForm_refID.revision > 0) {
	    		IssueCodeReviewWindow.showTheWindow(issueID, SVNMgr, repository_root, revision, username, password);
	    	}
	    });
	},
	showTheWindow_Revision: function(revision, issueID) {
		if ( ! this.isSaveInfo ) {
			// reset info
//			this.IssueLinkSVNForm_refID.getForm().reset();		// mark for developing
			this.IssueLinkSVNForm_refID.getForm().findField('SaveInfo').setValue(true);	// default true
		}
		
		this.IssueLinkSVNForm_refID.issueID = issueID;
		this.IssueLinkSVNForm_refID.revision = revision;
		
		if ( ! this.isLogin) {
			this.show();
		} else {
			var form = this.IssueLinkSVNForm_refID.getForm();
			var SVNMgr = form.findField('SVNManager').getValue();
			var repository_root = form.findField('SVNRoot').getValue();
			var revision = this.IssueLinkSVNForm_refID.revision;
			var username = form.findField('Username').getValue();
			var password = form.findField('Password').getValue();
			var issueID = this.IssueLinkSVNForm_refID.issueID;
			
			IssueCodeReviewWindow.showTheWindow(issueID, SVNMgr, repository_root, revision, username, password);
		}
	},
	showTheWindow_Link: function() {
		if ( ! this.isSaveInfo ) {
			// reset info
//			this.IssueLinkSVNForm_refID.getForm().reset();		// mark for developing
			this.IssueLinkSVNForm_refID.getForm().findField('SaveInfo').setValue(true);	// default true
		}
		
		this.IssueLinkSVNForm_refID.revision = -1;
		
		this.show();
	}
});

var IssueLinkWindow = new ezScrum.window.IssueLinkSVNWindow();