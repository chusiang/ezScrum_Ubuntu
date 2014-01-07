Ext.ns('ezScrum');
Ext.ns('ezScrum.layout');
Ext.ns('ezScrum.window');

var IssueStore_ForDoneIssue = new Ext.data.Store({
	idIndex	: 0,
	id		: 0,
	fields	:[
		{name : 'Id'},
		{name : 'Name'},
		{name : 'Notes'},
		{name : 'Partners'}
		],
	reader	: taskJSReader
});

/* Check out Issue Form */
ezScrum.DoneForm = Ext.extend(ezScrum.layout.TaskBoardCardWindowForm, {
    initComponent : function() {
        var config = {
            url     : 'doneIssue.do',
            loadUrl : 'showCheckOutIssue.do',
            items   : 
            		[{
                        fieldLabel	: 'ID',
                        name      	: 'Id',
                        readOnly	: true,
                        xtype: 'hidden'
                    },
                    {
                        fieldLabel	: 'Name',
                        name      	: 'Name',
                        allowBlank	: false
                    },
                    {
                    	fieldLabel	: 'Actual Hour',
                    	name      	: 'Actualhour'
                    },
                    {
                        fieldLabel	: 'Notes',
                        xtype     	: 'textarea',
                        name      	: 'Notes',
                        height    	: 150
                    },
                    {
                    	allowBlank	: true,
                    	fieldLabel	: 'Specific Checked Out Time',
                    	name		: 'ChangeDate',
                    	format 		: 'Y/m/d-H:i:s',
                    	xtype		: 'datefield'
                    },{
                    	xtype: 'RequireFieldLabel'
                    }],
            buttons : 
            		[{
						formBind : true,
                        text     : 'Done',
                        scope    : this,
                        handler  : this.submit,
                        disabled : true
                    }, {
                        text    : 'Cancel',
                        scope   : this,
                        handler : function() {	this.ownerCt.hide();  }
                    }]
        }

        Ext.apply(this, Ext.apply(this.initialConfig, config));
        ezScrum.DoneForm.superclass.initComponent.apply(this, arguments);

        this.addEvents('DOSuccess', 'DOFailure', 'LoadIssueFailure');
    },
    submit: function() {
        var form = this.getForm();
        var obj = this;
        
        Ext.Ajax.request({
			url     : this.url,
			params  : form.getValues(),
			success : function(response) {
				obj.onEditSuccess(response);
			},
			failure : function(response) {
				obj.onEditFailure(response);
			}		
		});
    },
    onEditSuccess: function(response) {
    	ConfirmWidget.loadData(response);
    	if (ConfirmWidget.confirmAction()) {
    		var rs = jsonIssueReader.read(response);
			if(rs.success) {
				var record = rs.records[0];
				if(record)
				{
					this.fireEvent('DOSuccess', this, response, record);
				}
			}
    	}
    },
    onEditFailure: function(response) {
        this.fireEvent('DOFailure', this, response);
    },
    onLoadSuccess: function(response) {
    	ConfirmWidget.loadData(response);
    	if (ConfirmWidget.confirmAction()) {
    		IssueStore_ForDoneIssue.loadData(Ext.decode(response.responseText));		// load issue info
			var record = IssueStore_ForDoneIssue.getAt(0);
			if(record) {
				this.getForm().setValues({
					Id: record.data['Id'],
					Name: record.data['Name'], 
					Partners: record.data['Partners'], 
					Notes: record.data['Notes'],
					Actualhour: 0
				});
				
				// append issueID to window title. "DoneIssueWindow" define in TaskBoardCardFormPanel.js
				DoneIssueWindow.setTitle('Done Issue #' + record.data['Id']);
				//this.fireEvent('LoadSuccess', this, response, record);
			}
    	}
    },
    onLoadFailure: function(response) {
        this.fireEvent('LoadIssueFailure', this, response);
    },
    reset: function() {
        this.getForm().reset();
    },
    loadIssue: function(id) {
        var obj = this;
        
    	Ext.Ajax.request({
			url: this.loadUrl,
			success: function(response) { obj.onLoadSuccess(response); },
			failure: function(response) { obj.onLoadFailure(response); },
			params : {issueID : id}
		});
    }
});

Ext.reg('ShowIssueDoneForm', ezScrum.DoneForm);

ezScrum.window.DoneIssueWindow = Ext.extend(ezScrum.layout.Window, {
	title	: 'Done Issue',
	initComponent : function() {
		var config = {
			layout : 'form',
			items  : [{	xtype : 'ShowIssueDoneForm'	}]
		}
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ezScrum.window.DoneIssueWindow.superclass.initComponent.apply(this, arguments);

		this.addEvents('DoneSuccess', 'DoneFailure', 'LoadFailure');		
		this.items.get(0).on('DOSuccess', function(obj, response, record) { this.fireEvent('DoneSuccess', this, response, record); }, this);
		this.items.get(0).on('DOFailure', function(obj, response) { this.fireEvent('DoneFailure', this, response); }, this);
		this.items.get(0).on('LoadIssueFailure', function(obj, response) { this.fireEvent('LoadFailure', this, response); }, this);
	},
	showWidget : function(taskID) {
		this.items.get(0).reset();
		this.items.get(0).loadIssue(taskID);
		this.show();
	}
});