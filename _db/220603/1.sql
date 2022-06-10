update border_district d
join border_dubl_hand_v1 dh on d.id = dh.`border_id`
set d.`coords` = dh.coords, d.`type` = dh.`type`
where object_type = 'district_region'