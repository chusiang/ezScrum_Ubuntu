

StoryFormPanel = Ext.extend(Ext.form.FormPanel, {
	title:'Issue',
	width:700,
    initComponent:function() {
		var config = {
			items:[
			       {xtype:'textfield', name:'Name', anchor:'83.7%', fieldLabel:'Name', readOnly: true},
			       {
			    	   layout:'column', 
			    	   border:false, 
			    	   items:[
			    	          {
			    	        	  columnWidth:.5, 
			    	        	  layout:'form', 
			    	        	  border:false, 
			    	        	  items:[
			    	        	         {
			    	        	        	 xtype:'textfield', 
			    	        	        	 fieldLabel:'Release', 
			    	        	        	 name:'Release',
			    	        	        	 readOnly: true
			    	        	         },
			    	        	         {
			    	        	        	 xtype:'textfield', 
			    	        	        	 fieldLabel:'Importance', 
			    	        	        	 name:'Importance',
			    	        	        	 readOnly: true
			    	        	         },
			    	        	         {
			    	        	        	 xtype:'textfield', 
			    	        	        	 fieldLabel:'Status', 
			    	        	        	 name:'Status',
			    	        	        	 readOnly: true
			    	        	         }
			    	        	  ]
			    	          },
			    	          {
			    	        	  columnWidth:.5, 
			    	        	  layout:'form', 
			    	        	  border:false, 
			    	        	  items:[
			    	        	         {
			    	        	        	 xtype:'textfield', 
			    	        	        	 fieldLabel:'Sprint', 
			    	        	        	 name:'Sprint',
			    	        	        	 readOnly: true
			    	        	         },
			    	        	         {
			    	        	        	 xtype:'textfield', 
			    	        	        	 fieldLabel:'Estimated', 
			    	        	        	 name:'Estimated',
			    	        	        	 readOnly: true
			    	        	         }
			    	        	  ]
			    	          }
			    	     ]
			      },
			{
	            xtype:'tabpanel',
	            activeTab: 0,
	            height:235,
	            deferredRender: false,
	            items:[{
	                title:'How To Demo',
	                layout:'fit',
	                items: [{
	                	xtype:'textarea',
	                    name: 'HowToDemo',
	                    readOnly: true
	                }]
	            },{
	                title:'Notes',
	                layout:'fit',
	                items: [{
	                	xtype:'textarea',
	                    name: 'Notes',
	                    readOnly: true
	                }]
	            },{
	            	title:'Commit Logs',
	            	layout:'fit',
	                items: [{
	                	xtype:'textarea',
	                    name: 'CommitLogs',
	                    readOnly: true
	                }]
	            }]
	        }]
        };
        
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		
		StoryFormPanel.superclass.initComponent.apply(this, arguments);
		
		this.addEvents('LoginSuccess', 'LoginFailure');
	},
	onRender:function() {
		StoryFormPanel.superclass.onRender.apply(this, arguments);
		this.getForm().waitMsgTarget = this.getEl();
	}
});

Ext.reg('StoryForm', StoryFormPanel);
