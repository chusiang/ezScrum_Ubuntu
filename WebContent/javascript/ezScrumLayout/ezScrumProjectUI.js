ezScrum.ProjectMaiUI = Ext.extend(Ext.Viewport, {
	id: 'ProjectInfoMainLayout',
	layout: 'border',
	initComponent: function() {
        this.items = [
            ezScrum.Project_TopPanel,	// src="javascript/ezScrumPanel/Top_Panel.js"
			ezScrum.LeftPanel,			// src="javascript/ezScrumPanel/LeftSide_Panel.js"
			ezScrum.ContentPanel,		// src="javascript/ezScrumPanel/Content_Panel.js"
			ezScrum.FooterPanel			// src="javascript/ezScrumPanel/Footer_Panel.js"
        ];
        
        ezScrum.ProjectMaiUI.superclass.initComponent.call(this);
    }
});
