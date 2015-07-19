// Declare global variables
var sequence1,
sequence2,
matchScore,
mismatchScore,
gapPenalty,
mode,
instantFeedback,
guidedMode,
correctMatrix,
correctTraceback,
currentTracebackSelect,
recursionCounter;

$(document).ready(function(){



    process();
    
    $('#sequence1, #sequence2, #matchScore, #mismatchScore, #gapPenalty, #mode, #instantFeedback, #showTestingInfo, #guidedMode').change(function(event) {
        process();
    });


    $('#process').click(function(event) {
        process();
    });


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



    // compare alignments when button is clicked
    $('#compareAlignment').click(function(event) {
        var alignmentInput1 = $('#alignmentInput1').val().toUpperCase();
        var alignmentInput2 = $('#alignmentInput2').val().toUpperCase();
        if (compareAlignment(alignmentInput1,alignmentInput2,correctTraceback)) {
            $('#alignmentInput1,#alignmentInput2').removeClass('wrong').addClass('correct');
        }else{
            $('#alignmentInput1,#alignmentInput2').removeClass('correct').addClass('wrong');
        }
    });

    // traceback input select
    $(document).on( 'click', '.tracebackSelect', function(event) {
        if ($(this).hasClass('tracebackOpen')){
            // traceback is open for this cell
            $(this).removeClass('tracebackOpen');
            $('#tracebackSelectOptions, #tracebackSelectOptionsOverlay').hide();
        } else{
            // traceback is closed for this cell (remember that it may be open for another cell)
            
            // remove tracebackOpen class from all cells in case there is another cell currently open other than $(this)
            $('.tracebackSelect').removeClass('tracebackOpen');

            // add tracebackOpen class to $(this)
            $(this).addClass('tracebackOpen');

            // update global variable currentTracebackSelect to this object
            currentTracebackSelect = $(this);

            // update tracebackSelectOptions to work with $(this) cell and display it
            // get traceback info from $(this) cell
            var thisTraceback = JSON.parse($(this).next().attr('traceback'));
            $('#tracebackSelectOptions').css({
                top: $(this).offset().top + $(this).height(),
                left: $(this).offset().left + $(this).width()
            }).find('.tracebackCheckbox').each(function(index, el) {
                if (thisTraceback[index]){
                    $(this).prop('checked', true);
                } else {
                    $(this).prop('checked', false);
                }
            });
            $('#tracebackSelectOptions, #tracebackSelectOptionsOverlay').show();
        }
    });
    
    $('.tracebackCheckbox').change(function(event) {
        // console.log(event);
        var currentTracebackInfo = JSON.parse(currentTracebackSelect.next().attr('traceback'));
        // console.log($(this).index());
        currentTracebackInfo[$(this).index()] = +(this.checked);
        // console.log(currentTracebackInfo);
        currentTracebackSelect.next().attr('traceback', JSON.stringify(currentTracebackInfo));
        currentTracebackSelect.html(parseInt(currentTracebackInfo.join(''), 2));

        if (instantFeedback){
            displayFeedback($('#inputTableContainer .dynamicProgrammingMatrix'), compareMatrices(correctMatrix, readMatrix($('#inputTableContainer .dynamicProgrammingMatrix'))));
        }

    });

    $('#tracebackSelectOptionsOverlay').click(function(event) {
        currentTracebackSelect.removeClass('tracebackOpen');
        $(this).add('#tracebackSelectOptions').hide();
    });

    
    /*-----  End of UI/UX  ------*/
    



});


/*=================================
=            Functions            =
=================================*/


function filterInteger(val){
    return (val[0] === '-') ? ('-' + val.replace(/[^0-9]/g, '')) : (val.replace(/[^0-9]/g, ''));
    // use below direcly on html element's onkeyup attr
    //  this.value = (this.value[0] === '-') ? ('-' + this.value.replace(/[^0-9]/g, '')) : (this.value.replace(/[^0-9]/g, ''));
}







function process () {
    console.log('---------------\nBegin process()\n---------------');
    // set global variables
    // 
    sequence1 = $("#sequence1").val().toUpperCase();
    sequence2 = $("#sequence2").val().toUpperCase();
    matchScore = parseInt($("#matchScore").val(),10);
    mismatchScore = parseInt($("#mismatchScore").val(),10);
    gapPenalty = parseInt($("#gapPenalty").val(),10);
    mode = $("#mode").val();
    instantFeedback = $("#instantFeedback")[0].checked;
    guidedMode = $("#guidedMode")[0].checked;


    // calculate correct matrix array
    correctMatrix = computeMatrix(mode,sequence1,sequence2,matchScore,mismatchScore,gapPenalty);


    // reset recursionCounter
    recursionCounter = 0;
    // calculate traceback
    correctTraceback = traceback(mode, correctMatrix, sequence1, sequence2);


    // Build input matrix
    $('#inputTableContainer').html(buildMatrixHTML(sequence1, sequence2));

    

    /*========================================
    =            INSTANT FEEDBACK            =
    ========================================*/
    if (instantFeedback){
        $('#inputTableContainer .dynamicProgrammingMatrixCell').on('change', function(event) {
            // validate input again in case .keyup() failed e.g. value was pasted in, dragged in
            $(this).val(filterInteger($(this).val()));
            displayFeedback($('#inputTableContainer .dynamicProgrammingMatrix'), compareMatrices(correctMatrix, readMatrix($('#inputTableContainer .dynamicProgrammingMatrix'))));
        });
    }else{
        $('#inputTableContainer .dynamicProgrammingMatrixCell, #inputTableContainer .tracebackSelect').off('focusout change');
    }
    /*-----  End of INSTANT FEEDBACK  ------*/
    



    /*===================================
    =            GUIDED MODE            =
    ===================================*/
    if (guidedMode){
        console.log('Entering guidedMode');

        step1($('#inputTableContainer .dynamicProgrammingMatrix'));


        // Add relevant/irrelevant visual guide
        $('#inputTableContainer .dynamicProgrammingMatrixContainer td').on('focusin.relevant.guidedMode', function(event) {
            $(this).closest('table').find('td').addClass('irrelevant');
            var top = $(this).parent().prev().find('td').eq($(this).index());
            var diag = top.prev();
            var left = $(this).prev();
            $(this).add(left).add(top).add(diag).removeClass('irrelevant');
        }).addClass('namespace_guidedMode');
        // Reset relevant/irrelevant cells when dynamicProgrammingMatrixContainer loses focus
        $('#inputTableContainer .dynamicProgrammingMatrixContainer').on('focusout.relevant.guidedMode', function(event) {
            $(this).find('td').removeClass('irrelevant');
        }).addClass('namespace_guidedMode');

    }else{
        $('.namespace_guidedMode').off('.guidedMode').removeClass('guidedMode');
    }
    /*-----  End of GUIDED MODE  ------*/



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
        printTraceback(correctTraceback, $('#correctMatrix').find('.dynamicProgrammingMatrix'), $('#correctAlignment'));

        $('#testing').show().prev().addClass('left');

    }else{
        $('#testing').hide().prev().removeClass('left');
    }

    

    // Read dynamicProgrammingMatrix when button is clicked
    $('#readMatrix').click(function(event) {
        console.log(readMatrix($('#inputTableContainer .dynamicProgrammingMatrix')));
    });
    
    /*-----  End of TESTING  ------*/

    console.log('---------------\nEND process()\n---------------\n\n\n\n');
} // Closes process()





function compareAlignment (input1,input2,traceback) {
    // Loop through all possibles tracebacks
    for (var i = 0; i < traceback.length; i++) {
        if (input1 === traceback[i].alignment[0].join('') && input2 === traceback[i].alignment[1].join('')){
            return true;
        }
    }
    return false;
}



function step1 (matrix) {
    var $cells = matrix.find('td');
    var $row1 = matrix.find('tr').eq(0).find('td');
    var $col1 = matrix.find('tr').find('td:eq(0)');
    var $mainCells = $cells.not($row1).not($col1);

    // watch for completion of step 1
    if (checkCompletion($row1.children())) {
        step2(matrix);
    }else{
        console.log('Step 1');
        console.log('Fill in first row');
        $cells.removeClass('guided');
        $row1.addClass('guided');
        $cells.not($row1).find('input').prop('disabled', true);


        $row1.add('.tracebackCheckbox').on('change.step1.guidedMode', function(event) {
            console.log('test step1');
            if (checkCompletion($row1.children())){
                // stop step1 event
                // $row1.off('.step1');

                step2(matrix);
            }
        }).addClass('namespace_guidedMode');
    }
}


function step2 (matrix) {
    var $cells = matrix.find('td');
    var $row1 = matrix.find('tr').eq(0).find('td');
    var $col1 = matrix.find('tr').find('td:eq(0)');
    var $mainCells = $cells.not($row1).not($col1);

    // watch for completion of step 3
    if (checkCompletion($col1.children())) {
        step3(matrix);
    }else{
        console.log('Entering step2');
        console.log('Complete first column');
        
        $cells.find('input').prop('disabled', false);
        $col1.eq(1).find('.dynamicProgrammingMatrixCell').focus();
        $cells.removeClass('guided');
        $col1.addClass('guided');
        $cells.not($col1).find('input').prop('disabled', true);

        $col1.add('.tracebackCheckbox').on('change.step2.guidedMode', function(event) {
            console.log('test step2');
            if (checkCompletion($col1.children())){
                // stop step1 event
                // $row1.off('.step1');

                step3(matrix);
            }
        }).addClass('namespace_guidedMode');
    }
}


function step3 (matrix) {
    var $cells = matrix.find('td');
    var $row1 = matrix.find('tr').eq(0).find('td');
    var $col1 = matrix.find('tr').find('td:eq(0)');
    var $mainCells = $cells.not($row1).not($col1);

    // watch for completion of step 1
    if (checkCompletion($mainCells.children())) {
        // step4(matrix);
    }else{
        console.log('Entering step3');
        console.log('Complete rest of matrix');
        
        $cells.find('input').prop('disabled', false);
        $mainCells.eq(0).find('.dynamicProgrammingMatrixCell').focus();
        $cells.removeClass('guided');
        $mainCells.addClass('guided');
        $cells.not($mainCells).find('input').prop('disabled', true);
    }
}


function checkCompletion (elements) {
    var complete = true;
    elements.filter('input').each(function(index, el) {
        if(!$(el).hasClass('correct'))
            complete = false;
    });
    return complete;
}

/*-----  End of Functions  ------*/
