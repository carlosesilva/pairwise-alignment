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
currentStep,
recursionCounter;

$(document).ready(function(){



    // process();
    
    // $('#sequence1, #sequence2, #matchScore, #mismatchScore, #gapPenalty, #mode, #instantFeedback, #guidedMode').change(function(event) {
    //     process();
    // });


    $('#process').click(function(event) {
        process();
    });

    $('#stuck a').click(function(event) {
        step1($('#inputTableContainer .dynamicProgrammingMatrix'));
    });


    /*=============================
    =            UI/UX            =
    =============================*/

    $('#intro').click(function(event) {
        $(this).hide();
    }).children('div').click(function(event) {
        event.stopPropagation();
    });


    $('#showTestingInfo').click(function(event) {
        $(this).find('span').toggle();
        $('#testing').toggle().prev().toggleClass('left');
    });

    // sidebar
    $('.sidebarTabHeader').click(function(event) {
        if(!$(this).hasClass('active')){

            $(this).siblings('h2').filter('.active').removeClass('active').next('.sidebarTabContent').slideUp(200);
            $(this).addClass('active').next('.sidebarTabContent').slideDown(200);
        }
    });


    // limit input to dynamicProgrammingMatrixCell to positive and negative integers only
    $('#inputTableContainer').on('keyup', ' .dynamicProgrammingMatrixCell', function(event) {
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
                left: $(this).offset().left - $('#tracebackSelectOptions').outerWidth()
            }).find('.tracebackCheckbox').each(function(index, el) {
                if (thisTraceback[index+1]){
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
        currentTracebackInfo[$(this).parent().index()+1] = +(this.checked);
        // console.log(currentTracebackInfo);
        currentTracebackSelect.next().attr('traceback', JSON.stringify(currentTracebackInfo));
        currentTracebackSelect.find('.arrow').eq($(this).parent().index()).toggleClass('active');
        
        if (currentTracebackSelect.find('.arrow').removeClass('alone').filter('.active').length == 1)
            currentTracebackSelect.find('.active').addClass('alone');

        // currentTracebackSelect.html(parseInt(currentTracebackInfo.join(''), 2));

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

    $('.solitaire-victory-clone, #placeholderText').remove();


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


    // reset current step
    currentStep = 0;

    // reset chat bubble
    talk('', true);

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
        // release event handles added by guidedMode
        $('.namespace_guidedMode').off('.guidedMode').removeClass('guidedMode');
    }
    /*-----  End of GUIDED MODE  ------*/



    /*===============================
    =            TESTING            =
    ===============================*/
    
    // build correct table skeleton
    $('#correctMatrix').html(buildMatrixHTML(sequence1, sequence2));
    
    // print correct matrix to a table
    printMatrix(correctMatrix,$('#correctMatrix').find('.dynamicProgrammingMatrix'));


    // test traceback
    printTraceback(correctTraceback, $('#correctMatrix').find('.dynamicProgrammingMatrix'), $('#correctAlignment'));

    

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
    }else if(currentStep === 1){
        // person is asking for more help
    }else{
        currentStep = 1;
        // talk('<p>Step 1</p>', true);
        // talk('<p>Fill in first row</p>');
        
        $( "<div>" )
                .html('Fill in first row')
                .dialog({
                    title: "Step 1",
                    buttons: {
                        "Ok": function() {
                            $( this ).dialog( "close" );

                            $cells.removeClass('guided');
                            $row1.addClass('guided').eq(0).find('.dynamicProgrammingMatrixCell').focus();
                            $cells.not($row1).find('input').add($('#inputAlignmentContainer').find('input')).prop('disabled', true);


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
                });
    }
}


function step2 (matrix) {
    var $cells = matrix.find('td');
    var $row1 = matrix.find('tr').eq(0).find('td');
    var $col1 = matrix.find('tr').find('td:eq(0)');
    var $mainCells = $cells.not($row1).not($col1);

    // watch for completion of step 2
    if (checkCompletion($col1.children())) {
        step3(matrix);
    }else{
        currentStep = 2;
        // talk('<p>Entering step2</p>', true);
        // talk('<p>Complete first column</p>');
        


        $( "<div>" )
                .html('Now complete the first column')
                .dialog({
                    title: "Step 2",
                    buttons: {
                        "Ok": function() {
                            $( this ).dialog( "close" );

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
                });



        
    }
}


function step3 (matrix) {
    var $cells = matrix.find('td');
    var $row1 = matrix.find('tr').eq(0).find('td');
    var $col1 = matrix.find('tr').find('td:eq(0)');
    var $mainCells = $cells.not($row1).not($col1);

    // watch for completion of step 3
    if (checkCompletion($mainCells.children())) {
         step4(matrix);
    }else{
        currentStep = 3;
        // talk('<p>Entering step3</p>', true);
        // talk('<p>Complete rest of matrix</p>');
        
        $( "<div>" )
                .html('Complete rest of matrix')
                .dialog({
                    title: "Step 2",
                    buttons: {
                        "Ok": function() {
                            $( this ).dialog( "close" );

                            $cells.find('input').prop('disabled', false);
                            $mainCells.eq(0).find('.dynamicProgrammingMatrixCell').focus();
                            $cells.removeClass('guided');
                            $mainCells.addClass('guided');
                            $cells.not($mainCells).find('input').prop('disabled', true);

                            $mainCells.add('.tracebackCheckbox').on('change.step3.guidedMode', function(event) {
                                console.log('test step3', checkCompletion($mainCells.children()));
                                if (checkCompletion($mainCells.children())){
                                    // stop step2 event
                                    // $col1.off('.step2');

                                    step4(matrix);
                                }
                            }).addClass('namespace_guidedMode');
                        }
                    }
                });
        
    }
}
function step4 (matrix) {
    var $cells = matrix.find('td');
    var $row1 = matrix.find('tr').eq(0).find('td');
    var $col1 = matrix.find('tr').find('td:eq(0)');
    var $mainCells = $cells.not($row1).not($col1);

        currentStep = 4;
        talk('<p>Entering step4</p>', true);
        talk('<p>Watch traceback selection</p>');
        
        $cells.find('input').prop('disabled', false);

        tracebackGuide (matrix);
}
function tracebackGuide (matrix) {
    var delay = 500;

    var guidedModeTitle = "Guided Mode";

    var skipContinue = {
        "Skip": function() {
          $( this ).dialog( "close" );
        },
        "Continue": function() {
            $( this ).dialog( "close" );
            if(tracebackSteps.length){
                setTimeout(tracebackSteps.shift(),delay);
            }
        }
    };

    var guidedModeDialogOptions = {
        title: guidedModeTitle,
        resizable: false,
        modal: true,
        closeOnScape: false,
        buttons: skipContinue
    };



    var tracebackSteps = [
        function() {
            $( "<div>" )
                .html('First Step of tracebacking is to select the last cell')
                .dialog(guidedModeDialogOptions);
        },
        function() {
            window.tracebackCounter = 0;
            matrix.find('tr').eq(correctTraceback[0].tracedCells[tracebackCounter].i).find('td').eq(correctTraceback[0].tracedCells[tracebackCounter].j).find('.dynamicProgrammingMatrixCell').addClass('tracebackActive');
            setTimeout(tracebackSteps.shift(),delay);
        },
        function() {
            $( "<div>" )
                .html('Next follow one of the arrows to the next cell')
                .dialog(guidedModeDialogOptions);
        },
        function() {
            window.tracebackCounter++;
            matrix.find('tr').eq(correctTraceback[0].tracedCells[tracebackCounter].i).find('td').eq(correctTraceback[0].tracedCells[tracebackCounter].j).find('.dynamicProgrammingMatrixCell').addClass('tracebackActive');
            setTimeout(tracebackSteps.shift(),delay);
        },
        function() {
            $( "<div>" )
                .html('Now do that until you hit the first cell')
                .dialog(guidedModeDialogOptions);
        },
        function() {
            (function forLoop (k) {          
                setTimeout(function () {
                    matrix.find('tr').eq(correctTraceback[0].tracedCells[k].i).find('td').eq(correctTraceback[0].tracedCells[k].j).find('.dynamicProgrammingMatrixCell').addClass('tracebackActive');  

                    //  increment k and call forLoop again if k < length          
                    if (++k < correctTraceback[0].tracedCells.length){ 
                        forLoop(k);      
                    }else{
                        setTimeout(tracebackSteps.shift(),delay);
                    }
                }, delay)
            })(window.tracebackCounter++);
        },
        function() {
            // Solitaire effect for fun
            matrix.closest('.dynamicProgrammingMatrixWrapper').solitaireVictory();

            $( "<div>" )
                .html('You Won!')
                .dialog({title:"Winner"});
        }
    ];

    tracebackSteps.shift()();

}
function checkCompletion (elements) {
    var complete = true;
    elements.filter('.dynamicProgrammingMatrixCell, .tracebackSelect').each(function(index, el) {
        if(!$(el).hasClass('correct'))
            complete = false;
    });
    if (complete) {$('#tracebackSelectOptionsOverlay').click()};
    return complete;
}

function talk (content, clear) {
    if (clear === true){
        $('#chatBubble').html('');
    }
    $('#chatBubble').append(content);
}
/*-----  End of Functions  ------*/
