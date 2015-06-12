$(document).ready(function(){
	

	/**
	 * Initialize sequences
	 */
	var sequence1 = 'THIS',
		sequence2 = 'THAT',
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
		displayFeedback($('#inputTableContainer .dynamicProgrammingMatrix'), compareMatrices(correctMatrix, inputMatrix));
	});

	// limit input to dynamicProgrammingMatrixCell to numbers and dashes
	$('.dynamicProgrammingMatrixCell').keyup(function(event) {
		$(this).val($(this).val().replace(/[^-?0-9]/, ''));
		// Remember to add, replace any dashes that are in anyposition other than first
	});

	$('#inputTableContainer .dynamicProgrammingMatrixCell').focusout(function(event) {
		var inputMatrix = dynamicProgrammingMatrixRead($('#inputTableContainer .dynamicProgrammingMatrix'));
		displayFeedback($('#inputTableContainer .dynamicProgrammingMatrix'), compareMatrices(correctMatrix, inputMatrix));
		// // validate input
		// if ($(this).val() != ''  && !$.isNumeric($(this).val()))
		// 	$(this).addClass('wrong');
	});

	// display feedback
		


});
