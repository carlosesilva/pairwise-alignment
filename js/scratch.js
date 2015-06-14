$(document).ready(function(){

    /*=============================
    =            UI/UX            =
    =============================*/


    // limit input to dynamicProgrammingMatrixCell to positive and negative integers only
    $('#inputTableContainer .dynamicProgrammingMatrixCell').keyup(function(event) {
        $(this).val(filterInteger($(this).val()));
    });



    // compare matrices when the compare button is cliked
    // this makes more sense when instant feedback is turned off or when in TEST mode
    $('#compareMatrices').click(function(event) {
        var inputMatrix = readMatrix($('#inputTableContainer .dynamicProgrammingMatrix'));
        displayFeedback($('#inputTableContainer .dynamicProgrammingMatrix'), compareMatrices(correctMatrix, inputMatrix));
    });
    
    /*-----  End of UI/UX  ------*/
    





    process();
    
    $('#sequence1, #sequence2, #matchScore, #mismatchScore, #gapPenalty, #mode, #instantFeedback, #showTestingInfo').change(function(event) {
        process();
    });


    $('#process').click(function(event) {
        process();
    });






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








function process () {

    // initialize global variables
    sequence1 = $("#sequence1").val();
    sequence2 = $("#sequence2").val();
    matchScore = parseInt($("#matchScore").val(),10);
    mismatchScore = parseInt($("#mismatchScore").val(),10);
    gapPenalty = parseInt($("#gapPenalty").val(),10);
    mode = $("#mode").val();
    var instantFeedback = $("#instantFeedback")[0].checked;


    // calculate correct matrix array
    correctMatrix = computeMatrix(mode,sequence1,sequence2,matchScore,mismatchScore,gapPenalty);


    // Build input matrix
    $('#inputTableContainer').html(buildMatrixHTML(sequence1, sequence2));

    
    // Instant feedback
    if (instantFeedback){
        $('#inputTableContainer .dynamicProgrammingMatrixCell').on('focusout', function(event) {
            // validate input again in case .keyup() failed e.g. value was pasted in, dragged in
            $(this).val(filterInteger($(this).val()));
            var inputMatrix = readMatrix($('#inputTableContainer .dynamicProgrammingMatrix'));
            displayFeedback($('#inputTableContainer .dynamicProgrammingMatrix'), compareMatrices(correctMatrix, inputMatrix));
        });
    }else{
        $('#inputTableContainer .dynamicProgrammingMatrixCell').off('focusout');
    }





    /*===============================
    =            TESTING            =
    ===============================*/
    
    var showTestingInfo = $("#showTestingInfo")[0].checked;

    if (showTestingInfo){
        // build correct table skeleton
        $('#correctMatrix').html(buildMatrixHTML(sequence1, sequence2));
        
        // print correct matrix to a table
        printMatrix(correctMatrix,$('#correctMatrix').find('.dynamicProgrammingMatrix'));


        // test traceback
        printTraceback(traceback(mode, correctMatrix),$('#correctMatrix').find('.dynamicProgrammingMatrix'));

        $('#testing').show().prev().addClass('left');

    }else{
        $('#testing').hide().prev().removeClass('left');
    }

    

    // Read dynamicProgrammingMatrix when button is clicked
    $('#readMatrix').click(function(event) {
        console.log(readMatrix($('#inputTableContainer .dynamicProgrammingMatrix')));
    });
    
    /*-----  End of TESTING  ------*/

} // Closes process()
















/*-----  End of Functions  ------*/
