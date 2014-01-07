Ext.ns('ezScrum');

/* Drop Sprint From Release Widget */
ezScrum.DropSprintFromReleaseWidget = Ext.extend(Ext.Window, {
			title : 'Drop Sprint',
			height : 140,
			width : 450,
			modal : false,
			releaseId : '-1',
			sprintId : '-1',
			closeAction : 'hide',
			initComponent : function() {
				var config = {
					// Delete Retrospective action url
					url : 'rmSprintFromRelease.do',
					items : {
						xtype : 'label',
						html : 'Are you sure to drop this Sprint from this release?<br/>'
					},
					buttons : [{
								text : 'Drop',
								scope : this,
								handler : this.onDrop
							}, {
								text : 'Cancel',
								scope : this,
								handler : this.onCancel
							}]
				}

				Ext.apply(this, Ext.apply(this.initialConfig, config));
				ezScrum.DropSprintFromReleaseWidget.superclass.initComponent
						.apply(this, arguments);

				this.addEvents('DropSprintSuccess', 'DropSprintFailure');
			},
			dropSprint : function(releaseId, sprintId) {
				this.releaseId = releaseId;
				this.sprintId = sprintId;
				this.show();
			},
			// Drop action
			onDrop : function() {
				// 顯示 Mask
				var myMask = new Ext.LoadMask(this.getEl(), {
							msg : "Please wait..."
						});
				myMask.show();
				// Ajax request
				var obj = this;
				Ext.Ajax.request({
							url : this.url,
							success : function(response) {
								obj.onSuccess(response);
							},
							failure : function(response) {
								obj.onFailure(response);
							},
							params : {
								ReleaseId : this.releaseId,
								SprintId : this.sprintId
							}
						});
			},
			// 按下取消按鈕 關閉刪除Retrospective視窗
			onCancel : function() {
				this.hide();
			},
			// Ajax request 成功
			onSuccess : function(response) {
				// 隱藏 Mask
				var myMask = new Ext.LoadMask(this.getEl(), {
							msg : "Please wait..."
						});
				myMask.hide();
				// 讀取回應資料
				var rs = sprintForDropReader.readRecords(response.responseXML);
				 //顯示回應資料
				var record = rs.records[0];
				if (record) {
					this.fireEvent('DropSprintSuccess', this, response,
							record.data['Id']);
				} else
					this.fireEvent('DropSprintFailure', this, response,
							this.sprintId);
			},
			onFailure : function(response) {
				// 隱藏 Mask
				var myMask = new Ext.LoadMask(this.getEl(), {
							msg : "Please wait..."
						});
				myMask.hide();

				this.fireEvent('DropSprintFailure', this, response,
								this.sprintId);
			}
		});