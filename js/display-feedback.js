function displayFeedback (inputTable,feedbackMatrix) {
    inputTable.find('tr').each(function(i) {
        $(this).find('td').each(function(j) {
            var cell = $(this).find('.dynamicProgrammingMatrixCell').removeClass('correct wrong');
            if (cell.val() != ''){
                if (feedbackMatrix[i][j])
                    cell.addClass('correct');
                else
                    cell.addClass('wrong');
            }
        });
    });
}