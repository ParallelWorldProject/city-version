class Resource{
	//功能：库存上限，库存周期，每日消耗，求援，生产
	constructor(){
		//0-20000，影响20%,满产略大于消耗
		this.medR=5000;
		this.eatR=5000;
		this.reqR=5000;
		this.extR=5000;
		this.fullProduction=250;
		this.dailyConsumption=450;
		this.requestToday=-1;
		this.requestDelay=5;//5天后才能送达
		this.requestAmount=1000;
		this.requests=new Array(MAX_ROUND+10);
		for(let i=0;i<MAX_ROUND;i++) this.requests[i]=-1;
		//alert("resource imported!");
	}
	production()
	{
		//10个生产线，分别生产1*2，2*2，3*2，4*4类资源
		//每日产量和工人数量为log
		let log10=Math.log(10);
		for(let i=0;i<office_number;i++)
		{
			let p=game.offices[i].work_count/game.offices[i].ids.size;//出勤率
			//console.log(p);
			game.offices[i].output_today=parseInt(Math.log(1+p*9)/log10*this.fullProduction);
			if(i<2) this.medR+=game.offices[i].output_today;
			else if(i<4) this.eatR+=game.offices[i].output_today;
			else if(i<6) this.reqR+=game.offices[i].output_today;
			else this.extR+=game.offices[i].output_today;
		}
		//console.log("produced!");
	}
	consumption()
	{
		this.medR-=this.dailyConsumption;
		this.eatR-=this.dailyConsumption; 
		this.reqR-=this.dailyConsumption; 
		this.extR-=this.dailyConsumption*2;
		// total_goods -= necessary expenditure (医疗以后要不要按比例减少?)
		// console.log("consumed!");
	}
	helpme()
	{
		if(this.requestToday!=-1) this.requests[game.day_count+this.requestDelay]=this.requestToday;
		let requestType=this.requests[game.day_count];
		if(requestType==1) this.medR+=this.requestAmount;
		else if(requestType==2) this.eatR+=this.requestAmount;
		else if(requestType==3) this.reqR+=this.requestAmount;
		else if(requestType==4) this.extR+=2*this.requestAmount;
		//可能改为几天要一次？
	}
}