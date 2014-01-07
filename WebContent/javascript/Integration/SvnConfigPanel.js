SvnConfigPanel = Ext.extend(Ext.Panel, {
	initComponent:function() {
		var config = {
			items:
			{
				layout:'border',
				layoutConfig: {
                    align:'stretch'
                },
				items:[
				    {
				    	region:'center',
				    	ref:'../svnTree',
				    	xtype:'treepanel',
				    	autoScroll:true,
				    	root: {
				            nodeType: 'async',
				            text: '/',
				            draggable: false,
				            id: '/'
				        },
				        tbar:[
				            {
				            	text:'Impact Analysis',
				            	handler:function(btn){
				            		var node = this.svnTree.getSelectionModel().getSelectedNode();
				            		if(node)
				            		{
				            			var impact = node.id.substring(this.repository.length, node.id.length);
				            			this.parent.showImpact(impact);
				            			
				            		}
				            	},
				            	scope:this
				            }	
				        ],
				        loader: new Ext.tree.TreeLoader({
				        	dataUrl:'getFolderList.do',
				        	listeners:{
				        		beforeload:function(tree, node)
				        		{
				        			this.svnTree.getLoader().baseParams.manager = this.manager;
				        			this.svnTree.getLoader().baseParams.repository = this.repository;
				        			this.svnTree.getLoader().baseParams.path = node.id;
				        			this.svnTree.getLoader().baseParams.username = this.username;
				        			this.svnTree.getLoader().baseParams.password = this.password;
				        		},
				        		scope:this
				        	}
				    	}),
				    	listeners:{
				    		click:function(node, evt)
				    		{
				        		this.propertyGrid.load(this.manager, this.repository, this.location, this.username, this.password, node);
				    		},
				    		scope:this
				    	}
				    },
				    {
				    	ref:'../cardLayout',
				    	id:'Card Layout',
				    	region:'south',
				    	layout:'card',
				    	height:350,
				    	split: true,
				    	activeItem: 0,
				    	defaults: {
				            // applied to each contained panel
				            border:false
				        },
				    	items: [
					    	{
					    		width:100,
						    	ref:'../../propertyGrid',
						    	id:'propertyGrid',
						    	xtype:'form',
						    	autoScroll:true,
						    	defaultType: 'textfield',
						    	items:[
						    	    {
						    	    	xtype:'fieldset',
						    	    	title:'簽入原則',
						    	    	columnWidth: 0.5,
						    	    	defaults: {
						                	anchor: '-20' // leave room for error icon
							            },
							            margins:{top:10, right:10, left:10, bottom:10},
							            defaultType: 'checkbox',
	                                    items:[
	                                        {
	                                        	ref:'../../../../comment',
	                                    	    boxLabel:'輸入版本變更註解',
	                                    	    hideLabel :true,
	                                        },
	                                        {
	                                        	ref:'../../../../link',
	                                        	boxLabel:'連結工作項目',
	                                    	    hideLabel :true
	                                        },
	                                        {
	                                        	ref:'../../../../test',
	                                    	    boxLabel:'單元測試',
	                                    	    hideLabel :true
	                                        },
	                                        {
	                                        	ref:'../../../../coverage',
	                                        	margins:{top:0, right:0, left:100, bottom:0},
	                                        	xtype:'fieldset',
	                                        	title:'測試碼涵蓋率',
	                                        	checkboxToggle:{tag: 'input', type: 'checkbox', name: '測試碼涵蓋率'},
	    						    	    	columnWidth: 0.5,
	                                    	    items:[
													{
														ref:'../../../../../coverageType',
														xtype:'combo',
														typeAhead: true,
													    triggerAction: 'all',
													    lazyRender:true,
													    mode: 'local',
													    store: new Ext.data.ArrayStore({
													        id: 0,
													        fields: [
													            'myId',
													            'displayText'
													        ],
													        data: [['Instr', 'Instruction'], ['Line', 'Line'], ['Method', 'Method'], ['Block', 'Block'], ['Class', 'Class']]
													    }),
													    valueField: 'myId',
													    displayField: 'displayText',
													    fieldLabel:'涵蓋率分析類型'
													},
	                                    	        {
														ref:'../../../../../coverageRatio',
	                                    	        	xtype:'textfield',
	                                    	        	fieldLabel:'涵蓋率'
	                                    	        }
	                                    	    ]
	                                        },
	                                        {
	                                        	ref:'../../../../staticanalysis',
	                                        	margins:{top:0, right:0, left:100, bottom:0},
	                                        	xtype:'fieldset',
	                                        	title:'FindBugs Setting',
	                                        	checkboxToggle:{tag: 'input', type: 'checkbox', name: 'FindBugs Setting'},
	    						    	    	columnWidth: 0.33,
	                                    	    items:[
													{
														ref:'../../../../../staticanalysisHighCount',
														xtype:'numberfield',
													    fieldLabel:'High Priority',
													},
													{
														ref:'../../../../../staticanalysisNormalCount',
														xtype:'numberfield',
													    fieldLabel:'Normal Priority'
													},
													{
														ref:'../../../../../staticanalysisLowCount',
														xtype:'numberfield',
													    fieldLabel:'Low Priority'
													}
	                                    	    ]
	                                        }
	                                    ]
						    	    },
						    	    {
                                    	xtype:'fieldset',
                                    	title:'連結工作項目',
						    	    	columnWidth: 0.5,
                                	    items:[
											{
												ref:'../../../../ITUrl',
												xtype:'textfield',
												fieldLabel:'Server URL',
												width:400
											},
                                	        {
												ref:'../../../../ITUsername',
                                	        	xtype:'textfield',
                                	        	fieldLabel:'帳號'
                                	        },
                                	        {
                                	        	ref:'../../../../ITPassword',
                                	        	xtype:'textfield',
                                	        	fieldLabel:'密碼',
                                	        	inputType:'password'
                                	        },
                                	        {
                                	        	ref:'../../../../ITProjectId',
                                	        	xtype:'textfield',
                                	        	fieldLabel:'專案名稱'
                                	        }
                                	    ]
                                    },
						    	    {
                                    	xtype:'fieldset',
                                    	title:'持續整合系統',
						    	    	columnWidth: 0.5,
                                	    items:[
											{
												ref:'../../../../CIUrl',
												xtype:'textfield',
												fieldLabel:'Server URL',
												width:400
											},
                                	        {
												ref:'../../../../CIProjectId',
                                	        	xtype:'textfield',
                                	        	fieldLabel:'專案名稱'
                                	        }
                                	    ]
                                    }
						    	],
						    	load:function(manager, repository, location, username, password, node)
						    	{
					    			var l = node.id.length;
					    			if(node.id.substring(l - 1, l) == "/" )
					    				this.enable();
					    			else
					    			{
					    				this.disable();
					    				return ;
					    			}

					    			this.editNode = node;
					    			
					    			var mask = new Ext.LoadMask(this.getEl(), {msg:"loading info..."});
					    			mask.show(); 
					    			
						    		Ext.Ajax.request({
						    			url:'getProperty.do',
						    			success:function(response){
						    				var data = Ext.decode(response.responseText);
						    				
						    				this.Owner.comment.setValue(data['ezETS:comment']);
						    				this.Owner.link.setValue(data['ezETS:link']);
						    				this.Owner.test.setValue(data['ezETS:junit']);
						    				
						    				
						    				if(data['ezETS:coverage']) {
						    					this.Owner.coverage.expand(false);
						    				} else {
						    					this.Owner.coverage.collapse(false);
						    				}
						    				
						    				this.Owner.coverageRatio.setValue(data['ezETS:coverageRatio']);
						    				this.Owner.coverageType.setValue(data['ezETS:coverageType']);
						    				
						    				if(data['ezETS:staticanalysis'])
						    					this.Owner.staticanalysis.expand(false)
						    				else
						    					this.Owner.staticanalysis.collapse(false)
						    					
						    				this.Owner.staticanalysisHighCount.setValue(data['ezETS:staticanalysisHighCount']);
						    				this.Owner.staticanalysisNormalCount.setValue(data['ezETS:staticanalysisNormalCount']);
						    				this.Owner.staticanalysisLowCount.setValue(data['ezETS:staticanalysisLowCount']);
						    				
						    				this.Owner.ITUrl.setValue(data['ITUrl']);
						    				this.Owner.ITUsername.setValue(data['ITUsername']);
						    				this.Owner.ITPassword.setValue(data['ITPassword']);
						    				this.Owner.ITProjectId.setValue(data['ITProjectId']);
						    				
						    				this.Owner.CIUrl.setValue(data['CIUrl']);
						    				this.Owner.CIProjectId.setValue(data['CIProjectId']);
						    				
						    				mask.hide();
						    			},
						    			params:{manager:manager, repository:repository, location:location, username:username, password:password, path:node.id},
						    			scope:this
						    		});
						    	},
						    	tbar:[
						    	    {
						    	    	text:'Save',
						    	    	listeners:{
						    	    		click:function(btn, evt)
						    	    	    {
						    	    			var data = {};
						    	    			var setting = {}
						    	    			
						    	    			// 連結工作項目
						    	    			if(this.ITUrl.getValue() != '' && this.ITProjectId.getValue() != '' && this.ITUsername.getValue() != '' && this.ITPassword.getValue() != '')
						    	    			{
						    	    				setting['ITUrl'] = this.ITUrl.getValue();
						    	    				setting['ITProjectId'] = this.ITProjectId.getValue();
						    	    				setting['ITUsername'] = this.ITUsername.getValue();
						    	    				setting['ITPassword'] = this.ITPassword.getValue();
						    	    				
						    	    				// SVN Property for link issue tracking system
						    	    				data['bugtraq:append'] = false;
						    	    				data['bugtraq:number'] = true;
						    	    				data['bugtraq:label'] = 'Issue ID:';
						    	    				data['bugtraq:message'] = 'Issue ID: %BUGID%';
						    	    				data['bugtraq:url'] = this.ITUrl.getValue() + 'showIssueDetail.do?projectId=' + this.ITProjectId.getValue() + '&issueId=%BUGID%';	
						    	    			}
						    	    			
						    	    			// 觸發持續整合系統進行建置
						    	    			if(this.CIUrl.getValue() != '' && this.CIProjectId.getValue() != '')
						    	    			{
						    	    				setting['CIUrl'] = this.CIUrl.getValue();
						    	    				setting['CIProjectId'] = this.CIProjectId.getValue();
						    	    			}
						    	    			
						    	    			// 輸入版本變更註解
						    	    			data['ezETS:comment'] = this.comment.getValue();
						    	    			
						    	    			// 連結工作項目
						    	    			data['ezETS:link'] = this.link.getValue();
						    	    			
						    	    			// 單元測試
						    	    			data['ezETS:junit'] = this.test.getValue();
						    	    			
						    	    			// 測試涵蓋率
						    	    			if(this.coverage.collapsed)
						    	    			{
						    	    				data['ezETS:coverageRatio'] = 0;
						    	    				data['ezETS:coverageType'] = 'Instr';
						    	    			}
						    	    			else
						    	    			{
						    	    				data['ezETS:coverageType'] = this.coverageType.getValue();
						    	    				data['ezETS:coverageRatio'] = this.coverageRatio.getValue(); 
						    	    			}
						    	    			
						    	    			// 靜態分析
						    	    			if(this.staticanalysis.collapsed)
						    	    			{
						    	    				data['ezETS:staticanalysisHighCount'] = 0;
						    	    				data['ezETS:staticanalysisNormalCount'] = 0;
						    	    				data['ezETS:staticanalysisLowCount'] = 0;
						    	    			}
						    	    			else
						    	    			{
						    	    				data['ezETS:staticanalysisHighCount'] = this.staticanalysisHighCount.getValue();
						    	    				data['ezETS:staticanalysisNormalCount'] = this.staticanalysisNormalCount.getValue();
						    	    				data['ezETS:staticanalysisLowCount'] = this.staticanalysisLowCount.getValue();
						    	    			}

					  	    	    			Ext.Ajax.request({
						    	    				url:'setProperty.do',
						    	    				method:'POST',
													success:function(response){},
													params:{manager:this.manager, repository:this.repository, location:this.location, path:this.propertyGrid.editNode.id, username:this.username, password:this.password, property:Ext.encode(data), setting:Ext.encode(setting)},
						    	    			});
						    	    		}, 
						    	    		scope:this
						    	    	}	
						    	    }
						    	]
					    	}
					    ]
				    }
				]
			}
	    }
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		SvnConfigPanel.superclass.initComponent.apply(this, arguments);
		
		this.svnTree.getRootNode().setText(this.repository);
		this.svnTree.getRootNode().setId(this.repository);
		this.svnTree.Owner = this;
		this.propertyGrid.Owner = this;
	}
});

Ext.reg('SvnConfigPanel', SvnConfigPanel);