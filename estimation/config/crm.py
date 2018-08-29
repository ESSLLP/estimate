from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Project Estimate"),
			"icon": "fa fa-star",
			"items": [
				{
					"type": "doctype",
					"name": "eSS Project Estimate",
					"description": _("Estimate before creating Quotation"),
				}
			]
		}
	]
