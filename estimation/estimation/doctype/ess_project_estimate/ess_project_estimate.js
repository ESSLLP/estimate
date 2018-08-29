// Copyright (c) 2018, earthians and contributors
// For license information, please see license.txt

frappe.ui.form.on('eSS Project Estimate', {
	refresh: function(frm) {
		if(!frm.doc.__islocal){// && frm.doc.__onload && !frm.doc.__onload.is_customer) {
			frm.add_custom_button(__("Quotation"), function(){
				make_quotation(frm.doc);
			}, __("Make"));
		}
	}
});

var make_quotation=function(doc){
	frappe.call({
					method: "estimation.estimation.utils.make_quotation",
					args:{
						opportunity: doc.opportunity
					},
					callback: function(r) {
						if(!r.exc) {
							var quotation = frappe.model.sync(r.message);
							frappe.set_route("Form", quotation[0].doctype, quotation[0].name);
						}
						else{
							frappe.show_alert({
								message:__('No data'),
								indicator:'orange'
							});
						}
					}
				});
}
