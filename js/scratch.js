$(document).ready(function(){
	

	/**
	 * Build tables
	 */
	var sequence1 = "THISLINE",
		sequence2 = "ISALIGNED";
	$('#inputTableContainer').html(buildInputTable(sequence1, sequence2));
	$('#inputMatrixContainer').html(buildInputMatrix(sequence1, sequence2));
	
	/**
	 * Read inputMatrix when button is clicked
	 */
	$('#readMatrix').click(function(event) {
		console.log(readInputMatrix($('#inputMatrix')));
	});



	/**
	 * Build the input table that will hold the two sequences and the matrix
	 * @param  {string} seq1 
	 * @param  {string} seq2
	 * @return {string} result
	 */
	function buildInputTable(seq1, seq2){
		var result = '<table id="inputTable">';
		result += '<tr><td class="emptyCell"><input type="text" disabled></td><td class="emptyCell"><input type="text" disabled></td>';
		for (var j = 0; j<seq2.length; j++){
			result += '<td class="sequenceLetter"><input type="text" disabled value="' + seq2[j] + '"></td>';
		}
		result += '</tr><td class="emptyCell"><input type="text" disabled></td><td id="inputMatrixContainer"></td></tr>';

		for (var i = 0; i<seq1.length; i++){
			result += '<tr><td class="sequenceLetter"><input type="text" disabled value="' + seq1[i] + '"></td></tr>';
		}
		result += '</table>';
		return result;
	}

	/**
	 * Build the input matrix table that hold the inputs for the user to enter matrix answer
	 * @param  {string} seq1
	 * @param  {string} seq2
	 * @return {string} result
	 */
	function buildInputMatrix(seq1, seq2){
		var result = '<table id="inputMatrix">';
		
		for (var i = -1; i<seq1.length; i++){
			result += '<tr>';
			for (var j = -1; j<seq2.length; j++){
				result += '<td>';
				result += '<input type="text" class="inputMatrixCell" i="" j=""/>';
				result += '</td>';
			}
			result += '</tr>';
		}
		
		result += '</table>';
		return result;
	}
	
	/**
	 * Read data from inputMatrix table into an array
	 * @param  {object} inputMatrix
	 * @return {array} S
	 */
	function readInputMatrix (inputMatrix) {
		var S = [];

		inputMatrix.find('tr').each(function() {
			var row = [];
			$(this).find('td').each(function() {
				row.push($(this).find('input').val());
			});
			S.push(row);
		});
		return S;
	}


});