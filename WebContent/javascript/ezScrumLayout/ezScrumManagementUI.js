ezScrum.ManagementMaiUI = Ext.extend(Ext.Viewport, {
	id: 'ManagementMainLayout',
	layout: 'border',
	initComponent: function() {
        this.items = [
			ezScrum.Management_TopPanel,		// src="javascript/ezScrumPanel/Top_Panel.js"
			ezScrum.Management_LeftPanel,		// src="javascript/ezScrumPanel/ManagementLeftTreePanelBtnEvent.js"
			ezScrum.Management_ContentPanel,	// src="javascript/ezScrumPanel/Management_Content_Panel.js"
			ezScrum.FooterPanel					// src="javascript/ezScrumPanel/Footer_Panel.js"
        ];
        
        ezScrum.ManagementMaiUI.superclass.initComponent.call(this);
    }
});
