
TaskFormPanel = Ext.extend(Ext.form.FormPanel, {
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
			    	        	        	 fieldLabel:'Estimated', 
			    	        	        	 name:'Estimated',
			    	        	        	 readOnly: true
			    	        	         },
			    	        	         {
			    	        	        	 xtype:'textfield', 
			    	        	        	 fieldLabel:'Status', 
			    	        	        	 name:'Status',
			    	        	        	 readOnly: true
			    	        	         },
			    	        	         {
			    	        	        	 xtype:'textfield', 
			    	        	        	 fieldLabel:'Partners', 
			    	        	        	 name:'Partners',
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
			    	        	        	 fieldLabel:'Actual', 
			    	        	        	 name:'Actual',
			    	        	        	 readOnly: true
			    	        	         },
			    	        	         {
			    	        	        	 xtype:'textfield', 
			    	        	        	 fieldLabel:'Handler', 
			    	        	        	 name:'Handler',
			    	        	        	 readOnly: true
			    	        	         }
			    	        	  ]
			    	          }
			    	     ]
			      },
			{
	            xtype:'tabpanel',
	            activeTab: 0,
	            height:400,
	            deferredRender: false,
	            items:[
	            {
	                title:'Notes',
	                layout:'fit',
	                items: [{
	                	xtype:'textarea',
	                    name: 'Notes',
	                    readOnly: true
	                }]
	            },{
	            	title:'Commit Logs',
	            	layout:'form',
	            	autoScroll:true,
	            	ref:'./CommitLogPanel',
	            	setCommitLog:function(logs)
	            	{
	            		for(var i = 0; i < logs.length; i++)
	            		{
	            			var log = logs[i];
	            			var title = "Revision:" + log.Revision + "...by " + log.Author + "..." + log.ChangeTime;
	            			var commitLog = log.Log;
	            			var fileList = log.Files;
	            			var fieldSet = new Ext.form.FieldSet(
	            				{
	            					title: title,
	            					collapsible: true,
	            					columnWidth: 0.5,
	            					layout:'form',
	            					labelAlign: 'right',
	            					items :[
	            					    {
	            					    	xtype:'textarea',
	            					    	readOnly:true,
	            					    	anchor:'80%',
	            					    	value:commitLog,
		            		                fieldLabel: 'Log'
		            		            }, {
		            		            	xtype:'textarea',
		            		            	readOnly:true,
		            		            	anchor:'80%',
		            		            	value:fileList,
		            		                fieldLabel: 'Changed Files'
		            		            }
	            		            ]
	            				}
	            			);
	            			this.add(fieldSet);
	            		}
	            	}
	            }]
	        }]
        };
        
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		
		TaskFormPanel.superclass.initComponent.apply(this, arguments);
		
		this.addEvents('LoginSuccess', 'LoginFailure');
	},
	onRender:function() {
		TaskFormPanel.superclass.onRender.apply(this, arguments);
		this.getForm().waitMsgTarget = this.getEl();
	}
});

Ext.reg('TaskForm', TaskFormPanel);
