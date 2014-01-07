ezScrum.review.SourceCodePanel = Ext.extend(Ext.Panel, {
	layout	: 'fit',
	url		: undefined,
	revision: undefined,		// issue review file has a revision, code review page does not have a revision
	issueID	: -1,
    listeners: {
    	beforerender: function() {
    		var mask = new Ext.LoadMask(Ext.getBody());
    		mask.show();
    		
    		if (this.revision == undefined) {
    			this.revision = -1;
    		}
    		
    		Ext.Ajax.request({
    			url		: this.url,
    			scope	: this,
    			params	: { manager: this.manager, path: this.path, username: this.username, password: this.password, revision: this.revision, issueID: this.issueID, Repository_Url: this.repos_root },
    			success	: function(response) {
    				this.setSourceCodeContent(response);
    				mask.hide();
    			},
    			failure	: function(response) {
    				Ext.example.msg('Server Error', 'Sorry, the connection is failure.');
    			}
    		});
    	}
    },
    setSourceCodeContent: function(response) {
    	var result_obj = Ext.util.JSON.decode(response.responseText);
    	
    	// add source code panel
    	this.add({
			xtype	: 'codepress',
			code	: result_obj.code,
			language: result_obj.language
    	});
    	this.doLayout();
    }
});
Ext.reg('SourceCodePanel', ezScrum.review.SourceCodePanel);