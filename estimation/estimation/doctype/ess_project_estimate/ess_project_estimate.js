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
	},
	total_item_cost: function(frm) {
		calculate_total_estimated_cost(frm);
	},
	estimated_expenses: function(frm) {
		calculate_total_estimated_cost(frm);
	},
	estimated_activity_costs: function(frm) {
		calculate_total_estimated_cost(frm);
	}
});

frappe.ui.form.on('eSS Project Estimate Item', {
	item_code: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		frappe.call({
			method: "frappe.client.get_value",
			args: { doctype: "Item Price",
							filters: {
								"price_list": frm.doc.buying_price_list,
								"item_code": child.item_code
							},
							fieldname: "price_list_rate"
						},
			callback: function(r){
				frappe.model.set_value(cdt, cdn, 'price_list_rate', r.message.price_list_rate);
			}
		});
	},
	price_list_rate: function(frm, cdt, cdn) {
		calculate_item_amount(cdt, cdn);
	},
	qty: function(frm, cdt, cdn) {
		calculate_item_amount(cdt, cdn);
	},
	amount: function(frm, cdt, cdn) {
		calculate_item_total_amount(frm, cdt, cdn);
	},
	items_remove: function(frm, cdt, cdn) {
		calculate_item_total_amount(frm, cdt, cdn);
	}
});

var calculate_total_estimated_cost = function(frm) {
	let total_cost = 0;
	if(frm.doc.estimated_expenses){
		total_cost += frm.doc.estimated_expenses
	}
	if(frm.doc.estimated_activity_costs){
		total_cost += frm.doc.estimated_activity_costs
	}
	if(frm.doc.total_item_cost){
		total_cost += frm.doc.total_item_cost
	}
	frm.set_value("total_estimated_cost", total_cost);
	frm.refresh_field("total_estimated_cost");
}

var calculate_item_amount = function(cdt, cdn) {
	var child = locals[cdt][cdn];
	if(child.price_list_rate && child.qty){
		frappe.model.set_value(cdt, cdn, 'amount', child.price_list_rate * child.qty);
	}
}

var calculate_item_total_amount = function(frm, cdt, cdn) {
	let total_amount = 0;
	var tbl = frm.doc.items;

	for(var i = 0; i < tbl.length; i++){
		if(cint(tbl[i].amount) > 0) {
			total_amount += flt(tbl[i].amount);
		}
	}
	frm.doc.total_item_cost = total_amount;
	calculate_total_estimated_cost(frm);
	frm.refresh_field('total_item_cost');
}

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
