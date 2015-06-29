function displayFeedback (inputTable,feedbackMatrix) {
    inputTable.find('tr').each(function(i) {
        $(this).find('td').each(function(j) {
            var cell = $(this).find('.dynamicProgrammingMatrixCell').removeClass('correct wrong');
            if (cell.val() !== ''){
                if (feedbackMatrix[i][j].score)
                    cell.addClass('correct');
                else
                    cell.addClass('wrong');
            }
            var tracebackSelect = $(this).find('.tracebackSelect2').removeClass('correct wrong');
            if (tracebackSelect.html() != 'T'){
                if (feedbackMatrix[i][j].traceback)
                    tracebackSelect.addClass('correct');
                else
                    tracebackSelect.addClass('wrong');
            }
        });
    });
}