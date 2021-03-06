$( document ).ready(function() {

	//Check to ensure page finishes load
	var checkExist = setInterval(function() {
	if ($('.lineup__player-score > .definition__value').length) {
		clearInterval(checkExist);
		myAliveScoring();

		//Load comparison scoring if query str exists
		if(getUrlVars() != null)
			theirAliveScoring();
		
		if( $('.live-comparison-entry').hasClass('h2h-opponent') )
			theirAliveScoring();
		}
		}, 2000);



	//Check every two seconds for query change
	var loadStr = getUrlVars();
	var testStr = '';
	
	var checkExistQS = setInterval(function() {

		testStr = getUrlVars();

		if ( loadStr != testStr ) {
			//clearInterval(checkExistQS);
			theirAliveScoring();
			loadStr = testStr;
			}
			}, 2000);
	
});

function myAliveScoring() {


	var myTotalProj = 0;
	var myActualTotalSalary = 0;

		//Add in Actual Salary (value of total pts/5)
	$('.live-entry').find('.lineup__player').each( function(num, ele) {

			//Get player score
			var score = $(ele).find('.lineup__player-score').find('.definition__value').html();

			//See if actual salary is higher or lower than FD salary to pick color
			if (salaryToInt(getActualSalary(score)) > salaryToInt(  $(ele).find('.lineup__player-salary').find('.definition__value').html() ))
					var color = "green";
			else
					var color = "#444";

			//Inject actual salary with color - style="color:'+color+';
			$(ele).find('.lineup__player-salary').after(
				'<dl class="definition lineup__player-actual-salary"><dd class="definition__value" >' + getActualSalary(score) + '</dd><dt class="definition__key">5x Salary</dt></dl>'
				);

			//Inject value multiple with color style="color:'+color+';
			$(ele).find('.lineup__player-salary').after(
				'<dl class="definition lineup__player-actual-salary"><dd class="definition__value" >' + getMultiple( getProjectedPoints(ele),salaryToInt(  $(ele).find('.lineup__player-salary').find('.definition__value').html())) +'x' +'</dd><dt class="definition__key">Proj Multi</dt></dl>'
				);

			//Total up actual salary to total for display
				myActualTotalSalary += salaryToInt(getActualSalary(score));

			//Inject projected points

			$(ele).find('.lineup__player-score').after(
				'<dl class="definition lineup__player-proj-score lineup__player-score"><dd style="color:green !important;">' + getProjectedPoints(ele) +'</dd></dl>'
				);
			
			if( !isNaN(getProjectedPoints(ele)) )
				myTotalProj += getProjectedPoints(ele);
	});//close each loop

		//Add total actual salary, need to check to see if user is viewing their own or not (if it was their own they would have entry-id)
		if ($('.contest-position-periods-remaining').find('.entry-id').length)
			$('.contest-position-periods-remaining').find('.entry-id').after(
				'<dl class="entry-detail entry-my-actual-value"><dd>'+intToSalary(myActualTotalSalary)+'</dd><dt>Actual Value</dt></dl>'
				);
		else
			$('.live-entry').find('.contest-position-periods-remaining').find('.user-winnings').after(
				'<dl class="entry-detail entry-lurker-actual-value"><dd>'+intToSalary(myActualTotalSalary)+'</dd><dt>Actual Value</dt></dl>'
				);


		//Inject projected points
		$('.live-entry').find('.score').append('<camel-number value="'+myTotalProj+'"><span class="camel-number" style="color:green !important;"><em> '+myTotalProj+'</em>.00</span></camel-number>');
};

function theirAliveScoring() {

	var theirActualTotalSalary = 0;
	var theirProjTotal = 0;
		//Add in Actual Salary (value of total pts/5)
	$('.live-comparison-entry').find('.lineup__player').each( function(num, ele) {

			//Get player score
			var score = $(ele).find('.lineup__player-score').find('.definition__value').html();

			//See if actual salary is higher or lower than FD salary to pick color
			//debugger;
			if (salaryToInt(getActualSalary(score)) > salaryToInt(  $(ele).find('.lineup__player-salary').find('.definition__value').html() ))
					var color = "green";
			else
					var color = "#444";

			//Inject actual salary with color - style="color:'+color+';
			$(ele).find('.lineup__player-salary').after(
				'<dl class="definition lineup__player-actual-salary"><dd class="definition__value" ">' + getActualSalary(score) + '</dd><dt class="definition__key">5x Salary</dt></dl>'
				);

			//Inject value multiple with color - style="color:'+color+';
			$(ele).find('.lineup__player-salary').after(
				'<dl class="definition lineup__player-actual-salary"><dd class="definition__value" ">' + getMultiple(getProjectedPoints(ele),salaryToInt(  $(ele).find('.lineup__player-salary').find('.definition__value').html())) +'x' +'</dd><dt class="definition__key">Proj Multi</dt></dl>'
				);

			//Inject projected points
			$(ele).find('.lineup__player-score').after(
				'<dl class="definition lineup__player-proj-score "><dd class="lineup__player-proj-score " style="color:green !important;">' + getProjectedPoints(ele) +'</dd></dl>'
				);
			theirProjTotal+=getProjectedPoints(ele);
			//Total up actual salary to total for display
				theirActualTotalSalary += salaryToInt(getActualSalary(score));
				
	});

		//Add total actual salary
		$('.live-comparison-entry').find('.user-winnings').after(
			'<dl class="entry-detail entry-their-actual-value"><dd>'+intToSalary(theirActualTotalSalary)+'</dd><dt>Actual Value</dt></dl>'
			);

		//Inject projected points
		$('.live-comparison-entry').find('.score').append('<camel-number value="'+theirProjTotal+'"><span class="camel-number" style="color:green !important;"><em> '+theirProjTotal+'</em>.00</span></camel-number>');

};

//This grabs points of player and coverts it to a multiple
function getMultiple(scr,sal)
{
	return Math.round(  (scr/(sal*.001))  *10)/10;
};

//This grabs points of player and coverts it to a salary string $XX,XXX
function getActualSalary(scr) {
	//Get pts
	var score = scr;

	//Convert to string
	score = score/5;
	var tens;
	var thous;
	tens = (score - (score%1));
	thous = Math.round ((score%1)*1000);

	//Adds 000 to string if needed
	if(thous == 0)
		return '$'+tens.toString()+',000';

	if(thous < 100)
		return '$'+tens.toString()+','+thous.toString()+'0';

	return '$'+tens.toString()+','+thous.toString();
};

//Simply converts salary string to int
function salaryToInt (sal)
{
	var salInt = sal.replace(",", "");
	salInt = salInt.replace("$", "");
	return parseInt(salInt);
}

//Convert int of salary to string display, there must be a better way
function intToSalary (sal)
{

	if (sal<10000)
	{
		var salStr = sal.toString();
		if(sal%1000==0)
			return '$'+salStr.substring(0,1)+','+salStr.substring(1,4);
		return '$'+salStr.substring(0,1)+','+salStr.substring(1,4);
	}


	var salStr = sal.toString();

	if(sal%1000 == 0)
			return '$'+salStr.substring(0,2)+','+salStr.substring(3,7)+'0';

	return '$'+salStr.substring(0,2)+','+salStr.substring(2,7);
}

//Stole this from the internet	
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    //ugly
    return vars[hash[0]];
}

