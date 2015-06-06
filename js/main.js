$(document).ready(function(){
	// declare and initialize global variables
	var matrix = $("#matrix table");
	var display = $("#display div");
	var seq1 = "";
	var seq2 = "";	
	var matchScore = "";
	var mismatchScore = "";
	var gap = "";
	var m = "";
	var n = "";
	var S = "";
	
	
	
	// ------------------------------------- Random Sequence Generation ------------------------------------- //
	// Bla bla bla
	$("#seq1RandButton, #seq2RandButton").click(function(){
		$(this).next("input").val(randomSequence(5));
	});
	
	function randomSequence(sequenceLength)
	{
		var sequence = "";
		var possible = "ACGT";

		for( var i=0; i < sequenceLength; i++ )
			sequence += possible.charAt(Math.floor(Math.random() * possible.length));
		
		return sequence;
	}
	// ------------------------------------- Random Sequence Generation ------------------------------------- //

	
	
	// ------------------------------------- UI ------------------------------------- //
	// Whenever the user clicks the process button we filter all white spaces from the inputs and call the main function process().
	
	$("#submitButton").click(function(){
		//remove all whitespaces from the inputs
		$("#seq1Input").val($("#seq1Input").val().replace(/\s/g, ""));
		$("#seq2Input").val($("#seq2Input").val().replace(/\s/g, ""));
		
		// call our main function
		process();
		
	});
	
	
	
	
	// ------------------------------------- UI ------------------------------------- //
	
	
	
	
	
	
	
	
	
	
	
	// ------------------------------------- UI Choose File ------------------------------------- //
	// There are 2 inputs of type "file" in our page.
	// Whenever a user selects a new file,
	// We get that file's content and enter it in the text input for the corresponding sequence.
	// We also disable the process button until the file has been properly loaded
	
	
	$('#file1').change(function(e){
		if (e.target.files.length > 0){
			$("#submitButton").prop("disabled",true).html("Please Wait");
			var files = e.target.files;
			var file = files[0];
				var reader = new FileReader();
				reader.onload = function() {
					$("#seq1Input").val((this.result).replace(/\s/g, ""));
					$("#submitButton").prop("disabled",false).html("Process");
				}
				reader.readAsText(file);
			
		}

	});
	
	$('#file2').change(function(e){
		if (e.target.files.length > 0){
			$("#submitButton").prop("disabled",true).html("Please Wait");
			var files = e.target.files;
			var file = files[0];
				var reader = new FileReader();
				reader.onload = function() {
					$("#seq2Input").val((this.result).replace(/\s/g, ""));
					$("#submitButton").prop("disabled",false).html("Process");
				}
				reader.readAsText(file);
			
		}

	});

	
	
	

	// ------------------------------------- UI Choose File ------------------------------------- //
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// -------------------------------------------- Functions -------------------------------------------- //
	
	
	// Function process()
	// Gathers all data necessary. Creates and calculates the Dynamic matrix
	// Input: No parameter input but it needs both sequences and the match/mismatch/gap-penalty scores to be entered in the appropriate HTML input fields.
	// Output: No direct output. At the end it calls 2 functions, one to print the matrix to the screen and one to perform the traceback function and find an optimal alignment.
	function process(){
	
		// Check if all necessary input has been entered.
		if ( $("#seq1Input").val()=="" || $("#seq2Input").val()=="" || $("#matchScore").val()=="" || $("#mismatchScore").val()=="" || $("#gapPenalty").val()==""){
			alert("Please fill in the appropriate fields.");
			return;
		}
		
		
		// Get inputs and assign them to our variables.
		if ($('#caseSensitive').is(':checked')){ // Check if the case sensitive option has been selected and if not transform both sequences to the same letter case.
			seq1 = $("#seq1Input").val();
			seq2 = $("#seq2Input").val();
		}else{
			seq1 = $("#seq1Input").val().toUpperCase();
			seq2 = $("#seq2Input").val().toUpperCase();
		}
		matchScore = parseInt($("#matchScore").val());
		mismatchScore = parseInt($("#mismatchScore").val());
		gap = parseInt($("#gapPenalty").val());
		
		
		// Get length of the sequences
		m = seq1.length;
		n = seq2.length;
		
		
		// Declare our 3d array of lengths m, n and 2. The third dimension will hold the value calculated and the traceback information at the position [Xi][Yj]
		S = createArray(m+1,n+1,2);
		
		// Initialize array with all 0s
		// S[i][j] holds two values Ex: S[i][j] = [0,0]
		// The first value holds score,
		// The second value holds the trace-back information
		// 0 = diagonal S[i-1][j-1] + s(xi, xj)
		// 1 = vertical S[i-1][j] + gap
		// 2 = horizontal S[i][j-1] + gap
		for (var i = 0; i<m+1;i++){
			for (var j = 0; j<n+1;j++){
				S[i][j] = [0,0];
			}
		}
		
		
		// set the first element trace-back information to -1 so the traceback function knows when to stop
		S[0][0] = [0,-1];
		
		
		
		// initialize the first row and the first column with the given gap penalty
		for (var i = 1; i<m+1;i++){
			S[i][0] = [(S[i-1][0][0] + gap), 1];
			//alert(S[i][0]);
		}
		for (var j = 1; j<n+1;j++){
			S[0][j] = [(S[0][j-1][0] + gap), 2];	
			//alert(S[0][j]);
			
		}
		
		
		
		
		// initialize score which will hold the score s(xi,yj)
		var score = 0;
		
		// loop through the whole matrix and set the optimal score values
		for (var i = 1; i<m+1;i++){
			for (var j = 1; j<n+1;j++){
				
				// compare s(xi,yj)
				if (seq1[i-1] == seq2[j-1]){
					score = matchScore;
				}else{
					score = mismatchScore;
				}
				
				// get value of the 3 options and put it into a tempArr
				// find the max and its index
				var tempArr = [ (S[i-1][j-1][0] + score), (S[i-1][j][0] + gap), (S[i][j-1][0] + gap) ];
				var max = tempArr[0];
				var maxIndex = 0;
				for (var k = 1; k < tempArr.length; k++) {
					if (tempArr[k] > max) {
						maxIndex = k;
						max = tempArr[k];
					}
				}
				
				// set S[i][j] to the calculated max and the trace-back information
				S[i][j] = [max,maxIndex];
			}
		}
		
		
		
		// Display matrix
		printMatrix();
		
		// Find optimal alignment 
		traceback();
	
	}
	
	
	
	
	// Function printMatrix()
	// Prints the matrix into a table in our HTML document given the form was properly filled and the scoring matrix S has been calculated.
	// Input: No direct input
	// Output: No direct output
	function printMatrix(){
		matrix.html("");
		var result = "";
		result += "<table>";
		
		var tempSeq1 = " " + seq1;
		var tempSeq2 = " " + seq2;
		
		for (var i = -1; i<m+1;i++){
			result += "<tr>";
			for (var j = -1; j<n+1;j++){
				//alert("i=" + i + ", j=" + j);
				if(i==-1){
					if (j==-1)
						result += "<td class='seq2'>&nbsp;&nbsp;&nbsp;&nbsp;</td>";
					else{
					//alert("seq2[" + j + "]= " + seq2[j]);
					result += "<td class='seq2'>" + tempSeq2[j] + "</td>";
					}
				}else if(j==-1){
					
					//alert("seq1[" + i + "]= " + seq1[i]);
					result += "<td class='seq1'>" + tempSeq1[i] + "</td>";
				
				}else{
					//alert("this is being called");
					result += "<td class='value'>" + S[i][j][0] + "</td>";
				}
			}
			result += "</tr>";
		}
		
		result += "</table>";
		
		matrix.html(result);
	}
	

	
	
	
	
	// Function traceback()
	// Starts at position [m][n] and traces back to position [0][0] to find an optimal alignment between the two sequences.
	// Adds the class "traced" to any of <td>'s in the table that contain the positions that were used in the trace back process
	// Prints the alignment found to a <div> in our HTML document
	// Input: No direct input
	// Output: No direct output
	function traceback(){
		var current = S[m][n];
		var i = m;
		var j = n;
		var alignment = [];
		
		do {
			matrix.find("tr").eq(i+1).find("td").eq(j+1).addClass("traced");
			if (current[1] == 0){
				i--;
				j--;
				alignment.push([seq1[i],seq2[j]]);
			}else if (current[1] == 1){
				i--;
				alignment.push([seq1[i],"-"]);
			}else if (current[1] == 2){
				j--;				
				alignment.push(["-", seq2[j]]);
			}
			
			var current = S[i][j];
			matrix.find("tr").eq(i+1).find("td").eq(j+1).addClass("traced");
		}while(current[1] != -1 );
		
		alignment = alignment.reverse();
		
		var seq1Result ="";
		var seq2Result ="";
		var score = "";
		
		for (var i =0; i < alignment.length; i++){
			seq1Result += alignment[i][0] + "&nbsp;";
			seq2Result += alignment[i][1] + "&nbsp;";
			if (alignment[i][0] == alignment[i][1]){
				score += "|&nbsp;";
			}else if( alignment[i][0] == "-" || alignment[i][1] == "-" ){
				score += "&nbsp;&nbsp;";
			}else {
				score += "X&nbsp;";
			}
		}
				
		var result = seq1Result + "<br>" + score + "<br>" + seq2Result;
		display.html(result);
	
	}
	
	
	// Function createArray()
	// Creates a multidimensional Array
	// Input: Length number of dimensions the new Array should have
	// Output: The newly created Array
	function createArray(length) {
		var arr = new Array(length || 0),
			i = length;
		if (arguments.length > 1) {
			var args = Array.prototype.slice.call(arguments, 1);
			while(i--) arr[length-1 - i] = createArray.apply(this, args);
		}
		return arr;
	}
	
	
});