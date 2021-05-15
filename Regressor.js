//[iName, lWeight, tWeight, iStar, iReforge, iEnchants,HPB,recomm,enchantWeight, uuid]

function searchSort(i){
	var itemsI =  Items[i];
	var Sortlength = itemsI.length;
	console.log(itemsI);
	if(Sortlength < 4){return;}
	
	var bestFlipWeight = 0;
	
	
	// Loads data (eff)
	var y = []; 
	var x1 = [];
	var x2 = [];
	var x3 = [];
	var x4 = [];
	var lw =[];
	
		for(var j = 0; j < Sortlength; j++){
		y[y.length] = itemsI[j][2];
		 x1[x1.length] = itemsI[j][3]; //star
		 //itemsI[j][4]; reforge
		x2[x2.length] = itemsI[j][6]; //hpb
		x3[x3.length] = itemsI[j][7]; //recomm
		x4[x4.length] = itemsI[j][8]; // enchants
		
		lw[lw.length] = itemsI[j][1]; // Etimated wieghts
	}
	
	var cutAmount = Math.floor(4/5 *Sortlength);
	
var yCut = y.splice(cutAmount,cutAmount);
var x1Cut = x1.splice(cutAmount,cutAmount);
var x2Cut = x2.splice(cutAmount,cutAmount);
var x3Cut = x3.splice(cutAmount,cutAmount);
var x4Cut = x4.splice(cutAmount,cutAmount);	
var lwCut = lw.splice(cutAmount,cutAmount);
	
	
	var idLength = y.length;
		var BS = findMultivaribleLine(yCut ,x1Cut, x2Cut, x3Cut, x4Cut, itemsI[0][0], lwCut);  //add reforge to this list



if(BS[2] === 1){  //multi vairble regression
	
		var why = math.sum(math.size(BS[0]));

		var Runs = BS[1];
		var UF = [[0],[0],[0],[0],[0]];
		
		var j = 0;
		
		for(var i= 0; i < why; i++){
			if(Runs[i] === 0){
				
			UF[i] = math.subset(BS[0], math.index(j));
			j = j+1;}

		} 
		
	var MinMax = [];
	
	//search through items 
	for(var j = 0; j < Sortlength; j++){
		var estimatedSell = Math.floor((UF[1] * x1[j]) + (UF[2] * x2[j]) + (UF[3] * x3[j]) + (UF[4] * x4[j]) + UF[0]);

		
		if(estimatedSell < 100000000){
		var EstimatedMargin = Math.floor(estimatedSell - y[j] - (0.02 * estimatedSell));
		}
		else{
		var EstimatedMargin = Math.floor(estimatedSell - y[j]- 1000000 - (0.01 * estimatedSell));
		}
		MinMax[MinMax.length] = ([EstimatedMargin, itemsI[j]]);
}
}

else{ //sigle varible regression

	var MinMax = [];
	
	for(var j = 0; j < Sortlength; j++){
		var estimatedSell = Math.floor(BS[0] * lw[j] + BS[1]);

		
		if(estimatedSell < 100000000){
		var EstimatedMargin = Math.floor(estimatedSell - y[j] - (0.02 * estimatedSell));
		}
		else{
		var EstimatedMargin = Math.floor(estimatedSell - y[j]- 1000000 - (0.01 * estimatedSell));
		}
		MinMax[MinMax.length] = ([EstimatedMargin, itemsI[j]]);
}
	
	
	
}


//sort
MinMax.sort(function(a, b){return b[0] - a[0]});


flipData[flipData.length] = MinMax
Priority[Priority.length] = [MinMax[0][0], flipData.length-1];
}



function findMultivaribleLine(y, x1, x2,x3, x4, name, lw) { //add x5, reforges

	var bVaule = [0,0,0,0,0];
	//Y matrix
	var matrixY = math.matrix(y);
	//X matrix
	//generate first row
	var ones = [];
	for(var i= 0; i < x1.length; i++){
	ones[ones.length] = 1;
	}
	

	//find error causing things
	if(math.mean(x1) === math.min(x1)){
	bVaule[1] = 1	}
	
	if(math.mean(x2) === math.min(x2)){
	bVaule[2] = 1	}
	
	if(math.mean(x3) === math.min(x3)){
	bVaule[3] = 1	}
	
	if(math.mean(x4) === math.min(x4)){
	bVaule[4] = 1	}	
	
	
	
//Create adjusted or noraml matrix	
var arrayX = [];
	 arrayX[0] = ones;
	
	if(bVaule[1] === 0){
		arrayX[arrayX.length] = x1; 
	}
	
	if(bVaule[2] === 0){	
		arrayX[arrayX.length] = x2;
	}

	if(bVaule[3] === 0){
		arrayX[arrayX.length] = x3;
	}

	if(bVaule[4] === 0){
		arrayX[arrayX.length] = x4;
	}
	
	var matrixX = math.transpose(math.matrix(arrayX));

	

	//Calc (X'X)^-1
	var matrixXT = math.transpose(matrixX);
	var matrixXX = math.multiply(matrixXT,matrixX);

//If not enough data is availible it will go to standard linear regression
try{
	var matrixXXInverse = math.inv(matrixXX);
	}
	catch{
		console.log(name);
	console.log(matrixY);
	console.log(matrixX);
	console.log(matrixXX);
	console.log(bVaule);
		console.log("fail");
		return linarRegression(y,lw);}  
	
	var matrixXY = math.multiply(matrixXT,matrixY);
	
	var matrixB = math.multiply(matrixXXInverse,matrixXY);
console.log("yay");
	return [matrixB,bVaule,1];}
	
	
	
	function linarRegression(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;


    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;

    /*
     * We will make the x and y result line now
     */
    var result_values_x = [];
    var result_values_y = [];

    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    return [result_values_x, result_values_y, 0];
}
	
	
	