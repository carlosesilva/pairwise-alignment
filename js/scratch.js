$(document).ready(function(){


    /*=================================
    =            Variables            =
    =================================*/
    var sequence1 = 'THIS',
    sequence2 = 'THAT',
    matchScore = 3,
    mismatchScore = 0,
    gapPenalty = -5,
    mode = 'global',
    instantFeedback = false;
    
    
    /*-----  End of Variables  ------*/


    
    


    // calculate correct matrix array
    var correctMatrix = computeMatrix(mode,sequence1,sequence2,matchScore,mismatchScore,gapPenalty)






    /*=============================
    =            UI/UX            =
    =============================*/
    // Build input matrix
    $('#inputTableContainer').html(buildDynamicProgrammingMatrixWrapper(sequence1, sequence2));

    

    // limit input to dynamicProgrammingMatrixCell to positive and negative integers only
    $('#inputTableContainer .dynamicProgrammingMatrixCell').keyup(function(event) {
        $(this).val(filterInteger($(this).val()));
    });



    // compare matrices when the compare button is cliked
    // this makes more sense when instant feedback is turned off or when in TEST mode
    $('#compareMatrices').click(function(event) {
        var inputMatrix = dynamicProgrammingMatrixRead($('#inputTableContainer .dynamicProgrammingMatrix'));
        displayFeedback($('#inputTableContainer .dynamicProgrammingMatrix'), compareMatrices(correctMatrix, inputMatrix));
    });
    
    /*-----  End of UI/UX  ------*/
    



    // Instant feedback
    if (instantFeedback){
        $('#inputTableContainer .dynamicProgrammingMatrixCell').focusout(function(event) {
            // validate input again in case .keyup() failed e.g. value was pasted in, dragged in
            $(this).val(filterInteger($(this).val()));

            var inputMatrix = dynamicProgrammingMatrixRead($('#inputTableContainer .dynamicProgrammingMatrix'));
            displayFeedback($('#inputTableContainer .dynamicProgrammingMatrix'), compareMatrices(correctMatrix, inputMatrix));
        });
    }
    






    /*===============================
    =            TESTING            =
    ===============================*/
    // create div for testing print results 
    $(document.createElement('div')).attr('id', 'correctMatrix').addClass('dynamicProgrammingMatrixWrapper').html(buildDynamicProgrammingMatrixWrapper(sequence1, sequence2)).appendTo('body');

    // build correct table skeleton
    $('#correctMatrix').html(buildDynamicProgrammingMatrixWrapper(sequence1, sequence2));
    
    // print correct matrix to a table
    printMatrix(correctMatrix,$('#correctMatrix').find('.dynamicProgrammingMatrix'));
    
    


    // Read dynamicProgrammingMatrix when button is clicked
    $('#readMatrix').click(function(event) {
        console.log(dynamicProgrammingMatrixRead($('#inputTableContainer .dynamicProgrammingMatrix')));
    });
    /*-----  End of TESTING  ------*/
    
    









});


/*=================================
=            Functions            =
=================================*/


function filterInteger(val){
    return (val[0] === '-') ? ('-' + val.replace(/[^0-9]/g, '')) : (val.replace(/[^0-9]/g, ''));
    // use below direcly on html element's onkeyup attr
    //  this.value = (this.value[0] === '-') ? ('-' + this.value.replace(/[^0-9]/g, '')) : (this.value.replace(/[^0-9]/g, ''));
}

function evaluate (argument) {
    // body...
}


/*-----  End of Functions  ------*/
