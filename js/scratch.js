$(document).ready(function(){
	

	/**
	 * Initialize sequences
	 */
	var sequence1 = 'THISLINE',
		sequence2 = 'ISALIGNED',
		matchScore = 3,
		mismatchScore = 0,
		gapPenalty = -5,
		mode = 'global';

	/**
	 * Build input matrix
	 */
	$('#inputTableContainer').html(buildDynamicProgrammingMatrixWrapper(sequence1, sequence2));

	
	/**
	 * Read dynamicProgrammingMatrix when button is clicked
	 */
	$('#readMatrix').click(function(event) {
		console.log(dynamicProgrammingMatrixRead($('#inputTableContainer .dynamicProgrammingMatrix')));
	});



	// calculate correct matrix array
	var correctMatrix = computeMatrix(mode,sequence1,sequence2,matchScore,mismatchScore,gapPenalty)

	// create div for testing print results 
	$(document.createElement('div')).attr('id', 'correctMatrix').addClass('dynamicProgrammingMatrixWrapper').html(buildDynamicProgrammingMatrixWrapper(sequence1, sequence2)).appendTo('body');

	// build table skeleton
	$('#correctMatrix').html(buildDynamicProgrammingMatrixWrapper(sequence1, sequence2));
	
	// print correct matrix to a table
	printMatrix(correctMatrix,$('#correctMatrix').find('.dynamicProgrammingMatrix'));



	// compare matrices
	$('#compareMatrices').click(function(event) {
		var inputMatrix = dynamicProgrammingMatrixRead($('#inputTableContainer .dynamicProgrammingMatrix'));
		compareMatrices(correctMatrix, inputMatrix);
	});


	// display feedback
	


});
