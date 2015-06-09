$(document).ready(function(){
	

	/**
	 * Initialize sequences
	 */
	var sequence1 = "THISLINE",
		sequence2 = "ISALIGNED";

	/**
	 * Build input matrix
	 */
	$('#inputTableContainer').html(buildDynamicProgrammingMatrixWrapper(sequence1, sequence2));

	
	/**
	 * Read dynamicProgrammingMatrix when button is clicked
	 */
	$('#readMatrix').click(function(event) {
		console.log(dynamicProgrammingMatrixRead($('.dynamicProgrammingMatrix')));
	});



});