// CONST
const healthy= 7; // 0 for healthy, 1 for 潜伏不传染，2 - 潜伏可传染，3 - 轻，4 - 重，5 - 死， 6 - 治愈
const MAX_ROUND=150;
const office_number = 10, neighbor_number = 10, hospital_number = 1, people_number = 1000;
const parameter_number = 8;
//parameters_for_UI[8]; // 0 - 活着的总人数，1 - 健康或潜伏人数，2 - 生病人数，3 - 可上班人数，4 - 轻症，5 - 重症，6 - 死亡，7 - 治愈

class Game {
    constructor (total_ppl, total_patients, total_neigh, total_hospital, total_quarantine, total_office) {
        this.total_ppl = total_ppl;
        this.total_healthy = total_ppl;
        this.total_infected = 0;
        this.total_patients = total_patients;
        this.total_neigh = total_neigh;
        this.total_hospital = total_hospital;
        this.total_quarantine = total_quarantine;
        this.total_office = total_office;
	this.parameters_for_UI=new Array(parameter_number);
	this.day_count=0;
	this.health_statistics=[1,0,0,0,0,0,0];
	this.total_cured=0;
	
	this.offices = [];
	this.neighbors = [];
	this.hospitals = [];
	for(let i=0;i<office_number;i++) { let o=new office(); this.offices.push(o);}
	for(let i=0;i<neighbor_number;i++) { let o=new neighbor(); this.neighbors.push(o);}
	for(let i=0;i<hospital_number;i++) { let o=new hospital(); this.hospitals.push(o);}
	this.people=[];
	this.ids=new Set();
	//this.pplSet=new Set();
	this.resource=new Resource();
	this.office_quarantine_choice=new Array(office_number);
	this.neighbor_quarantine_choice=new Array(neighbor_number);
	this.hospital_quarantine_choice=new Array(hospital_number);
	this.last_quarantine_ids=new Set();
	this.is_quarantined=new Array(people_number);
	for(let i=0;i<people_number;i++) this.is_quarantined[i]=false;
	this.hospital_work_rate=1;
	this.yesterday_cure=0;
    }

    startGame() {
        let idSet = new Set()
        //let pplSet = new Set()
//随机一些人感染，假设是20个
	var ttt=20;
	var people_count=0;
        while (people_count < people_number) {
//console.log(idSet.size );
            //number between 1 - 1000
            var rand = Math.floor(Math.random() * 1000) + 1;

            if (idSet.add(rand)) {
                // only add to office 0 for now.
                console.log("succ")
	var health_status=0;
	if(ttt>0){ttt--;health_status=1;}
                var p = new person(rand, health_status)
                //this.pplSet.add(p);
	this.people.push(p);
	this.ids.add(people_count);
	//一半去生产线，一半去医院
	if(rand%(office_number+hospital_number)<office_number)
		this.offices[rand%(office_number+hospital_number)].ids.add(people_count);
	else this.hospitals[rand%(office_number+hospital_number)-office_number].ids.add(people_count);
	this.neighbors[rand%neighbor_number].ids.add(people_count);
	people_count++;
            }
        }
       //var neigh = new neighbor(this.pplSet);
        //neigh.printIds()
    }
	updateGameStatus (){
		var ttt=new Array(parameter_number);
		ttt=calculationForUI(this.ids);
		this.parameters_for_UI=ttt;
		this.total_ppl=ttt[0];this.total_healthy=ttt[1];this.total_infected=ttt[2];this.total_cured=ttt[7];
		
for(let i=0;i<office_number;i++) this.offices[i].parameters_for_UI=calculationForUI(this.offices[i].ids);
for(let i=0;i<neighbor_number;i++) this.neighbors[i].parameters_for_UI=calculationForUI(this.neighbors[i].ids);
for(let i=0;i<hospital_number;i++) this.hospitals[i].parameters_for_UI=calculationForUI(this.hospitals[i].ids);

		document.getElementById('currentCityStatus').innerText = "Day "+this.day_count+"\n今日状态更新 \n 当前总人数: " + this.total_ppl + " \n 健康或潜伏人数: " + this.parameters_for_UI[1] + " \n 轻症人数: " + this.parameters_for_UI[4]+ " \n 重症人数: " + this.parameters_for_UI[5]+ " \n 死亡人数: " + this.parameters_for_UI[6] + " \n 治愈人数: " + this.parameters_for_UI[7] +" \n 医疗资源: " + this.resource.medR+" \n 食品资源: " + this.resource.eatR+" \n 非必需品: " + this.resource.reqR+" \n 非必需品: " + this.resource.extR ;
	}

}

function printEach (val) {
    console.log(val);
}

class neighbor {
	constructor () {
		this.ids=new Set();
		this.cap=100;
		this.parameters_for_UI=new Array(parameter_number);
		
	}
    getNeighborSize() {
        console.log(this.ids.size)
    }
    printIds() {
        this.ids.forEach(printEach)
    }
}
//医院暂时没人工作，全是病人，全自动治疗，明天再加这个功能，这个类暂时没用
//治疗和死亡人数暂时无法记录，因为医院内外的治愈和死亡合并为了一个魔法过程
class hospital {
	constructor () {
		this.ids=new Set();
		this.cap=100;
		this.parameters_for_UI=new Array(parameter_number);
		this.work_count=0;//今天努力工作的人数（去掉隔离的）
		this.patient_count=0;
		//this.sick_people_count=0;//不知道每个人去哪个医院，就不知道每个医院里新感染的医生数量
	}
}


class office {
	constructor () {
		this.ids=new Set();
		this.cap=100;
		this.parameters_for_UI=new Array(parameter_number);
		this.output_today=0;
		this.work_count=0;//今天努力工作的人数（去掉隔离的）
		this.new_sick_count=0;//生产线上新感染的人
	}
}

class person {
    constructor (id, health_status) {
        this.id = id;
        this.health_status = health_status;
        //this.office = office;
    }


}

// Initialize. Create a game
alert("150天，死亡率在4%以下，物资没有用完过，就算赢哦！");
var game = new Game(100, 0, 1, 1, 0, 0);
game.startGame ();
//game.neighbors[0].printIds();

// Start the Game (100 days)
var day = 0;
function updateDays() {
    //document.getElementById('day_index').innerText = "Today is: Day " + (day++) + " (night)";
    //setTimeout(updateDays, 1000);
}
updateDays();game.updateGameStatus ();quarantine();

function contagion(ids) //set of people's id who participate in this stage of contagion
{
	var ret=0;
	var x=0, y=0, t=ids.size; //分别是 传染源， 未传染人数，环节总人数
	for (var ttt of ids)
	if(game.is_quarantined[ttt]==false)
	{
		let cur=game.people[ttt];
		switch(cur.health_status){
			case 0: 
				y++; break;
			case 2:
			case 3:
			case 4:
				x++; break;
			case 5:
				t--; break;
			
		}
	}
	var p=x/t*2; //现在是正比例，2是随便取的参数，之后考虑根据症状程度再细化
	//console.log(p,x,t);
	for (var ttt of ids)
	{
		let cur=game.people[ttt];
		if(cur.health_status==0&&Math.random()<p) // 那个binomial什么的不太清楚，这里是正常人有p的概率感染
			{game.people[ttt].health_status=1; ret++;}
	}
	return ret;
}

function updateHealthStatus()
{
	game.yesterday_cure=game.total_cured;
	//markov_chain第一行: 轻保持，轻变重，轻变死，轻变治愈
	//research fact: 重症易死9倍
	var delta=game.resource.medR*0.0000005*game.hospital_work_rate;
	//2000物资改变0.001，上限0.01, 再乘以出勤率
	if(delta>0.01) delta=0.01;
	//alert(delta);
	var one_to_two=0.01, two_to_three=0.01, markov_chain=[[0.97,0.01-delta/2,0.01-delta/2,0.01+delta],
					       [0.01+delta/2,0.97,0.01-delta,0.01+delta/2],
					       [0,0,1,0],
					       [0,0,0,1]];//后续调这里的参数就行
	for (let tttt=0; tttt<people_number; tttt++)
	{
		let cur=game.people[tttt];
		switch(cur.health_status){
			case 3:
			case 4:
				var ttt=cur.health_status-3;
				var p1=markov_chain[ttt][0];
				var p2=p1+markov_chain[ttt][1];
				var p3=p2+markov_chain[ttt][2];
				var ppp=Math.random();
				if(ppp<p1) cur.health_status=3;
				else if(p1<=ppp&&ppp<p2) cur.health_status=4;
				else if(p2<=ppp&&ppp<p3) cur.health_status=5;
				else cur.health_status=6;
				break;
			case 2:
				if(Math.random()<two_to_three) cur.health_status++;break;
			case 1:
				if(Math.random()<one_to_two) cur.health_status++;break;
			
		}
	}
}

function gameLoop() //after the players' operations in the evening, the game loop begins in the next morning
{
	updateDays();
	game.day_count++;
	//update health condition
	updateHealthStatus();
	
	//transportation contagion 1:
	contagion(game.ids); // 学长说先不拓扑，那就大家一起玩吧

	//office: contagion & production
	var sss=new Set();
	for(let i=0;i<office_number;i++)
	{
	for (var cur of game.offices[i].ids)
		if(game.people[cur].health_status<3||game.people[cur].health_status==6) sss.add(cur);
	game.offices[i].new_sick_count=contagion(sss); // 健康，潜伏可/不可传染，和治愈 参与生产
	//console.log(game.offices[i].new_sick_count);
	sss.clear();
	}
	game.resource.production();
	
	//hospital: contagion (治疗和自愈统一成一个概率每天早上更新)
	sss.clear();
	for(let i=0;i<hospital_number;i++)
		for (var cur of game.hospitals[i].ids)
			sss.add(cur);
	game.hospitals[0].patient_count=0;
	for(var cur of game.ids)
		if(game.people[cur].health_status==4||game.people[cur].health_status==5) 
			{sss.add(cur);game.hospitals[0].patient_count++;}
	contagion(sss);//轻症、重症去医院，医生可能遭殃

	//transportation contagion
	contagion(game.ids);
	
	//update
	game.updateGameStatus(); 

	// game state check:
	if (game.day_count>MAX_ROUND)
	{
		if(game.total_ppl > people_number*0.96) alert("Congratulation! YOU WIN!!!");
		else alert("YOU LOSE! Try again to see if you can do better!");
	}
	if (game.resource.medR<0||game.resource.eatR<0||game.resource.reqR<0||game.resource.extR<0)
		alert("YOU LOSE! Try again to see if you can do better!");
	// if (game.total_goods < lower_limit || game.total_ppl < lower_limit || game.total_healthy/game.total_ppl <lower_limit) lose!;

	// player's operations (as in the file):
	//1. quarantine
	//console.log(game.neighbor_quarantine_choice);
	//console.log(game.office_quarantine_choice);
	quarantine();

	// 日常消耗资源
	game.resource.consumption();
	// choose to get goods (from donation or government)
	game.resource.requestToday = document.getElementById("request_type_1").value;
	//alert(game.resource.requestToday);
	game.resource.helpme();
}
