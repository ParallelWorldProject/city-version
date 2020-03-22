function calculationForUI(ids){
	var ret=new Array(parameter_number);
	for(let i=0;i<parameter_number;i++) ret[i]=0;
	ret[0]=ids.size;
	for (var ttt of ids)
	{
		let cur=game.people[ttt];
		switch(cur.health_status){
		case 6:
			ret[7]++;
		case 0:
			ret[1]++;ret[3]++; break;
		case 1:
		case 2:
			ret[1]++;ret[3]++;break;
		case 3:
			ret[2]++;ret[4]++;break;
		case 4:
			ret[2]++;ret[5]++;break;
		case 5: 
			ret[0]--; ret[6]++; break;
		}
	}
	return ret;
}

function printNeighbors(id)
{
	return "<strong>社区-"+id+" 封锁情况: " + (game.neighbor_quarantine_choice[id-1] ? "是" : "否") + "<br> 健康或潜伏: " +game.neighbors[id-1].parameters_for_UI[1] + "<br> 有症状: " +game.neighbors[id-1].parameters_for_UI[2] + "<br> 死亡: "+game.neighbors[id-1].parameters_for_UI[6] ;
}

function printHospitals()
{
	return "<strong>工作医生: " + game.hospitals[0].work_count + "<br> 接受病人: "+ game.hospitals[0].patient_count+ "<br> 出院人数: "+(game.total_cured-game.yesterday_cure);
}

function printOffices(id)
{
	switch(id){
		case 1: ttt="医疗资源工厂-1";break;
		case 2: ttt="医疗资源工厂-2";break;
		case 3: ttt="食品工厂-1";break;
		case 4: ttt="食品工厂-2";break;
		case 5: ttt="日用必需品工厂-1";break;
		case 6: ttt="日用必需品工厂-2";break;
		case 7: ttt="非必需品工厂-1";break;
		case 8: ttt="非必需品工厂-2";break;
		case 9: ttt="非必需品工厂-3";break;
		case 10: ttt="非必需品工厂-4";break;
	}
	return "<strong>"+ttt+ " 封锁情况: " + (game.office_quarantine_choice[id-1] ? "是" : "否") + "<br> 生产: " +game.offices[id-1].output_today + "<br> 工人: " +game.offices[id-1].work_count+ "<br> 新感染者（进入潜伏期）: " +game.offices[id-1].new_sick_count ;
}