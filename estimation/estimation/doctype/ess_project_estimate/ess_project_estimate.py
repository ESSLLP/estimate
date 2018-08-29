# -*- coding: utf-8 -*-
# Copyright (c) 2018, earthians and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class eSSProjectEstimate(Document):
	def on_submit(self):
		if frappe.db.exists("Opportunity", self.opportunity):
			opportunity_doc = frappe.get_doc("Opportunity", self.opportunity)
			opportunity_doc.total_estimated_cost = self.total_estimated_cost
			opportunity_doc.estimated_cost_of_boq_items = self.total_item_cost
			opportunity_doc.estimated_expenses = self.estimated_expenses
			opportunity_doc.estimated_activity_costs = self.estimated_activity_costs
			opportunity_doc.save(ignore_permissions=True)
