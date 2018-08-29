// Copyright (c) 2018, earthians and contributors
// For license information, please see license.txt

{% include 'erpnext/selling/sales_common.js' %}

frappe.ui.form.on('eSS Project Estimate', {
	refresh: function(frm) {
		if(!frm.doc.__islocal){// && frm.doc.__onload && !frm.doc.__onload.is_customer) {
			frm.add_custom_button(__("Quotation"), function(){
				make_quotation(frm.doc);
			}, __("Make"));
		}
	}
});

/*
frappe.ui.form.on("eSS Activity Estimate", {
  hours: function(frm, cdt, cdn) {
  var child = locals[cdt][cdn];
	if (child.billing_rate && child.hours){
			frappe.model.set_value(cdt, cdn, 'billing_amount', child.billing_rate * child.hours);
		}
	if (child.costing_rate && child.hours){
			frappe.model.set_value(cdt, cdn, 'costing_amount', child.costing_rate * child.hours);
		}
  }
});*/

/*
erpnext.selling.ProjectEstimateController = erpnext.selling.SellingController.extend({
	refresh: function(doc, dt, dn) {
		this._super(doc, dt, dn);

		var me = this;

		if (this.frm.doc.docstatus===0) {
			this.frm.add_custom_button(__('Quotation'),
				function() {
					var setters = {};
					if(me.frm.doc.customer) {
						setters.customer = me.frm.doc.customer || undefined;
					} else if (me.frm.doc.lead) {
						setters.lead = me.frm.doc.lead || undefined;
					}
					erpnext.utils.map_current_doc({
						method: "erpnext.crm.doctype.opportunity.opportunity.make_quotation",
						source_doctype: "Opportunity",
						target: me.frm,
						setters: setters,
						get_query_filters: {
							status: ["not in", ["Lost", "Closed"]],
							company: me.frm.doc.company,
							// cannot set opportunity_type as setter, as the fieldname is order_type
							opportunity_type: me.frm.doc.order_type,
						}
					})
				}, __("Get items from"), "btn-default");
		}
	}
});*/

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
