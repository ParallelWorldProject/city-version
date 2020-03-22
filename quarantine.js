function newNeighborEvent() {
	alert("neighborhood quarantine plan set!");
	//game.resource.tmpProduction=document.getElementById('production_type_1').value;
	var ttt=document.getElementById('neigh_1_event').value;
	for(let i=neighbor_number-1;i>=0;i--){
		game.neighbor_quarantine_choice[i]=ttt%10;
		ttt-=ttt%10;ttt/=10;
	}
}
function newOfficeEvent() {
	alert("production line quarantine plan set!");
	//game.resource.tmpProduction=document.getElementById('production_type_1').value;
	var ttt=document.getElementById('office_1_event').value;
	for(let i=office_number-1;i>=0;i--){
		game.office_quarantine_choice[i]=ttt%10;
		ttt-=ttt%10;ttt/=10;
	}
}
function newHospitalEvent() {
	alert("hospital quarantine plan set!");
	//game.resource.tmpProduction=document.getElementById('production_type_1').value;
	var ttt=document.getElementById('hospital_1_event').value;
	for(let i=hospital_number-1;i>=0;i--){
		game.hospital_quarantine_choice[i]=ttt%10;
		ttt-=ttt%10;ttt/=10;
	}
}
function quarantine()
{
	//复活上次
	for(var ttt of game.last_quarantine_ids) game.is_quarantined[ttt]=false;
	game.last_quarantine_ids.clear();
	//干掉这次
	for(let i=0;i<office_number;i++) 
	       if(game.office_quarantine_choice[i])
		for(var ttt of game.offices[i].ids)
		{
			game.last_quarantine_ids.add(ttt);
			game.is_quarantined[ttt]=true;
		}
	for(let i=0;i<neighbor_number;i++) 
	       if(game.neighbor_quarantine_choice[i])
		for(var ttt of game.neighbors[i].ids)
		{
			game.last_quarantine_ids.add(ttt);
			game.is_quarantined[ttt]=true;
		}
	for(let i=0;i<hospital_number;i++) 
	       if(game.hospital_quarantine_choice[i])
		for(var ttt of game.hospitals[i].ids)
		{
			game.last_quarantine_ids.add(ttt);
			game.is_quarantined[ttt]=true;
		}

	//更新工作人数
	for(let i=0;i<office_number;i++) 
	{
		game.offices[i].work_count=game.offices[i].parameters_for_UI[3];
		for(var ttt of game.offices[i].ids)
			if((game.people[ttt].health_status<3||game.people[ttt].health_status==6)&& game.is_quarantined[ttt])
				game.offices[i].work_count--;
	}
	let hospital_work_count=0,hospital_total_worker=0;
	for(let i=0;i<hospital_number;i++) 
	{
		game.hospitals[i].work_count=game.hospitals[i].parameters_for_UI[3];
		for(var ttt of game.hospitals[i].ids)
			if((game.people[ttt].health_status<3||game.people[ttt].health_status==6)&&game.is_quarantined[ttt])
				game.hospitals[i].work_count--;
		hospital_total_worker+=game.hospitals[i].ids.size;
		hospital_work_count+=game.hospitals[i].work_count;
	}
	game.hospital_work_rate=hospital_work_count/hospital_total_worker;
}